import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { z } from "zod";

import { shopOrderDetailQueryOptions } from "@/lib/shop/query-options";

// define search params schema
const searchParamsSchema = z.object({
  session_id: z.string().optional(),
  order_id: z.string().optional(),
});

export const Route = createFileRoute("/(shop)/checkout/success")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    orderId: search.order_id,
  }),
  loader: ({ context, deps }) => {
    if (!deps.orderId) {
      return null;
    }

    return context.queryClient.ensureQueryData(
      shopOrderDetailQueryOptions(deps.orderId),
    );
  },
  pendingComponent: () => (
    <CenteredCheckoutState>
      <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
      <h1 className="mb-2 text-2xl font-bold">Verifying your order...</h1>
      <p className="text-center text-muted-foreground">
        Please wait, we are processing your payment.
      </p>
    </CenteredCheckoutState>
  ),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessContent({ orderId }: { orderId: string }) {
  const { data: orderResult } = useSuspenseQuery(
    shopOrderDetailQueryOptions(orderId),
  );

  const orderData = orderResult.order;

  if (orderData && orderData.paymentStatus !== "PAID") {
    return (
      <CenteredCheckoutState>
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
      </CenteredCheckoutState>
    );
  }

  if (!orderResult.success || !orderData) {
    return (
      <CenteredCheckoutState>
        <h1 className="mb-4 text-2xl font-bold">
          Unable to get order information
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          {orderResult.error
            ? orderResult.error
            : "Unable to get order details."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </CenteredCheckoutState>
    );
  }

  return (
    <CenteredCheckoutState>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold">Order Confirmation</h1>
        <p className="mb-6 max-w-xl text-center text-muted-foreground">
          Thank you for your purchase! Your order has been successfully
          processed.
        </p>

        <div className="mx-auto mb-8 w-full max-w-md rounded-lg border bg-card p-6 text-left">
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

        <div className="flex flex-wrap justify-center gap-4">
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
    </CenteredCheckoutState>
  );
}

function CheckoutSuccessPage() {
  const { order_id } = Route.useSearch();

  if (!order_id) {
    return (
      <CenteredCheckoutState>
        <h1 className="mb-4 text-2xl font-bold">Missing order information</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Checkout success page requires order_id.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </CenteredCheckoutState>
    );
  }

  return <CheckoutSuccessContent orderId={order_id} />;
}

function CenteredCheckoutState({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      {children}
    </div>
  );
}
