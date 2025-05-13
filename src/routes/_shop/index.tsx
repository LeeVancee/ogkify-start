import Loading from '@/components/loading'
import { FeaturedCategories } from '@/components/shop/home/featured-categories'
import { FeaturedProducts } from '@/components/shop/home/featured-products'
import HeroSection from '@/components/shop/home/hero-section'
import { getFeaturedProducts } from '@/server/get-featured-products.server'

import { } from '@tanstack/react-router'

export const Route = createFileRoute({
  component: RouteComponent,
  pendingComponent: () => <Loading />,
  loader: async () => {
    const featuredProducts = await getFeaturedProducts({
      data: 4,
    })

    return {
      featuredProducts,
    }
  },
})

function RouteComponent() {
  const { featuredProducts } = Route.useLoaderData()
  return (
    <div className="">
      <HeroSection />
      <div className=" mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Products
        </h2>
        <FeaturedProducts initialProducts={featuredProducts} />
        <h2 className="text-3xl font-bold text-center mt-16 mb-8">
          Shop by Category
        </h2>
        <FeaturedCategories />
      </div>
    </div>
  )
}
