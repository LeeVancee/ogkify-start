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
 * Server function to get and filter product list
 */
export const getFilteredProducts = createServerFn()
  .validator((options: FilterOptions = {}) => options)
  .handler(async ({ data: options }) => {
    try {
      // Build base query conditions
      const baseConditions = [eq(products.isArchived, false)]

      // Featured products filter
      if (options.featured) {
        baseConditions.push(eq(products.isFeatured, true))
      }

      // Price range filter
      if (options.minPrice !== undefined) {
        baseConditions.push(gte(products.price, options.minPrice))
      }
      if (options.maxPrice !== undefined) {
        baseConditions.push(lte(products.price, options.maxPrice))
      }

      // Search query
      if (options.search) {
        baseConditions.push(
          or(
            ilike(products.name, `%${options.search}%`),
            ilike(products.description, `%${options.search}%`),
          )!,
        )
      }

      // Handle pagination
      const page = options.page || 1
      const limit = options.limit || 12
      const offset = (page - 1) * limit

      // Handle sorting
      let orderBy: any = [desc(products.createdAt)] // Default sort by creation time descending

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
            // Featured products first, then by creation time descending
            orderBy = [desc(products.isFeatured), desc(products.createdAt)]
        }
      }

      // Use relational query to get product list
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
            // featured or default sorting
            return [
              descFn(productsTable.isFeatured),
              descFn(productsTable.createdAt),
            ]
          }
        },
      })

      // Additional filtering in memory (category, colors, sizes)
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

      // Get total count
      const total = productsList.length

      // Apply pagination
      const paginatedProducts = productsList.slice(offset, offset + limit)

      // Format data to match SimpleProduct interface, return only necessary fields
      const formattedProducts = paginatedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images.map((image) => image.url),
        category: product.category.name,
        // Removed unnecessary hardcoded fields: inStock, rating, reviews, discount, freeShipping
        // These fields are not used in ProductGrid, reducing data transfer
        // If these fields are needed in the future, they should be fetched from database instead of hardcoded
      }))

      return {
        products: formattedProducts,
        total,
      }
    } catch (error) {
      console.error('Failed to get filtered products:', error)
      return { products: [], total: 0 }
    }
  })
