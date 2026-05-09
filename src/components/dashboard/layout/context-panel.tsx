import {
  Archive,
  ChartNoAxesCombined,
  Clock,
  PackageCheck,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

interface DashboardContextPanelProps {
  revenue?: number;
  pendingOrders?: number;
  productsCount?: number;
  latestLabel?: string;
}

export function DashboardContextPanel({
  revenue = 0,
  pendingOrders = 0,
  productsCount = 0,
  latestLabel,
}: DashboardContextPanelProps) {
  const { t } = useI18n();
  const items = [
    {
      label: t("dashboard.overview.revenue"),
      value: formatPrice(revenue),
      icon: ChartNoAxesCombined,
    },
    {
      label: t("dashboard.overview.pending"),
      value: String(pendingOrders),
      icon: Clock,
    },
    {
      label: t("dashboard.overview.products"),
      value: String(productsCount),
      icon: Archive,
    },
    {
      label: t("dashboard.overview.status"),
      value: latestLabel ?? t("dashboard.overview.synced"),
      icon: PackageCheck,
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          {t("dashboard.overview.workspace")}
        </h2>
        <span className="text-xs text-muted-foreground">
          {t("dashboard.overview.live")}
        </span>
      </div>
      <div className="grid gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border bg-background p-3"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{item.value}</div>
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
