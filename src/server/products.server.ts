import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { count, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  images,
  orderItems,
  products,
  productsToColors,
  productsToSizes,
} from '@/db/schema'

const productFormSchema = z.object({
  name: z.string().min(1, {
    message: '商品名称至少需要1个字符。',
  }),
  description: z.string().min(1, {
    message: '商品描述至少需要1个字符。',
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: '价格必须是有效的数字。',
  }),
  categoryId: z.string({
    required_error: '请选择一个分类。',
  }),
  colorIds: z.array(z.string()).min(1, {
    message: '请至少选择一种颜色。',
  }),
  sizeIds: z.array(z.string()).min(1, {
    message: '请至少选择一种尺寸。',
  }),
  images: z.array(z.string()).min(1, {
    message: '请至少上传一张商品图片。',
  }),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
})

export type ProductFormType = z.infer<typeof productFormSchema>

// 获取单个商品
export const getProduct = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const product = await db.query.products.findFirst({
        where: (productsTable, { eq }) => eq(productsTable.id, id),
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
      })

      if (!product) {
        return null
      }

      return {
        ...product,
        price: product.price,
        colorIds: product.colors.map((pc) => pc.color.id),
        sizeIds: product.sizes.map((ps) => ps.size.id),
        images: product.images.map((image) => image.url),
        colors: product.colors.map((pc) => pc.color),
        sizes: product.sizes.map((ps) => ps.size),
      }
    } catch (error) {
      console.error('获取商品失败:', error)
      return null
    }
  })

// 更新商品
export const updateProduct = createServerFn()
  .validator((params: { id: string; data: ProductFormType }) => {
    const validatedFields = productFormSchema.safeParse(params.data)
    if (!validatedFields.success) {
      throw new Error('表单验证失败')
    }
    return params
  })
  .handler(async ({ data: { id, data } }) => {
    try {
      const {
        name,
        description,
        price,
        categoryId,
        colorIds,
        sizeIds,
        images: imageUrls,
        isFeatured,
        isArchived,
      } = data

      // 查找现有的图片
      const existingImages = await db.query.images.findMany({
        where: (imagesTable, { eq }) => eq(imagesTable.productId, id),
      })

      // 删除不再使用的图片
      const imagesToDelete = existingImages.filter(
        (image) => !imageUrls.includes(image.url),
      )

      if (imagesToDelete.length > 0) {
        await db.delete(images).where(
          inArray(
            images.id,
            imagesToDelete.map((img) => img.id),
          ),
        )
      }

      // 添加新图片
      const existingUrls = existingImages.map((image) => image.url)
      const newImages = imageUrls.filter((url) => !existingUrls.includes(url))

      // 更新商品基本信息
      const [updatedProduct] = await db
        .update(products)
        .set({
          name,
          description,
          price: parseFloat(price),
          categoryId,
          isFeatured,
          isArchived,
        })
        .where(eq(products.id, id))
        .returning()

      // 更新颜色关联
      await db
        .delete(productsToColors)
        .where(eq(productsToColors.productId, id))
      if (colorIds.length > 0) {
        await db.insert(productsToColors).values(
          colorIds.map((colorId) => ({
            productId: id,
            colorId,
          })),
        )
      }

      // 更新尺寸关联
      await db.delete(productsToSizes).where(eq(productsToSizes.productId, id))
      if (sizeIds.length > 0) {
        await db.insert(productsToSizes).values(
          sizeIds.map((sizeId) => ({
            productId: id,
            sizeId,
          })),
        )
      }

      // 添加新图片
      if (newImages.length > 0) {
        await db.insert(images).values(
          newImages.map((url) => ({
            productId: id,
            url,
          })),
        )
      }

      return { success: true, data: updatedProduct }
    } catch (error) {
      return {
        success: false,
        error: '更新商品失败。请稍后重试。',
      }
    }
  })

// 获取所有商品
export const getProducts = createServerFn().handler(async () => {
  try {
    const productsList = await db.query.products.findMany({
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
      orderBy: (productsTable, { desc }) => [desc(productsTable.createdAt)],
    })

    // 格式化返回数据，只返回必要字段
    return productsList.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      colors: product.colors.map((pc) => pc.color),
      sizes: product.sizes.map((ps) => ps.size),
      images: product.images,
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))
  } catch (error) {
    console.error('获取商品列表失败:', error)
    return []
  }
})

// 创建商品
export const createProduct = createServerFn()
  .validator((data: ProductFormType) => {
    const validatedFields = productFormSchema.safeParse(data)
    if (!validatedFields.success) {
      throw new Error('表单验证失败')
    }
    return data
  })
  .handler(async ({ data }) => {
    try {
      const {
        name,
        description,
        price,
        categoryId,
        colorIds,
        sizeIds,
        images: imageUrls,
        isFeatured,
        isArchived,
      } = data

      // 创建商品
      const [product] = await db
        .insert(products)
        .values({
          name,
          description,
          price: parseFloat(price),
          categoryId,
          isFeatured,
          isArchived,
        })
        .returning()

      // 创建颜色关联
      if (colorIds.length > 0) {
        await db.insert(productsToColors).values(
          colorIds.map((colorId) => ({
            productId: product.id,
            colorId,
          })),
        )
      }

      // 创建尺寸关联
      if (sizeIds.length > 0) {
        await db.insert(productsToSizes).values(
          sizeIds.map((sizeId) => ({
            productId: product.id,
            sizeId,
          })),
        )
      }

      // 创建图片
      if (imageUrls.length > 0) {
        await db.insert(images).values(
          imageUrls.map((url) => ({
            productId: product.id,
            url,
          })),
        )
      }

      return { success: true, data: product }
    } catch (error) {
      return { success: false, error: '创建商品失败' }
    }
  })

// 删除商品
export const deleteProduct = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      // 删除商品（关联的图片、颜色、尺寸会通过外键级联删除）
      await db.delete(products).where(eq(products.id, id))

      return { success: true, message: '商品已成功删除' }
    } catch (error) {
      console.error('删除商品失败:', error)
      return { success: false, message: '删除商品失败，请稍后重试' }
    }
  })

// 获取产品数量
export const getProductsCount = createServerFn().handler(async () => {
  try {
    const [result] = await db.select({ count: count() }).from(products)
    return result.count
  } catch (error) {
    console.error('获取商品数量失败:', error)
    return 0
  }
})

// 获取热门产品
export const getPopularProducts = createServerFn()
  .validator((limit?: number) => limit || 5)
  .handler(async ({ data: limit }) => {
    try {
      // 使用关系查询获取热门产品
      const productsList = await db.query.products.findMany({
        with: {
          images: true,
          category: true,
          orderItems: true,
        },
        limit,
      })

      // 按订单数量排序并格式化返回数据
      const sortedProducts = productsList
        .map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0]?.url || null,
          category: product.category.name || '',
          orderCount: product.orderItems.length,
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, limit)

      return sortedProducts
    } catch (error) {
      console.error('获取热门产品失败:', error)
      return []
    }
  })
