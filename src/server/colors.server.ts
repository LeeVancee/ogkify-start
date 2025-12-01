import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/db";

const colorFormSchema = z.object({
  name: z.string().min(1, {
    message: "Color name must be at least 1 character.",
  }),
  value: z.string().min(1, {
    message: "Color value must be at least 1 character.",
  }),
});

export type ColorFormType = z.infer<typeof colorFormSchema>;

// Get all colors
export const getColors = createServerFn().handler(async () => {
  try {
    const colors = await prisma.color.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return colors;
  } catch (error) {
    console.error("Failed to get colors:", error);
    return [];
  }
});

// Get single color
export const getColor = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const color = await prisma.color.findUnique({
        where: { id },
      });

      if (!color) {
        return { success: false, color: null };
      }

      return { success: true, color };
    } catch (error) {
      console.error("Failed to get color:", error);
      return { success: false, color: null };
    }
  });

// Create color
export const createColor = createServerFn({ method: "POST" })
  .inputValidator((data: ColorFormType) => {
    const validatedFields = colorFormSchema.safeParse(data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const color = await prisma.color.create({
        data: {
          name: data.name,
          value: data.value,
        },
      });

      return { success: true, data: color };
    } catch (error) {
      console.error("Failed to create color:", error);
      return { success: false, error: "Failed to create color" };
    }
  });

// Update color
export const updateColor = createServerFn({ method: "POST" })
  .inputValidator((params: { id: string; data: ColorFormType }) => {
    const validatedFields = colorFormSchema.safeParse(params.data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return params;
  })
  .handler(async ({ data: { id, data } }) => {
    try {
      const color = await prisma.color.update({
        where: { id },
        data: {
          name: data.name,
          value: data.value,
        },
      });

      return { success: true, data: color };
    } catch (error) {
      console.error("Failed to update color:", error);
      return { success: false, error: "Failed to update color" };
    }
  });

// Delete color
export const deleteColor = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await prisma.color.delete({
        where: { id },
      });

      return { success: true, message: "Color deleted successfully" };
    } catch (error) {
      console.error("Failed to delete color:", error);
      return {
        success: false,
        message: "Failed to delete color, please try again later",
      };
    }
  });
