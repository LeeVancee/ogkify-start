import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardSettingsPage } from "@/components/dashboard/settings/settings-page";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminSessionQueryOptions } from "@/lib/admin/query-options";

export const Route = createFileRoute("/dashboard/settings/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(adminSessionQueryOptions());
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const sessionQuery = useQuery(adminSessionQueryOptions());

  if (sessionQuery.isPending) {
    return <PagePendingSpinner />;
  }

  if (sessionQuery.isError) {
    throw sessionQuery.error;
  }

  const session = sessionQuery.data;
  return <DashboardSettingsPage initialSession={session} />;
}
