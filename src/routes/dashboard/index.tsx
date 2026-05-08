import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardOverview } from "@/components/dashboard/overview/overview";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { dashboardOverviewQueryOptions } from "@/lib/admin/query-options";

export const Route = createFileRoute("/dashboard/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(dashboardOverviewQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(dashboardOverviewQueryOptions());
  return <DashboardOverview data={data} />;
}
