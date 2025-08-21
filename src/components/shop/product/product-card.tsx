import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div
      key={product.id}
      className="group border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block relative aspect-square overflow-hidden bg-muted"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </Link>
      <div className="p-4 bg-muted">
        <Link to="/product/$id" params={{ id: product.id }} className="block">
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
  );
}
