import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  ProductGrid,
  type SimpleProduct,
} from "@/components/shop/product/product-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProductsProps {
  initialData?: Array<SimpleProduct>;
}

export function FeaturedProducts({ initialData }: FeaturedProductsProps = {}) {
  const products = initialData || [];
  const isLoading = !initialData;

  if (isLoading) {
    return <FeaturedProductsLoading />;
  }

  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Products
              </h2>
              <p className="text-muted-foreground max-w-3xl">
                Explore our carefully selected products
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="hidden md:flex items-center gap-1 self-start"
            >
              <Link to="/products" search={{ featured: true }}>
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={products || []} />
          <div className="flex justify-center md:hidden mt-4">
            <Button asChild variant="outline">
              <Link to="/products" search={{ featured: true }}>
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsLoading() {
  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-80" />
            </div>
            <div className="hidden md:flex">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center md:hidden mt-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}
