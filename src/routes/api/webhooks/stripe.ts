import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { db } from "@/db";
import { cartItems, orders } from "@/db/schema";
import { env } from "@/env/server";
import { stripe } from "@/lib/stripe";

export const Route = createFileRoute("/api/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.text();
        const signature = request.headers.get("stripe-signature");

        if (!signature) {
          throw new Error("Missing Stripe signature header");
        }

        if (!env.STRIPE_WEBHOOK_SECRET) {
          throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
        }

        const event = stripe.webhooks.constructEvent(
          body,
          signature,
          env.STRIPE_WEBHOOK_SECRET,
        );

        // Handle based on event type
        switch (event.type) {
          case "payment_intent.succeeded":
            await handlePaymentIntentSucceeded(
              event.data.object as Stripe.PaymentIntent,
            );
            break;
          case "checkout.session.completed":
            await handleCheckoutSessionCompleted(
              event.data.object as Stripe.Checkout.Session,
            );
            break;
          case "payment_intent.payment_failed":
            await handlePaymentIntentFailed(
              event.data.object as Stripe.PaymentIntent,
            );
            break;
          case "charge.refunded":
            await handleChargeRefunded(event.data.object as Stripe.Charge);
            break;
          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        return Response.json({ received: true });
      },
    },
  },
});

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  console.log("Processing payment intent succeeded:", paymentIntent.id);

  const orderId = paymentIntent.metadata?.orderId;
  const userId = paymentIntent.metadata?.userId;

  if (!orderId) {
    throw new Error("Order ID not found in payment intent metadata");
  }

  const existingOrder = await db.query.orders.findFirst({
    where: (ordersTable, { eq }) => eq(ordersTable.id, orderId),
    columns: {
      id: true,
      paymentIntent: true,
    },
  });

  if (!existingOrder) {
    throw new Error(`Order ${orderId} not found for payment completion`);
  }

  if (
    existingOrder.paymentIntent &&
    existingOrder.paymentIntent !== paymentIntent.id &&
    !existingOrder.paymentIntent.startsWith("cs_")
  ) {
    throw new Error(`Payment intent mismatch for order ${orderId}`);
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: "PAID",
      paymentStatus: "PAID",
      paymentIntent: paymentIntent.id,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning({
      id: orders.id,
    });

  if (!updatedOrder) {
    throw new Error(`Failed to update paid order ${orderId}`);
  }

  if (userId) {
    await clearUserCart(userId);
  }

  console.log(`Order ${orderId} marked as paid`);
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  console.log("Processing checkout session completed:", session.id);

  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  if (!orderId) {
    throw new Error("Order ID not found in checkout session metadata");
  }

  const existingOrder = await db.query.orders.findFirst({
    where: (ordersTable, { eq }) => eq(ordersTable.id, orderId),
    columns: {
      id: true,
      paymentIntent: true,
    },
  });

  if (!existingOrder) {
    throw new Error(`Order ${orderId} not found for checkout completion`);
  }

  const sessionPaymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  if (
    existingOrder.paymentIntent &&
    existingOrder.paymentIntent !== session.id &&
    existingOrder.paymentIntent !== sessionPaymentIntentId
  ) {
    throw new Error(`Checkout session mismatch for order ${orderId}`);
  }

  const address = session.customer_details?.address;
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  const addressString = addressComponents.filter((c) => c).join(", ");

  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: "PAID",
      paymentStatus: "PAID",
      paymentIntent: sessionPaymentIntentId,
      phone: session.customer_details?.phone,
      shippingAddress: addressString.length > 0 ? addressString : null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning({
      id: orders.id,
    });

  if (!updatedOrder) {
    throw new Error(`Failed to update paid order ${orderId}`);
  }

  if (userId) {
    await clearUserCart(userId);
  }

  console.log(`Order ${orderId} marked as paid`);
}

async function clearUserCart(userId: string) {
  const userCart = await db.query.carts.findFirst({
    where: (cartsTable, { eq }) => eq(cartsTable.userId, userId),
  });

  if (userCart) {
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
    console.log(`Cart cleared for user ${userId}`);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Processing payment intent failed:", paymentIntent.id);

  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    throw new Error("Order ID not found in payment intent metadata");
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: "CANCELLED",
      paymentStatus: "FAILED",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning({
      id: orders.id,
    });

  if (!updatedOrder) {
    throw new Error(`Failed to update failed payment for order ${orderId}`);
  }

  console.log(`Order ${orderId} payment failed, status updated`);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("Processing refund event:", charge.id);

  const paymentIntentId = charge.payment_intent as string | null;

  if (!paymentIntentId) {
    throw new Error("Payment intent not found for refunded charge");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    throw new Error("Order ID not found in refunded payment intent metadata");
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({
      paymentStatus: "REFUNDED",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning({
      id: orders.id,
    });

  if (!updatedOrder) {
    throw new Error(`Failed to update refunded order ${orderId}`);
  }

  console.log(`Order ${orderId} refunded`);
}
