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
  try {
    console.log("Processing checkout session completed:", session.id);

    // Get order ID from metadata
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    if (!orderId) {
      console.error("Order ID not found");
      return;
    }

    // Get address information
    const address = session.customer_details?.address;
    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];
    const addressString = addressComponents
      .filter((c) => c !== null)
      .join(", ");

    // Update order status and address information
    await db
      .update(orders)
      .set({
        status: "PAID",
        paymentStatus: "PAID",
        paymentIntent: session.payment_intent as string,
        phone: session.customer_details?.phone || null,
        shippingAddress: addressString || null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    // Clear user's shopping cart
    if (userId) {
      const userCart = await db.query.carts.findFirst({
        where: (carts, { eq }) => eq(carts.userId, userId),
      });

      if (userCart) {
        // Delete cart items
        await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
        console.log(`Cart cleared for user ${userId}`);
      }
    }

    console.log(`Order ${orderId} marked as paid`);
  } catch (error) {
    console.error("Error processing checkout session completed:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Processing payment intent failed:", paymentIntent.id);

    // Try to get order ID from metadata
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      // Update order status
      await db
        .update(orders)
        .set({
          status: "CANCELLED",
          paymentStatus: "FAILED",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));

      console.log(`Order ${orderId} payment failed, status updated`);
    } else {
      console.log("Unable to get order ID from metadata");
    }
  } catch (error) {
    console.error("Error processing payment intent failed:", error);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    console.log("Processing refund event:", charge.id);

    // Try to get associated payment intent
    const paymentIntentId = charge.payment_intent as string;

    if (paymentIntentId) {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await db
          .update(orders)
          .set({
            paymentStatus: "REFUNDED",
            updatedAt: new Date(),
          })
          .where(eq(orders.id, orderId));

        console.log(`Order ${orderId} refunded`);
      }
    }
  } catch (error) {
    console.error("Error processing refund event:", error);
  }
}
