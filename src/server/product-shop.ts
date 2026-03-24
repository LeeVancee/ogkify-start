import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

// Get product details
export const getProduct = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const product = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, id),
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
      inStock: true, // This can be set based on actual conditions
      freeShipping: true,
    };
  });

// Get related products
export const getRelatedProducts = createServerFn()
  .inputValidator((params: { productId: string; category: string }) => params)
  .handler(async ({ data: { productId, category } }) => {
    const productsList = await db.query.products.findMany({
      where: (products, { eq, ne, and }) =>
        and(
          eq(products.categoryId, category),
          ne(products.id, productId),
          eq(products.isArchived, false),
        ),
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
