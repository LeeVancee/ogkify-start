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
    <div className="min-h-0 w-full flex-1 overflow-auto bg-muted/25">
      <div className="flex min-h-full flex-col gap-6 p-4 sm:p-6 md:p-7 xl:flex-row">
        <main className={cn("flex min-w-0 flex-1 flex-col gap-5", className)}>
          {!hideHeader ? (
            <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-[-0.03em]">
                  {title}
                </h1>
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
