import { Outlet } from '@tanstack/react-router'
import { ProductFilters } from '@/components/shop/product/product-filters'
import { getCategories } from '@/server/categories.server'
import { getColors } from '@/server/colors.server'
import { getSizes } from '@/server/sizes.server'
import { ProductSort } from '@/components/shop/product/product-sort'
// Loading component for the entire products page

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories()
    const allColors = await getColors()
    const allSizes = await getSizes()
    return { categories, allColors, allSizes }
  },
  // Cache filter data for 1 hour since categories, colors, and sizes rarely change
  staleTime: 1000 * 60 * 60, // 1 hour
  gcTime: 1000 * 60 * 60 * 24, // 24 hours (keep in memory)
  pendingComponent: ProductsPageLoading,
})

function RouteComponent() {
  const { categories, allColors, allSizes } = Route.useLoaderData()
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 min-h-[800px] gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-8 h-fit">
          <ProductFilters
            categories={categories}
            colors={allColors}
            sizes={allSizes}
            maxPrice={5000}
          />
        </aside>
        <main className="flex h-full flex-col gap-6">
        <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
        <div className="flex items-center gap-4">
          <ProductSort />
        </div>
      </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function ProductsPageLoading() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 min-h-[800px] gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar skeleton */}
        <aside className="sticky top-8 h-fit">
          <div className="grid gap-6">
            {/* Categories skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-20 bg-muted animate-pulse rounded" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Featured skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              </div>
            </div>

            {/* Price range skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              <div className="space-y-4">
                <div className="h-2 w-full bg-muted animate-pulse rounded" />
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>

            {/* Reset button skeleton */}
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="flex h-full flex-col gap-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="flex items-center gap-4">
              <div className="h-5 w-24 bg-muted animate-pulse rounded" />
              <div className="h-9 w-[180px] bg-muted animate-pulse rounded" />
            </div>
          </div>

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
        </main>
      </div>
    </div>
  )
}
