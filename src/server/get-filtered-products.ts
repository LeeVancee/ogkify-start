import { createServerFn } from "@tanstack/react-start";
import { asc, desc, eq, gte, ilike, lte, or } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

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
    // Build base query conditions
    const baseConditions = [eq(products.isArchived, false)];

    // Featured products filter
    if (options.featured) {
      baseConditions.push(eq(products.isFeatured, true));
    }

    // Price range filter
    if (options.minPrice !== undefined) {
      baseConditions.push(gte(products.price, options.minPrice));
    }
    if (options.maxPrice !== undefined) {
      baseConditions.push(lte(products.price, options.maxPrice));
    }

    // Search query
    if (options.search) {
      baseConditions.push(
        or(
          ilike(products.name, `%${options.search}%`),
          ilike(products.description, `%${options.search}%`),
        )!,
      );
    }

    // Handle pagination
    const page = options.page || 1;
    const limit = options.limit || 12;
    const offset = (page - 1) * limit;

    // Handle sorting
    let orderBy: any = [desc(products.createdAt)];

    if (options.sort) {
      switch (options.sort) {
        case "price-asc":
          orderBy = [asc(products.price)];
          break;
        case "price-desc":
          orderBy = [desc(products.price)];
          break;
        case "newest":
          orderBy = [desc(products.createdAt)];
          break;
        case "featured":
        default:
          orderBy = [desc(products.isFeatured), desc(products.createdAt)];
      }
    }

    // Since we need to support in-memory filtering for categories/colors/sizes (due to relational structure),
    // we fetch all and filter, then slice. 
    // BUT to be more efficient, we can at least return the total count correctly.
    
    let productsList = await db.query.products.findMany({
      where: (productsTable, { and: andFn }) => andFn(...baseConditions),
      with: {
        category: true,
        images: true,
        colors: { with: { color: true } },
        sizes: { with: { size: true } },
      },
      orderBy,
    });

    // In-memory filtering (Category, Colors, Sizes)
    if (options.category) {
      productsList = productsList.filter(
        (product) => product.category.name === options.category,
      );
    }

    if (options.colors && options.colors.length > 0) {
      productsList = productsList.filter((product) =>
        product.colors.some((pc) => options.colors!.includes(pc.color.name)),
      );
    }

    if (options.sizes && options.sizes.length > 0) {
      productsList = productsList.filter((product) =>
        product.sizes.some((ps) => options.sizes!.includes(ps.size.value)),
      );
    }

    const total = productsList.length;
    const paginatedProducts = productsList.slice(offset, offset + limit);

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
  });
