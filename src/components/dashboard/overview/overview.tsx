import { Link } from "@tanstack/react-router";
import { Box, Grid3X3, Palette, Ruler, ShoppingCart, Star } from "lucide-react";

import { DashboardContextPanel } from "@/components/dashboard/layout/context-panel";
import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { useI18n } from "@/lib/i18n";
import type { DashboardOverviewData } from "@/lib/admin/types";
import { formatPrice } from "@/lib/utils";

interface DashboardOverviewProps {
  data: DashboardOverviewData;
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { t } = useI18n();
  const cards = [
    { label: t("dashboard.overview.products"), value: data.productsCount, icon: Box },
    {
      label: t("dashboard.overview.categories"),
      value: data.categoriesCount,
      icon: Grid3X3,
    },
    { label: t("dashboard.overview.colors"), value: data.colorsCount, icon: Palette },
    { label: t("dashboard.overview.sizes"), value: data.sizesCount, icon: Ruler },
    {
      label: t("dashboard.overview.pendingOrders"),
      value: data.pendingOrders,
      icon: ShoppingCart,
    },
    { label: t("dashboard.overview.featured"), value: data.featuredProducts, icon: Star },
  ];

  return (
    <DashboardPageShell
      title={t("dashboard.nav.dashboard")}
      description={t("dashboard.pages.dashboardDescription")}
      aside={
        <DashboardContextPanel
          revenue={data.totalRevenue}
          pendingOrders={data.pendingOrders}
          productsCount={data.productsCount}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("dashboard.overview.admin")}
                </span>
              </div>
              <div className="text-3xl font-semibold">{card.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-xl border bg-card">
          <div className="border-b p-4">
            <h2 className="text-sm font-semibold">
              {t("dashboard.overview.recentOrders")}
            </h2>
          </div>
          <div className="divide-y">
            {data.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {order.orderNumber}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.customerName} · {order.status}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {formatPrice(order.amount)}
                </div>
              </div>
            ))}
            {data.recentOrders.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                {t("dashboard.overview.noOrders")}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="border-b p-4">
            <h2 className="text-sm font-semibold">
              {t("dashboard.overview.latestProducts")}
            </h2>
          </div>
          <div className="divide-y">
            {data.latestProducts.map((product) => (
              <Link
                key={product.id}
                to="/dashboard/products/$id"
                params={{ id: product.id }}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="size-10 overflow-hidden rounded-md bg-muted">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {product.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.categoryName}
                  </div>
                </div>
              </Link>
            ))}
            {data.latestProducts.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                {t("dashboard.overview.noProducts")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
