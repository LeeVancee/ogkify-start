import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";

import {
  type CartItemView,
  CartLineItem,
  CartSummary,
  getCartSubtotal,
  SecurePaymentNote,
  useCartActions,
} from "@/components/shop/cart/cart-ui";
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
        className="w-full gap-0 border-slate-200 bg-white p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                {t("shop.cart.eyebrow")}
              </p>
              <SheetTitle className="mt-2 text-xl font-semibold text-slate-900">
                {t("shop.cart.title")}
              </SheetTitle>
            </div>
            {cartData.totalItems > 0 ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                {t(
                  cartData.totalItems === 1
                    ? "shop.cart.itemCount_one"
                    : "shop.cart.itemCount_other",
                  { count: cartData.totalItems },
                )}
              </span>
            ) : null}
          </div>
          <SheetDescription className="mt-2 text-sm leading-6 text-slate-500">
            {cartData.totalItems > 0
              ? t("shop.cart.descriptionWithItems", {
                  count: lineItemCount,
                  plural: lineItemCount === 1 ? "" : "s",
                })
              : t("shop.cart.descriptionEmpty")}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center px-6 py-16 text-sm text-slate-500">
            {t("shop.cart.loading")}
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center px-6 py-16 text-center text-sm text-slate-500">
            {t("shop.cart.loadError")}
          </div>
        ) : items.length === 0 ? (
          <CartSheetEmpty onOpenChange={onOpenChange} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto bg-slate-50/55 px-5 py-5">
              <div className="space-y-3 pb-6">
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

            <SheetFooter className="gap-4 border-t border-slate-200 bg-white/96 px-5 py-5 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm">
              <CartSummary
                subtotal={subtotal}
                isCheckingOut={cartActions.isCheckingOut}
                onCheckout={cartActions.checkout}
                variant="sheet"
              />
              <SecurePaymentNote />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Link
                  to="/cart"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  {t("shop.cart.viewCart")}
                </Link>
                <button
                  type="button"
                  onClick={cartActions.checkout}
                  disabled={cartActions.isCheckingOut}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {cartActions.isCheckingOut
                    ? t("shop.cart.processing")
                    : t("shop.cart.checkout")}
                </button>
              </div>
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
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">
        {t("shop.cart.emptyTitle")}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
        {t("shop.cart.emptyDescription")}
      </p>
      <div className="mt-6 flex max-w-sm flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
        <span className="rounded-full border border-slate-200 px-3 py-1.5">
          {t("shop.cart.fastCheckout")}
        </span>
        <span className="rounded-full border border-slate-200 px-3 py-1.5">
          {t("shop.cart.freeShipping")}
        </span>
        <span className="rounded-full border border-slate-200 px-3 py-1.5">
          {t("shop.cart.securePayment")}
        </span>
      </div>
      <Link
        to="/products"
        onClick={() => onOpenChange(false)}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        {t("common.actions.continueShopping")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
