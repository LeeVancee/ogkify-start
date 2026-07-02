import { createServerFn } from "@tanstack/react-start";
import { and, eq, gte, ilike, lte, or } from "drizzle-orm";

import { db } from "@/db";

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

export const getCategories = createServerFn().handler(async () => {
  const categoriesList = await db.query.categories.findMany({
    orderBy: { createdAt: "desc" },
    columns: {
      id: true,
      name: true,
      imageUrl: true,
    },
  });
  return categoriesList;
});

export const getFeaturedProducts = createServerFn()
  .validator((limit?: number) => limit || 4)
  .handler(async ({ data: limit }) => {
    const productsList = await db.query.products.findMany({
      where: {
        isFeatured: true,
        isArchived: false,
      },
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
      orderBy: { createdAt: "desc" },
      limit,
    });

    return productsList.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images.map((image) => image.url),
      category: product.category.name || "Uncategorized",
    }));
  });

export const getFilteredProducts = createServerFn()
  .validator((options: FilterOptions = {}) => options)
  .handler(async ({ data: options }) => {
    const page = options.page || 1;
    const limit = options.limit || 12;
    const offset = (page - 1) * limit;

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
          orderBy = { isFeatured: "desc", createdAt: "desc" };
      }
    }

    let productsList = await db.query.products.findMany({
      where: {
        RAW: (table) =>
          and(
            eq(table.isArchived, false),
            options.featured ? eq(table.isFeatured, true) : undefined,
            options.minPrice !== undefined
              ? gte(table.price, options.minPrice)
              : undefined,
            options.maxPrice !== undefined
              ? lte(table.price, options.maxPrice)
              : undefined,
            options.search
              ? or(
                  ilike(table.name, `%${options.search}%`),
                  ilike(table.description, `%${options.search}%`),
                )
              : undefined,
          )!,
      },
      with: {
        category: true,
        images: true,
        colors: { with: { color: true } },
        sizes: { with: { size: true } },
      },
      orderBy,
    });

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
