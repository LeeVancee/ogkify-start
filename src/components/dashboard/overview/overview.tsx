import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Box,
  CalendarDays,
  Download,
  Grid3X3,
  Palette,
  Ruler,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardOverviewData } from "@/lib/admin/types";
import { useI18n } from "@/lib/i18n";
import { cn, formatPrice } from "@/lib/utils";

import { RevenueStat } from "./revenue-stat";
import { SignalRow } from "./signal-row";
import { StatusBadge } from "./status-badge";

interface DashboardOverviewProps {
  data: DashboardOverviewData;
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { t } = useI18n();
  const completionRate =
    data.completedOrders + data.pendingOrders === 0
      ? 0
      : Math.round(
          (data.completedOrders / (data.completedOrders + data.pendingOrders)) *
            100,
        );

  const summaryCards = [
    {
      label: t("dashboard.overview.products"),
      value: data.productsCount,
      detail: `${data.featuredProducts} featured`,
      icon: Box,
    },
    {
      label: t("dashboard.overview.categories"),
      value: data.categoriesCount,
      detail: `${data.colorsCount} colors`,
      icon: Grid3X3,
    },
    {
      label: t("dashboard.overview.sizes"),
      value: data.sizesCount,
      detail: `${data.pendingOrders} pending`,
      icon: Ruler,
    },
    {
      label: t("dashboard.overview.featured"),
      value: data.featuredProducts,
      detail: `${data.completedOrders} completed`,
      icon: Star,
    },
  ];

  const catalogHealth = [
    {
      label: t("dashboard.overview.products"),
      value: data.productsCount,
      accent: "bg-slate-900",
    },
    {
      label: t("dashboard.overview.categories"),
      value: data.categoriesCount,
      accent: "bg-slate-500",
    },
    {
      label: t("dashboard.overview.colors"),
      value: data.colorsCount,
      accent: "bg-slate-400",
    },
    {
      label: t("dashboard.overview.sizes"),
      value: data.sizesCount,
      accent: "bg-slate-300",
    },
  ];

  const maxCatalogValue = Math.max(
    ...catalogHealth.map((item) => item.value),
    1,
  );

  return renderDashboardOverview({
    t,
    data,
    completionRate,
    summaryCards,
    catalogHealth,
    maxCatalogValue,
  });
}

function renderDashboardOverview({
  t,
  data,
  completionRate,
  summaryCards,
  catalogHealth,
  maxCatalogValue,
}: {
  t: ReturnType<typeof useI18n>["t"];
  data: DashboardOverviewData;
  completionRate: number;
  summaryCards: Array<{
    label: string;
    value: number;
    detail: string;
    icon: typeof Box;
  }>;
  catalogHealth: Array<{ label: string; value: number; accent: string }>;
  maxCatalogValue: number;
}) {
  return (
    <DashboardPageShell
      title={t("dashboard.nav.dashboard")}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-10 gap-2 bg-white">
            <CalendarDays className="size-4" />
            2026-05-01 - 2026-05-29
          </Button>
          <Button className="h-10 gap-2">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <section className="grid gap-5 xl:grid-cols-12">
          <Card className="relative overflow-hidden border-border/70 bg-[linear-gradient(135deg,#0f172a_0%,#111827_55%,#1e293b_100%)] text-white xl:col-span-7">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_58%)]" />
            <div className="absolute -right-14 -top-14 size-40 rounded-full border border-white/10" />
            <div className="absolute bottom-4 right-6 size-24 rounded-full bg-white/5 blur-2xl" />
            <CardHeader className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                    <Sparkles className="size-3" />
                    Admin workspace
                  </Badge>
                  <CardTitle className="text-3xl font-semibold tracking-tight text-white">
                    Store performance snapshot
                  </CardTitle>
                  <CardDescription className="max-w-xl text-white/70">
                    Keep products, orders, and merchandising in one clean
                    dashboard flow.
                  </CardDescription>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Completion
                  </div>
                  <div className="mt-2 text-3xl font-semibold">
                    {completionRate}%
                  </div>
                  <div className="mt-1 text-xs text-white/65">
                    {data.completedOrders} completed orders
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative pt-2">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <div className="text-sm text-white/65">Total revenue</div>
                  <div className="mt-2 text-4xl font-semibold tracking-tight">
                    {formatPrice(data.totalRevenue)}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-emerald-300">
                    <TrendingUp className="size-4" />
                    {data.pendingOrders === 0
                      ? "All orders are moving cleanly."
                      : `${data.pendingOrders} orders still need attention.`}
                  </div>
                </div>
                <div className="grid min-w-[240px] grid-cols-2 gap-3">
                  <HeroMiniStat
                    label={t("dashboard.overview.pendingOrders")}
                    value={data.pendingOrders}
                  />
                  <HeroMiniStat
                    label="Completed"
                    value={data.completedOrders}
                  />
                  <HeroMiniStat
                    label={t("dashboard.overview.featured")}
                    value={data.featuredProducts}
                  />
                  <HeroMiniStat
                    label={t("dashboard.overview.categories")}
                    value={data.categoriesCount}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2 xl:col-span-5">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="border-border/70 bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          {card.label}
                        </div>
                        <div className="text-3xl font-semibold tracking-tight">
                          {card.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {card.detail}
                        </div>
                      </div>
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-muted">
                        <Icon className="size-5 text-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-12">
          <Card className="border-border/70 xl:col-span-7">
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>
                A compact operations view built from your live catalog and order
                data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <RevenueStat
                  label="Revenue"
                  value={formatPrice(data.totalRevenue)}
                  tone="up"
                />
                <RevenueStat
                  label="Completed"
                  value={String(data.completedOrders)}
                  tone="neutral"
                />
                <RevenueStat
                  label="Pending"
                  value={String(data.pendingOrders)}
                  tone={data.pendingOrders > 0 ? "warn" : "up"}
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Catalog health</div>
                    <div className="text-xs text-muted-foreground">
                      Relative size across your catalog dimensions
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    <Palette className="size-3" />
                    Live sync
                  </Badge>
                </div>
                <div className="space-y-4">
                  {catalogHealth.map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="font-medium text-foreground">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.accent,
                          )}
                          style={{
                            width: `${Math.max(
                              12,
                              Math.round((item.value / maxCatalogValue) * 100),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 xl:col-span-5">
            <CardHeader>
              <CardTitle>{t("dashboard.overview.latestProducts")}</CardTitle>
              <CardDescription>
                Newly added products ready for editing and merchandising.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.latestProducts.map((product) => (
                <Link
                  key={product.id}
                  to="/dashboard/products/$id"
                  params={{ id: product.id }}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white p-3 transition-colors hover:bg-muted/20"
                >
                  <div className="size-14 overflow-hidden rounded-xl border border-border/60 bg-muted/50">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
                        {product.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{product.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {product.categoryName}
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
              {data.latestProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                  {t("dashboard.overview.noProducts")}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5 xl:grid-cols-12">
          <Card className="border-border/70 xl:col-span-7">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{t("dashboard.overview.recentOrders")}</CardTitle>
                  <CardDescription>
                    The latest customer activity from your admin workspace.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-white">
                  {data.recentOrders.length} records
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-2xl border border-border/70">
                <Table>
                  <TableHeader className="bg-muted/35">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-4">Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="bg-white hover:bg-muted/20"
                      >
                        <TableCell className="px-4 py-3.5">
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarImage
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.customerName)}&background=f3f4f6&color=111827`}
                              />
                              <AvatarFallback>
                                {order.customerName.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="truncate">{order.customerName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 font-medium">
                          {formatPrice(order.amount)}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <StatusBadge status={order.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {data.recentOrders.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">
                    {t("dashboard.overview.noOrders")}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 xl:col-span-5">
            <CardHeader>
              <CardTitle>Workspace signals</CardTitle>
              <CardDescription>
                A quick operational read across products and orders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SignalRow
                label={t("dashboard.overview.pendingOrders")}
                value={`${data.pendingOrders} open`}
                helper="Needs manual follow-up"
              />
              <SignalRow
                label="Completed orders"
                value={`${data.completedOrders} done`}
                helper="Successfully processed"
              />
              <SignalRow
                label={t("dashboard.overview.featured")}
                value={`${data.featuredProducts} merchandised`}
                helper="Highlighted on storefront"
              />
              <SignalRow
                label={t("dashboard.overview.categories")}
                value={`${data.categoriesCount} groups`}
                helper="Catalog browsing structure"
              />
            </CardContent>
            <CardFooter className="justify-between bg-muted/25">
              <div className="text-sm text-muted-foreground">
                Keep your admin area focused and scannable.
              </div>
              <Button variant="outline" size="sm" className="bg-white">
                Review
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </DashboardPageShell>
  );
}

function HeroMiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

const overviewDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string) {
  return overviewDateFormatter.format(new Date(value));
}
