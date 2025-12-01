import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";

/**
 * Search products based on query string
 */
export const searchProducts = createServerFn()
  .inputValidator((query: string = "") => query)
  .handler(async ({ data: query }) => {
    if (!query || query.trim() === "") {
      return [];
    }

    try {
      const productsList = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          images: true,
          category: true,
        },
      });

      // Format return results
      return productsList.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image:
          product.images[0]?.url || "/placeholder.svg?height=300&width=300",
        category: product.category.name || "",
      }));
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  });
