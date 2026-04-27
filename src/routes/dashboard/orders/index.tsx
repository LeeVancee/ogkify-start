import { createFileRoute } from "@tanstack/react-router";

import { OrderManagement } from "@/components/dashboard/order/order-management";
import { SpinnerLoading } from "@/components/shared/flexible-loading";

export const Route = createFileRoute("/dashboard/orders/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  return <OrderManagement />;
}
