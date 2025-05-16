import { z } from 'zod'
import ProductCard from '@/components/shop/product/product-card'
import { searchProducts } from '@/server/search.server'

const searchParamsSchema = z.object({
  q: z.string().optional(),
})

export const Route = createFileRoute({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    q: search.q,
  }),
  component: RouteComponent,
  loader: async ({ deps }) => {
    const query = deps.q || ''
    const products = await searchProducts({ data: query })
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
