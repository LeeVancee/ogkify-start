import { createServerFn } from '@tanstack/react-start'
import { and, eq, ne } from 'drizzle-orm'
import { db } from '@/db'

// 获取产品详情
export const getProduct = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const product = await db.query.products.findFirst({
        where: (products, { eq }) => eq(products.id, id),
        with: {
          category: true,
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
        colors: product.colors.map((pc) => ({
          id: pc.color.id,
          name: pc.color.name,
          value: pc.color.value,
        })),
        sizes: product.sizes.map((ps) => ({
          id: ps.size.id,
          name: ps.size.name,
          value: ps.size.value,
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
      const productsList = await db.query.products.findMany({
        where: (products, { eq, ne, and }) =>
          and(
            eq(products.categoryId, category),
            ne(products.id, productId),
            eq(products.isArchived, false),
          ),
        with: {
          images: true,
        },
        limit: 4,
      })

      return productsList.map((product) => ({
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
