import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import { shopQueryKeys } from "@/lib/shop/query-options";
import { formatPrice } from "@/lib/utils";
import {
  createCheckoutPaymentIntent,
  removeFromCart,
  updateCartItemQuantity,
} from "@/server/shop/cart";

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
    mutationFn: async (cartItemId: string) => {
      const result = await removeFromCart({ data: cartItemId });
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success(t("shop.cart.removedToast"));
      queryClient.invalidateQueries({ queryKey: shopQueryKeys.cart() });
    },
    onError: () => {
      toast.error(t("shop.cart.removeErrorToast"));
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => {
      const result = await updateCartItemQuantity({
        data: { cartItemId, quantity },
      });
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopQueryKeys.cart() });
    },
    onError: () => {
      toast.error(t("shop.cart.updateErrorToast"));
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: () => createCheckoutPaymentIntent(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: shopQueryKeys.cart() });
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
  const itemClasses = "flex gap-4 border-b border-border py-6 sm:gap-6";
  const imageClasses = isSheet
    ? "h-32 w-24 bg-secondary object-cover"
    : "h-36 w-24 bg-secondary object-cover sm:h-44 sm:w-36";
  const quantityButtonClasses =
    "flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-35";

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

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/product/$id"
              params={{ id: item.productId }}
              onClick={onClose}
              className="block text-sm font-medium leading-6 text-foreground transition-colors hover:text-muted-foreground sm:text-base"
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
            className="-mr-2 -mt-2 flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive disabled:opacity-35"
            aria-label={t("shop.cart.removeLabel", { name: item.name })}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center border border-border">
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
              disabled={isMutating || item.quantity >= 99}
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
    <article className={itemClasses} aria-busy={isMutating}>
      {content}
    </article>
  );
}
