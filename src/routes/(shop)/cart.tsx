import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { formatPrice } from "@/lib/utils";
import {
  createCheckoutSession,
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
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to remove item");
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
      toast.error("Failed to update quantity");
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: () => createCheckoutSession(),
    onSuccess: (data) => {
      window.location.href = data.sessionUrl;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Checkout process failed",
      );
    },
  });

  if (isLoading) {
    return <SpinnerLoading text="Loading cart..." />;
  }

  if (isError || !cartData) {
    throw new Error("Failed to load cart");
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
      <div className="shop-shell py-20 text-center">
        <h1 className="mb-3 text-2xl font-light tracking-tight text-foreground">
          Cart
        </h1>
        <p className="text-muted-foreground">Your cart is empty</p>
        <Link to="/products" className="shop-pill-button mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-8 text-2xl font-light tracking-tight text-foreground sm:text-3xl">
        Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-border p-4"
            >
              <Link to="/product/$id" params={{ id: item.productId }}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 flex-shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to="/product/$id"
                      params={{ id: item.productId }}
                      className="block truncate text-sm font-medium text-foreground hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.colorName ? item.colorName : ""}{" "}
                      {item.sizeValue ? `/ ${item.sizeValue}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemMutation.mutate(item.id)}
                    className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border">
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
                      className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">
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
                      className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-medium text-foreground tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl bg-muted/40 p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-sm font-medium text-foreground">
            Order Summary
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="tabular-nums">Free</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 font-medium text-foreground">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending}
            className="shop-pill-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {checkoutMutation.isPending
              ? "Processing..."
              : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
