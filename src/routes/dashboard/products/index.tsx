import { Plus } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ProductsView } from '@/components/dashboard/product/products-view'

export const Route = createFileRoute('/dashboard/products/')({
  component: RouteComponent,
})

function RouteComponent() {
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
      <ProductsView />
    </div>
  )
}
