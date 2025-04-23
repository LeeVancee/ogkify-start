import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'
import { getSession } from './getSession.server'

export interface CartItemData {
  productId: string
  quantity: number
  colorId?: string
  sizeId?: string
}

// 将商品添加到购物车
export const addToCart = createServerFn()
  .validator((data: CartItemData) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getSession()

      // 检查用户是否登录
      if (!session?.user?.id) {
        console.error('add to cart failed: user not logged in')
        return { error: 'user not logged in, please login', success: false }
      }

      // 检查商品是否存在
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      })

      if (!product) {
        console.error('add to cart failed: product not found', data.productId)
        return { error: 'product not found', success: false }
      }

      console.log('try to add product to cart', session.user.id, data.productId)

      // 检查用户是否已有购物车
      let cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
      })

      // 如果没有购物车，创建一个新的
      if (!cart) {
        console.log('user has no cart, create new cart')
        cart = await prisma.cart.create({
          data: { userId: session.user.id },
        })
      }

      // 检查购物车中是否已有该商品
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: data.productId,
          colorId: data.colorId,
          sizeId: data.sizeId,
        },
      })

      if (existingItem) {
        console.log('cart already has this product, update quantity')
        // 更新现有商品数量
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + data.quantity },
        })
      } else {
        console.log('add new product to cart')
        // 添加新商品到购物车
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: data.productId,
            quantity: data.quantity,
            colorId: data.colorId,
            sizeId: data.sizeId,
          },
        })
      }

      return { success: true, message: 'product added to cart' }
    } catch (error) {
      console.error('add to cart failed:', error)
      return { error: 'add to cart failed, server error', success: false }
    }
  })

// 处理表单提交的服务器操作
export const handleAddToCartFormAction = createServerFn()
  .validator((formData: FormData) => {
    if (!(formData instanceof FormData)) {
      throw new Error('Invalid form data')
    }

    const productId = formData.get('productId') as string
    const quantity = parseInt(formData.get('quantity') as string) || 1
    const colorId = (formData.get('colorId') as string) || undefined
    const sizeId = (formData.get('sizeId') as string) || undefined

    console.log('server received cart request:', {
      productId,
      quantity,
      colorId,
      sizeId,
    })

    return {
      productId,
      quantity,
      colorId,
      sizeId,
    }
  })
  .handler(async ({ data }) => {
    return addToCart({ data: data })
  })

// 获取用户购物车
export const getUserCart = createServerFn().handler(async () => {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return { items: [], totalItems: 0 }
    }

    // 使用Prisma一次性查询购物车，包括所有关联数据
    const cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            color: true,
            size: true,
          },
        },
      },
    })

    if (!cart || !cart.items.length) {
      return { items: [], totalItems: 0 }
    }

    // 格式化购物车数据
    const formattedItems = cart.items.map((item) => {
      return {
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]?.url || '/placeholder.svg',
        colorId: item.colorId,
        colorName: item.color?.name || null,
        colorValue: item.color?.value || null,
        sizeId: item.sizeId,
        sizeName: item.size?.name || null,
        sizeValue: item.size?.value || null,
      }
    })

    return {
      items: formattedItems,
      totalItems: formattedItems.length,
    }
  } catch (error) {
    console.error('get cart failed:', error)
    return { items: [], totalItems: 0 }
  }
})

// 从购物车移除商品
export const removeFromCart = createServerFn()
  .validator((cartItemId: string) => cartItemId)
  .handler(async ({ data: cartItemId }) => {
    try {
      const session = await getSession()

      if (!session?.user?.id) {
        return { error: 'user not logged in', success: false }
      }

      // 验证这个购物车项属于当前用户
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
      })

      if (!cartItem || cartItem.cart.userId !== session.user.id) {
        return {
          error: 'no permission to operate this cart item',
          success: false,
        }
      }

      // 删除购物车项
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      })

      return { success: true, message: 'product removed from cart' }
    } catch (error) {
      console.error('remove from cart failed:', error)
      return { error: 'remove from cart failed', success: false }
    }
  })

// 更新购物车商品数量
export const updateCartItemQuantity = createServerFn()
  .validator((params: { cartItemId: string; quantity: number }) => params)
  .handler(async ({ data: { cartItemId, quantity } }) => {
    try {
      const session = await getSession()

      if (!session?.user?.id) {
        return { error: 'user not logged in', success: false }
      }

      if (quantity <= 0) {
        return removeFromCart({ data: cartItemId })
      }

      // 验证这个购物车项属于当前用户
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
      })

      if (!cartItem || cartItem.cart.userId !== session.user.id) {
        return {
          error: 'no permission to operate this cart item',
          success: false,
        }
      }

      // 更新数量
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      })

      return { success: true, message: 'cart updated' }
    } catch (error) {
      console.error('update cart quantity failed:', error)
      return { error: 'update cart quantity failed', success: false }
    }
  })

// 清空购物车
export const clearCart = createServerFn().handler(async () => {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return { error: 'user not logged in', success: false }
    }

    // 获取用户的购物车
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    })

    if (!cart) {
      return { success: true, message: 'cart is already empty' }
    }

    // 删除购物车中的所有商品
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return { success: true, message: 'cart cleared' }
  } catch (error) {
    console.error('clear cart failed:', error)
    return { error: 'clear cart failed', success: false }
  }
})
