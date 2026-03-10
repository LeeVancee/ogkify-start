import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/db";
import { cartItems, carts, orders } from "@/db/schema";
import { env } from "@/env/server";
import { stripe } from "@/lib/stripe";

export const Route = createFileRoute("/api/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.text();
          const signature = request.headers.get("stripe-signature");

          if (!signature) {
            console.error("Missing Stripe signature header");
            return Response.json(
              { error: "Missing Stripe signature header" },
              { status: 400 },
            );
          }

          // Ensure Webhook secret is configured
          if (!env.STRIPE_WEBHOOK_SECRET) {
            console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
            return Response.json(
              { error: "Webhook configuration error" },
              { status: 500 },
            );
          }

          // Verify Webhook signature
          let event: Stripe.Event;
          try {
            event = stripe.webhooks.constructEvent(
              body,
              signature,
              env.STRIPE_WEBHOOK_SECRET,
            );
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Unknown error";
            console.error(
              `Webhook signature verification failed: ${errorMessage}`,
            );
            return Response.json(
              {
                error: `Webhook signature verification failed: ${errorMessage}`,
              },
              { status: 400 },
            );
          }

          // Handle based on event type
          switch (event.type) {
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
        } catch (error) {
          console.error("Webhook error:", error);
          return Response.json(
            { error: "Error processing webhook" },
            { status: 500 },
          );
        }
      },
    },
  },
});

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

  if (
    existingOrder.paymentIntent &&
    existingOrder.paymentIntent !== session.id
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
      paymentIntent: session.payment_intent as string,
      phone: session.customer_details?.phone || null,
      shippingAddress: addressString || null,
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
    const userCart = await db.query.carts.findFirst({
      where: (cartsTable, { eq }) => eq(cartsTable.userId, userId),
    });

    if (userCart) {
      await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
      console.log(`Cart cleared for user ${userId}`);
    }
  }

  console.log(`Order ${orderId} marked as paid`);
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
