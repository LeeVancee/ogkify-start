import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { UnifiedProductForm } from "@/components/dashboard/product/unified-product-form";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b bg-muted/30 px-6 py-3 md:px-8">
        <Link to="/dashboard/products">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
      <UnifiedProductForm
        mode="create"
        categories={categories}
        colors={colors}
        sizes={sizes}
      />
    </div>
  );
}
