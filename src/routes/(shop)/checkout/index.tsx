import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, LockKeyhole } from "lucide-react";
import { z } from "zod";

import { CheckoutMessage } from "@/components/shop/checkout/checkout-message";
import { CheckoutPaymentForm } from "@/components/shop/checkout/checkout-payment-form";
import { OrderSnapshot } from "@/components/shop/checkout/order-snapshot";
import { env } from "@/env/client";
import { useI18n } from "@/lib/i18n";
import { shopCheckoutOrderQueryOptions } from "@/lib/shop/query-options";

const stripePromise = env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const searchParamsSchema = z.object({
  order_id: z.string().optional(),
});

export const Route = createFileRoute("/(shop)/checkout/")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    orderId: search.order_id,
  }),
  loader: ({ context, deps }) => {
    if (!deps.orderId) {
      return null;
    }

    return context.queryClient.ensureQueryData(
      shopCheckoutOrderQueryOptions(deps.orderId),
    );
  },
  pendingComponent: () => (
    <div className="shop-shell flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
    </div>
  ),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { order_id } = Route.useSearch();
  const { t } = useI18n();

  if (!order_id) {
    return (
      <CheckoutMessage title={t("shop.checkoutPage.unavailable")} to="/cart" />
    );
  }

  if (!env.VITE_STRIPE_PUBLISHABLE_KEY || !stripePromise) {
    return (
      <CheckoutMessage
        title={t("shop.checkoutPage.stripeNotConfigured")}
        description={t("shop.checkoutPage.stripeNotConfiguredDescription")}
        to="/cart"
      />
    );
  }

  return <CheckoutPageContent orderId={order_id} />;
}

function CheckoutPageContent({ orderId }: { orderId: string }) {
  const { t } = useI18n();
  const { data: checkoutResult } = useSuspenseQuery(
    shopCheckoutOrderQueryOptions(orderId),
  );

  if (
    !checkoutResult.success ||
    !checkoutResult.order ||
    !checkoutResult.clientSecret
  ) {
    return (
      <CheckoutMessage
        title={t("shop.checkoutPage.unableToLoad")}
        description={
          checkoutResult.error
            ? checkoutResult.error
            : t("shop.checkoutPage.returnToCartAndTryAgain")
        }
        to="/cart"
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          {t("shop.checkoutPage.eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-light tracking-tight text-slate-900">
          {t("shop.checkoutPage.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        <OrderSnapshot order={checkoutResult.order} />
        <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-700">
            <LockKeyhole className="h-4 w-4" />
            {t("shop.checkoutPage.encryptedByStripe")}
          </div>

          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: checkoutResult.clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  borderRadius: "10px",
                  colorPrimary: "#0f172a",
                  colorText: "#0f172a",
                  colorTextSecondary: "#64748b",
                  colorDanger: "#dc2626",
                  colorBackground: "#ffffff",
                  fontFamily: "Geist, sans-serif",
                  fontSizeBase: "15px",
                  spacingUnit: "4px",
                },
                rules: {
                  ".Input": {
                    borderColor: "#cbd5e1",
                    boxShadow: "none",
                  },
                  ".Input:focus": {
                    borderColor: "#0f172a",
                    boxShadow: "0 0 0 1px #0f172a",
                  },
                  ".Label": {
                    color: "#334155",
                    fontWeight: "500",
                  },
                },
              },
            }}
          >
            <CheckoutPaymentForm
              orderId={checkoutResult.order.id}
              customerEmail={checkoutResult.customerEmail}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
