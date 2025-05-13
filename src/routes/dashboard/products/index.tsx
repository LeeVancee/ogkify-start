import { Button } from '@/components/ui/button'
import { getProducts } from '@/server/products.server'
import { Plus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ProductsView } from '@/components/dashboard/product/products-view'
import Loading from '@/components/loading'
export const Route = createFileRoute({
  pendingComponent: Loading,
  component: RouteComponent,
  loader: async () => {
    const products = await getProducts()
    return { products }
  },
})

function RouteComponent() {
  const { products } = Route.useLoaderData()
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <Button asChild>
          <Link to="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      <ProductsView products={products} />
    </div>
  )
}
