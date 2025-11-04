import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownUp,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getOrderDetails, getUserOrders } from "@/server/orders.server";
import { OrderDetailsDialog } from "./order-details-dialog";
import type { Order } from "./order-types";
import { OrdersTable } from "./orders-table";
import { UpdateOrderStatusDialog } from "./update-order-status-dialog";

// Filter form type
interface FilterForm {
  searchQuery: string;
  statusFilter: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function OrderManagement() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Extract order array from response
  const orders = ordersResponse?.success ? ordersResponse.orders : [];

  // Use react-hook-form to manage filter form
  const { register, watch, setValue, handleSubmit } = useForm<FilterForm>({
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) ||
      (order.email.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && order.paymentStatus === "PAID") ||
      (statusFilter === "unpaid" && order.paymentStatus === "UNPAID") ||
      (statusFilter === "processing" && order.status === "PAID");

    return matchesSearch && matchesStatus;
  });

  // Handle loading state
  if (isLoading) {
    return <Loading />;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold text-red-500">
            Failed to load orders
          </h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            There was an error loading the orders. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Handle form submission
  const onSubmit = (data: FilterForm) => {
    console.log("Filter form submitted:", data);
    // Can perform more complex filtering operations
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs
          defaultValue="all"
          value={statusFilter}
          onValueChange={(value) => setValue("statusFilter", value)}
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8 w-full md:w-[250px]"
                  {...register("searchQuery")}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear Search</span>
                  </Button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter Conditions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Range
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowDownUp className="mr-2 h-4 w-4" />
                    Amount
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <OrdersTable
              orders={filteredOrders}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>
          <TabsContent value="paid" className="mt-4">
            <OrdersTable
              orders={filteredOrders}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>
          <TabsContent value="unpaid" className="mt-4">
            <OrdersTable
              orders={filteredOrders}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>
          <TabsContent value="processing" className="mt-4">
            <OrdersTable
              orders={filteredOrders}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>
        </Tabs>
      </form>

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
