import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { categories } from "@/db/schema";

import { requireAdminSession } from "./require-admin";

const categoryIdSchema = z.uuid();
const categoryInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  imageUrl: z.string().trim().url(),
});
const updateCategoryInputSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(100),
  imageUrl: z.string().trim().url().optional(),
});

// Get all categories
export const getCategories = createServerFn().handler(async () => {
  const categoriesList = await db.query.categories.findMany({
    orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    columns: {
      id: true,
      name: true,
      imageUrl: true,
    },
  });
  return categoriesList;
});

// Get single category
export const getCategory = createServerFn()
  .inputValidator((id: string) => categoryIdSchema.parse(id))
  .handler(async ({ data: id }) => {
    const category = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.id, id),
      columns: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, category };
  });

interface CreateCategoryInput {
  name: string;
  imageUrl: string;
}

// Create category
export const createCategory = createServerFn({ method: "POST" })
  .inputValidator((input: CreateCategoryInput) =>
    categoryInputSchema.parse(input),
  )
  .handler(async ({ data: input }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: input.name,
        imageUrl: input.imageUrl,
      })
      .returning();

    return { success: true, data: category };
  });

// Update category
export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator((params: { id: string; name: string; imageUrl?: string }) =>
    updateCategoryInputSchema.parse(params),
  )
  .handler(async ({ data: { id, name, imageUrl } }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

    const [category] = await db
      .update(categories)
      .set({ name, imageUrl })
      .where(eq(categories.id, id))
      .returning();

    return { success: true, data: category };
  });

// Delete category
export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((id: string) => categoryIdSchema.parse(id))
  .handler(async ({ data: id }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

    await db.delete(categories).where(eq(categories.id, id));

    return { success: true };
  });

// Get category count
export const getCategoriesCount = createServerFn().handler(async () => {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return 0;
  }

  const [result] = await db.select({ count: count() }).from(categories);
  return result.count;
});
