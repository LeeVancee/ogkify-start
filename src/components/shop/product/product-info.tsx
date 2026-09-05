import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { SetStateAction } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useSessionQuery } from "@/lib/auth-hooks";
import { useI18n } from "@/lib/i18n";
import { shopQueryKeys } from "@/lib/shop/query-options";
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
  const { t, locale } = useI18n();
  const { session } = useSessionQuery();
  const navigate = useNavigate();

  if (product.images.length === 0) {
    throw new Error(`Product images are missing for product ${product.id}`);
  }

  const [state, setState] = useState({
    activeImage: 0,
    quantity: 1,
    selectedColor: product.colors[0]?.id ?? "",
    selectedSize: product.sizes[0]?.id ?? "",
    isSubmitting: false,
  });
  const { activeImage, quantity, selectedColor, selectedSize, isSubmitting } =
    state;
  const setField = <K extends keyof typeof state>(
    key: K,
    value: SetStateAction<(typeof state)[K]>,
  ) =>
    setState((current) => ({
      ...current,
      [key]: typeof value === "function" ? value(current[key]) : value,
    }));
  const setActiveImage = (value: SetStateAction<number>) =>
    setField("activeImage", value);
  const setQuantity = (value: SetStateAction<number>) =>
    setField("quantity", value);
  const setSelectedColor = (value: SetStateAction<string>) =>
    setField("selectedColor", value);
  const setSelectedSize = (value: SetStateAction<string>) =>
    setField("selectedSize", value);
  const setIsSubmitting = (value: SetStateAction<boolean>) =>
    setField("isSubmitting", value);
  const queryClient = useQueryClient();

  const handleAddToCart = async () => {
    if (!session) {
      await navigate({
        to: "/login",
        search: { redirect: `/product/${product.id}` },
      });
      return;
    }
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

    const result = await addToCartAction(formData).catch((error: unknown) => ({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : t("shop.productDetail.addToCartFailed"),
      message: undefined,
    }));

    if (result.success) {
      queryClient.invalidateQueries({ queryKey: shopQueryKeys.cart() });
      toast.success(t("shop.productDetail.addedToCart"));
    } else {
      toast.error(result.error || t("shop.productDetail.addToCartFailed"));
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="space-y-3">
        <div className="product-photo aspect-[4/5] overflow-hidden">
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {product.images.length > 1 ? (
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={image}
                aria-label={`${product.name} — ${index + 1}`}
                aria-pressed={activeImage === index}
                type="button"
                onClick={() => setActiveImage(index)}
                className={
                  activeImage === index
                    ? "h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-slate-900 cursor-pointer"
                    : "h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-transparent opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
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

      <div className="flex flex-col self-start lg:sticky lg:top-28 lg:py-6">
        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {product.category}
        </span>
        <h1 className="text-3xl font-medium leading-snug tracking-tight text-slate-900 sm:text-4xl">
          {product.name}
        </h1>
        <div className="mt-5 border-b border-border pb-7 text-xl font-medium text-slate-900">
          {formatPrice(product.price)}
        </div>
        <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-slate-500">
          {product.description}
        </p>

        <a
          href="#product-details"
          className="mt-3 w-fit text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("shop.productDetail.details")}
        </a>

        {product.colors.length > 0 ? (
          <div className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t("shop.productDetail.color")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  aria-pressed={selectedColor === color.id}
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
              {t("shop.productDetail.size")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  aria-pressed={selectedSize === size.id}
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
              aria-label={t("shop.cart.decreaseLabel", { name: product.name })}
              disabled={quantity <= 1 || isSubmitting}
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
              aria-label={t("shop.cart.increaseLabel", { name: product.name })}
              disabled={quantity >= 99 || isSubmitting}
              onClick={() => setQuantity((value) => Math.min(99, value + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-900 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isSubmitting}
            className="h-12 flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting
              ? t("shop.productDetail.adding")
              : !session
                ? locale === "en"
                  ? "Sign in to add to bag"
                  : locale === "zh-CN"
                    ? "登录后加入购物袋"
                    : "登入後加入購物袋"
                : t("shop.productDetail.addToCart")}
          </Button>
        </div>
        <p className="mt-6 border-t border-border pt-5 text-xs leading-6 text-muted-foreground">
          {t("shop.productDetail.optionsNote")}
        </p>
      </div>
    </>
  );
}
