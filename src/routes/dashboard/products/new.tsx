import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProductForm } from "@/components/dashboard/product/product-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminProductFormDataQueryOptions } from "@/lib/admin/query-options";
import { saveAdminProduct } from "@/server/admin/products";

export const Route = createFileRoute("/dashboard/products/new")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(adminProductFormDataQueryOptions());
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const formDataQuery = useQuery(adminProductFormDataQueryOptions());

  if (formDataQuery.isPending) {
    return <PagePendingSpinner />;
  }

  if (formDataQuery.isError) {
    throw formDataQuery.error;
  }

  const data = formDataQuery.data;

  return (
    <ProductForm
      title="New product"
      categories={data.categories}
      colors={data.colors}
      sizes={data.sizes}
      save={(values) => saveAdminProduct({ data: { values } })}
    />
  );
}
