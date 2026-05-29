import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { ProductList } from "@/components/dashboard/product/product-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminProductsQueryOptions } from "@/lib/admin/query-options";
import { useI18n } from "@/lib/i18n";
import { deleteAdminProduct } from "@/server/admin/products";

export const Route = createFileRoute("/dashboard/products/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminProductsQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useI18n();
  const { data: products } = useSuspenseQuery(adminProductsQueryOptions());

  return (
    <DashboardPageShell title={t("dashboard.nav.products")}>
      <ProductList
        products={products}
        deleteProduct={(id) => deleteAdminProduct({ data: id })}
      />
    </DashboardPageShell>
  );
}
