import {
  AddressElement,
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, LockKeyhole, Mail, MapPin, ShieldCheck } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { env } from "@/env/client";
import { useI18n } from "@/lib/i18n";
import { shopCheckoutOrderQueryOptions } from "@/lib/shop/query-options";
import { formatPrice } from "@/lib/utils";
import { updateCheckoutOrderDetails } from "@/server/orders";

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
  const { session } = Route.useRouteContext();
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
              customerEmail={session?.user.email || ""}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}

interface CheckoutOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    imageUrl: string;
    color: { name: string; value: string } | null;
    size: { name: string; value: string } | null;
  }>;
}

function OrderSnapshot({ order }: { order: CheckoutOrder }) {
  const { t } = useI18n();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {t("shop.cart.orderSummary")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t("shop.checkoutPage.orderNumber", {
              orderNumber: order.orderNumber,
            })}
          </p>
        </div>
        <Link
          to="/cart"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          {t("shop.checkoutPage.backToCart")}
        </Link>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
          >
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link
                to="/product/$id"
                params={{ id: item.productId }}
                className="block truncate text-sm font-semibold text-slate-900 transition-colors hover:text-slate-600"
              >
                {item.productName}
              </Link>
              <p className="mt-1 text-xs text-slate-400">
                {[item.color?.name, item.size?.value]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
              <p className="mt-3 text-xs font-medium text-slate-500">
                {t("shop.checkoutPage.quantity", { quantity: item.quantity })}
              </p>
            </div>
            <div className="text-right text-sm font-semibold tabular-nums text-slate-900">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>{t("shop.cart.subtotal")}</span>
          <span className="font-medium text-slate-900">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>{t("shop.cart.shipping")}</span>
          <span className="font-medium text-slate-900">
            {t("shop.cart.free")}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold text-slate-900">
          <span>{t("shop.cart.total")}</span>
          <span className="tabular-nums">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}

function CheckoutPaymentForm({
  orderId,
  customerEmail,
}: {
  orderId: string;
  customerEmail: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(customerEmail);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const addressElement = elements.getElement(AddressElement);

    if (!addressElement) {
      toast.error(t("shop.checkoutPage.shippingAddressNotReady"));
      return;
    }

    setIsSubmitting(true);

    try {
      const addressResult = await addressElement.getValue();

      if (!addressResult.complete) {
        toast.error(t("shop.checkoutPage.completeShippingAddress"));
        return;
      }

      const saveResult = await updateCheckoutOrderDetails({
        data: {
          orderId,
          shippingAddress: formatAddress(addressResult.value),
          phone: addressResult.value.phone || undefined,
        },
      });

      if (!saveResult.success) {
        throw new Error(
          saveResult.error || t("shop.checkoutPage.saveShippingFailed"),
        );
      }

      const confirmResult = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          payment_method_data: {
            billing_details: {
              email: email || undefined,
              name: addressResult.value.name || undefined,
              phone: addressResult.value.phone || undefined,
              address: {
                line1: addressResult.value.address.line1 || undefined,
                line2: addressResult.value.address.line2 || undefined,
                city: addressResult.value.address.city || undefined,
                state: addressResult.value.address.state || undefined,
                postal_code:
                  addressResult.value.address.postal_code || undefined,
                country: addressResult.value.address.country || undefined,
              },
            },
          },
          shipping: {
            name: addressResult.value.name,
            phone: addressResult.value.phone || undefined,
            address: {
              line1: addressResult.value.address.line1 || "",
              line2: addressResult.value.address.line2 || undefined,
              city: addressResult.value.address.city || undefined,
              state: addressResult.value.address.state || undefined,
              postal_code: addressResult.value.address.postal_code || undefined,
              country: addressResult.value.address.country || "",
            },
          },
        },
      });

      if (confirmResult.error) {
        throw new Error(
          confirmResult.error.message ||
            t("shop.checkoutPage.paymentConfirmFailed"),
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("shop.checkoutPage.paymentProcessFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <CheckoutSection
        icon={<Mail className="h-4 w-4" />}
        title={t("shop.checkoutPage.contact")}
        description={t("shop.checkoutPage.contactDescription")}
      >
        <LinkAuthenticationElement
          options={{
            defaultValues: {
              email: customerEmail,
            },
          }}
          onChange={(event) => setEmail(event.value.email)}
        />
      </CheckoutSection>

      <CheckoutSection
        icon={<MapPin className="h-4 w-4" />}
        title={t("shop.checkoutPage.shippingAddress")}
        description={t("shop.checkoutPage.shippingAddressDescription")}
      >
        <AddressElement
          options={{
            mode: "shipping",
            allowedCountries: ["CN", "US", "CA", "JP", "SG", "HK", "TW", "MO"],
            autocomplete: {
              mode: "automatic",
            },
            display: {
              name: "full",
            },
            defaultValues: {
              address: {
                country: "US",
              },
            },
            fields: {
              phone: "always",
            },
            validation: {
              phone: {
                required: "always",
              },
            },
          }}
        />
      </CheckoutSection>

      <CheckoutSection
        icon={<ShieldCheck className="h-4 w-4" />}
        title={t("shop.checkoutPage.payment")}
        description={t("shop.checkoutPage.paymentDescription")}
      >
        <PaymentElement
          options={{
            defaultValues: {
              billingDetails: {
                email: customerEmail,
              },
            },
            layout: {
              type: "tabs",
              defaultCollapsed: false,
            },
          }}
        />
      </CheckoutSection>

      <Button
        type="submit"
        size="lg"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("shop.cart.processing")}
          </>
        ) : (
          t("shop.checkoutPage.paySecurely")
        )}
      </Button>
    </form>
  );
}

function CheckoutSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-4 flex gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function formatAddress(value: {
  name?: string | null;
  address: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  };
}) {
  const address = value.address;
  const parts = [
    value.name,
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ];

  return parts.filter((part) => part && part.trim().length > 0).join(", ");
}

function CheckoutMessage({
  title,
  description,
  to,
}: {
  title: string;
  description?: string;
  to: "/cart" | "/";
}) {
  const { t } = useI18n();

  return (
    <div className="shop-shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="mb-3 text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mb-8 max-w-md text-sm text-slate-500">
        {description ?? t("shop.checkoutPage.returnToCartAndTryAgain")}
      </p>
      <Link
        to={to}
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        {t("shop.checkoutPage.return")}
      </Link>
    </div>
  );
}
