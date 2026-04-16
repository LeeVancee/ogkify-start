import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { colors } from "@/db/schema";

import { requireAdminSession } from "./require-admin";

const colorIdSchema = z.uuid();
const colorDataSchema = z.object({
  name: z.string().trim().min(1).max(50),
  value: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
});
const updateColorSchema = z.object({
  id: z.uuid(),
  data: colorDataSchema,
});

// Get all colors
export const getColors = createServerFn().handler(async () => {
  const colorsList = await db.query.colors.findMany({
    orderBy: (colors, { asc }) => [asc(colors.name)],
    columns: {
      id: true,
      name: true,
      value: true,
    },
  });

  return colorsList;
});

// Get single color
export const getColor = createServerFn()
  .inputValidator((id: string) => colorIdSchema.parse(id))
  .handler(async ({ data: id }) => {
    const color = await db.query.colors.findFirst({
      where: (colors, { eq }) => eq(colors.id, id),
      columns: {
        id: true,
        name: true,
        value: true,
      },
    });

    if (!color) {
      return { success: false, error: "Color not found" };
    }

    return {
      success: true,
      color,
    };
  });

// Create color
export const createColor = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; value: string }) =>
    colorDataSchema.parse(data),
  )
  .handler(async ({ data }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

    const [color] = await db
      .insert(colors)
      .values({
        name: data.name,
        value: data.value,
      })
      .returning();

    return { success: true, data: color };
  });

// Update color
export const updateColor = createServerFn({ method: "POST" })
  .inputValidator(
    (params: { id: string; data: { name: string; value: string } }) =>
      updateColorSchema.parse(params),
  )
  .handler(async ({ data: { id, data } }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

    const [color] = await db
      .update(colors)
      .set({
        name: data.name,
        value: data.value,
      })
      .where(eq(colors.id, id))
      .returning();

    return { success: true, data: color };
  });

// Delete color
export const deleteColor = createServerFn({ method: "POST" })
  .inputValidator((id: string) => colorIdSchema.parse(id))
  .handler(async ({ data: id }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

    await db.delete(colors).where(eq(colors.id, id));

    return { success: true };
  });
