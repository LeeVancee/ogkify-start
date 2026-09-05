import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/db";

export const searchProducts = createServerFn()
  .validator((query: string = "") =>
    z.string().trim().min(1).max(200).parse(query),
  )
  .handler(async ({ data: query }) => {
    if (!query || query.trim() === "") {
      throw new Error("Search query is required");
    }

    const productsList = await db.query.products.findMany({
      where: {
        isArchived: false,
        OR: [
          { name: { ilike: `%${query}%` } },
          { description: { ilike: `%${query}%` } },
        ],
      },
      with: {
        images: true,
        category: true,
      },
    });

    return productsList.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.images[0]?.url ?? null,
      category: product.category.name,
    }));
  });
