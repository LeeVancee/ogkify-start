import { ProductCard } from "./product-card";
import type { Product } from "./product-types";

interface ProductGridViewProps {
  products: Array<Product>;
  onDelete: (id: string) => void;
}

export function ProductGridView({ products, onDelete }: ProductGridViewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            colors: product.colors,
            sizes: product.sizes,
            images: product.images.map((img) => img.url),
          }}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
