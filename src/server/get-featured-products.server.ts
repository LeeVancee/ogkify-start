import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

/**
 * Get featured products list
 */
export const getFeaturedProducts = createServerFn()
  .inputValidator((limit?: number) => limit || 4)
  .handler(async ({ data: limit }) => {
    try {
      // Get featured products from database
      const productsList = await db.query.products.findMany({
        where: (products, { eq, and }) =>
          and(eq(products.isFeatured, true), eq(products.isArchived, false)),
        with: {
          category: true,
          images: true,
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
        },
        orderBy: (products, { desc }) => [desc(products.createdAt)],
        limit,
      });

      // Format data to match SimpleProduct interface, return only necessary fields
      return productsList.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
        category: product.category.name || "Uncategorized",
        // Removed unnecessary hardcoded fields: rating, reviews, inStock, freeShipping
        // If these fields are needed, they should be fetched from database
      }));
    } catch (error) {
      console.error("Failed to get featured products:", error);
      return [];
    }
  });
