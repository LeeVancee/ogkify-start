import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'

// 获取产品详情
export const getProduct = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          colors: true,
          sizes: true,
          images: true,
        },
      })

      if (!product) {
        return null
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category.name,
        categoryId: product.categoryId,
        colors: product.colors.map((color) => ({
          id: color.id,
          name: color.name,
          value: color.value,
        })),
        sizes: product.sizes.map((size) => ({
          id: size.id,
          name: size.name,
          value: size.value,
        })),
        images: product.images.map((image) => image.url),
        inStock: true, // 这里可以根据实际情况设置
        freeShipping: product.price > 200, // 假设价格高于200免运费
      }
    } catch (error) {
      console.error('获取产品详情失败:', error)
      return null
    }
  })

// 获取相关产品
export const getRelatedProducts = createServerFn()
  .validator((params: { productId: string; category: string }) => params)
  .handler(async ({ data: { productId, category } }) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          categoryId: category,
          id: { not: productId },
          isArchived: false,
        },
        include: {
          images: true,
        },
        take: 4,
      })

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
      }))
    } catch (error) {
      console.error('获取相关产品失败:', error)
      return []
    }
  })
