import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db";

export const getProduct = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const product = await db.query.products.findFirst({
      where: { id },
      with: {
        category: true,
        colors: {
          with: {
            color: true,
          },
        },
        sizes: {
          with: {
            size: true,
          },
        },
        images: true,
      },
    });

    if (!product) {
      throw new Error(`Product not found: ${id}`);
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category.name,
      categoryId: product.categoryId,
      colors: product.colors.map((pc) => ({
        id: pc.color.id,
        name: pc.color.name,
        value: pc.color.value,
      })),
      sizes: product.sizes.map((ps) => ({
        id: ps.size.id,
        name: ps.size.name,
        value: ps.size.value,
      })),
      images: product.images.map((image) => image.url),
      inStock: true,
      freeShipping: true,
    };
  });

export const getRelatedProducts = createServerFn()
  .validator((params: { productId: string; category: string }) => params)
  .handler(async ({ data: { productId, category } }) => {
    const productsList = await db.query.products.findMany({
      where: {
        categoryId: category,
        id: { ne: productId },
        isArchived: false,
      },
      with: {
        images: true,
      },
      limit: 4,
    });

    return productsList.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images.map((image) => image.url),
    }));
  });
