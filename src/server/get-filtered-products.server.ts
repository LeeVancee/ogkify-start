import { createServerFn } from '@tanstack/react-start'
import type { Product } from '@/lib/types'
import { prisma } from '@/lib/prisma'

export interface FilterOptions {
  category?: string
  featured?: boolean
  sort?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  colors?: Array<string>
  sizes?: Array<string>
  page?: number
  limit?: number
}

/**
 * 获取并过滤商品列表的服务器函数
 */
export const getFilteredProducts = createServerFn()
  .validator((options: FilterOptions = {}) => options)
  .handler(async ({ data: options }) => {
    try {
      // 构建查询条件
      const where: any = {
        isArchived: false, // 不包括已归档商品
      }

      // 分类筛选
      if (options.category) {
        where.category = {
          name: options.category, // 通过分类名称筛选而不是ID
        }
      }

      // 特色商品筛选
      if (options.featured) {
        where.isFeatured = true
      }

      // 价格范围筛选
      if (options.minPrice !== undefined || options.maxPrice !== undefined) {
        where.price = {}

        if (options.minPrice !== undefined) {
          where.price.gte = options.minPrice
        }

        if (options.maxPrice !== undefined) {
          where.price.lte = options.maxPrice
        }
      }

      // 颜色筛选
      if (options.colors && options.colors.length > 0) {
        where.colors = {
          some: {
            name: {
              in: options.colors, // 通过颜色名称筛选而不是ID
            },
          },
        }
      }

      // 尺寸筛选
      if (options.sizes && options.sizes.length > 0) {
        where.sizes = {
          some: {
            value: {
              in: options.sizes, // 通过尺寸值筛选而不是ID
            },
          },
        }
      }

      // 搜索查询
      if (options.search) {
        where.OR = [
          {
            name: {
              contains: options.search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: options.search,
              mode: 'insensitive',
            },
          },
        ]
      }

      // 处理分页
      const page = options.page || 1
      const limit = options.limit || 12
      const skip = (page - 1) * limit

      // 处理排序
      let orderBy: any = { createdAt: 'desc' } // 默认按创建时间降序

      if (options.sort) {
        switch (options.sort) {
          case 'price-asc':
            orderBy = { price: 'asc' }
            break
          case 'price-desc':
            orderBy = { price: 'desc' }
            break
          case 'newest':
            orderBy = { createdAt: 'desc' }
            break
          case 'featured':
          default:
            // 特色商品优先，然后按创建时间降序
            orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
        }
      }

      // 获取商品总数
      const total = await prisma.product.count({ where })

      // 获取商品列表
      const products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
        },
        orderBy,
        skip,
        take: limit,
      })

      // 格式化数据以符合SimpleProduct接口，只返回必要字段
      const formattedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
        category: product.category.name,
        // 移除了不必要的硬编码字段：inStock, rating, reviews, discount, freeShipping
        // 这些字段在ProductGrid中都没有被使用，减少数据传输量
        // 如果将来需要这些字段，应该从数据库中获取真实数据而不是硬编码
      }))

      return {
        products: formattedProducts,
        total,
      }
    } catch (error) {
      console.error('获取筛选商品失败:', error)
      return { products: [], total: 0 }
    }
  })
