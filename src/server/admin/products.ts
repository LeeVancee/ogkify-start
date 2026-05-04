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
import type {
  AdminProductDetail,
  AdminProductFormValues,
  AdminProductListItem,
} from "@/lib/admin/types";

import { requireAdminSession } from "../require-admin";

const idSchema = z.uuid();
const productSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1),
  price: z.string().refine((value) => !Number.isNaN(Number(value))),
  categoryId: z.uuid(),
  colorIds: z.array(z.uuid()).default([]),
  sizeIds: z.array(z.uuid()).default([]),
  images: z.array(z.string().trim().url()).min(1),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

async function requireWritableAdmin() {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false as const, error: adminSession.error };
  }
  return { ok: true as const };
}

export const listAdminProducts = createServerFn().handler(
  async (): Promise<AdminProductListItem[]> => {
    const list = await db.query.products.findMany({
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
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    return list.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryName: product.category.name,
      colors: product.colors.map((item) => item.color),
      sizes: product.sizes.map((item) => item.size),
      imageUrl: product.images[0]?.url ?? null,
      imageCount: product.images.length,
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
      createdAt: product.createdAt.toISOString(),
    }));
  },
);

export const getAdminProductDetail = createServerFn()
  .inputValidator((id: string) => idSchema.parse(id))
  .handler(async ({ data: id }): Promise<AdminProductDetail> => {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
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
      throw new Error("Product not found");
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: String(product.price),
      categoryId: product.categoryId,
      colorIds: product.colors.map((item) => item.color.id),
      sizeIds: product.sizes.map((item) => item.size.id),
      images: product.images.map((item) => item.url),
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
    };
  });

export const getAdminProductFormData = createServerFn().handler(async () => {
  const [categoryList, colorList, sizeList] = await Promise.all([
    db.query.categories.findMany({
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    }),
    db.query.colors.findMany({
      orderBy: (table, { asc }) => [asc(table.name)],
    }),
    db.query.sizes.findMany({
      orderBy: (table, { asc }) => [asc(table.name)],
    }),
  ]);

  return {
    categories: categoryList,
    colors: colorList,
    sizes: sizeList,
  };
});

export const saveAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { id?: string; values: AdminProductFormValues }) => ({
    id: input.id,
    values: productSchema.parse(input.values),
  }))
  .handler(async ({ data: input }) => {
    const admin = await requireWritableAdmin();
    if (!admin.ok) return { success: false, error: admin.error };

    if (input.id) {
      await db
        .update(products)
        .set({
          name: input.values.name,
          description: input.values.description,
          price: Number(input.values.price),
          categoryId: input.values.categoryId,
          isFeatured: input.values.isFeatured,
          isArchived: input.values.isArchived,
          updatedAt: new Date(),
        })
        .where(eq(products.id, input.id));

      await db
        .delete(productsToColors)
        .where(eq(productsToColors.productId, input.id));
      await db
        .delete(productsToSizes)
        .where(eq(productsToSizes.productId, input.id));

      if (input.values.colorIds.length > 0) {
        await db.insert(productsToColors).values(
          input.values.colorIds.map((colorId) => ({
            productId: input.id!,
            colorId,
          })),
        );
      }

      if (input.values.sizeIds.length > 0) {
        await db.insert(productsToSizes).values(
          input.values.sizeIds.map((sizeId) => ({
            productId: input.id!,
            sizeId,
          })),
        );
      }

      const existingImages = await db.query.images.findMany({
        where: eq(images.productId, input.id),
      });
      const nextUrls = new Set(input.values.images);
      const removeIds = existingImages
        .filter((image) => !nextUrls.has(image.url))
        .map((image) => image.id);

      if (removeIds.length > 0) {
        await db.delete(images).where(inArray(images.id, removeIds));
      }

      const existingUrls = new Set(existingImages.map((image) => image.url));
      const addUrls = input.values.images.filter(
        (url) => !existingUrls.has(url),
      );

      if (addUrls.length > 0) {
        await db.insert(images).values(
          addUrls.map((url) => ({
            productId: input.id!,
            url,
          })),
        );
      }

      return { success: true };
    }

    const [product] = await db
      .insert(products)
      .values({
        name: input.values.name,
        description: input.values.description,
        price: Number(input.values.price),
        categoryId: input.values.categoryId,
        isFeatured: input.values.isFeatured,
        isArchived: input.values.isArchived,
      })
      .returning();

    if (input.values.colorIds.length > 0) {
      await db.insert(productsToColors).values(
        input.values.colorIds.map((colorId) => ({
          productId: product.id,
          colorId,
        })),
      );
    }

    if (input.values.sizeIds.length > 0) {
      await db.insert(productsToSizes).values(
        input.values.sizeIds.map((sizeId) => ({
          productId: product.id,
          sizeId,
        })),
      );
    }

    await db.insert(images).values(
      input.values.images.map((url) => ({
        productId: product.id,
        url,
      })),
    );

    return { success: true, data: product };
  });

export const deleteAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((id: string) => idSchema.parse(id))
  .handler(async ({ data: id }) => {
    const admin = await requireWritableAdmin();
    if (!admin.ok) return { success: false, error: admin.error };

    await db.delete(products).where(eq(products.id, id));
    return { success: true };
  });

export const getAdminProductStats = createServerFn().handler(async () => {
  const [productCount, productList] = await Promise.all([
    db.select({ count: count() }).from(products),
    db.query.products.findMany({
      columns: {
        id: true,
        isFeatured: true,
      },
    }),
  ]);

  return {
    productsCount: productCount[0]?.count ?? 0,
    featuredProducts: productList.filter((product) => product.isFeatured)
      .length,
  };
});
