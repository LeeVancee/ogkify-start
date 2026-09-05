import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/db";

export const getProduct = createServerFn()
  .validator((id: string) => z.uuid().parse(id))
  .handler(async ({ data: id }) => {
    const product = await db.query.products.findFirst({
      where: { id, isArchived: false },
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
      throw notFound();
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
      images: product.images.length
        ? product.images.map((image) => image.url)
        : ["/product-placeholder.svg"],
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
      images: product.images.length
        ? product.images.map((image) => image.url)
        : ["/product-placeholder.svg"],
    }));
  });
