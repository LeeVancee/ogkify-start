import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";

export interface FilterOptions {
  category?: string;
  featured?: boolean;
  sort?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: Array<string>;
  sizes?: Array<string>;
  page?: number;
  limit?: number;
}

/**
 * Server function to get and filter product list
 */
export const getFilteredProducts = createServerFn()
  .inputValidator((options: FilterOptions = {}) => options)
  .handler(async ({ data: options }) => {
    try {
      // Build base query conditions
      const whereConditions: any = {
        isArchived: false,
      };

      // Featured products filter
      if (options.featured) {
        whereConditions.isFeatured = true;
      }

      // Price range filter
      if (options.minPrice !== undefined || options.maxPrice !== undefined) {
        whereConditions.price = {};
        if (options.minPrice !== undefined) {
          whereConditions.price.gte = options.minPrice;
        }
        if (options.maxPrice !== undefined) {
          whereConditions.price.lte = options.maxPrice;
        }
      }

      // Search query
      if (options.search) {
        whereConditions.OR = [
          { name: { contains: options.search, mode: "insensitive" } },
          { description: { contains: options.search, mode: "insensitive" } },
        ];
      }

      // Category filter
      if (options.category) {
        whereConditions.category = {
          name: options.category,
        };
      }

      // Handle pagination
      const page = options.page || 1;
      const limit = options.limit || 12;
      const skip = (page - 1) * limit;

      // Handle sorting
      let orderBy: any = { createdAt: "desc" };

      if (options.sort) {
        switch (options.sort) {
          case "price-asc":
            orderBy = { price: "asc" };
            break;
          case "price-desc":
            orderBy = { price: "desc" };
            break;
          case "newest":
            orderBy = { createdAt: "desc" };
            break;
          case "featured":
          default:
            orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
        }
      }

      // Get products with relations
      let productsList = await prisma.product.findMany({
        where: whereConditions,
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
        orderBy,
      });

      // Additional filtering for colors and sizes (in-memory)
      if (options.colors && options.colors.length > 0) {
        productsList = productsList.filter((product) =>
          product.productToColors.some((pc) =>
            options.colors!.includes(pc.color.name),
          ),
        );
      }

      if (options.sizes && options.sizes.length > 0) {
        productsList = productsList.filter((product) =>
          product.productToSizes.some((ps) =>
            options.sizes!.includes(ps.size.value),
          ),
        );
      }

      // Get total count
      const total = productsList.length;

      // Apply pagination
      const paginatedProducts = productsList.slice(skip, skip + limit);

      // Format data
      const formattedProducts = paginatedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
        category: product.category.name,
      }));

      return {
        products: formattedProducts,
        total,
      };
    } catch (error) {
      console.error("Failed to get filtered products:", error);
      return { products: [], total: 0 };
    }
  });
