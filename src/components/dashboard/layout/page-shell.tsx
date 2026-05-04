import type React from "react";

import { cn } from "@/lib/utils";

interface DashboardPageShellProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export function DashboardPageShell({
  title,
  description,
  action,
  children,
  aside,
  className,
}: DashboardPageShellProps) {
  return (
    <div className="min-h-0 w-full flex-1 overflow-auto">
      <div className="flex min-h-full flex-col gap-4 p-3 sm:p-4 md:p-5 xl:flex-row">
        <main className={cn("flex min-w-0 flex-1 flex-col gap-4", className)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
          <div className="min-h-0 flex-1">{children}</div>
        </main>

        {aside ? (
          <aside className="w-full shrink-0 space-y-4 xl:w-80">{aside}</aside>
        ) : null}
      </div>
    </div>
  );
}
