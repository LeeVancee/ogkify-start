import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/utils";

// Simplified product type
export interface SimpleProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Array<string>;
  category?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  discount?: number;
  freeShipping?: boolean;
}

interface ProductGridProps {
  products: Array<SimpleProduct>;
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative flex flex-col bg-card rounded-xl border border-border/50 overflow-hidden hover:border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-white bg-red-500 rounded-md shadow-sm">
                -{product.discount}%
              </span>
            </div>
          )}

          {/* Free Shipping Badge */}
          {product.freeShipping && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-md">
                Free Shipping
              </span>
            </div>
          )}

          {/* Product Image */}
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="relative aspect-square overflow-hidden bg-muted/30"
          >
            <img
              src={product.images[0] || "/placeholder.svg?height=400&width=300"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </Link>

          {/* Product Info */}
          <div className="flex flex-col flex-1 p-4 space-y-2">
            {/* Category */}
            {product.category && (
              <Link
                to="/products"
                search={{ category: product.category }}
                className="inline-flex self-start px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50 hover:bg-muted rounded-md transition-colors"
              >
                {product.category}
              </Link>
            )}

            {/* Product Name */}
            <Link
              to="/product/$id"
              params={{ id: product.id }}
              className="block flex-1"
            >
              <h3 className="font-semibold text-base leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            {product.rating && product.reviews !== undefined && (
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="flex items-end justify-between pt-1.5 border-t border-border/50">
              <div className="flex items-baseline gap-2">
                {product.discount ? (
                  <>
                    <p className="text-xl font-bold text-foreground">
                      {formatPrice(
                        product.price * (1 - product.discount / 100),
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </p>
                  </>
                ) : (
                  <p className="text-xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              {product.inStock !== undefined && (
                <span
                  className={`text-xs font-medium ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
