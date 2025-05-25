import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'

/**
 * 获取特色商品列表
 */
export const getFeaturedProducts = createServerFn()
  .validator((limit?: number) => limit || 4)
  .handler(async ({ data: limit }) => {
    try {
      // 从数据库获取特色商品
      const productsList = await db.query.products.findMany({
        where: (products, { eq, and }) =>
          and(eq(products.isFeatured, true), eq(products.isArchived, false)),
        with: {
          category: true,
          images: true,
          colors: {
            with: {
              color: true,
            },
          },
          sizes: {
            with: {
              size: true,
            },
          },
        },
        orderBy: (products, { desc }) => [desc(products.createdAt)],
        limit,
      })

      // 格式化数据以符合SimpleProduct接口，只返回必要字段
      return productsList.map((product) => ({
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
