import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";

// Get all categories
export const getCategories = createServerFn().handler(async () => {
  try {
    const categoriesList = await db.query.categories.findMany({
      orderBy: (categories, { desc }) => [desc(categories.createdAt)],
      columns: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });
    return categoriesList;
  } catch (error) {
    return [];
  }
});

// Get single category
export const getCategory = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
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
    } catch (error) {
      console.error("Failed to get category:", error);
      return { success: false, error: "Failed to get category" };
    }
  });

interface CreateCategoryInput {
  name: string;
  imageUrl: string;
}

// Create category
export const createCategory = createServerFn({ method: "POST" })
  .inputValidator((input: CreateCategoryInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const [category] = await db
        .insert(categories)
        .values({
          name: input.name,
          imageUrl: input.imageUrl,
        })
        .returning();

      return { success: true, data: category };
    } catch (error) {
      console.error("Failed to create category:", error);
      return { success: false, error: "Failed to create category" };
    }
  });

// Update category
export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator((params: { id: string; name: string }) => params)
  .handler(async ({ data: { id, name } }) => {
    try {
      const [category] = await db
        .update(categories)
        .set({ name })
        .where(eq(categories.id, id))
        .returning();

      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: "Failed to update category" };
    }
  });

// Delete category
export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(categories).where(eq(categories.id, id));

      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete category" };
    }
  });

// Get category count
export const getCategoriesCount = createServerFn().handler(async () => {
  try {
    const [result] = await db.select({ count: count() }).from(categories);
    return result.count;
  } catch (error) {
    console.error("Failed to get category count:", error);
    return 0;
  }
});
