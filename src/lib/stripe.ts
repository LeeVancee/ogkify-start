import Stripe from "stripe";

import { env } from "@/env/server";

// Ensure environment variable is set
if (!env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

// Create Stripe instance
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover", // Use API version supported by your Stripe library
  typescript: true,
});

// Currency formatting function, converts to smallest unit used by Stripe (e.g., dollars to cents)
export function formatAmountForStripe(
  amount: number,
  currency: string = "usd",
): number {
  const currencies: Record<string, number> = {
    usd: 100, // $1.00 = 100 cents
    eur: 100, // €1.00 = 100 cents
    gbp: 100, // £1.00 = 100 pence
    cny: 100, // ¥1.00 = 100 fen
  };

  const multiplier = currencies[currency.toLowerCase()] || 100;
  return Math.round(amount * multiplier);
}

// Convert from Stripe's smallest unit back to regular amount
export function formatAmountFromStripe(
  amount: number,
  currency: string = "usd",
): number {
  const currencies: Record<string, number> = {
    usd: 100,
    eur: 100,
    gbp: 100,
    cny: 100,
  };

  const divider = currencies[currency.toLowerCase()] || 100;
  return amount / divider;
}
