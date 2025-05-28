import { useQuery } from '@tanstack/react-query'
import { ProductForm } from '@/components/dashboard/product/product-form'
import { getCategories } from '@/server/categories.server'
import { getColors } from '@/server/colors.server'
import { getSizes } from '@/server/sizes.server'
import {} from '@tanstack/react-router'
import Loading from '@/components/loading'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  // parallel get required data
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

  const isLoading = isLoadingCategories || isLoadingColors || isLoadingSizes

  if (isLoading) {
    return <Loading />
  }

  return <ProductForm categories={categories} colors={colors} sizes={sizes} />
}
