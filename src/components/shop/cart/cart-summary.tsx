import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  isCheckingOut: boolean;
  onCheckout: () => void;
  variant?: "page" | "sheet";
}

export function CartSummary({
  subtotal,
  isCheckingOut,
  onCheckout,
  variant = "page",
}: CartSummaryProps) {
  const { t } = useI18n();
  const isSheet = variant === "sheet";
  return (
    <div
      className={
        isSheet
          ? "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          : "h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24"
      }
    >
      {!isSheet ? (
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-400">
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
        <div className="flex justify-between border-t border-slate-100 pt-3 text-slate-900">
          <span className="font-semibold">{t("shop.cart.total")}</span>
          <span className="tabular-nums font-semibold">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>
      {!isSheet ? (
        <button
          type="button"
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="mt-6 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isCheckingOut
            ? t("shop.cart.processing")
            : t("shop.cart.proceedToCheckout")}
        </button>
      ) : null}
    </div>
  );
}
