import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'

// 获取所有尺寸
export const getSizes = createServerFn().handler(async () => {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return sizes.map((size) => ({
      id: size.id,
      name: size.name,
      value: size.value,
    }))
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
      const size = await prisma.size.findUnique({
        where: { id },
      })

      if (!size) {
        return { success: false, error: '尺寸不存在' }
      }

      return {
        success: true,
        size: {
          id: size.id,
          name: size.name,
          value: size.value,
        },
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
      const size = await prisma.size.create({
        data: {
          name: data.name,
          value: data.value,
        },
      })
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
      const size = await prisma.size.update({
        where: { id },
        data: {
          name: data.name,
          value: data.value,
        },
      })
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
      await prisma.size.delete({
        where: { id },
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: '删除尺寸失败' }
    }
  })
