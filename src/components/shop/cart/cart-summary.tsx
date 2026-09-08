import { ArrowRight, Loader2 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

import { SecurePaymentNote } from "./secure-payment-note";

interface CartSummaryProps {
  subtotal: number;
  isCheckingOut: boolean;
  isUpdating?: boolean;
  onCheckout: () => void;
  variant?: "page" | "sheet";
}

export function CartSummary({
  subtotal,
  isCheckingOut,
  isUpdating = false,
  onCheckout,
  variant = "page",
}: CartSummaryProps) {
  const { t } = useI18n();
  const isSheet = variant === "sheet";
  return (
    <div
      className={
        isSheet
          ? ""
          : "h-fit border-t-2 border-foreground bg-secondary/60 p-6 sm:p-8 lg:sticky lg:top-28"
      }
    >
      {!isSheet ? (
        <h2 className="mb-8 text-lg font-medium tracking-tight text-foreground">
          {t("shop.cart.orderSummary")}
        </h2>
      ) : null}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>{t("shop.cart.subtotal")}</span>
          <span className="tabular-nums font-medium text-slate-900">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>{t("shop.cart.shipping")}</span>
          <span className="font-medium text-slate-900">
            {t("shop.cart.free")}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-5 text-foreground">
          <span className="font-semibold">{t("shop.cart.total")}</span>
          <span className="text-2xl font-medium tracking-tight tabular-nums">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>
      {!isSheet ? (
        <>
          <button
            type="button"
            onClick={onCheckout}
            disabled={isCheckingOut || isUpdating}
            className="commerce-primary mt-7 w-full"
          >
            {isCheckingOut
              ? t("shop.cart.processing")
              : t("shop.cart.proceedToCheckout")}
            {isCheckingOut ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowRight className="size-4" />
            )}
          </button>
          <div className="mt-4">
            <SecurePaymentNote />
          </div>
        </>
      ) : null}
    </div>
  );
}
