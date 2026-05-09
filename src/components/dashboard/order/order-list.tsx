import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";

import {
  AdminTable,
  AdminTableCell,
  AdminTableRow,
  StatusPill,
} from "@/components/dashboard/table/admin-table";
import { Button } from "@/components/ui/button";
import { adminQueryKeys } from "@/lib/admin/query-options";
import type { AdminOrderListItem, OrderStatus } from "@/lib/admin/types";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

interface OrderListProps {
  orders: AdminOrderListItem[];
  updateStatus: (
    orderId: string,
    status: OrderStatus,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function OrderList({ orders, updateStatus }: OrderListProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  async function handleStatus(orderId: string, status: OrderStatus) {
    const result = await updateStatus(orderId, status);
    if (result.success) {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
    } else {
      window.alert(result.error || t("dashboard.orders.statusUpdateFailed"));
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminTable
        columns={[
          t("dashboard.orders.order"),
          t("dashboard.orders.customer"),
          t("dashboard.orders.items"),
          t("dashboard.orders.amount"),
          t("dashboard.orders.orderStatus"),
          t("dashboard.orders.payment"),
          t("dashboard.orders.created"),
          t("dashboard.orders.update"),
        ]}
        empty={orders.length === 0}
        emptyMessage={t("dashboard.orders.noOrders")}
        minWidth="min-w-[1120px]"
      >
        {orders.map((order) => (
          <AdminTableRow key={order.id}>
            <AdminTableCell>
              <div className="font-medium">{order.orderNumber}</div>
            </AdminTableCell>
            <AdminTableCell>
              <div className="max-w-56">
                <div className="truncate font-medium">{order.customerName}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {order.customerEmail}
                </div>
              </div>
            </AdminTableCell>
            <AdminTableCell>{order.itemCount}</AdminTableCell>
            <AdminTableCell>{formatPrice(order.totalAmount)}</AdminTableCell>
            <AdminTableCell>
              <StatusPill tone={orderTone(order.status)}>
                {order.status}
              </StatusPill>
            </AdminTableCell>
            <AdminTableCell>
              <StatusPill
                tone={order.paymentStatus === "PAID" ? "success" : "neutral"}
              >
                {order.paymentStatus}
              </StatusPill>
            </AdminTableCell>
            <AdminTableCell>
              <span className="text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </AdminTableCell>
            <AdminTableCell>
              <div className="flex gap-2">
                {(
                  ["PENDING", "PAID", "COMPLETED", "CANCELLED"] as OrderStatus[]
                )
                  .filter((status) => status !== order.status)
                  .map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleStatus(order.id, status)}
                    >
                      <RefreshCcw className="size-3" />
                      {status}
                    </Button>
                  ))}
              </div>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
}

function orderTone(status: OrderStatus) {
  if (status === "COMPLETED") return "success";
  if (status === "CANCELLED") return "danger";
  if (status === "PAID") return "warning";
  return "neutral";
}
