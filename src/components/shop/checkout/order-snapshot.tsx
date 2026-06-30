import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

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

export function OrderSnapshot({ order }: { order: CheckoutOrder }) {
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
