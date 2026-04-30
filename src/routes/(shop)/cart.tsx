import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SpinnerLoading } from "@/components/shared/flexible-loading";
import {
  type CartItemView,
  CartLineItem,
  CartSummary,
  getCartSubtotal,
  useCartActions,
} from "@/components/shop/cart/cart-ui";
import { useI18n } from "@/lib/i18n";
import { getUserCart } from "@/server/cart";

export const Route = createFileRoute("/(shop)/cart")({
  component: CartPage,
});

function CartPage() {
  const { t } = useI18n();

  const {
    data: cartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getUserCart(),
    staleTime: 1000 * 60 * 2,
  });

  const cartActions = useCartActions();

  if (isLoading) {
    return <SpinnerLoading text={t("shop.cart.loading")} />;
  }

  if (isError || !cartData) {
    throw new Error(t("shop.cart.loadError"));
  }

  const items = cartData.items as Array<CartItemView>;
  const subtotal = getCartSubtotal(items);

  if (items.length === 0) {
    return (
      <div className="shop-shell py-24 text-center">
        <h1 className="mb-3 text-3xl font-light tracking-tight text-slate-900">
          {t("shop.cart.title")}
        </h1>
        <p className="text-slate-500">{t("shop.cart.emptyTitle")}</p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          {t("common.actions.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-10 text-3xl font-light tracking-tight text-slate-900">
        {t("shop.cart.title")}
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              isMutating={cartActions.isMutating}
              onRemove={cartActions.removeItem}
              onQuantityChange={cartActions.setQuantity}
            />
          ))}
        </div>

        <CartSummary
          subtotal={subtotal}
          isCheckingOut={cartActions.isCheckingOut}
          onCheckout={cartActions.checkout}
        />
      </div>
    </div>
  );
}
