import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { ResourceList } from "@/components/dashboard/resource/resource-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminCategoriesQueryOptions } from "@/lib/admin/query-options";
import { useI18n } from "@/lib/i18n";
import { deleteAdminCategory } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/categories/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminCategoriesQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useI18n();
  const { data: categories } = useSuspenseQuery(adminCategoriesQueryOptions());

  return (
    <DashboardPageShell title={t("dashboard.nav.categories")} hideHeader>
      <ResourceList
        title={t("dashboard.nav.categories")}
        items={categories}
        newHref="/dashboard/categories/new"
        editHref="/dashboard/categories/$id"
        accent="image"
        showTitle
        onDelete={(id) => deleteAdminCategory({ data: id })}
      />
    </DashboardPageShell>
  );
}
