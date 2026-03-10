import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { sizes } from "@/db/schema";
import { requireAdminSession } from "./require-admin";

const sizeIdSchema = z.uuid();
const sizeDataSchema = z.object({
  name: z.string().trim().min(1).max(50),
  value: z.string().trim().min(1).max(50),
});
const updateSizeSchema = z.object({
  id: z.uuid(),
  data: sizeDataSchema,
});

// Get all sizes
export const getSizes = createServerFn().handler(async () => {
  try {
    const sizesList = await db.query.sizes.findMany({
      orderBy: (sizes, { asc }) => [asc(sizes.name)],
      columns: {
        id: true,
        name: true,
        value: true,
      },
    });

    return sizesList;
  } catch (error) {
    console.error("Failed to get sizes:", error);
    return [];
  }
});

// Get single size
export const getSize = createServerFn()
  .inputValidator((id: string) => sizeIdSchema.parse(id))
  .handler(async ({ data: id }) => {
    try {
      const size = await db.query.sizes.findFirst({
        where: (sizes, { eq }) => eq(sizes.id, id),
        columns: {
          id: true,
          name: true,
          value: true,
        },
      });

      if (!size) {
        return { success: false, error: "Size not found" };
      }

      return {
        success: true,
        size,
      };
    } catch (error) {
      console.error("Failed to get size:", error);
      return { success: false, error: "Failed to get size" };
    }
  });

// Create size
export const createSize = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; value: string }) =>
    sizeDataSchema.parse(data),
  )
  .handler(async ({ data }) => {
    try {
      const adminSession = await requireAdminSession();
      if (!adminSession.ok) {
        return { success: false, error: adminSession.error };
      }

      const [size] = await db
        .insert(sizes)
        .values({
          name: data.name,
          value: data.value,
        })
        .returning();

      return { success: true, data: size };
    } catch (error) {
      return { success: false, error: "Failed to create size" };
    }
  });

// Update size
export const updateSize = createServerFn({ method: "POST" })
  .inputValidator(
    (params: { id: string; data: { name: string; value: string } }) =>
      updateSizeSchema.parse(params),
  )
  .handler(async ({ data: { id, data } }) => {
    try {
      const adminSession = await requireAdminSession();
      if (!adminSession.ok) {
        return { success: false, error: adminSession.error };
      }

      const [size] = await db
        .update(sizes)
        .set({
          name: data.name,
          value: data.value,
        })
        .where(eq(sizes.id, id))
        .returning();

      return { success: true, data: size };
    } catch (error) {
      return { success: false, error: "Failed to update size" };
    }
  });

// Delete size
export const deleteSize = createServerFn({ method: "POST" })
  .inputValidator((id: string) => sizeIdSchema.parse(id))
  .handler(async ({ data: id }) => {
    try {
      const adminSession = await requireAdminSession();
      if (!adminSession.ok) {
        return { success: false, error: adminSession.error };
      }

      await db.delete(sizes).where(eq(sizes.id, id));

      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete size" };
    }
  });
