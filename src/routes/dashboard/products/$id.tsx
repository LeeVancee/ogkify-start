import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProductForm } from "@/components/dashboard/product/product-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { productToFormValues } from "@/lib/admin/form-utils";
import {
  adminProductFormDataQueryOptions,
  adminProductQueryOptions,
} from "@/lib/admin/query-options";
import { saveAdminProduct } from "@/server/admin/products";

export const Route = createFileRoute("/dashboard/products/$id")({
  loader: ({ context, params }) => {
    void context.queryClient.prefetchQuery(adminProductQueryOptions(params.id));
    void context.queryClient.prefetchQuery(adminProductFormDataQueryOptions());
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const productQuery = useQuery(adminProductQueryOptions(id));
  const formDataQuery = useQuery(adminProductFormDataQueryOptions());

  if (productQuery.isPending || formDataQuery.isPending) {
    return <PagePendingSpinner />;
  }

  if (productQuery.isError || formDataQuery.isError) {
    throw productQuery.error ?? formDataQuery.error;
  }

  const product = productQuery.data;
  const formData = formDataQuery.data;

  return (
    <ProductForm
      title="Edit product"
      initialValues={productToFormValues(product)}
      categories={formData.categories}
      colors={formData.colors}
      sizes={formData.sizes}
      save={(values) => saveAdminProduct({ data: { id: product.id, values } })}
    />
  );
}
