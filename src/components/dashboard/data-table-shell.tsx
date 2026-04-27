import type { ReactNode } from "react";

export function DataTableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
}
