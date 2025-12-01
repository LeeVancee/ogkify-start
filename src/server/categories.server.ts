import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/db";

const categoryFormSchema = z.object({
  name: z.string().min(1, {
    message: "Category name must be at least 1 character.",
  }),
  imageUrl: z.string().optional(),
});

export type CategoryFormType = z.infer<typeof categoryFormSchema>;

// Get all categories
export const getCategories = createServerFn().handler(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map image_url to imageUrl for frontend compatibility
    return categories.map((category) => ({
      ...category,
      imageUrl: category.imageUrl,
    }));
  } catch (error) {
    console.error("Failed to get categories:", error);
    return [];
  }
});

// Get single category
export const getCategory = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return { success: false, category: null };
      }

      // Map image_url to imageUrl for frontend compatibility
      return {
        success: true,
        category: {
          ...category,
          imageUrl: category.imageUrl,
        },
      };
    } catch (error) {
      console.error("Failed to get category:", error);
      return { success: false, category: null };
    }
  });

// Create category
export const createCategory = createServerFn({ method: "POST" })
  .inputValidator((data: CategoryFormType) => {
    const validatedFields = categoryFormSchema.safeParse(data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const category = await prisma.category.create({
        data: {
          name: data.name,
          imageUrl: data.imageUrl || null,
        },
      });

      return { success: true, data: category };
    } catch (error) {
      console.error("Failed to create category:", error);
      return { success: false, error: "Failed to create category" };
    }
  });

// Update category
export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator((params: { id: string; name: string; imageUrl?: string }) => {
    const validatedFields = categoryFormSchema.safeParse({
      name: params.name,
      imageUrl: params.imageUrl,
    });
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return params;
  })
  .handler(async ({ data: { id, name, imageUrl } }) => {
    try {
      const category = await prisma.category.update({
        where: { id },
        data: {
          name: name,
          imageUrl: imageUrl || null,
        },
      });

      // Map image_url to imageUrl for frontend compatibility
      return {
        success: true,
        data: {
          ...category,
          imageUrl: category.imageUrl,
        },
      };
    } catch (error) {
      console.error("Failed to update category:", error);
      return { success: false, error: "Failed to update category" };
    }
  });

// Delete category
export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await prisma.category.delete({
        where: { id },
      });

      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      console.error("Failed to delete category:", error);
      return {
        success: false,
        message: "Failed to delete category, please try again later",
      };
    }
  });
