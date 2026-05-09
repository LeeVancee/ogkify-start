import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProductForm } from "@/components/dashboard/product/product-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { productToFormValues } from "@/lib/admin/form-utils";
import {
  adminProductFormDataQueryOptions,
  adminProductQueryOptions,
} from "@/lib/admin/query-options";
import { useI18n } from "@/lib/i18n";
import { saveAdminProduct } from "@/server/admin/products";

export const Route = createFileRoute("/dashboard/products/$id")({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(adminProductQueryOptions(params.id)),
      context.queryClient.ensureQueryData(adminProductFormDataQueryOptions()),
    ]);
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { data: product } = useSuspenseQuery(adminProductQueryOptions(id));
  const { data: formData } = useSuspenseQuery(
    adminProductFormDataQueryOptions(),
  );

  return (
    <ProductForm
      title={t("dashboard.forms.editProduct")}
      initialValues={productToFormValues(product)}
      categories={formData.categories}
      colors={formData.colors}
      sizes={formData.sizes}
      save={(values) => saveAdminProduct({ data: { id: product.id, values } })}
    />
  );
}
