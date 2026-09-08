import { Link } from "@tanstack/react-router";

import { SecurePaymentNote } from "@/components/shop/cart/secure-payment-note";
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
    <div className="border-t-2 border-foreground bg-secondary/60 p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium tracking-tight text-foreground">
            {t("shop.cart.orderSummary")}
          </h2>
          <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground">
            {t("shop.checkoutPage.orderNumber", {
              orderNumber: order.orderNumber,
            })}
          </p>
        </div>
        <Link
          to="/cart"
          className="text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("shop.checkoutPage.backToCart")}
        </Link>
      </div>

      <div className="divide-y divide-border">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-3 py-5">
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="h-24 w-20 shrink-0 bg-background object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link
                to="/product/$id"
                params={{ id: item.productId }}
                className="block text-sm font-medium leading-5 text-foreground transition-colors hover:text-muted-foreground"
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

      <div className="mt-4 space-y-4 border-t border-border pt-6 text-sm">
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
        <div className="flex items-baseline justify-between border-t border-border pt-5 font-medium text-foreground">
          <span>{t("shop.cart.total")}</span>
          <span className="text-3xl tracking-tight tabular-nums">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <SecurePaymentNote />
      </div>
    </div>
  );
}
