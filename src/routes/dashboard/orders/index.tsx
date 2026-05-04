import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { OrderList } from "@/components/dashboard/order/order-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminOrdersQueryOptions } from "@/lib/admin/query-options";
import type { OrderStatus } from "@/lib/admin/types";
import { updateAdminOrderStatus } from "@/server/admin/orders";

export const Route = createFileRoute("/dashboard/orders/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminOrdersQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: orders } = useSuspenseQuery(adminOrdersQueryOptions());

  return (
    <DashboardPageShell
      title="Orders"
      description="Review orders, payments and fulfillment status."
    >
      <OrderList
        orders={orders}
        updateStatus={(orderId, status: OrderStatus) =>
          updateAdminOrderStatus({ data: { orderId, status } })
        }
      />
    </DashboardPageShell>
  );
}
