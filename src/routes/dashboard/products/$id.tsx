import { getCategories } from '@/server/categories.server'
import { getColors } from '@/server/colors.server'
import { getProduct } from '@/server/products.server'
import { getSizes } from '@/server/sizes.server'
import { createFileRoute } from '@tanstack/react-router'
import { EditProductForm } from '@/components/dashboard/product/edit-product-form'

export const Route = createFileRoute('/dashboard/products/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [product, categories, colors, sizes] = await Promise.all([
      getProduct({ data: params.id }),
      getCategories(),
      getColors(),
      getSizes(),
    ])
    return { product, categories, colors, sizes }
  },
})

function RouteComponent() {
  const { product, categories, colors, sizes } = Route.useLoaderData()

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
      </div>
      <div className="rounded-xl border p-6">
        <EditProductForm
          product={product as any}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  )
}
