import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { z } from "zod";

import { CheckoutMessage } from "@/components/shop/checkout/checkout-message";
import { CheckoutPaymentForm } from "@/components/shop/checkout/checkout-payment-form";
import { OrderSnapshot } from "@/components/shop/checkout/order-snapshot";
import { env } from "@/env/client";
import { useI18n } from "@/lib/i18n";
import { shopCheckoutOrderQueryOptions } from "@/lib/shop/query-options";
import { getSession } from "@/server/getSession";

const stripePromise = env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY, {
      developerTools: {
        assistant: { enabled: false },
      },
    })
  : null;

const searchParamsSchema = z.object({
  order_id: z.string().optional(),
});

export const Route = createFileRoute("/(shop)/checkout/")({
  validateSearch: searchParamsSchema,
  beforeLoad: async ({ location }) => {
    if (!(await getSession()))
      throw redirect({ to: "/login", search: { redirect: location.href } });
  },
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
    <div className="shop-shell py-12 sm:py-16">
      <div className="mb-10">
        <nav className="mb-6 flex items-center gap-4 text-xs text-muted-foreground">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {t("shop.cart.title")}
          </Link>
          <span>/</span>
          <span aria-current="step" className="text-foreground">
            {t("shop.checkoutPage.payment")}
          </span>
        </nav>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
          {t("shop.checkoutPage.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:gap-20">
        <div className="min-w-0">
          <div className="mb-7 flex items-center gap-2 text-xs text-muted-foreground">
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
                  borderRadius: "2px",
                  colorPrimary: "#20201e",
                  colorText: "#20201e",
                  colorTextSecondary: "#77766f",
                  colorDanger: "#dc2626",
                  colorBackground: "#faf9f6",
                  fontFamily: "Arial, sans-serif",
                  fontSizeBase: "15px",
                  spacingUnit: "4px",
                },
                rules: {
                  ".Input": {
                    borderColor: "#d8d6d0",
                    boxShadow: "none",
                  },
                  ".Input:focus": {
                    borderColor: "#20201e",
                    boxShadow: "0 0 0 1px #20201e",
                  },
                  ".Label": {
                    color: "#484740",
                    fontWeight: "500",
                  },
                },
              },
            }}
          >
            <CheckoutPaymentForm
              orderId={checkoutResult.order.id}
              customerEmail={checkoutResult.customerEmail}
              totalAmount={checkoutResult.order.totalAmount}
            />
          </Elements>
        </div>
        <aside className="lg:sticky lg:top-28">
          <OrderSnapshot order={checkoutResult.order} />
        </aside>
      </div>
    </div>
  );
}
