import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import {
  createCheckoutPaymentIntent,
  removeFromCart,
  updateCartItemQuantity,
} from "@/server/cart";

export interface CartItemView {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  colorName?: string | null;
  sizeValue?: string | null;
}

interface UseCartActionsOptions {
  onCheckoutSuccess?: () => void;
}

export function useCartActions({
  onCheckoutSuccess,
}: UseCartActionsOptions = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useI18n();

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
      onCheckoutSuccess?.();
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

  const removeItem = (itemId: string) => removeItemMutation.mutate(itemId);
  const setQuantity = (item: CartItemView, quantity: number) => {
    if (quantity < 1) {
      removeItem(item.id);
      return;
    }

    updateQuantityMutation.mutate({
      cartItemId: item.id,
      quantity,
    });
  };

  return {
    checkout: () => checkoutMutation.mutate(),
    isCheckingOut: checkoutMutation.isPending,
    isMutating:
      removeItemMutation.isPending ||
      updateQuantityMutation.isPending ||
      checkoutMutation.isPending,
    removeItem,
    setQuantity,
  };
}

export function getCartSubtotal(items: Array<CartItemView>) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

interface CartLineItemProps {
  item: CartItemView;
  isMutating: boolean;
  onClose?: () => void;
  onRemove: (itemId: string) => void;
  onQuantityChange: (item: CartItemView, quantity: number) => void;
  variant?: "page" | "sheet";
}

export function CartLineItem({
  item,
  isMutating,
  onClose,
  onRemove,
  onQuantityChange,
  variant = "page",
}: CartLineItemProps) {
  const { t } = useI18n();
  const isSheet = variant === "sheet";
  const itemClasses = isSheet
    ? "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    : "flex gap-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5";
  const imageClasses = isSheet
    ? "h-20 w-20 rounded-xl object-cover"
    : "h-28 w-28 shrink-0 rounded-xl object-cover";
  const quantityButtonClasses = isSheet
    ? "flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
    : "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

  const content = (
    <>
      <Link
        to="/product/$id"
        params={{ id: item.productId }}
        onClick={onClose}
        className="shrink-0"
      >
        <img src={item.image} alt={item.name} className={imageClasses} />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/product/$id"
              params={{ id: item.productId }}
              onClick={onClose}
              className="block truncate text-sm font-semibold text-slate-900 transition-colors hover:text-slate-600"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-slate-400">
              {item.colorName ? item.colorName : t("shop.cart.standard")}
              {item.sizeValue ? ` / ${item.sizeValue}` : ""}
            </p>
            {isSheet ? (
              <p className="mt-2 text-sm font-medium text-slate-900">
                {formatPrice(item.price)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={isMutating}
            className="rounded-lg p-1 text-slate-300 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            aria-label={t("shop.cart.removeLabel", { name: item.name })}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div
            className={
              isSheet
                ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1"
                : "flex items-center gap-2"
            }
          >
            <button
              type="button"
              onClick={() => onQuantityChange(item, item.quantity - 1)}
              disabled={isMutating}
              className={quantityButtonClasses}
              aria-label={t("shop.cart.decreaseLabel", { name: item.name })}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-7 text-center text-sm font-semibold tabular-nums text-slate-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item, item.quantity + 1)}
              disabled={isMutating}
              className={quantityButtonClasses}
              aria-label={t("shop.cart.increaseLabel", { name: item.name })}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <span className="text-sm font-semibold tabular-nums text-slate-900">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className={itemClasses}>
      {isSheet ? <div className="flex gap-4">{content}</div> : content}
    </div>
  );
}

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

export function SecurePaymentNote() {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <ShieldCheck className="h-4 w-4 text-slate-700" />
      {t("shop.cart.securePaymentNote")}
    </div>
  );
}
