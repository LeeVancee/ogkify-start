import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { CheckoutSection } from "@/components/shop/checkout/checkout-section";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { updateCheckoutOrderDetails } from "@/server/shop/orders";

export function CheckoutPaymentForm({
  orderId,
  customerEmail,
  totalAmount,
}: {
  orderId: string;
  customerEmail: string;
  totalAmount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef(customerEmail);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    void (async () => {
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
              email: emailRef.current || undefined,
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
    })()
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error
            ? error.message
            : t("shop.checkoutPage.paymentProcessFailed"),
        );
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <CheckoutSection step="01" title={t("shop.checkoutPage.contact")}>
        <LinkAuthenticationElement
          options={{
            defaultValues: {
              email: customerEmail,
            },
          }}
          onChange={(event) => {
            emailRef.current = event.value.email;
          }}
        />
      </CheckoutSection>

      <CheckoutSection step="02" title={t("shop.checkoutPage.shippingAddress")}>
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

      <CheckoutSection step="03" title={t("shop.checkoutPage.payment")}>
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

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="commerce-primary w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("shop.cart.processing")}
          </>
        ) : (
          <>
            <span className="flex items-center gap-2">
              <LockKeyhole className="size-4" />
              {t("shop.checkoutPage.paySecurely")}
            </span>
            <span className="flex items-center gap-3 tabular-nums">
              {formatPrice(totalAmount)}
              <ArrowRight className="size-4" />
            </span>
          </>
        )}
      </button>
    </form>
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
