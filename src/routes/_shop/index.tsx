import { createFileRoute } from '@tanstack/react-router'
import { FeaturedCategories } from '@/components/shop/home/featured-categories'
import { FeaturedProducts } from '@/components/shop/home/featured-products'
import HeroSection from '@/components/shop/home/hero-section'

export const Route = createFileRoute('/_shop/')({
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
