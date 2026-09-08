import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { CartSummary } from "@/components/shop/cart/cart-summary";
import {
  type CartItemView,
  CartLineItem,
  useCartActions,
} from "@/components/shop/cart/cart-ui";
import { getCartSubtotal } from "@/components/shop/cart/cart-utils";
import { SecurePaymentNote } from "@/components/shop/cart/secure-payment-note";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";

export interface CartSheetData {
  items: Array<CartItemView>;
  totalItems: number;
}

interface CartSheetProps {
  cartData: CartSheetData;
  isLoading: boolean;
  isError: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({
  cartData,
  isLoading,
  isError,
  open,
  onOpenChange,
}: CartSheetProps) {
  const { t } = useI18n();
  const cartActions = useCartActions({
    onCheckoutSuccess: () => onOpenChange(false),
  });
  const items = cartData.items;
  const subtotal = getCartSubtotal(items);
  const lineItemCount = items.length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="shop-theme gap-0 border-border bg-background p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[480px]"
      >
        <SheetHeader className="shrink-0 border-b border-border px-6 py-7 sm:px-8">
          <div className="flex items-center gap-3 pr-8">
            <div>
              <SheetTitle className="text-3xl font-medium tracking-tight text-foreground">
                {t("shop.cart.title")}
              </SheetTitle>
            </div>
            {cartData.totalItems > 0 ? (
              <span className="text-xs tabular-nums text-muted-foreground">
                {t(
                  cartData.totalItems === 1
                    ? "shop.cart.itemCount_one"
                    : "shop.cart.itemCount_other",
                  { count: cartData.totalItems },
                )}
              </span>
            ) : null}
          </div>
          <SheetDescription className="sr-only">
            {cartData.totalItems > 0
              ? t("shop.cart.descriptionWithItems", {
                  count: lineItemCount,
                  plural: lineItemCount === 1 ? "" : "s",
                })
              : t("shop.cart.descriptionEmpty")}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-8 py-8 text-sm text-muted-foreground">
            <span role="status" className="sr-only">
              {t("shop.cart.loading")}
            </span>
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                aria-hidden="true"
                className="flex w-full animate-pulse gap-4"
              >
                <div className="h-32 w-24 bg-secondary" />
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-4 w-3/4 bg-secondary" />
                  <div className="h-3 w-1/2 bg-secondary" />
                  <div className="mt-8 h-8 w-24 bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center bg-secondary/35 px-6 py-16 text-center text-sm text-muted-foreground">
            {t("shop.cart.loadError")}
          </div>
        ) : items.length === 0 ? (
          <CartSheetEmpty onOpenChange={onOpenChange} />
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8">
              <div className="pb-2">
                {items.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    isMutating={cartActions.isMutating}
                    onClose={() => onOpenChange(false)}
                    onRemove={cartActions.removeItem}
                    onQuantityChange={cartActions.setQuantity}
                    variant="sheet"
                  />
                ))}
              </div>
            </div>

            <SheetFooter className="shrink-0 gap-4 border-t border-border bg-secondary/40 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
              <CartSummary
                subtotal={subtotal}
                isCheckingOut={cartActions.isCheckingOut}
                onCheckout={cartActions.checkout}
                variant="sheet"
              />
              <button
                type="button"
                onClick={cartActions.checkout}
                disabled={cartActions.isCheckingOut || cartActions.isMutating}
                className="commerce-primary w-full"
              >
                {cartActions.isCheckingOut
                  ? t("shop.cart.processing")
                  : t("shop.cart.checkout")}
                <ArrowRight className="size-4" />
              </button>
              <div className="flex justify-center">
                <SecurePaymentNote />
              </div>
              <Link
                to="/cart"
                onClick={() => onOpenChange(false)}
                className="py-1 text-center text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                {t("shop.cart.viewCart")}
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartSheetEmpty({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-8 py-12 text-center">
      <div className="flex h-24 w-24 items-center justify-center bg-secondary/60 text-muted-foreground">
        <ShoppingBag className="h-9 w-9" strokeWidth={1} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-foreground">
        {t("shop.cart.emptyTitle")}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
        {t("shop.cart.emptyDescription")}
      </p>
      <Link
        to="/products"
        onClick={() => onOpenChange(false)}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all duration-200 hover:bg-[#354239] active:translate-y-px"
      >
        {t("common.actions.continueShopping")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
