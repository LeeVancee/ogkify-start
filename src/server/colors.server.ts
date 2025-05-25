import { createServerFn } from '@tanstack/react-start'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { colors } from '@/db/schema'

// 获取所有颜色
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
    console.error('获取颜色失败:', error)
    return []
  }
})

// 获取单个颜色
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
        return { success: false, error: '颜色不存在' }
      }

      return {
        success: true,
        color,
      }
    } catch (error) {
      console.error('获取颜色失败:', error)
      return { success: false, error: '获取颜色失败' }
    }
  })

// 创建颜色
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
      return { success: false, error: '创建颜色失败' }
    }
  })

// 更新颜色
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
      return { success: false, error: '更新颜色失败' }
    }
  })

// 删除颜色
export const deleteColor = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(colors).where(eq(colors.id, id))

      return { success: true }
    } catch (error) {
      return { success: false, error: '删除颜色失败' }
    }
  })
