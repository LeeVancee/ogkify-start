import { Link } from "@tanstack/react-router";

import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
  if (!product.image) {
    throw new Error(`Product image is missing for product ${product.id}`);
  }

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group cursor-pointer"
    >
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="truncate text-sm font-semibold text-slate-900">
        {product.name}
      </h3>
      <div className="mt-1 text-sm text-slate-500">
        {formatPrice(product.price)}
      </div>
    </Link>
  );
}
