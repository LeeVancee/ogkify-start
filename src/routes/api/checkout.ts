import { json } from '@tanstack/react-start'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getWebRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const ServerRoute = createServerFileRoute().methods({
  POST: async ({ request }: { request: any }) => {
    try {
      const { headers } = getWebRequest()!

      const session = await auth.api.getSession({
        headers,
      })
      // 检查用户是否已登录
      if (!session?.user?.id) {
        return json({ error: '必须登录才能结账' }, { status: 401 })
      }

      // 获取用户的购物车
      const cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
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

      if (!cart || cart.items.length === 0) {
        return json({ error: '购物车为空' }, { status: 400 })
      }

      // 计算总金额
      const amount = cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      )

      // 构建行项目
      const lineItems = cart.items.map((item) => {
        const productName = item.product.name
        const colorName = item.color?.name || ''
        const sizeName = item.size?.name || ''
        const variantInfo = [colorName, sizeName].filter(Boolean).join(', ')

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: variantInfo ? `${variantInfo}` : undefined,
              images:
                item.product.images && item.product.images.length > 0
                  ? [item.product.images[0]?.url]
                  : undefined,
            },
            unit_amount: formatAmountForStripe(item.product.price),
          },
          quantity: item.quantity,
        }
      })

      // 创建订单
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          totalAmount: amount,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              colorId: item.colorId,
              sizeId: item.sizeId,
            })),
          },
        },
      })

      const origin = new URL(request.url).origin

      // 创建 Stripe 结账会话
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`,
        metadata: {
          orderId: order.id,
          userId: session.user.id,
        },
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['CN', 'US', 'CA', 'JP', 'SG', 'HK', 'TW', 'MO'],
        },
        phone_number_collection: {
          enabled: true,
        },
      })

      // 更新订单，添加 Stripe 会话 ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: 'Stripe',
          paymentIntent: checkoutSession.id,
        },
      })

      return json({
        sessionId: checkoutSession.id,
        sessionUrl: checkoutSession.url,
      })
    } catch (error) {
      console.error('结账错误:', error)
      return json({ error: '创建结账会话失败' }, { status: 500 })
    }
  },
  GET: () => {
    return json({ message: '请使用 POST 方法访问此接口' })
  },
})
