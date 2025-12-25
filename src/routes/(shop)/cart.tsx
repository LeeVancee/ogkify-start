import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getUserCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/server/cart.server";

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
  colorId?: string | null;
  colorName?: string | null;
  colorValue?: string | null;
  sizeId?: string | null;
  sizeName?: string | null;
  sizeValue?: string | null;
}

function CartPage() {
  const queryClient = useQueryClient();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Get cart data
  const {
    data: cartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getUserCart(),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCart({ data: cartItemId }),
    onSuccess: () => {
      toast.success("Item removed from cart");
      // Refresh cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => updateCartItemQuantity({ data: { cartItemId, quantity } }),
    onSuccess: () => {
      // Refresh cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to update quantity");
    },
  });

  const handleRemoveItem = (cartItemId: string) => {
    removeItemMutation.mutate(cartItemId);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }
    updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Call checkout API to create Stripe session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout page
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
        return;
      }

      toast.error("Failed to create checkout session");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error ? error.message : "Checkout process failed",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Calculate totals
  const items = cartData?.items || [];
  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 25 ? 0 : 10; // Free shipping over $25
  const total = subtotal + shipping;

  // Handle loading state
  if (isLoading) {
    return <SpinnerLoading />;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold text-red-500">
              Failed to load cart
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              There was an error loading your cart. Please try again.
            </p>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["cart"] })
              }
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item: CartItem, index: number) => (
                <div key={item.id}>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeItemMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Variants */}
                      <div className="flex gap-2">
                        {item.colorName && (
                          <Badge variant="outline" className="text-xs">
                            <div
                              className="mr-1 h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: item.colorValue || "#000",
                              }}
                            />
                            {item.colorName}
                          </Badge>
                        )}
                        {item.sizeValue && (
                          <Badge variant="outline" className="text-xs">
                            Size: {item.sizeValue}
                          </Badge>
                        )}
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={
                              updateQuantityMutation.isPending ||
                              item.quantity <= 1
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updateQuantityMutation.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < items.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                  Add ${(25 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
              >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Secure checkout powered by Stripe
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
