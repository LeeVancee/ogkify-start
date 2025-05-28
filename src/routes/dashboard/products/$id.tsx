import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/server/categories.server'
import { getColors } from '@/server/colors.server'
import { getProduct } from '@/server/products.server'
import { getSizes } from '@/server/sizes.server'
import { } from '@tanstack/react-router'
import { EditProductForm } from '@/components/dashboard/product/edit-product-form'
import Loading from '@/components/loading'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  // parallel get required data
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct({ data: id }),
  })

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const { data: colors = [], isLoading: isLoadingColors } = useQuery({
    queryKey: ['colors'],
    queryFn: () => getColors(),
  })

  const { data: sizes = [], isLoading: isLoadingSizes } = useQuery({
    queryKey: ['sizes'],
    queryFn: () => getSizes(),
  })

  const isLoading = isLoadingProduct || isLoadingCategories || isLoadingColors || isLoadingSizes

  if (isLoading) {
    return <Loading />
  }

  if (!product) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Product not found</h3>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
      </div>
      <div className="rounded-xl border p-6">
        <EditProductForm
          product={{
            ...product,
            price: product.price.toString(),
            colorIds: product.colors.map(c => c.id),
            sizeIds: product.sizes.map(s => s.id),
            images: product.images,
          }}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  )
}
