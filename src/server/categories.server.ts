import { createServerFn } from '@tanstack/react-start'
import { count, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema'

// 获取所有分类
export const getCategories = createServerFn().handler(async () => {
  try {
    const categoriesList = await db.query.categories.findMany({
      orderBy: (categories, { desc }) => [desc(categories.createdAt)],
      columns: {
        id: true,
        name: true,
        imageUrl: true,
      },
    })
    return categoriesList
  } catch (error) {
    return []
  }
})

// 获取单个分类
export const getCategory = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const category = await db.query.categories.findFirst({
        where: (categories, { eq }) => eq(categories.id, id),
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      })

      if (!category) {
        return { success: false, error: '分类不存在' }
      }

      return { success: true, category }
    } catch (error) {
      console.error('获取分类失败:', error)
      return { success: false, error: '获取分类失败' }
    }
  })

interface CreateCategoryInput {
  name: string
  imageUrl: string
}

// 创建分类
export const createCategory = createServerFn()
  .validator((input: CreateCategoryInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const [category] = await db
        .insert(categories)
        .values({
          name: input.name,
          imageUrl: input.imageUrl,
        })
        .returning()

      return { success: true, data: category }
    } catch (error) {
      console.error('创建分类失败:', error)
      return { success: false, error: '创建分类失败' }
    }
  })

// 更新分类
export const updateCategory = createServerFn()
  .validator((params: { id: string; name: string }) => params)
  .handler(async ({ data: { id, name } }) => {
    try {
      const [category] = await db
        .update(categories)
        .set({ name })
        .where(eq(categories.id, id))
        .returning()

      return { success: true, data: category }
    } catch (error) {
      return { success: false, error: '更新分类失败' }
    }
  })

// 删除分类
export const deleteCategory = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(categories).where(eq(categories.id, id))

      return { success: true }
    } catch (error) {
      return { success: false, error: '删除分类失败' }
    }
  })

// 获取分类数量
export const getCategoriesCount = createServerFn().handler(async () => {
  try {
    const [result] = await db.select({ count: count() }).from(categories)
    return result.count
  } catch (error) {
    console.error('获取分类数量失败:', error)
    return 0
  }
})
