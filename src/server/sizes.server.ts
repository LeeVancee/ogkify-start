import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/db";

const sizeFormSchema = z.object({
  name: z.string().min(1, {
    message: "Size name must be at least 1 character.",
  }),
  value: z.string().min(1, {
    message: "Size value must be at least 1 character.",
  }),
});

export type SizeFormType = z.infer<typeof sizeFormSchema>;

// Get all sizes
export const getSizes = createServerFn().handler(async () => {
  try {
    const sizes = await prisma.sizes.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return sizes;
  } catch (error) {
    console.error("Failed to get sizes:", error);
    return [];
  }
});

// Get single size
export const getSize = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const size = await prisma.sizes.findUnique({
        where: { id },
      });

      if (!size) {
        return { success: false, size: null };
      }

      return { success: true, size };
    } catch (error) {
      console.error("Failed to get size:", error);
      return { success: false, size: null };
    }
  });

// Create size
export const createSize = createServerFn({ method: "POST" })
  .inputValidator((data: SizeFormType) => {
    const validatedFields = sizeFormSchema.safeParse(data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const size = await prisma.sizes.create({
        data: {
          name: data.name,
          value: data.value,
        },
      });

      return { success: true, data: size };
    } catch (error) {
      console.error("Failed to create size:", error);
      return { success: false, error: "Failed to create size" };
    }
  });

// Update size
export const updateSize = createServerFn({ method: "POST" })
  .inputValidator((params: { id: string; data: SizeFormType }) => {
    const validatedFields = sizeFormSchema.safeParse(params.data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return params;
  })
  .handler(async ({ data: { id, data } }) => {
    try {
      const size = await prisma.sizes.update({
        where: { id },
        data: {
          name: data.name,
          value: data.value,
        },
      });

      return { success: true, data: size };
    } catch (error) {
      console.error("Failed to update size:", error);
      return { success: false, error: "Failed to update size" };
    }
  });

// Delete size
export const deleteSize = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await prisma.sizes.delete({
        where: { id },
      });

      return { success: true, message: "Size deleted successfully" };
    } catch (error) {
      console.error("Failed to delete size:", error);
      return {
        success: false,
        message: "Failed to delete size, please try again later",
      };
    }
  });
