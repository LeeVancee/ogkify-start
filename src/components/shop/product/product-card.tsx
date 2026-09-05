import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ImageOff } from "lucide-react";

import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category?: string;
}
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block min-w-0"
    >
      <div className="product-photo relative mb-4 flex aspect-[4/5] items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImageOff className="size-8 text-muted-foreground" />
        )}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex size-8 items-center justify-center bg-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <p className="mb-2 text-[10px] tracking-[0.08em] text-muted-foreground">
        {product.category || "OGKIFY COLLECTION"}
      </p>
      <h3 className="line-clamp-2 min-h-10 text-[13px] font-medium leading-5 group-hover:text-muted-foreground">
        {product.name}
      </h3>
      <p className="mt-2 text-[13px] tabular-nums">
        {formatPrice(product.price)}
      </p>
    </Link>
  );
}
