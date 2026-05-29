import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { ResourceList } from "@/components/dashboard/resource/resource-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminSizesQueryOptions } from "@/lib/admin/query-options";
import { useI18n } from "@/lib/i18n";
import { deleteAdminSize } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/sizes/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminSizesQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useI18n();
  const { data: sizes } = useSuspenseQuery(adminSizesQueryOptions());

  return (
    <DashboardPageShell title={t("dashboard.nav.sizes")} hideHeader>
      <ResourceList
        title={t("dashboard.nav.sizes")}
        items={sizes}
        newHref="/dashboard/sizes/new"
        editHref="/dashboard/sizes/$id"
        showTitle
        onDelete={(id) => deleteAdminSize({ data: id })}
      />
    </DashboardPageShell>
  );
}
