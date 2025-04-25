import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'

/**
 * 根据查询字符串搜索产品
 */
export const searchProducts = createServerFn()
  .validator((query: string = '') => query)
  .handler(async ({ data: query }) => {
    if (!query || query.trim() === '') {
      return []
    }

    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          images: true,
          category: true,
        },
      })

      // 格式化返回结果
      return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.images[0]?.url || '/placeholder.svg',
        category: product.category?.name || '',
      }))
    } catch (error) {
      console.error('搜索产品时出错:', error)
      return []
    }
  })
