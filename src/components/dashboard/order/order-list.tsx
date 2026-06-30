import { useQueryClient } from "@tanstack/react-query";
import {
  Filter,
  MoreHorizontal,
  RefreshCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminQueryKeys } from "@/lib/admin/query-options";
import type { AdminOrderListItem, OrderStatus } from "@/lib/admin/types";
import { useI18n } from "@/lib/i18n";
import { cn, formatPrice } from "@/lib/utils";

type StatusFilter = "ALL" | OrderStatus;

interface OrderListProps {
  orders: AdminOrderListItem[];
  updateStatus: (
    orderId: string,
    status: OrderStatus,
  ) => Promise<{ success: boolean; error?: string }>;
}

const statusTabs: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Canceled", value: "CANCELLED" },
];
const orderDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const orderStatusActions: OrderStatus[] = [
  "PENDING",
  "PAID",
  "COMPLETED",
  "CANCELLED",
];

export function OrderList({ orders, updateStatus }: OrderListProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filteredOrders = (() => {
    const normalized = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery =
        normalized.length === 0 ||
        order.orderNumber.toLowerCase().includes(normalized) ||
        order.customerName.toLowerCase().includes(normalized) ||
        order.customerEmail.toLowerCase().includes(normalized) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(normalized),
        );

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  })();

  async function handleStatus(orderId: string, status: OrderStatus) {
    const result = await updateStatus(orderId, status);
    if (result.success) {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
    } else {
      window.alert(result.error || t("dashboard.orders.statusUpdateFailed"));
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Card className="min-h-0 flex-1 border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <CardContent className="flex h-full min-h-0 flex-col p-0">
          <div className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("dashboard.nav.orders")}
              </h1>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {statusTabs.map((tab) => {
                  const active = statusFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setStatusFilter(tab.value)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-white text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" className="h-10 gap-2 bg-white">
                  <Filter className="size-4" />
                  Status
                </Button>
                <Button variant="outline" className="h-10 gap-2 bg-white">
                  <SlidersHorizontal className="size-4" />
                  Columns
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search orders, customers, or products..."
                  className="h-10 bg-white pl-9"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[inherit]">
            <Table className="min-w-[1080px]">
              <TableHeader className="bg-muted/35">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-5">#</TableHead>
                  <TableHead>
                    {t("dashboard.table.product") || "Product"}
                  </TableHead>
                  <TableHead>{t("dashboard.orders.amount")}</TableHead>
                  <TableHead>{t("dashboard.orders.customer")}</TableHead>
                  <TableHead>{t("dashboard.orders.created")}</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>{t("dashboard.orders.orderStatus")}</TableHead>
                  <TableHead>{t("dashboard.orders.payment")}</TableHead>
                  <TableHead className="w-[72px] text-right" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow className="bg-white hover:bg-white">
                    <TableCell
                      colSpan={9}
                      className="px-5 py-16 text-center text-sm text-muted-foreground"
                    >
                      {t("dashboard.orders.noOrders")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const primaryItem = order.items[0];
                    const extraItems = Math.max(order.itemCount - 1, 0);

                    return (
                      <TableRow
                        key={order.id}
                        className="bg-white hover:bg-muted/20"
                      >
                        <TableCell className="px-5 py-4 font-medium">
                          {order.orderNumber}
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-11 overflow-hidden rounded-xl border border-border/60 bg-muted/40">
                              {primaryItem?.imageUrl ? (
                                <img
                                  src={primaryItem.imageUrl}
                                  alt={primaryItem.productName}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
                                  {primaryItem?.productName
                                    ?.slice(0, 1)
                                    .toUpperCase() ?? "O"}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-medium">
                                {primaryItem?.productName ?? "Order item"}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {extraItems > 0
                                  ? `+${extraItems} more item${extraItems > 1 ? "s" : ""}`
                                  : `${order.itemCount} item`}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 font-medium">
                          {formatPrice(order.totalAmount)}
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarImage
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  order.customerName,
                                )}&background=f3f4f6&color=111827`}
                              />
                              <AvatarFallback>
                                {order.customerName.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate font-medium">
                                {order.customerName}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {order.customerEmail}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </TableCell>

                        <TableCell className="py-4">
                          <Badge variant="outline" className="bg-white">
                            {inferOrderType(order)}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4">
                          <StatusBadge status={order.status} />
                        </TableCell>

                        <TableCell className="py-4">
                          <PaymentBadge status={order.paymentStatus} />
                        </TableCell>

                        <TableCell className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="bg-transparent"
                                >
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end" className="w-44">
                              {orderStatusActions.flatMap((status) =>
                                status === order.status
                                  ? []
                                  : [
                                      <DropdownMenuItem
                                        key={status}
                                        onClick={() =>
                                          handleStatus(order.id, status)
                                        }
                                      >
                                        <RefreshCcw className="size-4" />
                                        Mark as {status.toLowerCase()}
                                      </DropdownMenuItem>,
                                    ],
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    PAID: "border-sky-200 bg-sky-50 text-sky-700",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        styles[status],
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}

function PaymentBadge({
  status,
}: {
  status: AdminOrderListItem["paymentStatus"];
}) {
  const styles = {
    PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
    UNPAID: "border-amber-200 bg-amber-50 text-amber-700",
    REFUNDED: "border-slate-200 bg-slate-50 text-slate-700",
    FAILED: "border-rose-200 bg-rose-50 text-rose-700",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        styles[status],
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}

function inferOrderType(order: AdminOrderListItem) {
  if (order.paymentStatus === "REFUNDED") return "Return";
  if (order.status === "CANCELLED") return "Canceled";
  return "Sale";
}

function formatDate(value: string) {
  return orderDateFormatter.format(new Date(value));
}
