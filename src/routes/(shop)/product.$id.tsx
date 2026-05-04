import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { ProductGrid } from "@/components/shop/product/product-grid";
import { ProductInfo } from "@/components/shop/product/product-info";
import { ProductInfoLoading } from "@/components/shop/product/product-info-loading";
import { ProductTabs } from "@/components/shop/product/product-tabs";
import { useI18n } from "@/lib/i18n";
import {
  shopProductQueryOptions,
  shopRelatedProductsQueryOptions,
} from "@/lib/shop/query-options";
import { handleAddToCartFormAction } from "@/server/cart";

export const Route = createFileRoute("/(shop)/product/$id")({
  pendingComponent: () => <ProductInfoLoading />,
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(
      shopProductQueryOptions(params.id),
    );

    await context.queryClient.ensureQueryData(
      shopRelatedProductsQueryOptions(product.id, product.categoryId),
    );
  },
});

function RouteComponent() {
  const { t } = useI18n();
  const { id } = Route.useParams();
  const { data: product } = useSuspenseQuery(shopProductQueryOptions(id));
  const { data: relatedProducts } = useSuspenseQuery(
    shopRelatedProductsQueryOptions(product.id, product.categoryId),
  );

  const addToCartAdapter = async (formData: FormData) => {
    const result = await handleAddToCartFormAction({ data: formData });
    return {
      success: result.success,
      error: result.error,
      message: result.message,
    };
  };

  return (
    <div className="shop-shell py-8 sm:py-12">
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ChevronLeft className="h-4 w-4" />{" "}
        {t("shop.productDetail.backToProducts")}
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductInfo product={product} addToCartAction={addToCartAdapter} />
      </div>

      <ProductTabs product={product} />

      {relatedProducts.length > 0 ? (
        <div className="mt-20 border-t border-slate-100 pt-16">
          <div className="mb-10">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {t("shop.productDetail.youMayAlsoLike")}
            </p>
            <h2 className="text-3xl font-light tracking-tight text-slate-900">
              {t("shop.productDetail.relatedProducts")}
            </h2>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      ) : null}
    </div>
  );
}
