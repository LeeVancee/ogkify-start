import type { AdminProductDetail, AdminProductFormValues } from "./types";

export function emptyProductFormValues(): AdminProductFormValues {
  return {
    name: "",
    description: "",
    price: "",
    categoryId: "",
    colorIds: [],
    sizeIds: [],
    images: [""],
    isFeatured: false,
    isArchived: false,
  };
}

export function productToFormValues(
  product: AdminProductDetail,
): AdminProductFormValues {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    colorIds: product.colorIds,
    sizeIds: product.sizeIds,
    images: product.images.length > 0 ? product.images : [""],
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
  };
}

export function normalizeImageUrls(value: string) {
  return value
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}
