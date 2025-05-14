// src/routes/categories.tsx

import { z } from 'zod'

import { Suspense } from 'react'
import { ProductGrid } from '@/components/shop/product/product-grid'
import { ProductPagination } from '@/components/shop/product/product-pagination'
import { ProductSort } from '@/components/shop/product/product-sort'
import { ProductsLoading } from '@/components/shop/product/products-loading'
import { getFilteredProducts } from '@/server/get-filtered-products.server'
import { getCategories } from '@/server/categories.server'
import { getColors } from '@/server/colors.server'
import { getSizes } from '@/server/sizes.server'
import { ProductFilters } from '@/components/shop/product/product-filters'

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
})

// 定义搜索参数类型
type SearchParams = z.infer<typeof searchParamsSchema>

export const Route = createFileRoute({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }: { search: SearchParams }) => ({
    category: search.category,
    sort: search.sort,
    search: search.search,
    featured: search.featured,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    color: search.color,
    size: search.size,
    page: search.page || '1',
  }),
  loader: async ({ deps }: { deps: any }) => {
    // Parse search parameters
    const category = deps.category
    const sort = deps.sort
    const searchQuery = deps.search
    const featured = deps.featured || false

    // Price range
    const minPrice = deps.minPrice ? parseFloat(deps.minPrice) : undefined
    const maxPrice = deps.maxPrice ? parseFloat(deps.maxPrice) : undefined

    // Colors and sizes
    const colors = Array.isArray(deps.color)
      ? deps.color
      : deps.color
        ? [deps.color]
        : []

    const sizes = Array.isArray(deps.size)
      ? deps.size
      : deps.size
        ? [deps.size]
        : []

    // Pagination
    const page = parseInt(deps.page)

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
    })
    const categories = await getCategories()
    const allColors = await getColors()
    const allSizes = await getSizes()

    return {
      products,
      total,
      currentPage: page,
      categories,
      allColors,
      allSizes,
    }
  },
  component: CategoriesPage,
  pendingComponent: () => <ProductsLoading />,
})

function CategoriesPage() {
  const { products, total, currentPage, categories, allColors, allSizes } =
    Route.useLoaderData()

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
              <p className="text-sm text-muted-foreground">
                Total {total} products
              </p>
              <Suspense
                fallback={
                  <div className="w-[180px] h-9 animate-pulse bg-muted rounded-md" />
                }
              >
                <ProductSort />
              </Suspense>
            </div>
          </div>
          <Suspense fallback={<ProductsLoading />}>
            {products.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <h3 className="text-lg font-semibold">No Products Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No products matching your current filter criteria were found.
                  Please try adjusting your filters.
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
          </Suspense>
        </main>
      </div>
    </div>
  )
}
