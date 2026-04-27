import { Link } from "@tanstack/react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";

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
    <div className="space-y-8">
      {recentOrders.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 text-center">
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
        recentOrders.map((order) => (
          <div key={order.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {order.customerName
                  ? order.customerName.substring(0, 2).toUpperCase()
                  : "UN"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm leading-none font-medium">
                  {order.customerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Order #{order.orderNumber}
                </p>
              </div>
              <div className="font-medium">${order.amount.toFixed(2)}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
