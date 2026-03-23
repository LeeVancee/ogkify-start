import { createServerFn } from "@tanstack/react-start";
import { count, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  images,
  products,
  productsToColors,
  productsToSizes,
} from "@/db/schema";
import { requireAdminSession } from "./require-admin";

const productFormSchema = z.object({
  name: z.string().min(1, {
    message: "Product name must be at least 1 character.",
  }),
  description: z.string().min(1, {
    message: "Product description must be at least 1 character.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number.",
  }),
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
  colorIds: z.array(z.string()).default([]),
  sizeIds: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, {
    message: "Please upload at least one product image.",
  }),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export type ProductFormType = z.infer<typeof productFormSchema>;

// Get single product
export const getProduct = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const product = await db.query.products.findFirst({
      where: (productsTable, { eq }) => eq(productsTable.id, id),
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
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      price: product.price,
      colorIds: product.colors.map((pc) => pc.color.id),
      sizeIds: product.sizes.map((ps) => ps.size.id),
      images: product.images.map((image) => image.url),
      colors: product.colors.map((pc) => pc.color),
      sizes: product.sizes.map((ps) => ps.size),
    };
  });

// Update product
export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((params: { id: string; data: ProductFormType }) => {
    const validatedFields = productFormSchema.safeParse(params.data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return params;
  })
  .handler(async ({ data: { id, data } }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

    const {
      name,
      description,
      price,
      categoryId,
      colorIds,
      sizeIds,
      images: imageUrls,
      isFeatured,
      isArchived,
    } = data;

      // Find existing images
      const existingImages = await db.query.images.findMany({
        where: (imagesTable, { eq }) => eq(imagesTable.productId, id),
      });

      // Delete unused images
      const imagesToDelete = existingImages.filter(
        (image) => !imageUrls.includes(image.url),
      );

      if (imagesToDelete.length > 0) {
        await db.delete(images).where(
          inArray(
            images.id,
            imagesToDelete.map((img) => img.id),
          ),
        );
      }

      // Add new images
      const existingUrls = existingImages.map((image) => image.url);
      const newImages = imageUrls.filter((url) => !existingUrls.includes(url));

      // Update product basic information
      const [updatedProduct] = await db
        .update(products)
        .set({
          name,
          description,
          price: parseFloat(price),
          categoryId,
          isFeatured,
          isArchived,
        })
        .where(eq(products.id, id))
        .returning();

      // Update color associations
      await db
        .delete(productsToColors)
        .where(eq(productsToColors.productId, id));
      if (colorIds.length > 0) {
        await db.insert(productsToColors).values(
          colorIds.map((colorId) => ({
            productId: id,
            colorId,
          })),
        );
      }

      // Update size associations
      await db.delete(productsToSizes).where(eq(productsToSizes.productId, id));
      if (sizeIds.length > 0) {
        await db.insert(productsToSizes).values(
          sizeIds.map((sizeId) => ({
            productId: id,
            sizeId,
          })),
        );
      }

      // Add new images
      if (newImages.length > 0) {
        await db.insert(images).values(
          newImages.map((url) => ({
            productId: id,
            url,
          })),
        );
      }

    return { success: true, data: updatedProduct };
  });

// Get all products
export const getProducts = createServerFn().handler(async () => {
  const productsList = await db.query.products.findMany({
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
    orderBy: (productsTable, { desc }) => [desc(productsTable.createdAt)],
  });

  // Format return data, only return necessary fields
  return productsList.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    colors: product.colors.map((pc) => pc.color),
    sizes: product.sizes.map((ps) => ps.size),
    images: product.images,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
});

// Create product
export const createProduct = createServerFn({ method: "POST" })
  .inputValidator((data: ProductFormType) => {
    const validatedFields = productFormSchema.safeParse(data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

      const {
        name,
        description,
        price,
        categoryId,
        colorIds,
        sizeIds,
        images: imageUrls,
        isFeatured,
        isArchived,
      } = data;

      // Create product
      const [product] = await db
        .insert(products)
        .values({
          name,
          description,
          price: parseFloat(price),
          categoryId,
          isFeatured,
          isArchived,
        })
        .returning();

      // Create color associations
      if (colorIds.length > 0) {
        await db.insert(productsToColors).values(
          colorIds.map((colorId) => ({
            productId: product.id,
            colorId,
          })),
        );
      }

      // Create size associations
      if (sizeIds.length > 0) {
        await db.insert(productsToSizes).values(
          sizeIds.map((sizeId) => ({
            productId: product.id,
            sizeId,
          })),
        );
      }

      // Create images
      if (imageUrls.length > 0) {
        await db.insert(images).values(
          imageUrls.map((url) => ({
            productId: product.id,
            url,
          })),
        );
      }

    return { success: true, data: product };
  });

// Delete product
export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, message: adminSession.error };
    }

      // Delete product (associated images, colors, sizes will be cascade deleted via foreign keys)
      await db.delete(products).where(eq(products.id, id));

    return { success: true, message: "Product deleted successfully" };
  });

// Get product count
export const getProductsCount = createServerFn().handler(async () => {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return 0;
  }

  const [result] = await db.select({ count: count() }).from(products);
  return result.count;
});

// Get popular products
export const getPopularProducts = createServerFn()
  .inputValidator((limit?: number) => limit || 5)
  .handler(async ({ data: limit }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return [];
    }

      // Use relational query to get popular products
      const productsList = await db.query.products.findMany({
        with: {
          images: true,
          category: true,
          orderItems: true,
        },
        limit,
      });

      // Sort by order count and format return data
      const sortedProducts = productsList
        .map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0]?.url || null,
          category: product.category.name || "",
          orderCount: product.orderItems.length,
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, limit);

    return sortedProducts;
  });

// Get all product form data in a single request for better performance
export const getProductFormData = createServerFn().handler(async () => {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return {
      categories: [],
      colors: [],
      sizes: [],
    };
  }

    // Use Promise.all to fetch all data in parallel
    const [categories, colors, sizes] = await Promise.all([
      db.query.categories.findMany({
        orderBy: (categories, { desc }) => [desc(categories.createdAt)],
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      }),
      db.query.colors.findMany({
        orderBy: (colors, { asc }) => [asc(colors.name)],
        columns: {
          id: true,
          name: true,
          value: true,
        },
      }),
      db.query.sizes.findMany({
        orderBy: (sizes, { asc }) => [asc(sizes.name)],
        columns: {
          id: true,
          name: true,
          value: true,
        },
      }),
    ]);

  return {
    categories,
    colors,
    sizes,
  };
});
