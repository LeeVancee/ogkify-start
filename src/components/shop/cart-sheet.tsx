import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import {
  createCheckoutPaymentIntent,
  removeFromCart,
  updateCartItemQuantity,
} from "@/server/cart";

export interface CartSheetItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  colorName?: string | null;
  sizeValue?: string | null;
}

export interface CartSheetData {
  items: Array<CartSheetItem>;
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const items = cartData.items;
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const lineItemCount = items.length;

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCart({ data: cartItemId }),
    onSuccess: () => {
      toast.success(t("shop.cart.removedToast"));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error(t("shop.cart.removeErrorToast"));
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => updateCartItemQuantity({ data: { cartItemId, quantity } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error(t("shop.cart.updateErrorToast"));
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: () => createCheckoutPaymentIntent(),
    onSuccess: (data) => {
      onOpenChange(false);
      navigate({
        to: "/checkout",
        search: {
          order_id: data.orderId,
        },
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : t("shop.cart.checkoutErrorToast"),
      );
    },
  });

  const isMutating =
    removeItemMutation.isPending ||
    updateQuantityMutation.isPending ||
    checkoutMutation.isPending;

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
        ) : (
          <>
            <div className="flex-1 overflow-y-auto bg-slate-50/55 px-5 py-5">
              <div className="space-y-3 pb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex gap-4">
                      <Link
                        to="/product/$id"
                        params={{ id: item.productId }}
                        onClick={() => onOpenChange(false)}
                        className="shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              to="/product/$id"
                              params={{ id: item.productId }}
                              onClick={() => onOpenChange(false)}
                              className="block truncate text-sm font-semibold text-slate-900 transition-colors hover:text-slate-600"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-xs text-slate-400">
                              {item.colorName
                                ? item.colorName
                                : t("shop.cart.standard")}
                              {item.sizeValue ? ` / ${item.sizeValue}` : ""}
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-900">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItemMutation.mutate(item.id)}
                            disabled={isMutating}
                            className="rounded-lg p-1 text-slate-300 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            aria-label={t("shop.cart.removeLabel", {
                              name: item.name,
                            })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity === 1) {
                                  removeItemMutation.mutate(item.id);
                                  return;
                                }

                                updateQuantityMutation.mutate({
                                  cartItemId: item.id,
                                  quantity: item.quantity - 1,
                                });
                              }}
                              disabled={isMutating}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                              aria-label={t("shop.cart.decreaseLabel", {
                                name: item.name,
                              })}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold tabular-nums text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  cartItemId: item.id,
                                  quantity: item.quantity + 1,
                                })
                              }
                              disabled={isMutating}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                              aria-label={t("shop.cart.increaseLabel", {
                                name: item.name,
                              })}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold tabular-nums text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="gap-4 border-t border-slate-200 bg-white/96 px-5 py-5 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>{t("shop.cart.subtotal")}</span>
                    <span className="font-medium text-slate-900 tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>{t("shop.cart.shipping")}</span>
                    <span className="font-medium text-slate-900">
                      {t("shop.cart.free")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-slate-900">
                    <span className="font-semibold">
                      {t("shop.cart.total")}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-slate-700" />
                {t("shop.cart.securePaymentNote")}
              </div>

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
                  onClick={() => checkoutMutation.mutate()}
                  disabled={checkoutMutation.isPending}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {checkoutMutation.isPending
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
