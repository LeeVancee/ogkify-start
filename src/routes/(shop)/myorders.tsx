import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

import { DeleteOrderButton } from "@/components/shop/orders/delete-order-button";
import { PayOrderButton } from "@/components/shop/orders/pay-order-button";
import {
  shopQueryKeys,
  shopUnpaidOrdersQueryOptions,
  shopUserOrdersQueryOptions,
} from "@/lib/shop/query-options";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/(shop)/myorders")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(shopUserOrdersQueryOptions()),
      context.queryClient.ensureQueryData(shopUnpaidOrdersQueryOptions()),
    ]),
  pendingComponent: OrdersPageLoading,
  component: MyOrdersPage,
});

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string | null;
  color?: { name: string; value: string } | null;
  size?: { name: string; value: string } | null;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  paymentStatus: string;
  totalAmount: number;
  items: Array<OrderItem>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "PAID") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
        <CheckCircle className="h-3 w-3" />
        Paid
      </span>
    );
  }
  if (status === "UNPAID") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
        <Clock className="h-3 w-3" />
        Unpaid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      {status}
    </span>
  );
}

function MyOrdersPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: allOrdersData } = useSuspenseQuery(
    shopUserOrdersQueryOptions(),
  );
  const { data: unpaidOrdersData } = useSuspenseQuery(
    shopUnpaidOrdersQueryOptions(),
  );

  if (!allOrdersData.success || !unpaidOrdersData.success) {
    throw new Error("Failed to load orders");
  }

  const allOrders = allOrdersData.orders as Array<Order>;
  const unpaidOrderIds = new Set(
    (unpaidOrdersData.orders as Array<Order>).map((order) => order.id),
  );

  if (allOrders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Account
          </p>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">
            My Orders
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-base font-medium text-slate-700">No orders yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Your order history will appear here
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            <ShoppingBag className="h-4 w-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Account
          </p>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">
            My Orders
          </h1>
        </div>
        <span className="text-sm text-slate-400">
          {allOrders.length} order{allOrders.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-3">
        {allOrders.map((order) => {
          const expanded = expandedId === order.id;
          const isUnpaid = unpaidOrderIds.has(order.id);
          const previewImages = order.items
            .slice(0, 3)
            .map((item) => item.imageUrl)
            .filter(Boolean);

          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-sm"
            >
              {/* Order header row */}
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : order.id)}
                className="flex w-full items-center gap-4 p-4 text-left sm:p-5 cursor-pointer"
              >
                {/* Product image previews */}
                <div className="hidden shrink-0 sm:flex -space-x-2">
                  {previewImages.length > 0 ? (
                    previewImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img!}
                        alt=""
                        className="h-12 w-12 rounded-xl border-2 border-white object-cover"
                        style={{ zIndex: previewImages.length - idx }}
                      />
                    ))
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Order info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {order.orderNumber}
                    </p>
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>

                {/* Total + chevron */}
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    {expanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              {expanded ? (
                <div className="border-t border-slate-100 bg-slate-50/70 px-4 pb-5 pt-4 sm:px-5">
                  {/* Items list */}
                  <div className="space-y-3">
                    {order.items.map((item) => {
                      if (!item.imageUrl) {
                        throw new Error(
                          `Order item image is missing for item ${item.id}`,
                        );
                      }

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {item.productName}
                            </p>
                            <div className="mt-0.5 flex flex-wrap gap-1.5">
                              {item.color ? (
                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                                  {item.color.name}
                                </span>
                              ) : null}
                              {item.size ? (
                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                                  {item.size.name}
                                </span>
                              ) : null}
                              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                                × {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer: total + actions */}
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {isUnpaid ? (
                        <>
                          <PayOrderButton orderId={order.id} />
                          <DeleteOrderButton
                            orderId={order.id}
                            orderNumber={order.orderNumber}
                            onDeleted={() =>
                              queryClient.invalidateQueries({
                                queryKey: shopQueryKeys.orders.all(),
                              })
                            }
                          />
                        </>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Order Total
                      </p>
                      <p className="mt-0.5 text-2xl font-light tracking-tight text-slate-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                      {order.paymentStatus === "PAID" ? (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Payment completed
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersPageLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Account
        </p>
        <h1 className="text-3xl font-light tracking-tight text-slate-900">
          My Orders
        </h1>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}
