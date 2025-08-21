import { json } from '@tanstack/react-start'
import { createServerFileRoute } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'
import { db } from '@/db'
import { cartItems, carts, orders } from '@/db/schema'
import { stripe } from '@/lib/stripe'

export const ServerRoute = createServerFileRoute(
  '/api/webhooks/stripe'
).methods({
  POST: async ({ request }: { request: any }) => {
    try {
      const body = await request.text()
      const signature = request.headers.get('stripe-signature')

      if (!signature) {
        console.error('缺少 Stripe 签名头')
        return json({ error: '缺少 Stripe 签名头' }, { status: 400 })
      }

      // 确保 Webhook 密钥已设置
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('缺少 STRIPE_WEBHOOK_SECRET 环境变量')
        return json({ error: 'Webhook 配置错误' }, { status: 500 })
      }

      // 验证 Webhook 签名
      let event: Stripe.Event
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        )
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知错误'
        console.error(`Webhook 签名验证失败: ${errorMessage}`)
        return json(
          { error: `Webhook 签名验证失败: ${errorMessage}` },
          { status: 400 }
        )
      }

      // 根据事件类型处理
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          )
          break
        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent
          )
          break
        case 'charge.refunded':
          await handleChargeRefunded(event.data.object as Stripe.Charge)
          break
        default:
          console.log(`未处理的事件类型: ${event.type}`)
      }

      return json({ received: true })
    } catch (error) {
      console.error('Webhook 错误:', error)
      return json({ error: '处理 webhook 时发生错误' }, { status: 500 })
    }
  },
})

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    console.log('处理结账会话完成:', session.id)

    // 从元数据中获取订单 ID
    const orderId = session.metadata?.orderId
    const userId = session.metadata?.userId

    if (!orderId) {
      console.error('找不到订单 ID')
      return
    }

    // 获取地址信息
    const address = session.customer_details?.address
    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ]
    const addressString = addressComponents.filter((c) => c !== null).join(', ')

    // 更新订单状态和地址信息
    await db
      .update(orders)
      .set({
        status: 'PAID',
        paymentStatus: 'PAID',
        paymentIntent: session.payment_intent as string,
        phone: session.customer_details?.phone || null,
        shippingAddress: addressString || null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    // 清空用户购物车
    if (userId) {
      const userCart = await db.query.carts.findFirst({
        where: (carts, { eq }) => eq(carts.userId, userId),
      })

      if (userCart) {
        // 删除购物车项
        await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id))
        console.log(`用户 ${userId} 的购物车已清空`)
      }
    }

    console.log(`订单 ${orderId} 已标记为已付款`)
  } catch (error) {
    console.error('处理结账会话完成时发生错误:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('处理支付意图失败:', paymentIntent.id)

    // 尝试通过 metadata 获取订单 ID
    const orderId = paymentIntent.metadata?.orderId

    if (orderId) {
      // 更新订单状态
      await db
        .update(orders)
        .set({
          status: 'CANCELLED',
          paymentStatus: 'FAILED',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))

      console.log(`订单 ${orderId} 支付失败，状态已更新`)
    } else {
      console.log('无法通过 metadata 获取订单 ID')
    }
  } catch (error) {
    console.error('处理支付意图失败时发生错误:', error)
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    console.log('处理退款事件:', charge.id)

    // 尝试获取关联的付款意图
    const paymentIntentId = charge.payment_intent as string

    if (paymentIntentId) {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId)
      const orderId = paymentIntent.metadata?.orderId

      if (orderId) {
        await db
          .update(orders)
          .set({
            paymentStatus: 'REFUNDED',
            updatedAt: new Date(),
          })
          .where(eq(orders.id, orderId))

        console.log(`订单 ${orderId} 已退款`)
      }
    }
  } catch (error) {
    console.error('处理退款事件时发生错误:', error)
  }
}
