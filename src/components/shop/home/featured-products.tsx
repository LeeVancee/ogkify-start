import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/shop/product/product-grid'

interface FeaturedProductsProps {
  initialProducts: Array<Product>
  title?: string
  description?: string
}

export function FeaturedProducts({
  initialProducts,
  title = 'Featured Products',
  description = 'Explore our carefully selected products',
}: FeaturedProductsProps) {
  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <p className="text-muted-foreground max-w-3xl">{description}</p>
            </div>
            <Button
              variant="outline"
              asChild
              className="hidden md:flex items-center gap-1 self-start"
            >
              <Link to="/categories" search={{ featured: true }}>
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={initialProducts} />
          <div className="flex justify-center md:hidden mt-4">
            <Button asChild variant="outline">
              <Link to="/categories" search={{ featured: true }}>
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
