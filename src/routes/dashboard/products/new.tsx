import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProductForm } from "@/components/dashboard/product/product-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminProductFormDataQueryOptions } from "@/lib/admin/query-options";
import { saveAdminProduct } from "@/server/admin/products";

export const Route = createFileRoute("/dashboard/products/new")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminProductFormDataQueryOptions()),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(adminProductFormDataQueryOptions());

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
