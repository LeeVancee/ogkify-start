import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { ResourceList } from "@/components/dashboard/resource/resource-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminColorsQueryOptions } from "@/lib/admin/query-options";
import { useI18n } from "@/lib/i18n";
import { deleteAdminColor } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/colors/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminColorsQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useI18n();
  const { data: colors } = useSuspenseQuery(adminColorsQueryOptions());

  return (
    <DashboardPageShell
      title={t("dashboard.nav.colors")}
      description={t("dashboard.pages.colorsDescription")}
    >
      <ResourceList
        title={t("dashboard.nav.colors")}
        items={colors}
        newHref="/dashboard/colors/new"
        editHref="/dashboard/colors/$id"
        accent="color"
        onDelete={(id) => deleteAdminColor({ data: id })}
      />
    </DashboardPageShell>
  );
}
