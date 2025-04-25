import { Link } from '@tanstack/react-router'
import { formatPrice } from '@/lib/utils'

// 简化的产品类型
export interface SimpleProduct {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category?: string
  inStock?: boolean
  rating?: number
  reviews?: number
  discount?: number
  freeShipping?: boolean
}

interface ProductGridProps {
  products: SimpleProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group border rounded-lg overflow-hidden bg-muted hover:shadow-md transition-shadow"
        >
          <Link
            to="/products/$id"
            params={{ id: product.id }}
            className="block relative aspect-square overflow-hidden bg-muted"
          >
            <img
              src={product.images[0] || '/placeholder.svg?height=300&width=300'}
              alt={product.name}
              className="object-cover transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="p-4">
            <Link
              to="/products/$id"
              params={{ id: product.id }}
              className="block"
            >
              <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{formatPrice(product.price)}</p>
                {product.discount ? (
                  <span className="text-xs font-medium text-green-600">
                    {product.discount}% Off
                  </span>
                ) : null}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
