import { Link } from "@tanstack/react-router";

import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  if (!product.image) {
    throw new Error(`Product image is missing for product ${product.id}`);
  }

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-md bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mb-1 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {product.category}
      </p>
      <h3 className="truncate text-sm font-medium text-foreground">
        {product.name}
      </h3>
      <div className="mt-1 text-sm text-foreground tabular-nums">
        {formatPrice(product.price)}
      </div>
    </Link>
  );
}
