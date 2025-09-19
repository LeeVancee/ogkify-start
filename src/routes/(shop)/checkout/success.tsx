import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/server/orders.server";

// order type definition
interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingAddress: string | null;
  phone: string | null;
}

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
  const { session_id, order_id } = Route.useSearch();

  // use TanStack Query to get order data
  const {
    data: orderResult,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", order_id, session_id],
    queryFn: async () => {
      if (!session_id || !order_id) {
        return null;
      }

      // wait for a short time to ensure webhook is processed
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // get order information from server
      const result = await getOrderById({ data: order_id });

      if (!result.success) {
        throw new Error(result.error || "Failed to get order information");
      }

      return result;
    },
    retry: 2,
    staleTime: 1000 * 60 * 10, // 10 minutes cache, checkout success page is usually only visited once
    enabled: Boolean(session_id && order_id),
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

  if (isError || !orderData) {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <h1 className="mb-4 text-2xl font-bold">
          Unable to get order information
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Unable to get order details, but your payment may have been processed. Please check your email or contact customer support."}
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
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
          <Button asChild variant="outline">
            <Link to="/">Continue Shopping</Link>
          </Button>
          <Button asChild>
            <Link to="/myorders">View My Orders</Link>
          </Button>
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
