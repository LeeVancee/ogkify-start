import { createFileRoute } from "@tanstack/react-router";
// src/routes/categories.tsx
import { z } from "zod";
import { normalizeArray } from "@/components/shop/product/filter-types";
import { ProductGrid } from "@/components/shop/product/product-grid";
import { ProductPagination } from "@/components/shop/product/product-pagination";
import { getFilteredProducts } from "@/server/get-filtered-products";

// Define search params schema
const searchParamsSchema = z.object({
  category: z.string().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  color: z.union([z.string(), z.array(z.string())]).optional(),
  size: z.union([z.string(), z.array(z.string())]).optional(),
  page: z.string().optional(),
});

export const Route = createFileRoute("/(shop)/products/")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    category: search.category,
    sort: search.sort,
    search: search.search,
    featured: search.featured,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    color: search.color,
    size: search.size,
    page: search.page,
  }),
  loader: async ({ deps }) => {
    // Parse search parameters
    const category = deps.category;
    const sort = deps.sort;
    const searchQuery = deps.search;
    const featured = deps.featured || false;

    // Price range
    const minPrice = deps.minPrice ? parseFloat(deps.minPrice) : undefined;
    const maxPrice = deps.maxPrice ? parseFloat(deps.maxPrice) : undefined;

    // Colors and sizes
    const colors = normalizeArray(deps.color);
    const sizes = normalizeArray(deps.size);

    // Pagination
    const page = parseInt(deps.page || "1");

    // Fetch filtered products
    const { products, total } = await getFilteredProducts({
      data: {
        category,
        sort,
        search: searchQuery,
        featured,
        minPrice,
        maxPrice,
        colors,
        sizes,
        page,
        limit: 12,
      },
    });

    return {
      products,
      total,
      currentPage: page,
    };
  },
  // Cache products data for 10 minutes since product data changes occasionally
  staleTime: 1000 * 60 * 10, // 10 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes (keep in memory)
  component: CategoriesPage,
  pendingComponent: ProductsContentLoading,
});

function CategoriesPage() {
  const { products, total, currentPage } = Route.useLoaderData();

  return (
    <div>
      {products.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <h3 className="text-lg font-semibold">No Products Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No products matching your current filter criteria were found. Please
            try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          <ProductPagination
            currentPage={currentPage}
            totalPages={Math.ceil(total / 12)}
          />
        </>
      )}
    </div>
  );
}

// Loading component for products content
function ProductsContentLoading() {
  return (
    <div>
      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-lg border bg-background"
          >
            {/* Image skeleton */}
            <div className="aspect-square bg-muted animate-pulse" />

            {/* Content skeleton */}
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              <div className="h-6 w-1/3 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-center space-x-2">
        <div className="h-10 w-20 bg-muted animate-pulse rounded" />
        <div className="h-10 w-10 bg-muted animate-pulse rounded" />
        <div className="h-10 w-10 bg-muted animate-pulse rounded" />
        <div className="h-10 w-10 bg-muted animate-pulse rounded" />
        <div className="h-10 w-20 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
