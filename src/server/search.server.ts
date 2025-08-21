import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

/**
 * 根据查询字符串搜索产品
 */
export const searchProducts = createServerFn()
  .validator((query: string = "") => query)
  .handler(async ({ data: query }) => {
    if (!query || query.trim() === "") {
      return [];
    }

    try {
      const productsList = await db.query.products.findMany({
        where: (products, { or, ilike }) =>
          or(
            ilike(products.name, `%${query}%`),
            ilike(products.description, `%${query}%`),
          ),
        with: {
          images: true,
          category: true,
        },
      });

      // 格式化返回结果
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
