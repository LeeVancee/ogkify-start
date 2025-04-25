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

      // 格式化数据以符合Product接口
      return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
        category: product.category.name,
        inStock: true, // 假设所有商品都有库存
        rating: 5, // 默认评分
        reviews: 0, // 默认评论数
        discount: 0, // 默认无折扣
        freeShipping: false, // 默认不提供免费配送
      }))
    } catch (error) {
      console.error('获取特色商品失败:', error)
      return []
    }
  })
