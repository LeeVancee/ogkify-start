import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardPanelProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DashboardPanel({
  title,
  action,
  children,
  className,
  contentClassName,
}: DashboardPanelProps) {
  return (
    <section
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg border bg-card p-4",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3">
          {title ? <h2 className="text-sm font-medium">{title}</h2> : <div />}
          {action}
        </div>
      )}
      <div className={cn("min-w-0 flex-1", contentClassName)}>{children}</div>
    </section>
  );
}

interface DashboardMetricCardProps {
  label: string;
  value: ReactNode;
  description: string;
  icon: LucideIcon;
  trend?: string;
  trendTone?: "up" | "down" | "neutral";
}

export function DashboardMetricCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  trendTone = "neutral",
}: DashboardMetricCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      </div>
      <div className="flex min-h-[70px] items-center justify-between gap-3 rounded-md border bg-card p-3">
        <div className="min-w-0">
          <div className="truncate text-2xl font-semibold tracking-tight">
            {value}
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {description}
          </p>
        </div>
        {trend && (
          <span
            className={cn(
              "shrink-0 text-sm font-medium",
              trendTone === "up" && "text-emerald-600 dark:text-emerald-400",
              trendTone === "down" && "text-destructive",
              trendTone === "neutral" && "text-muted-foreground",
            )}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
