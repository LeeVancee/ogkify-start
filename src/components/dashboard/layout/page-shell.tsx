import type React from "react";

import { cn } from "@/lib/utils";

interface DashboardPageShellProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

export function DashboardPageShell({
  title,
  action,
  children,
  aside,
  className,
  hideHeader = false,
}: DashboardPageShellProps) {
  return (
    <div className="min-h-0 w-full flex-1 overflow-auto bg-muted/35">
      <div className="flex min-h-full flex-col gap-5 p-4 sm:p-5 md:p-6 xl:flex-row">
        <main className={cn("flex min-w-0 flex-1 flex-col gap-4", className)}>
          {!hideHeader ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              </div>
              {action ? <div className="shrink-0">{action}</div> : null}
            </div>
          ) : null}
          <div className="min-h-0 flex-1">{children}</div>
        </main>

        {aside ? (
          <aside className="w-full shrink-0 space-y-4 xl:w-80">{aside}</aside>
        ) : null}
      </div>
    </div>
  );
}
