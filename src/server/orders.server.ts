import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'
import { getSession } from './getSession.server'
import { formatPrice } from '@/lib/utils'

// 获取用户所有订单
export const getUserOrders = createServerFn().handler(async () => {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, orders: [] }
    }

    const orders = await prisma.order.findMany({
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
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 转换为前端友好的格式
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.user?.name,
      email: order.user?.email,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      firstItemImage: order.items[0]?.product?.images[0]?.url || null,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.product.images[0]?.url || null,
        color: item.color
          ? {
              name: item.color.name,
              value: item.color.value,
            }
          : null,
        size: item.size
          ? {
              name: item.size.name,
              value: item.size.value,
            }
          : null,
      })),
    }))

    return { success: true, orders: formattedOrders }
  } catch (error) {
    console.error('获取订单失败:', error)
    return { success: false, orders: [] }
  }
})

// 获取订单详情
export const getOrderDetails = createServerFn()
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    try {
      const session = await getSession()

      if (!session?.user?.id) {
        return { error: '未授权', success: false }
      }

      // 查询订单，确保订单属于当前登录用户
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
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

      if (!order) {
        return { error: '找不到订单', success: false }
      }

      // 格式化订单详情
      const totalItems = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      )

      const formattedOrder = {
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt.toISOString(),
        createdAtFormatted: new Date(order.createdAt).toLocaleDateString(
          'zh-CN',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          },
        ),
        status: order.status,
        statusText: getOrderStatusText(order.status),
        paymentStatus: order.paymentStatus,
        paymentStatusText: getPaymentStatusText(order.paymentStatus),
        totalAmount: order.totalAmount,
        totalAmountFormatted: formatPrice(order.totalAmount),
        totalItems,
        shippingAddress: order.shippingAddress,
        phone: order.phone,
        paymentMethod: order.paymentMethod,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          productDescription: item.product.description,
          quantity: item.quantity,
          price: item.price,
          priceFormatted: formatPrice(item.price),
          totalPrice: item.price * item.quantity,
          totalPriceFormatted: formatPrice(item.price * item.quantity),
          imageUrl: item.product.images[0]?.url || null,
          color: item.color
            ? {
                name: item.color.name,
                value: item.color.value,
              }
            : null,
          size: item.size
            ? {
                name: item.size.name,
                value: item.size.value,
              }
            : null,
        })),
      }

      return {
        success: true,
        order: formattedOrder,
      }
    } catch (error) {
      console.error('获取订单详情失败:', error)
      return { error: '获取订单详情失败', success: false }
    }
  })

// 获取用户未支付的订单
export const getUnpaidOrders = createServerFn().handler(async () => {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, orders: [] }
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        paymentStatus: 'UNPAID',
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      totalAmount: order.totalAmount,
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      firstItemImage: order.items[0]?.product?.images[0]?.url || null,
    }))

    return { success: true, orders: formattedOrders }
  } catch (error) {
    console.error('获取未支付订单失败:', error)
    return { success: false, orders: [] }
  }
})

// 删除未支付的订单
export const deleteUnpaidOrder = createServerFn()
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    try {
      const session = await getSession()
      if (!session?.user?.id) {
        return { error: '未授权', success: false }
      }

      // 检查订单是否存在且属于当前用户
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
          userId: session.user.id,
          paymentStatus: 'UNPAID',
        },
      })

      if (!order) {
        return { error: '找不到未支付的订单', success: false }
      }

      // 删除订单项
      await prisma.orderItem.deleteMany({
        where: { orderId },
      })

      // 删除订单
      await prisma.order.delete({
        where: { id: orderId },
      })

      return { success: true, message: '订单已成功删除' }
    } catch (error) {
      console.error('删除订单失败:', error)
      return { error: '删除订单失败', success: false }
    }
  })

// 获取订单状态的中文描述
function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: '待处理',
    PAID: '已支付',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
  }
  return statusMap[status] || status
}

// 获取支付状态的中文描述
function getPaymentStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    UNPAID: '未支付',
    PAID: '已支付',
    REFUNDED: '已退款',
    FAILED: '支付失败',
  }
  return statusMap[status] || status
}
