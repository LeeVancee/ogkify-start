import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ProductForm } from '@/components/dashboard/product/product-form'
import { getProductFormData } from '@/server/products.server'
import { } from '@tanstack/react-router'
import Loading from '@/components/loading'

export const Route = createFileRoute('/dashboard/products/new')({
  component: RouteComponent,
})

function RouteComponent() {
  // Use single query to fetch all product form data for optimal performance
  const { data, isLoading } = useQuery({
    queryKey: ['product-form-data'],
    queryFn: () => getProductFormData(),
  })

  if (isLoading) {
    return <Loading />
  }

  const { categories = [], colors = [], sizes = [] } = data || {}

  return (
    <ProductForm 
      categories={categories} 
      colors={colors} 
      sizes={sizes} 
    />
  )
}
