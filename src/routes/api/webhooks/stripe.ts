import { createFileRoute } from "@tanstack/react-router";

import { env } from "@/env/server";
import { stripe } from "@/lib/stripe";
import { applyStripeWebhookEvent } from "@/server/order-payment";

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

        await applyStripeWebhookEvent(event);

        return Response.json({ received: true });
      },
    },
  },
});
