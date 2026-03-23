import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/utils";

export interface SimpleProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Array<string>;
  category?: string;
  isNew?: boolean;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
}

interface ProductGridProps {
  products: Array<SimpleProduct>;
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <Link key={product.id} to="/product/$id" params={{ id: product.id }} className="group">
          <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-muted/40">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.isNew ? (
              <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-background">
                New
              </span>
            ) : null}
            {product.originalPrice ? (
              <span className="absolute right-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-destructive-foreground">
                Sale
              </span>
            ) : null}
          </div>

          <h3 className="truncate text-sm font-medium text-foreground">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            ) : null}
          </div>

          {typeof product.rating === "number" && typeof product.reviewCount === "number" ? (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <span>★ {product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
