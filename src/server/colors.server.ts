import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'

// 获取所有颜色
export const getColors = createServerFn().handler(async () => {
  try {
    const colors = await prisma.color.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return colors.map((color) => ({
      id: color.id,
      name: color.name,
      value: color.value,
    }))
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
      const color = await prisma.color.findUnique({
        where: { id },
      })

      if (!color) {
        return { success: false, error: '颜色不存在' }
      }

      return {
        success: true,
        color: {
          id: color.id,
          name: color.name,
          value: color.value,
        },
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
      const color = await prisma.color.create({
        data: {
          name: data.name,
          value: data.value,
        },
      })
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
      const color = await prisma.color.update({
        where: { id },
        data: {
          name: data.name,
          value: data.value,
        },
      })
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
      await prisma.color.delete({
        where: { id },
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: '删除颜色失败' }
    }
  })
