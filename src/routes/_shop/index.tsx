import Loading from '@/components/loading'
import { FeaturedCategories } from '@/components/shop/home/featured-categories'
import { FeaturedProducts } from '@/components/shop/home/featured-products'
import HeroSection from '@/components/shop/home/hero-section'
import { getCategories } from '@/server/categories.server'
import { getFeaturedProducts } from '@/server/get-featured-products.server'

export const Route = createFileRoute({
  component: RouteComponent,
  pendingComponent: () => <Loading />,
  loader: async () => {
    const featuredProducts = await getFeaturedProducts({
      data: 4,
    })
    const categories = await getCategories()

    return {
      featuredProducts,
      categories,
    }
  },
})

function RouteComponent() {
  const { featuredProducts, categories } = Route.useLoaderData()
  return (
    <div className="">
      <HeroSection />
      <div className="mx-auto px-4 py-12">
        <FeaturedProducts initialProducts={featuredProducts} />
        <FeaturedCategories categories={categories} />
      </div>
    </div>
  )
}
