import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { ProductList } from "@/components/dashboard/product/product-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminProductsQueryOptions } from "@/lib/admin/query-options";
import { deleteAdminProduct } from "@/server/admin/products";

export const Route = createFileRoute("/dashboard/products/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(adminProductsQueryOptions());
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const productsQuery = useQuery(adminProductsQueryOptions());

  if (productsQuery.isPending) {
    return <PagePendingSpinner />;
  }

  if (productsQuery.isError) {
    throw productsQuery.error;
  }

  const products = productsQuery.data;

  return (
    <DashboardPageShell
      title="Products"
      description="Manage catalog items, visual inventory and product availability."
    >
      <ProductList
        products={products}
        deleteProduct={(id) => deleteAdminProduct({ data: id })}
      />
    </DashboardPageShell>
  );
}
