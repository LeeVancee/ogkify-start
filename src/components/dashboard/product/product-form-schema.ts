import { z } from "zod";

// Shared types
export interface Category {
  id: string;
  name: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface ProductFormProps {
  categories: Array<Category>;
  colors: Array<Color>;
  sizes: Array<Size>;
}

// Shared form schema
export const productFormSchema = z.object({
  name: z.string().min(1, {
    message: "Product name must be at least 1 character.",
  }),
  description: z.string().min(1, {
    message: "Product description must be at least 1 character.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number.",
  }),
  categoryId: z.string().min(1, "Please select a category."),
  colorIds: z.array(z.string()).default([]),
  sizeIds: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, {
    message: "Please upload at least one product image.",
  }),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
