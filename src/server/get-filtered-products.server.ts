import { createServerFn } from '@tanstack/react-start'
import { and, asc, count, desc, eq, gte, ilike, lte, or } from 'drizzle-orm'
import { db } from '@/db'
import { products } from '@/db/schema'

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
      // 构建基础查询条件
      const baseConditions = [eq(products.isArchived, false)]

      // 特色商品筛选
      if (options.featured) {
        baseConditions.push(eq(products.isFeatured, true))
      }

      // 价格范围筛选
      if (options.minPrice !== undefined) {
        baseConditions.push(gte(products.price, options.minPrice))
      }
      if (options.maxPrice !== undefined) {
        baseConditions.push(lte(products.price, options.maxPrice))
      }

      // 搜索查询
      if (options.search) {
        baseConditions.push(
          or(
            ilike(products.name, `%${options.search}%`),
            ilike(products.description, `%${options.search}%`),
          )!,
        )
      }

      // 处理分页
      const page = options.page || 1
      const limit = options.limit || 12
      const offset = (page - 1) * limit

      // 处理排序
      let orderBy: any = [desc(products.createdAt)] // 默认按创建时间降序

      if (options.sort) {
        switch (options.sort) {
          case 'price-asc':
            orderBy = [asc(products.price)]
            break
          case 'price-desc':
            orderBy = [desc(products.price)]
            break
          case 'newest':
            orderBy = [desc(products.createdAt)]
            break
          case 'featured':
          default:
            // 特色商品优先，然后按创建时间降序
            orderBy = [desc(products.isFeatured), desc(products.createdAt)]
        }
      }

      // 使用关系查询获取商品列表
      let productsList = await db.query.products.findMany({
        where: (productsTable, { and: andFn }) => andFn(...baseConditions),
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
        orderBy: (productsTable, { desc: descFn, asc: ascFn }) => {
          if (options.sort === 'price-asc') {
            return [ascFn(productsTable.price)]
          } else if (options.sort === 'price-desc') {
            return [descFn(productsTable.price)]
          } else if (options.sort === 'newest') {
            return [descFn(productsTable.createdAt)]
          } else {
            // featured 或默认排序
            return [
              descFn(productsTable.isFeatured),
              descFn(productsTable.createdAt),
            ]
          }
        },
      })

      // 在内存中进行额外的筛选（分类、颜色、尺寸）
      if (options.category) {
        productsList = productsList.filter(
          (product) => product.category.name === options.category,
        )
      }

      if (options.colors && options.colors.length > 0) {
        productsList = productsList.filter((product) =>
          product.colors.some((pc) => options.colors!.includes(pc.color.name)),
        )
      }

      if (options.sizes && options.sizes.length > 0) {
        productsList = productsList.filter((product) =>
          product.sizes.some((ps) => options.sizes!.includes(ps.size.value)),
        )
      }

      // 获取总数
      const total = productsList.length

      // 应用分页
      const paginatedProducts = productsList.slice(offset, offset + limit)

      // 格式化数据以符合SimpleProduct接口，只返回必要字段
      const formattedProducts = paginatedProducts.map((product) => ({
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
