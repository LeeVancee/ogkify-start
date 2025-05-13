import { useEffect, useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { z } from 'zod'

// 订单类型定义
interface OrderData {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  shippingAddress: string | null
  phone: string | null
}

// 定义查询参数schema
const searchParamsSchema = z.object({
  session_id: z.string().optional(),
  order_id: z.string().optional(),
})

export const Route = createFileRoute({
  validateSearch: searchParamsSchema,
  component: CheckoutSuccessPage,
})

function CheckoutSuccessContent() {
  const { session_id, order_id } = Route.useSearch()
  const [isVerifying, setIsVerifying] = useState(true)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verifyPayment() {
      if (!session_id || !order_id) {
        setIsVerifying(false)
        return
      }

      try {
        // 等待一小段时间，以确保 webhook 处理完成
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // 从服务器获取订单信息
        const response = await fetch(`/api/orders/${order_id}`)

        if (!response.ok) {
          throw new Error('Failed to get order information')
        }

        const data = await response.json()
        setOrderData(data.order)
      } catch (error) {
        console.error('Failed to get order information', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to get order information',
        )
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [session_id, order_id])

  if (isVerifying) {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
        <h1 className="mb-2 text-2xl font-bold">正在验证您的订单...</h1>
        <p className="text-center text-muted-foreground">
          请稍等，我们正在处理您的支付。
        </p>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <h1 className="mb-4 text-2xl font-bold">无法获取订单信息</h1>
        <p className="mb-8 text-center text-muted-foreground">
          {error ||
            '无法获取订单详情，但您的付款可能已经处理。请检查您的电子邮件或联系客户支持。'}
        </p>
        <Button asChild>
          <Link to="/">返回首页</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="container flex flex-col items-center justify-center py-16">
        <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold">订单确认</h1>
        <p className="mb-6 text-center text-muted-foreground">
          感谢您的购买！您的订单已成功处理。
        </p>

        <div className="mb-8 w-full max-w-md rounded-lg border bg-card p-6">
          <div className="mb-4">
            <p className="mb-1 text-sm text-muted-foreground">订单号：</p>
            <p className="text-xl font-semibold">{orderData.orderNumber}</p>
          </div>

          {orderData.shippingAddress && (
            <div className="mb-4">
              <p className="mb-1 text-sm text-muted-foreground">配送地址：</p>
              <p className="text-sm">{orderData.shippingAddress}</p>
            </div>
          )}

          {orderData.phone && (
            <div className="mb-4">
              <p className="mb-1 text-sm text-muted-foreground">电话：</p>
              <p className="text-sm">{orderData.phone}</p>
            </div>
          )}

          <div>
            <p className="mb-1 text-sm text-muted-foreground">订单状态：</p>
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              已支付
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/">继续购物</Link>
          </Button>
          <Button asChild>
            <Link to="/">查看我的订单</Link>
          </Button>
        </div>
      </div>
    </>
  )
}

function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex flex-col items-center justify-center py-16">
          <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
          <h1 className="mb-2 text-2xl font-bold">加载中...</h1>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
