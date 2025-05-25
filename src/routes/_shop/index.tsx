import { FeaturedCategories } from '@/components/shop/home/featured-categories'
import { FeaturedProducts } from '@/components/shop/home/featured-products'
import HeroSection from '@/components/shop/home/hero-section'

import {} from '@tanstack/react-router'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <HeroSection />
      <div className="mx-auto px-4 py-12">
        <FeaturedProducts />
        <FeaturedCategories />
      </div>
    </div>
  )
}
