import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'

// 获取所有分类
export const getCategories = createServerFn().handler(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
    })
    return categories
  } catch (error) {
    return []
  }
})

// 获取单个分类
export const getCategory = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        select: {
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
      const category = await prisma.category.create({
        data: {
          name: input.name,
          imageUrl: input.imageUrl,
        },
      })

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
      const category = await prisma.category.update({
        where: { id },
        data: { name },
      })
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
      await prisma.category.delete({
        where: { id },
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: '删除分类失败' }
    }
  })

// 获取分类数量
export const getCategoriesCount = createServerFn().handler(async () => {
  try {
    const count = await prisma.category.count()
    return count
  } catch (error) {
    console.error('获取分类数量失败:', error)
    return 0
  }
})
