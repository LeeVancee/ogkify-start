import { createServerFn } from '@tanstack/react-start'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { sizes } from '@/db/schema'

// 获取所有尺寸
export const getSizes = createServerFn().handler(async () => {
  try {
    const sizesList = await db.query.sizes.findMany({
      orderBy: (sizes, { asc }) => [asc(sizes.name)],
      columns: {
        id: true,
        name: true,
        value: true,
      },
    })

    return sizesList
  } catch (error) {
    console.error('获取尺寸失败:', error)
    return []
  }
})

// 获取单个尺寸
export const getSize = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const size = await db.query.sizes.findFirst({
        where: (sizes, { eq }) => eq(sizes.id, id),
        columns: {
          id: true,
          name: true,
          value: true,
        },
      })

      if (!size) {
        return { success: false, error: '尺寸不存在' }
      }

      return {
        success: true,
        size,
      }
    } catch (error) {
      console.error('获取尺寸失败:', error)
      return { success: false, error: '获取尺寸失败' }
    }
  })

// 创建尺寸
export const createSize = createServerFn()
  .validator((data: { name: string; value: string }) => data)
  .handler(async ({ data }) => {
    try {
      const [size] = await db
        .insert(sizes)
        .values({
          name: data.name,
          value: data.value,
        })
        .returning()

      return { success: true, data: size }
    } catch (error) {
      return { success: false, error: '创建尺寸失败' }
    }
  })

// 更新尺寸
export const updateSize = createServerFn()
  .validator(
    (params: { id: string; data: { name: string; value: string } }) => params,
  )
  .handler(async ({ data: { id, data } }) => {
    try {
      const [size] = await db
        .update(sizes)
        .set({
          name: data.name,
          value: data.value,
        })
        .where(eq(sizes.id, id))
        .returning()

      return { success: true, data: size }
    } catch (error) {
      return { success: false, error: '更新尺寸失败' }
    }
  })

// 删除尺寸
export const deleteSize = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(sizes).where(eq(sizes.id, id))

      return { success: true }
    } catch (error) {
      return { success: false, error: '删除尺寸失败' }
    }
  })
