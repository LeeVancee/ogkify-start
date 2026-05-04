import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardSettingsPage } from "@/components/dashboard/settings/settings-page";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminSessionQueryOptions } from "@/lib/admin/query-options";

export const Route = createFileRoute("/dashboard/settings/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminSessionQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSuspenseQuery(adminSessionQueryOptions());
  return <DashboardSettingsPage initialSession={session} />;
}
