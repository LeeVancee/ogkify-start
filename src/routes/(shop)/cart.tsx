import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import {
  createCheckoutPaymentIntent,
  getUserCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/server/cart";

export const Route = createFileRoute("/(shop)/cart")({
  component: CartPage,
});

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  colorName?: string | null;
  sizeValue?: string | null;
}

function CartPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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

  if (isLoading) {
    return <SpinnerLoading text={t("shop.cart.loading")} />;
  }

  if (isError || !cartData) {
    throw new Error(t("shop.cart.loadError"));
  }

  const items = cartData.items as Array<CartItem>;
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

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
            <div
              key={item.id}
              className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
            >
              <Link to="/product/$id" params={{ id: item.productId }}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-28 shrink-0 rounded-xl object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to="/product/$id"
                      params={{ id: item.productId }}
                      className="block truncate text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.colorName ? item.colorName : ""}{" "}
                      {item.sizeValue ? `/ ${item.sizeValue}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemMutation.mutate(item.id)}
                    className="p-1 text-slate-300 transition-colors hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
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
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-900 cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold tabular-nums text-slate-900">
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
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-900 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="text-sm font-semibold text-slate-900 tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {t("shop.cart.orderSummary")}
          </h2>
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
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending}
            className="mt-6 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {checkoutMutation.isPending
              ? t("shop.cart.processing")
              : t("shop.cart.proceedToCheckout")}
          </button>
        </div>
      </div>
    </div>
  );
}
