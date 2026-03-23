import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface ProductColor {
  id: string;
  name: string;
  value: string;
}

interface ProductSize {
  id: string;
  name: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  colors: Array<ProductColor>;
  sizes: Array<ProductSize>;
  images: Array<string>;
}

interface ProductInfoProps {
  product: Product;
  addToCartAction: (
    formData: FormData,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function ProductInfo({ product, addToCartAction }: ProductInfoProps) {
  if (product.images.length === 0) {
    throw new Error(`Product images are missing for product ${product.id}`);
  }

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0] ? product.colors[0].id : "",
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0] ? product.sizes[0].id : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToCart = async () => {
    const formData = new FormData();
    formData.append("productId", product.id);
    formData.append("quantity", quantity.toString());

    if (selectedColor) {
      formData.append("colorId", selectedColor);
    }

    if (selectedSize) {
      formData.append("sizeId", selectedSize);
    }

    setIsSubmitting(true);

    try {
      const result = await addToCartAction(formData);

      if (!result.success) {
        throw new Error(result.error ? result.error : "Failed to add to cart");
      }

      toast.success(result.message ? result.message : "Added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add to cart");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted/40">
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {product.images.length > 1 ? (
          <div className="flex gap-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                className={
                  activeImage === index
                    ? "h-20 w-20 overflow-hidden rounded-lg border-2 border-foreground"
                    : "h-20 w-20 overflow-hidden rounded-lg border-2 border-transparent"
                }
              >
                <img src={image} alt={product.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <span className="mb-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {product.category}
        </span>
        <h1 className="text-2xl font-light leading-tight tracking-tight text-foreground sm:text-3xl">
          {product.name}
        </h1>
        <div className="mt-3 text-xl font-medium text-foreground sm:text-2xl">
          {formatPrice(product.price)}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        {product.colors.length > 0 ? (
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-medium text-foreground">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className={
                    selectedColor === color.id
                      ? "rounded-full border border-foreground bg-foreground px-4 py-2 text-sm text-background"
                      : "rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-foreground/50"
                  }
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {product.sizes.length > 0 ? (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-foreground">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  className={
                    selectedSize === size.id
                      ? "h-10 w-12 rounded-lg border border-foreground bg-foreground text-sm text-background"
                      : "h-10 w-12 rounded-lg border border-border text-sm text-foreground transition-colors hover:border-foreground/50"
                  }
                >
                  {size.value}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="p-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="p-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSubmitting}
            className="shop-pill-button flex-1 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}
