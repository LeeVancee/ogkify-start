import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { ResourceList } from "@/components/dashboard/resource/resource-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminColorsQueryOptions } from "@/lib/admin/query-options";
import { deleteAdminColor } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/colors/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminColorsQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: colors } = useSuspenseQuery(adminColorsQueryOptions());

  return (
    <DashboardPageShell
      title="Colors"
      description="Maintain product color options and storefront swatches."
    >
      <ResourceList
        title="Colors"
        items={colors}
        newHref="/dashboard/colors/new"
        editHref="/dashboard/colors/$id"
        accent="color"
        onDelete={(id) => deleteAdminColor({ data: id })}
      />
    </DashboardPageShell>
  );
}
