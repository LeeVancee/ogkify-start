import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ProductGrid } from "@/components/shop/product/product-grid";
import { ProductInfo } from "@/components/shop/product/product-info";
import { ProductInfoLoading } from "@/components/shop/product/product-info-loading";
import { ProductTabs } from "@/components/shop/product/product-tabs";
import { handleAddToCartFormAction } from "@/server/cart";
import { getProduct, getRelatedProducts } from "@/server/product-shop";

export const Route = createFileRoute("/(shop)/product/$id")({
  pendingComponent: () => <ProductInfoLoading />,
  component: RouteComponent,
  loader: async ({ params }: { params: { id: string } }) => {
    const product = await getProduct({ data: params.id });
    if (!product) {
      throw new Error("Product not found");
    }

    const relatedProducts = await getRelatedProducts({
      data: { productId: product.id, category: product.categoryId },
    });

    return { product, relatedProducts };
  },
  staleTime: 1000 * 60 * 15,
  gcTime: 1000 * 60 * 60,
});

function RouteComponent() {
  const { product, relatedProducts } = Route.useLoaderData();

  const addToCartAdapter = async (formData: FormData) => {
    const result = await handleAddToCartFormAction({ data: formData });
    return {
      success: result.success,
      error: result.error,
      message: result.message,
    };
  };

  return (
    <div className="shop-shell py-6 sm:py-10">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <ProductInfo product={product} addToCartAction={addToCartAdapter} />
      </div>

      <ProductTabs product={product} />

      {relatedProducts.length > 0 ? (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-light tracking-tight text-foreground">
            Related Products
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      ) : null}
    </div>
  );
}
