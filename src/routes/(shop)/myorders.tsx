import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle, ChevronDown, ChevronUp, Package } from "lucide-react";
import { useState } from "react";
import { DeleteOrderButton } from "@/components/shop/orders/delete-order-button";
import { PayOrderButton } from "@/components/shop/orders/pay-order-button";
import { formatPrice } from "@/lib/utils";
import { getUnpaidOrders, getUserOrders } from "@/server/orders";

export const Route = createFileRoute("/(shop)/myorders")({
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

function statusLabel(paymentStatus: string) {
  if (paymentStatus === "PAID") return "Paid";
  if (paymentStatus === "UNPAID") return "Unpaid";
  return paymentStatus;
}

function statusClass(paymentStatus: string) {
  if (paymentStatus === "PAID") return "bg-green-100 text-green-800";
  if (paymentStatus === "UNPAID") return "bg-yellow-100 text-yellow-800";
  return "bg-muted text-foreground";
}

function MyOrdersPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: allOrdersData, isLoading: isLoadingAll } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => getUserOrders({}),
    staleTime: 1000 * 60 * 3,
  });

  const { data: unpaidOrdersData, isLoading: isLoadingUnpaid } = useQuery({
    queryKey: ["orders", "unpaid"],
    queryFn: () => getUnpaidOrders({}),
    staleTime: 1000 * 60 * 3,
  });

  if (isLoadingAll || isLoadingUnpaid) {
    return (
      <div className="shop-shell py-20 text-center text-muted-foreground">Loading orders...</div>
    );
  }

  if (!allOrdersData || !unpaidOrdersData) {
    throw new Error("Orders data is missing");
  }

  if (!allOrdersData.success || !unpaidOrdersData.success) {
    throw new Error("Failed to load orders");
  }

  const allOrders = allOrdersData.orders as Array<Order>;
  const unpaidOrderIds = new Set(
    (unpaidOrdersData.orders as Array<Order>).map((order) => order.id),
  );

  if (allOrders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="mb-8 text-2xl font-light tracking-tight text-foreground sm:text-3xl">
          My Orders
        </h1>
        <div className="py-20 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">You don't have any orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-8 text-2xl font-light tracking-tight text-foreground sm:text-3xl">
        My Orders
      </h1>

      <div className="space-y-4">
        {allOrders.map((order) => {
          const expanded = expandedId === order.id;

          return (
            <div key={order.id} className="overflow-hidden rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : order.id)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/30 sm:p-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{order.orderNumber}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("zh-TW")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(order.paymentStatus)}`}>
                    {statusLabel(order.paymentStatus)}
                  </span>
                  <span className="hidden text-sm font-medium text-foreground tabular-nums sm:inline">
                    {formatPrice(order.totalAmount)}
                  </span>
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expanded ? (
                <div className="space-y-4 border-t border-border bg-muted/20 p-4 sm:p-5">
                  {order.items.map((item) => {
                    if (!item.imageUrl) {
                      throw new Error(`Order item image is missing for item ${item.id}`);
                    }

                    return (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.color ? item.color.name : ""} {item.size ? `/ ${item.size.name}` : ""} ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm text-foreground tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}

                  <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                    {unpaidOrderIds.has(order.id) ? <PayOrderButton orderId={order.id} /> : null}
                    {unpaidOrderIds.has(order.id) ? (
                      <DeleteOrderButton
                        orderId={order.id}
                        orderNumber={order.orderNumber}
                        onDeleted={() =>
                          queryClient.invalidateQueries({ queryKey: ["orders"] })
                        }
                      />
                    ) : null}
                  </div>

                  <div className="border-t border-border pt-3 text-right">
                    <div className="text-sm text-muted-foreground">Order Total</div>
                    <div className="text-xl font-medium text-foreground">
                      {formatPrice(order.totalAmount)}
                    </div>
                    {order.paymentStatus === "PAID" ? (
                      <div className="mt-2 inline-flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Payment completed
                      </div>
                    ) : null}
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
