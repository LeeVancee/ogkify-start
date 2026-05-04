import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { categories, colors, sizes } from "@/db/schema";
import type { AdminResourceFormValues } from "@/lib/admin/types";

import { requireAdminSession } from "../require-admin";

const idSchema = z.uuid();

const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().url().or(z.literal("")).optional(),
});

const colorSchema = z.object({
  name: z.string().trim().min(1).max(50),
  value: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
});

const sizeSchema = z.object({
  name: z.string().trim().min(1).max(50),
  value: z.string().trim().min(1).max(50),
});

async function requireWritableAdmin() {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false as const, error: adminSession.error };
  }
  return { ok: true as const };
}

export const listAdminCategories = createServerFn().handler(async () => {
  return db.query.categories.findMany({
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });
});

export const getAdminCategoryDetail = createServerFn()
  .inputValidator((id: string) => idSchema.parse(id))
  .handler(async ({ data: id }) => {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  });

export const saveAdminCategory = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { id?: string; values: AdminResourceFormValues }) => ({
      id: input.id,
      values: categorySchema.parse(input.values),
    }),
  )
  .handler(async ({ data: input }) => {
    const admin = await requireWritableAdmin();
    if (!admin.ok) return { success: false, error: admin.error };

    const values = {
      name: input.values.name,
      imageUrl: input.values.imageUrl || null,
      updatedAt: new Date(),
    };

    if (input.id) {
      const [category] = await db
        .update(categories)
        .set(values)
        .where(eq(categories.id, input.id))
        .returning();
      return { success: true, data: category };
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: values.name,
        imageUrl: values.imageUrl,
      })
      .returning();
    return { success: true, data: category };
  });

export const deleteAdminCategory = createServerFn({ method: "POST" })
  .inputValidator((id: string) => idSchema.parse(id))
  .handler(async ({ data: id }) => {
    const admin = await requireWritableAdmin();
    if (!admin.ok) return { success: false, error: admin.error };

    await db.delete(categories).where(eq(categories.id, id));
    return { success: true };
  });

export const listAdminColors = createServerFn().handler(async () => {
  return db.query.colors.findMany({
    orderBy: (table, { asc }) => [asc(table.name)],
  });
});

export const getAdminColorDetail = createServerFn()
  .inputValidator((id: string) => idSchema.parse(id))
  .handler(async ({ data: id }) => {
    const color = await db.query.colors.findFirst({
      where: eq(colors.id, id),
    });

    if (!color) {
      throw new Error("Color not found");
    }

    return color;
  });

export const saveAdminColor = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { id?: string; values: AdminResourceFormValues }) => ({
      id: input.id,
      values: colorSchema.parse(input.values),
    }),
  )
  .handler(async ({ data: input }) => {
    const admin = await requireWritableAdmin();
    if (!admin.ok) return { success: false, error: admin.error };

    if (input.id) {
      const [color] = await db
        .update(colors)
        .set({
          name: input.values.name,
          value: input.values.value,
          updatedAt: new Date(),
        })
        .where(eq(colors.id, input.id))
        .returning();
      return { success: true, data: color };
    }

    const [color] = await db
      .insert(colors)
      .values({
        name: input.values.name,
        value: input.values.value,
      })
      .returning();
    return { success: true, data: color };
  });

export const deleteAdminColor = createServerFn({ method: "POST" })
  .inputValidator((id: string) => idSchema.parse(id))
  .handler(async ({ data: id }) => {
    const admin = await requireWritableAdmin();
    if (!admin.ok) return { success: false, error: admin.error };

    await db.delete(colors).where(eq(colors.id, id));
    return { success: true };
  });

export const listAdminSizes = createServerFn().handler(async () => {
  return db.query.sizes.findMany({
    orderBy: (table, { asc }) => [asc(table.name)],
  });
});

export const getAdminSizeDetail = createServerFn()
  .inputValidator((id: string) => idSchema.parse(id))
  .handler(async ({ data: id }) => {
    const size = await db.query.sizes.findFirst({
      where: eq(sizes.id, id),
    });

    if (!size) {
      throw new Error("Size not found");
    }

    return size;
  });

export const saveAdminSize = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { id?: string; values: AdminResourceFormValues }) => ({
      id: input.id,
      values: sizeSchema.parse(input.values),
    }),
  )
  .handler(async ({ data: input }) => {
    const admin = await requireWritableAdmin();
    if (!admin.ok) return { success: false, error: admin.error };

    if (input.id) {
      const [size] = await db
        .update(sizes)
        .set({
          name: input.values.name,
          value: input.values.value,
          updatedAt: new Date(),
        })
        .where(eq(sizes.id, input.id))
        .returning();
      return { success: true, data: size };
    }

    const [size] = await db
      .insert(sizes)
      .values({
        name: input.values.name,
        value: input.values.value,
      })
      .returning();
    return { success: true, data: size };
  });

export const deleteAdminSize = createServerFn({ method: "POST" })
  .inputValidator((id: string) => idSchema.parse(id))
  .handler(async ({ data: id }) => {
    const admin = await requireWritableAdmin();
    if (!admin.ok) return { success: false, error: admin.error };

    await db.delete(sizes).where(eq(sizes.id, id));
    return { success: true };
  });

export const getAdminResourceCounts = createServerFn().handler(async () => {
  const [categoryCount, colorCount, sizeCount] = await Promise.all([
    db.select({ count: count() }).from(categories),
    db.select({ count: count() }).from(colors),
    db.select({ count: count() }).from(sizes),
  ]);

  return {
    categoriesCount: categoryCount[0]?.count ?? 0,
    colorsCount: colorCount[0]?.count ?? 0,
    sizesCount: sizeCount[0]?.count ?? 0,
  };
});
