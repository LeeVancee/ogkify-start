import ProductCard from '@/components/shop/product/product-card'
import { searchProducts } from '@/server/search.server'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_shop/search')({
  component: RouteComponent,
  loader: async ({ search }: any) => {
    const query = search.q || ''
    const products = await searchProducts(query)
    return { products, query }
  },
})

function RouteComponent() {
  const { products, query } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">search: {query}</h1>
        <p className="text-muted-foreground">found {products.length} results</p>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="text-xl font-semibold">no products found</h2>
          <p className="text-muted-foreground mt-2">
            please try other keywords
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
