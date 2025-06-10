import { createFileRoute } from '@tanstack/react-router'
import { ProductGrid } from '@/components/shop/product/product-grid'
import { ProductInfo } from '@/components/shop/product/product-info'
import { ProductInfoLoading } from '@/components/shop/product/product-info-loading'
import { ProductTabs } from '@/components/shop/product/product-tabs'

import { handleAddToCartFormAction } from '@/server/cart.server'
import { getProduct, getRelatedProducts } from '@/server/product-shop.server'

import {} from '@tanstack/react-router'

export const Route = createFileRoute('/_shop/product/$id')({
  pendingComponent: () => <ProductInfoLoading />,
  //  pendingMs: 0,
  component: RouteComponent,
  loader: async ({ params }: { params: { id: string } }) => {
    const product = await getProduct({ data: params.id })
    if (!product) {
      throw new Error('Product not found')
    }
    const relatedProducts = await getRelatedProducts({
      data: { productId: product.id, category: product.categoryId },
    })
    return { product, relatedProducts }
  },
  // Cache product details for 15 minutes since product info changes occasionally
  staleTime: 1000 * 60 * 15, // 15 minutes
  gcTime: 1000 * 60 * 60, // 1 hour (keep in memory)
})

function RouteComponent() {
  const { product, relatedProducts } = Route.useLoaderData()

  // adapter function to handle type mismatch
  const addToCartAdapter = async (formData: FormData) => {
    try {
      const result = await handleAddToCartFormAction({ data: formData })
      return {
        success: result.success,
        error: result.error,
        message: result.message,
      }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <ProductInfo product={product} addToCartAction={addToCartAdapter} />
      </div>
      <ProductTabs product={product} />

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
