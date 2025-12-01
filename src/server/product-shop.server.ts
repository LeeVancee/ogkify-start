import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";

// Get product details
export const getProduct = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
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
          images: true,
        },
      });

      if (!product) {
        return null;
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category.name,
        categoryId: product.categoryId,
        colors: product.productToColors.map((pc) => ({
          id: pc.color.id,
          name: pc.color.name,
          value: pc.color.value,
        })),
        sizes: product.productToSizes.map((ps) => ({
          id: ps.size.id,
          name: ps.size.name,
          value: ps.size.value,
        })),
        images: product.images.map((image) => image.url),
        inStock: true,
        freeShipping: product.price > 25,
      };
    } catch (error) {
      console.error("Failed to get product details:", error);
      return null;
    }
  });

// Get related products
export const getRelatedProducts = createServerFn()
  .inputValidator((params: { productId: string; category: string }) => params)
  .handler(async ({ data: { productId, category } }) => {
    try {
      const productsList = await prisma.product.findMany({
        where: {
          categoryId: category,
          id: { not: productId },
          isArchived: false,
        },
        include: {
          images: true,
        },
        take: 4,
      });

      return productsList.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
      }));
    } catch (error) {
      console.error("Failed to get related products:", error);
      return [];
    }
  });
