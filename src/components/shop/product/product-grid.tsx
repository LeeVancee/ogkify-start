import { cn } from "@/lib/utils";

import ProductCard from "./product-card";
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
export function ProductGrid({
  products,
  className,
}: {
  products: Array<SimpleProduct>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{ ...product, image: product.images[0] ?? null }}
        />
      ))}
    </div>
  );
}
