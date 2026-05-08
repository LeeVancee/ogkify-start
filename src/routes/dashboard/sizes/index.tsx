import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { ResourceList } from "@/components/dashboard/resource/resource-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminSizesQueryOptions } from "@/lib/admin/query-options";
import { deleteAdminSize } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/sizes/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminSizesQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: sizes } = useSuspenseQuery(adminSizesQueryOptions());

  return (
    <DashboardPageShell
      title="Sizes"
      description="Manage size labels and purchasable product options."
    >
      <ResourceList
        title="Sizes"
        items={sizes}
        newHref="/dashboard/sizes/new"
        editHref="/dashboard/sizes/$id"
        onDelete={(id) => deleteAdminSize({ data: id })}
      />
    </DashboardPageShell>
  );
}
