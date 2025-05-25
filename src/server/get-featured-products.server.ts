import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'

/**
 * 获取特色商品列表
 */
export const getFeaturedProducts = createServerFn()
  .validator((limit?: number) => limit || 4)
  .handler(async ({ data: limit }) => {
    try {
      // 从数据库获取特色商品
      const products = await prisma.product.findMany({
        where: {
          isFeatured: true,
          isArchived: false, // 不包括已归档商品
        },
        include: {
          category: true,
          images: true,
          colors: true,
          sizes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      })

      // 格式化数据以符合SimpleProduct接口，只返回必要字段
      return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
        category: product.category.name || '未分类',
        // 移除了不必要的硬编码字段：rating, reviews, inStock, freeShipping
        // 如果需要这些字段，应该从数据库中获取真实数据
      }))
    } catch (error) {
      console.error('获取特色商品失败:', error)
      return []
    }
  })
