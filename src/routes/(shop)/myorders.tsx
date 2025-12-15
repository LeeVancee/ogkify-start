import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Hash,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { NoOrders } from "@/components/shop/orders/no-orders";
import { DeleteOrderButton } from "@/components/shop/orders/delete-order-button";
import { PayOrderButton } from "@/components/shop/orders/pay-order-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { getUnpaidOrders, getUserOrders } from "@/server/orders.server";

// Define types
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
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: Array<OrderItem>;
  firstItemImage: string | null;
}

export const Route = createFileRoute("/(shop)/myorders")({
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  // Use TanStack Query to fetch all orders
  const { data: allOrders = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      const response = await getUserOrders({});
      return response.success ? response.orders : [];
    },
    staleTime: 1000 * 60 * 3, // 3-minute cache
  });

  // Use TanStack Query to fetch unpaid orders
  const { data: unpaidOrders = [], isLoading: isLoadingUnpaid } = useQuery({
    queryKey: ["orders", "unpaid"],
    queryFn: async () => {
      const response = await getUnpaidOrders({});
      return response.success ? response.orders : [];
    },
    staleTime: 1000 * 60 * 3, // 3-minute cache
  });

  const isLoading = isLoadingAll || isLoadingUnpaid;

  // Handle refresh after order deletion
  const handleOrderDeleted = () => {
    // Use TanStack Query to refetch data
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  // Get order status icon
  function getOrderStatusIcon(status: string) {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "PAID":
      case "PROCESSING":
      case "PENDING":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "CANCELLED":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "UNPAID":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  }

  // Get order status name
  function getOrderStatusName(status: string) {
    switch (status) {
      case "COMPLETED":
        return "Completed";
      case "PAID":
        return "Processing";
      case "PROCESSING":
        return "Processing";
      case "PENDING":
        return "Pending";
      case "CANCELLED":
        return "Cancelled";
      case "UNPAID":
        return "Unpaid";
      default:
        return "Unknown Status";
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your orders
          </p>
        </div>
        <div className="flex justify-center py-20">
          <div className="text-center">
            <Clock className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (allOrders.length === 0 && unpaidOrders.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your orders
          </p>
        </div>
        <NoOrders
          icon={<ShoppingBag className="h-10 w-10" />}
          title="You have no orders"
          description="Start shopping, and your orders will appear here."
          buttonText="Browse Products"
          buttonHref="/"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your orders
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md h-11">
          <TabsTrigger value="all" className="gap-2">
            <Package className="h-4 w-4" />
            All Orders
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
              {allOrders.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unpaid" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Unpaid
            <span className="ml-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 px-2 py-0.5 text-xs font-semibold">
              {unpaidOrders.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {allOrders.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No orders yet</h3>
              <p className="text-muted-foreground">
                You haven't placed any orders yet.
              </p>
            </div>
          ) : (
            <OrdersList
              orders={allOrders}
              showPayButton={false}
              showDeleteButton={false}
              getOrderStatusIcon={getOrderStatusIcon}
              getOrderStatusName={getOrderStatusName}
              onOrderDeleted={handleOrderDeleted}
            />
          )}
        </TabsContent>

        <TabsContent value="unpaid" className="mt-6">
          {unpaidOrders.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="mb-2 text-lg font-semibold">All caught up!</h3>
              <p className="text-muted-foreground">
                You have no unpaid orders.
              </p>
            </div>
          ) : (
            <OrdersList
              orders={unpaidOrders}
              showPayButton={true}
              showDeleteButton={true}
              getOrderStatusIcon={getOrderStatusIcon}
              getOrderStatusName={getOrderStatusName}
              onOrderDeleted={handleOrderDeleted}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Order list component
interface OrdersListProps {
  orders: Array<Order>;
  showPayButton: boolean;
  showDeleteButton: boolean;
  getOrderStatusIcon: (status: string) => React.ReactNode;
  getOrderStatusName: (status: string) => string;
  onOrderDeleted: () => void;
}

function OrdersList({
  orders,
  showPayButton,
  showDeleteButton,
  getOrderStatusIcon,
  getOrderStatusName,
  onOrderDeleted,
}: OrdersListProps) {
  return (
    <div className="grid gap-6">
      {orders.map((order) => (
        <Card
          key={order.id}
          className="shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">
                  {order.orderNumber}
                </CardTitle>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {order.paymentStatus === "UNPAID" && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Unpaid
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/50">
                  {getOrderStatusIcon(order.status)}
                  <span className="text-sm font-medium">
                    {getOrderStatusName(order.status)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="text-right font-semibold">
                      Quantity
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Unit Price
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <div className="h-14 w-14 overflow-hidden rounded-lg border-2 border-border shadow-sm">
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {item.productName}
                            </div>
                            <div className="flex gap-2 mt-1">
                              {item.color && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <div
                                    className="h-3 w-3 rounded-full border"
                                    style={{
                                      backgroundColor: item.color.value,
                                    }}
                                  />
                                  {item.color.name}
                                </div>
                              )}
                              {item.size && (
                                <div className="text-xs text-muted-foreground">
                                  • Size: {item.size.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ×{item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              {showPayButton && order.paymentStatus === "UNPAID" && (
                <PayOrderButton orderId={order.id} />
              )}
              {showDeleteButton && order.paymentStatus === "UNPAID" && (
                <DeleteOrderButton
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  onDeleted={onOrderDeleted}
                />
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground font-medium">
                Order Total
              </div>
              <div className="text-2xl font-bold">
                {formatPrice(order.totalAmount)}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
