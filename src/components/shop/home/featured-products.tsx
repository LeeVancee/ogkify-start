import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  ProductGrid,
  type SimpleProduct,
} from "@/components/shop/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProductsProps {
  initialData: Array<SimpleProduct>;
}

export function FeaturedProducts({ initialData }: FeaturedProductsProps) {
  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            {/* <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Products
              </h2>
              <p className="text-muted-foreground max-w-3xl">
                Explore our carefully selected products
              </p>
            </div> */}
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                  Featured Products
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Handpicked items from our collection
                </p>
              </div>
            </div>
            {/*  <Link
              to="/products"
              search={{ featured: true }}
              className="hidden md:inline-flex items-center gap-1 self-start h-10 px-6 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors shadow-sm"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link> */}
          </div>
          <ProductGrid products={initialData} />
          <div className="flex justify-center  mt-4">
            <Link
              to="/products"
              search={{ featured: true }}
              className="inline-flex items-center justify-center gap-2 h-10 px-6 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors shadow-sm"
            >
              View All Products
            </Link>
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
