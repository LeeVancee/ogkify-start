import { ProductFilters } from '@/components/shop/product/product-filters'
import { getCategories } from '@/server/categories.server'
import { getColors } from '@/server/colors.server'
import { getSizes } from '@/server/sizes.server'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_shop/categories')({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories()
    const allColors = await getColors()
    const allSizes = await getSizes()
    return {
      categories,
      allColors,
      allSizes,
    }
  },
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
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
