import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
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
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {products.map((product) => (
        <Link
          key={product.id}
          to="/product/$id"
          params={{ id: product.id }}
          className="group cursor-pointer"
        >
          <div className="relative mb-3 aspect-3/4 overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.isNew ? (
              <span className="absolute left-3 top-3 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                {t("shop.productFilters.newBadge")}
              </span>
            ) : null}
            {product.originalPrice ? (
              <span className="absolute right-3 top-3 rounded-lg bg-red-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                {t("shop.productFilters.saleBadge")}
              </span>
            ) : null}
          </div>

          <h3 className="truncate text-sm font-semibold text-slate-900">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-slate-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice ? (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            ) : null}
          </div>

          {typeof product.rating === "number" &&
          typeof product.reviewCount === "number" ? (
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <span>★ {product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
