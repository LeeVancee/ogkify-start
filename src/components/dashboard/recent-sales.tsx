import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">No recent orders</p>
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
