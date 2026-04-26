import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { z } from "zod";

import { getOrderById } from "@/server/orders";

// define search params schema
const searchParamsSchema = z.object({
  session_id: z.string().optional(),
  order_id: z.string().optional(),
});

export const Route = createFileRoute("/(shop)/checkout/success")({
  validateSearch: searchParamsSchema,
  component: CheckoutSuccessPage,
});

function CheckoutSuccessContent() {
  const { order_id } = Route.useSearch();

  const {
    data: orderResult,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", order_id],
    queryFn: async () => {
      if (!order_id) {
        throw new Error("Checkout success page requires order_id");
      }

      const result = await getOrderById({ data: order_id });

      if (!result.success) {
        if (!result.error) {
          throw new Error("Order request failed without an error message");
        }

        throw new Error(result.error);
      }

      return result;
    },
    retry: 1,
    refetchInterval: (query) => {
      const order = query.state.data?.order;

      if (!order_id) {
        return false;
      }

      return order?.paymentStatus === "PAID" ? false : 2000;
    },
    refetchIntervalInBackground: true,
    staleTime: 1000 * 60 * 10, // 10 minutes cache, checkout success page is usually only visited once
    enabled: Boolean(order_id),
  });

  const orderData = orderResult?.order;

  if (isLoading) {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
        <h1 className="mb-2 text-2xl font-bold">Verifying your order...</h1>
        <p className="text-center text-muted-foreground">
          Please wait, we are processing your payment.
        </p>
      </div>
    );
  }

  if (orderData && orderData.paymentStatus !== "PAID") {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
        <h1 className="mb-2 text-2xl font-bold">Verifying your order...</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Payment is still being confirmed. This page will update automatically.
        </p>
        <Link
          to="/myorders"
          className="inline-flex items-center justify-center gap-2 h-10 px-6 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors shadow-sm"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  if (isError || !orderData) {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <h1 className="mb-4 text-2xl font-bold">
          Unable to get order information
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Unable to get order details."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container flex flex-col items-center justify-center py-16">
        <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold">Order Confirmation</h1>
        <p className="mb-6 text-center text-muted-foreground">
          Thank you for your purchase! Your order has been successfully
          processed.
        </p>

        <div className="mb-8 w-full max-w-md rounded-lg border bg-card p-6">
          <div className="mb-4">
            <p className="mb-1 text-sm text-muted-foreground">Order Number:</p>
            <p className="text-xl font-semibold">{orderData.orderNumber}</p>
          </div>

          {orderData.shippingAddress && (
            <div className="mb-4">
              <p className="mb-1 text-sm text-muted-foreground">
                Shipping Address:
              </p>
              <p className="text-sm">{orderData.shippingAddress}</p>
            </div>
          )}

          {orderData.phone && (
            <div className="mb-4">
              <p className="mb-1 text-sm text-muted-foreground">Phone:</p>
              <p className="text-sm">{orderData.phone}</p>
            </div>
          )}

          <div>
            <p className="mb-1 text-sm text-muted-foreground">Order Status:</p>
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Paid
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 h-10 px-6 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
          <Link
            to="/myorders"
            className="inline-flex items-center justify-center gap-2 h-10 px-6 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors shadow-sm"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </>
  );
}

function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex flex-col items-center justify-center py-16">
          <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
          <h1 className="mb-2 text-2xl font-bold">Loading...</h1>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
