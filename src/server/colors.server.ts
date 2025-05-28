import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { colors } from '@/db/schema'

// Get all colors
export const getColors = createServerFn().handler(async () => {
  try {
    const colorsList = await db.query.colors.findMany({
      orderBy: (colors, { asc }) => [asc(colors.name)],
      columns: {
        id: true,
        name: true,
        value: true,
      },
    })

    return colorsList
  } catch (error) {
    console.error('Failed to get colors:', error)
    return []
  }
})

// Get single color
export const getColor = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const color = await db.query.colors.findFirst({
        where: (colors, { eq }) => eq(colors.id, id),
        columns: {
          id: true,
          name: true,
          value: true,
        },
      })

      if (!color) {
        return { success: false, error: 'Color not found' }
      }

      return {
        success: true,
        color,
      }
    } catch (error) {
      console.error('Failed to get color:', error)
      return { success: false, error: 'Failed to get color' }
    }
  })

// Create color
export const createColor = createServerFn()
  .validator((data: { name: string; value: string }) => data)
  .handler(async ({ data }) => {
    try {
      const [color] = await db
        .insert(colors)
        .values({
          name: data.name,
          value: data.value,
        })
        .returning()

      return { success: true, data: color }
    } catch (error) {
      return { success: false, error: 'Failed to create color' }
    }
  })

// Update color
export const updateColor = createServerFn()
  .validator(
    (params: { id: string; data: { name: string; value: string } }) => params,
  )
  .handler(async ({ data: { id, data } }) => {
    try {
      const [color] = await db
        .update(colors)
        .set({
          name: data.name,
          value: data.value,
        })
        .where(eq(colors.id, id))
        .returning()

      return { success: true, data: color }
    } catch (error) {
      return { success: false, error: 'Failed to update color' }
    }
  })

// Delete color
export const deleteColor = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(colors).where(eq(colors.id, id))

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete color' }
    }
  })
