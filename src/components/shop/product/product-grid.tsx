import { Link } from '@tanstack/react-router'
import { formatPrice } from '@/lib/utils'

// 简化的产品类型
export interface SimpleProduct {
  id: string
  name: string
  description: string
  price: number
  images: Array<string>
  category?: string
  inStock?: boolean
  rating?: number
  reviews?: number
  discount?: number
  freeShipping?: boolean
}

interface ProductGridProps {
  products: Array<SimpleProduct>
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
            to="/product/$id"
            params={{ id: product.id }}
            className="block relative aspect-square overflow-hidden bg-muted"
          >
            <img
              src={product.images[0] || '/placeholder.svg?height=300&width=300'}
              alt={product.name}
              className="object-cover transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="p-4 space-y-2">
            <Link
              to="/product/$id"
              params={{ id: product.id }}
              className="block"
            >
              <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* 分类标签 */}
            {product.category && (
              <Link
                to="/products"
                search={{ category: product.category }}
                className="inline-block  py-1 text-xs font-medium rounded-full bg-base-200 hover:bg-base-300 transition-colors text-left"
              >
                {product.category}
              </Link>
            )}

            <div className="flex items-center justify-between">
              <p className="font-semibold">{formatPrice(product.price)}</p>
              {product.discount ? (
                <span className="text-xs font-medium text-green-600">
                  {product.discount}% Off
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
