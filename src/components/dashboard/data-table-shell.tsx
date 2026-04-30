import type { ReactNode } from "react";

export function DataTableShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
}
