import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ProductsView } from "@/components/dashboard/product/products-view";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/products/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardPageHeader
        title={t("dashboard.nav.products")}
        description={t("dashboard.pages.productsDescription")}
        action={
          <Link to="/dashboard/products/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />{" "}
            {t("dashboard.actions.addProduct")}
          </Link>
        }
      />
      <ProductsView />
    </div>
  );
}
