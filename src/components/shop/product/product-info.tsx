import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

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

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(result.message ? result.message : "Added to cart");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {product.images.length > 1 ? (
          <div className="flex gap-2.5">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                className={
                  activeImage === index
                    ? "h-20 w-20 overflow-hidden rounded-xl border-2 border-slate-900 cursor-pointer"
                    : "h-20 w-20 overflow-hidden rounded-xl border-2 border-transparent opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                }
              >
                <img
                  src={image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {product.category}
        </span>
        <h1 className="text-2xl font-light leading-tight tracking-tight text-slate-900 sm:text-3xl">
          {product.name}
        </h1>
        <div className="mt-3 text-2xl font-semibold text-slate-900">
          {formatPrice(product.price)}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          {product.description}
        </p>

        {product.colors.length > 0 ? (
          <div className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className={
                    selectedColor === color.id
                      ? "rounded-lg border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white cursor-pointer"
                      : "rounded-lg border-2 border-slate-200 px-4 py-2 text-sm text-slate-700 transition-colors hover:border-slate-400 cursor-pointer"
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
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  className={
                    selectedSize === size.id
                      ? "h-10 min-w-12 rounded-lg border-2 border-slate-900 bg-slate-900 px-3 text-sm font-medium text-white cursor-pointer"
                      : "h-10 min-w-12 rounded-lg border-2 border-slate-200 px-3 text-sm text-slate-700 transition-colors hover:border-slate-400 cursor-pointer"
                  }
                >
                  {size.value}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-900 cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-900 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}
