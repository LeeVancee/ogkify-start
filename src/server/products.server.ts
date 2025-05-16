import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

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
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: true,
          colors: true,
          sizes: true,
        },
      })

      if (!product) {
        return null
      }

      return {
        ...product,
        price: product.price,
        colorIds: product.colors.map((color) => color.id),
        sizeIds: product.sizes.map((size) => size.id),
        images: product.images.map((image) => image.url),
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
        images,
        isFeatured,
        isArchived,
      } = data

      // 查找现有的图片
      const existingImages = await prisma.image.findMany({
        where: { productId: id },
      })

      // 删除不再使用的图片
      const imagesToDelete = existingImages.filter(
        (image) => !images.includes(image.url),
      )
      for (const image of imagesToDelete) {
        await prisma.image.delete({
          where: { id: image.id },
        })
      }

      // 添加新图片
      const existingUrls = existingImages.map((image) => image.url)
      const newImages = images.filter((url) => !existingUrls.includes(url))

      // 更新商品
      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: parseFloat(price),
          categoryId,
          isFeatured,
          isArchived,
          colors: {
            set: [], // 先清空关联
            connect: colorIds.map((colorId) => ({ id: colorId })),
          },
          sizes: {
            set: [], // 先清空关联
            connect: sizeIds.map((sizeId) => ({ id: sizeId })),
          },
          images: {
            create: newImages.map((url) => ({ url })),
          },
        },
      })

      return { success: true, data: product }
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
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        colors: true,
        sizes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return products
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
        images,
        isFeatured,
        isArchived,
      } = data

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          categoryId,
          isFeatured,
          isArchived,
          colors: {
            connect: colorIds.map((colorId) => ({ id: colorId })),
          },
          sizes: {
            connect: sizeIds.map((sizeId) => ({ id: sizeId })),
          },
          images: {
            create: images.map((url) => ({ url })),
          },
        },
      })

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
      // 先删除与商品相关的所有图片
      await prisma.image.deleteMany({
        where: { productId: id },
      })

      // 删除商品
      await prisma.product.delete({
        where: { id },
      })

      return { success: true, message: '商品已成功删除' }
    } catch (error) {
      console.error('删除商品失败:', error)
      return { success: false, message: '删除商品失败，请稍后重试' }
    }
  })

// 获取产品数量
export const getProductsCount = createServerFn().handler(async () => {
  try {
    const count = await prisma.product.count()
    return count
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
      // 这里简化处理，实际应该基于订单量或其他指标计算热门程度
      const products = await prisma.product.findMany({
        include: {
          images: true,
          category: true,
          orderItems: true,
        },
        orderBy: {
          orderItems: {
            _count: 'desc',
          },
        },
        take: limit,
      })

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0]?.url || null,
        category: product.category.name || '',
        orderCount: product.orderItems.length,
      }))
    } catch (error) {
      console.error('获取热门产品失败:', error)
      return []
    }
  })
