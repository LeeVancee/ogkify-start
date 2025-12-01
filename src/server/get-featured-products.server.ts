import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";

/**
 * Get featured products list
 */
export const getFeaturedProducts = createServerFn()
  .inputValidator((limit?: number) => limit || 4)
  .handler(async ({ data: limit }) => {
    try {
      // Get featured products from database
      const productsList = await prisma.product.findMany({
        where: {
          isFeatured: true,
          isArchived: false,
        },
        include: {
          category: true,
          images: true,
          productToColors: {
            include: {
              color: true,
            },
          },
          productToSizes: {
            include: {
              size: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      // Format data to match SimpleProduct interface, return only necessary fields
      return productsList.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
        category: product.category.name || "Uncategorized",
      }));
    } catch (error) {
      console.error("Failed to get featured products:", error);
      return [];
    }
  });
