import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardOverview } from "@/components/dashboard/overview/overview";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { dashboardOverviewQueryOptions } from "@/lib/admin/query-options";

export const Route = createFileRoute("/dashboard/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(dashboardOverviewQueryOptions());
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const overviewQuery = useQuery(dashboardOverviewQueryOptions());

  if (overviewQuery.isPending) {
    return <PagePendingSpinner />;
  }

  if (overviewQuery.isError) {
    throw overviewQuery.error;
  }

  const data = overviewQuery.data;
  return <DashboardOverview data={data} />;
}
