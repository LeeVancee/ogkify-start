import { ProductForm } from '@/components/dashboard/product/product-form'
import { getCategories } from '@/server/categories.server'
import { getColors } from '@/server/colors.server'
import { getSizes } from '@/server/sizes.server'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/products/new')({
  component: RouteComponent,
  loader: async () => {
    const [categories, colors, sizes] = await Promise.all([
      getCategories(),
      getColors(),
      getSizes(),
    ])
    return { categories, colors, sizes }
  },
})

function RouteComponent() {
  const { categories, colors, sizes } = Route.useLoaderData()
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
      </div>
      <div className="rounded-xl border p-6">
        <ProductForm categories={categories} colors={colors} sizes={sizes} />
      </div>
    </div>
  )
}
