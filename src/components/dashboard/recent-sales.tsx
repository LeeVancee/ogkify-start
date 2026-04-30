import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string | Date;
  status: string;
  paymentStatus: string;
  amount: number;
  itemsCount: number;
}

interface RecentSalesProps {
  recentOrders: Array<Order>;
}

export function RecentSales({ recentOrders = [] }: RecentSalesProps) {
  return (
    <div className="space-y-2">
      {recentOrders.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 text-center">
          <p className="text-sm font-medium">No recent orders</p>
          <p className="mt-1 text-xs text-muted-foreground">
            New completed orders will appear here.
          </p>
          <Link
            to="/dashboard/orders"
            className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-3`}
          >
            View Orders
          </Link>
        </div>
      ) : (
        recentOrders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/30"
          >
            <Avatar className="size-8 shrink-0 rounded-full">
              <AvatarFallback className="text-xs">
                {order.customerName
                  ? order.customerName.substring(0, 2).toUpperCase()
                  : "UN"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <p className="truncate text-sm font-medium">
                  {order.customerName || "Unknown customer"}
                </p>
                <span className="shrink-0 text-sm font-semibold">
                  {formatPrice(order.amount)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <ShoppingCart className="size-3.5" />
                <span className="truncate">#{order.orderNumber}</span>
                <span className="rounded border px-1.5 py-0.5">
                  {order.itemsCount} items
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
