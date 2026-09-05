import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

import { CenteredCheckoutState } from "@/components/shop/checkout/centered-checkout-state";
import { useI18n } from "@/lib/i18n";
import {
  shopOrderDetailQueryOptions,
  shopQueryKeys,
} from "@/lib/shop/query-options";
import { getSession } from "@/server/getSession";

// define search params schema
const searchParamsSchema = z.object({
  session_id: z.string().optional(),
  order_id: z.string().optional(),
});

export const Route = createFileRoute("/(shop)/checkout/success")({
  validateSearch: searchParamsSchema,
  beforeLoad: async ({ location }) => {
    if (!(await getSession()))
      throw redirect({ to: "/login", search: { redirect: location.href } });
  },
  loaderDeps: ({ search }) => ({
    orderId: search.order_id,
  }),
  loader: ({ context, deps }) => {
    if (!deps.orderId) {
      return null;
    }

    return context.queryClient.ensureQueryData(
      shopOrderDetailQueryOptions(deps.orderId),
    );
  },
  pendingComponent: PaymentPending,
  component: CheckoutSuccessPage,
});

function CheckoutSuccessContent({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const { t, locale } = useI18n();
  const { data: orderResult } = useSuspenseQuery(
    shopOrderDetailQueryOptions(orderId),
  );

  const orderData = orderResult.order;

  useEffect(() => {
    if (orderData?.paymentStatus !== "PAID") {
      return;
    }

    queryClient.invalidateQueries({ queryKey: shopQueryKeys.cart() });
    queryClient.invalidateQueries({ queryKey: shopQueryKeys.orders.all() });
  }, [orderData?.paymentStatus, queryClient]);

  if (
    orderData &&
    (orderData.paymentStatus === "FAILED" ||
      orderData.paymentStatus === "REFUNDED" ||
      orderData.status === "CANCELLED")
  ) {
    return (
      <CenteredCheckoutState>
        <h1 className="mb-4 text-2xl font-medium">
          {locale === "en"
            ? "This payment is no longer pending"
            : locale === "zh-CN"
              ? "此订单的支付已结束"
              : "此訂單的支付已結束"}
        </h1>
        <Link to="/myorders" className="shop-pill-button">
          {t("shop.userMenu.myOrders")}
        </Link>
      </CenteredCheckoutState>
    );
  }
  if (orderData && orderData.paymentStatus !== "PAID") {
    return (
      <CenteredCheckoutState>
        <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
        <h1 className="mb-2 text-2xl font-bold">
          {locale === "en"
            ? "Confirming your payment…"
            : locale === "zh-CN"
              ? "正在确认付款…"
              : "正在確認付款…"}
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          {locale === "en"
            ? "This page will update once your payment is confirmed."
            : locale === "zh-CN"
              ? "确认付款后，此页面会自动更新。"
              : "確認付款後，此頁面會自動更新。"}
        </p>
        <Link
          to="/myorders"
          className="inline-flex items-center justify-center gap-2 h-10 px-6 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors shadow-sm"
        >
          {t("shop.userMenu.myOrders")}
        </Link>
      </CenteredCheckoutState>
    );
  }

  if (!orderResult.success || !orderData) {
    return (
      <CenteredCheckoutState>
        <h1 className="mb-4 text-2xl font-bold">
          {t("shop.checkoutPage.unableToLoad")}
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          {orderResult.error
            ? orderResult.error
            : "Unable to get order details."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {t("common.actions.home")}
        </Link>
      </CenteredCheckoutState>
    );
  }

  return (
    <CenteredCheckoutState>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <CheckCircle className="mb-4 h-16 w-16 text-foreground" />
        <h1 className="mb-2 text-2xl font-bold">
          {locale === "en"
            ? "Thank you. It’s yours."
            : locale === "zh-CN"
              ? "已收到你的订单。"
              : "已收到你的訂單。"}
        </h1>
        <p className="mb-6 max-w-xl text-center text-muted-foreground">
          {locale === "en"
            ? "Your payment is confirmed. You can follow your order in your account."
            : locale === "zh-CN"
              ? "付款已确认，你可以在账户中查看订单进度。"
              : "付款已確認，你可以在帳戶中查看訂單進度。"}
        </p>

        <div className="mx-auto mb-8 w-full max-w-md rounded-lg border bg-card p-6 text-left">
          <div className="mb-4">
            <p className="mb-1 text-sm text-muted-foreground">
              {t("shop.checkoutPage.orderNumber", { orderNumber: "" })}
            </p>
            <p className="text-xl font-semibold">{orderData.orderNumber}</p>
          </div>

          {orderData.shippingAddress && (
            <div className="mb-4">
              <p className="mb-1 text-sm text-muted-foreground">
                {t("shop.checkoutPage.shippingAddress")}
              </p>
              <p className="text-sm">{orderData.shippingAddress}</p>
            </div>
          )}

          {orderData.phone && (
            <div className="mb-4">
              <p className="mb-1 text-sm text-muted-foreground">
                {locale === "en" ? "Phone" : "電話"}
              </p>
              <p className="text-sm">{orderData.phone}</p>
            </div>
          )}

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              {locale === "en" ? "Payment status" : "付款狀態"}
            </p>
            <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              {locale === "en" ? "Paid" : "已付款"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 h-10 px-6 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors shadow-sm"
          >
            {t("common.actions.continueShopping")}
          </Link>
          <Link
            to="/myorders"
            className="inline-flex items-center justify-center gap-2 h-10 px-6 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors shadow-sm"
          >
            {t("shop.userMenu.myOrders")}
          </Link>
        </div>
      </div>
    </CenteredCheckoutState>
  );
}

function CheckoutSuccessPage() {
  const { order_id } = Route.useSearch();
  const { t, locale } = useI18n();

  if (!order_id) {
    return (
      <CenteredCheckoutState>
        <h1 className="mb-4 text-2xl font-bold">
          {t("shop.checkoutPage.unavailable")}
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          {locale === "en"
            ? "Open your orders to find your latest purchase."
            : locale === "zh-CN"
              ? "你可以在我的订单中查看最近的购买记录。"
              : "你可以在我的訂單中查看最近的購買紀錄。"}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {t("common.actions.home")}
        </Link>
      </CenteredCheckoutState>
    );
  }

  return <CheckoutSuccessContent orderId={order_id} />;
}

function PaymentPending() {
  const { locale } = useI18n();
  return (
    <CenteredCheckoutState>
      <Loader2 className="mb-5 size-8 animate-spin" />
      <h1 className="text-2xl font-medium">
        {locale === "en"
          ? "Confirming your payment…"
          : locale === "zh-CN"
            ? "正在确认付款…"
            : "正在確認付款…"}
      </h1>
    </CenteredCheckoutState>
  );
}
