import { createFileRoute } from "@tanstack/react-router";

import { CategoryList } from "@/components/dashboard/category/category-list";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardPageHeader
        title={t("dashboard.nav.categories")}
        description={t("dashboard.pages.categoriesDescription")}
      />
      <CategoryList />
    </div>
  );
}
