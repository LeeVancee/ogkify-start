import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";

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
      <div className="shop-shell flex min-h-[65dvh] flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="mx-auto mb-8 size-14" strokeWidth={1} />
        <h1 className="mb-4 text-4xl font-medium tracking-tight text-foreground">
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
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t("common.actions.continueShopping")}
      </Link>
      <div className="mb-4 flex items-baseline gap-4 border-b border-border pb-8 sm:mb-8">
        <h1 className="text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
          {t("shop.cart.title")}
        </h1>
        <span className="text-sm tabular-nums text-muted-foreground">
          ({cartData.totalItems})
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <div className="min-w-0">
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
          isUpdating={cartActions.isMutating}
          onCheckout={cartActions.checkout}
        />
      </div>
    </div>
  );
}
