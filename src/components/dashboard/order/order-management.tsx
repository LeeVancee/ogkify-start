import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, RefreshCw, Search, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getOrderDetails, getUserOrders } from "@/server/orders";

import { EmptyState } from "../empty-state";
import { DashboardPageHeader } from "../page-header";
import { OrderDetailsDialog } from "./order-details-dialog";
import type { Order } from "./order-types";
import { OrdersTable } from "./orders-table";
import { UpdateOrderStatusDialog } from "./update-order-status-dialog";

// Filter form type
interface FilterForm {
  searchQuery: string;
  statusFilter: string;
}

const processingStatuses = new Set(["PROCESSING", "PAID"]);

export function OrderManagement() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);

  // Use TanStack Query to fetch order data
  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await getUserOrders();
      return response;
    },
    staleTime: 1000 * 60 * 2, // 2-minute cache
  });

  if (ordersResponse && !ordersResponse.success) {
    throw new Error("Failed to load user orders");
  }
  const { register, watch, setValue } = useForm<FilterForm>({
    defaultValues: {
      searchQuery: "",
      statusFilter: "all",
    },
  });

  // Watch form value changes
  const searchQuery = watch("searchQuery");
  const statusFilter = watch("statusFilter");

  // Clear search
  const clearSearch = () => {
    setValue("searchQuery", "");
  };

  // Refresh order list
  function refreshOrders() {
    refetch();
  }

  // View order details
  async function handleViewDetails(order: Order) {
    try {
      // First show basic information
      setSelectedOrder(order);
      setIsDetailsOpen(true);

      // Then load detailed information asynchronously
      const response = await getOrderDetails({ data: order.id });
      if (response.success && response.order) {
        setSelectedOrder(response.order);
      }
    } catch (err) {
      console.error("Failed to get order details:", err);
    }
  }

  // Open update status dialog
  function handleUpdateStatus(order: Order) {
    setSelectedOrder(order);
    setIsStatusUpdateOpen(true);
  }

  // Callback after order status update
  function handleStatusUpdated() {
    // Close status update dialog
    setIsStatusUpdateOpen(false);
    // Refresh order data
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }

  // Handle loading state
  if (isLoading) {
    return <SpinnerLoading />;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <DashboardPageHeader
          title="Order Management"
          description="Manage customer orders, payment state, and fulfillment progress."
        />
        <EmptyState
          icon={AlertCircle}
          title="Failed to load orders"
          description="There was an error loading the orders. Please try again."
          tone="destructive"
          action={
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  if (!ordersResponse) {
    throw new Error("Orders response is required");
  }

  const orders = ordersResponse.orders;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && order.paymentStatus === "PAID") ||
      (statusFilter === "unpaid" && order.paymentStatus === "UNPAID") ||
      (statusFilter === "processing" && processingStatuses.has(order.status));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardPageHeader
        title="Order Management"
        description="Manage customer orders, payment state, and fulfillment progress."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={refreshOrders}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", {
                "animate-spin": isLoading,
              })}
            />
            Refresh
          </Button>
        }
      />

      <Tabs
        defaultValue="all"
        value={statusFilter}
        onValueChange={(value) => setValue("statusFilter", value)}
      >
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full overflow-x-auto pb-1 lg:w-auto">
            <TabsList>
              <TabsTrigger value="all" className="h-7 text-xs">
                All Orders
              </TabsTrigger>
              <TabsTrigger value="paid" className="h-7 text-xs">
                Paid
              </TabsTrigger>
              <TabsTrigger value="unpaid" className="h-7 text-xs">
                Unpaid
              </TabsTrigger>
              <TabsTrigger value="processing" className="h-7 text-xs">
                Processing
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="text-xs text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length}
            </div>
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="h-8 pl-8 pr-9 text-sm"
                {...register("searchQuery")}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-0 top-0 size-8"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear Search</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Tabs>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={searchQuery ? Search : AlertCircle}
          title="No orders found"
          description={
            searchQuery || statusFilter !== "all"
              ? "No orders match the current search or status filter."
              : "Orders will appear here after customers place them."
          }
          action={
            searchQuery || statusFilter !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearSearch();
                  setValue("statusFilter", "all");
                }}
              >
                Clear Filters
              </Button>
            ) : null
          }
        />
      ) : (
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Order details dialog */}
      <OrderDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Update order status dialog */}
      {selectedOrder && (
        <UpdateOrderStatusDialog
          open={isStatusUpdateOpen}
          onOpenChange={setIsStatusUpdateOpen}
          order={selectedOrder}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
