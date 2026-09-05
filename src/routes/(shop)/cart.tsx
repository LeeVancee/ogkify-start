import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { CartSummary } from "@/components/shop/cart/cart-summary";
import {
  type CartItemView,
  CartLineItem,
  useCartActions,
} from "@/components/shop/cart/cart-ui";
import { getCartSubtotal } from "@/components/shop/cart/cart-utils";
import { useSessionQuery } from "@/lib/auth-hooks";
import { useI18n } from "@/lib/i18n";
import { shopCartQueryOptions } from "@/lib/shop/query-options";

export const Route = createFileRoute("/(shop)/cart")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(shopCartQueryOptions()),
  pendingComponent: () => <SpinnerLoading text="Loading cart..." />,
  component: CartPage,
});

function CartPage() {
  const { t } = useI18n();
  const { session } = useSessionQuery();

  const { data: cartData } = useSuspenseQuery(shopCartQueryOptions());

  const cartActions = useCartActions();

  const items = cartData.items as Array<CartItemView>;
  const subtotal = getCartSubtotal(items);

  if (items.length === 0) {
    return (
      <div className="shop-shell py-24 text-center">
        <ShoppingBag className="mx-auto mb-6 size-10" strokeWidth={1} />
        <h1 className="mb-3 text-3xl font-light tracking-tight text-slate-900">
          {t("shop.cart.title")}
        </h1>
        <p className="text-slate-500">{t("shop.cart.emptyTitle")}</p>
        <Link
          to={session ? "/products" : "/login"}
          search={session ? {} : { redirect: "/cart" }}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          {t(
            session ? "common.actions.continueShopping" : "shop.userMenu.login",
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="shop-shell py-12 sm:py-16">
      <h1 className="mb-10 border-b border-border pb-8 text-4xl font-medium tracking-tight text-slate-900">
        {t("shop.cart.title")}
      </h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
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
