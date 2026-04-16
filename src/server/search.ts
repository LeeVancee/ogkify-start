import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db";

/**
 * Search products based on query string
 */
export const searchProducts = createServerFn()
  .inputValidator((query: string = "") => query)
  .handler(async ({ data: query }) => {
    if (!query || query.trim() === "") {
      throw new Error("Search query is required");
    }

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

    // Format return results
    return productsList.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: getRequiredSearchProductImage(product.images[0]?.url, product.id),
      category: product.category.name,
    }));
  });

function getRequiredSearchProductImage(
  imageUrl: string | undefined,
  productId: string,
) {
  if (!imageUrl) {
    throw new Error(`Product image is missing for product ${productId}`);
  }

  return imageUrl;
}
