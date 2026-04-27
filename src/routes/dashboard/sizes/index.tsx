import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SizeList } from "@/components/dashboard/size/size-list";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/sizes/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardPageHeader
        title={t("dashboard.nav.sizes")}
        description={t("dashboard.pages.sizesDescription")}
      />
      <SizeList />
    </div>
  );
}
