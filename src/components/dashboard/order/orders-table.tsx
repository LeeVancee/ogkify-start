import { Eye, RefreshCw } from "lucide-react";

import { DataTableShell } from "@/components/dashboard/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

import type { Order } from "./order-types";
import { getOrderStatusName, getPaymentStatusName } from "./order-utils";

interface OrdersTableProps {
  orders: Array<Order>;
  isLoading: boolean;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
}

function OrderStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
    PAID: "bg-blue-50 text-blue-700 border-blue-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  };
  const cls =
    variants[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={`text-xs font-medium ${cls}`}>
      {getOrderStatusName(status)}
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    PAID: "bg-green-50 text-green-700 border-green-200",
    UNPAID: "bg-amber-50 text-amber-700 border-amber-200",
    REFUNDED: "bg-blue-50 text-blue-700 border-blue-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
  };
  const cls =
    variants[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={`text-xs font-medium ${cls}`}>
      {getPaymentStatusName(status)}
    </Badge>
  );
}

export function OrdersTable({
  orders,
  isLoading,
  onViewDetails,
  onUpdateStatus,
}: OrdersTableProps) {
  return (
    <DataTableShell>
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-10 text-xs font-medium text-muted-foreground">
              Order
            </TableHead>
            <TableHead className="hidden h-10 text-xs font-medium text-muted-foreground md:table-cell">
              Date
            </TableHead>
            <TableHead className="h-10 text-xs font-medium text-muted-foreground">
              Customer
            </TableHead>
            <TableHead className="h-10 text-right text-xs font-medium text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="h-10 text-xs font-medium text-muted-foreground">
              Order Status
            </TableHead>
            <TableHead className="h-10 text-xs font-medium text-muted-foreground">
              Payment
            </TableHead>
            <TableHead className="hidden h-10 text-xs font-medium text-muted-foreground md:table-cell">
              Items
            </TableHead>
            <TableHead className="h-10 text-right text-xs font-medium text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                <div className="mt-2 text-sm text-muted-foreground">
                  Loading orders...
                </div>
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-12 text-sm text-muted-foreground"
              >
                No orders found. Try adjusting the filters.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="py-3 font-medium text-sm text-foreground">
                  {order.orderNumber}
                </TableCell>
                <TableCell className="hidden py-3 text-sm text-muted-foreground md:table-cell">
                  {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                </TableCell>
                <TableCell className="py-3">
                  <div className="font-medium text-sm text-foreground">
                    {order.customer || "Unknown User"}
                  </div>
                  <div className="text-xs text-muted-foreground hidden md:block mt-0.5">
                    {order.email || "—"}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-right font-semibold text-sm text-foreground">
                  {formatPrice(order.totalAmount)}
                </TableCell>
                <TableCell className="py-3">
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="py-3">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </TableCell>
                <TableCell className="hidden py-3 text-sm text-muted-foreground md:table-cell">
                  {order.totalItems}
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 text-xs text-foreground hover:bg-muted"
                      onClick={() => onViewDetails(order)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span className="hidden sm:inline">Details</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 text-xs text-foreground hover:bg-muted"
                      onClick={() => onUpdateStatus(order)}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      <span className="hidden sm:inline">Update</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </DataTableShell>
  );
}
