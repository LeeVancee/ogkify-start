import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/dashboard/product/product-form";
import Loading from "@/components/loading";
import { getProductFormData } from "@/server/products.server";

export const Route = createFileRoute("/dashboard/products/new")({
  component: RouteComponent,
});

function RouteComponent() {
  // Use single query to fetch all product form data for optimal performance
  const { data, isLoading } = useQuery({
    queryKey: ["product-form-data"],
    queryFn: () => getProductFormData(),
  });

  if (isLoading) {
    return <Loading />;
  }

  const { categories = [], colors = [], sizes = [] } = data || {};

  return <ProductForm categories={categories} colors={colors} sizes={sizes} />;
}
