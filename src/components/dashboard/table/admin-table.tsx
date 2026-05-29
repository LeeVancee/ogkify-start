import type React from "react";

import { cn } from "@/lib/utils";

interface AdminTableProps {
  columns: string[];
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  minWidth?: string;
}

export function AdminTable({
  columns,
  children,
  empty = false,
  emptyMessage = "No records found.",
  minWidth = "min-w-[760px]",
}: AdminTableProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[inherit] bg-card">
      <div className="min-h-0 w-full flex-1 overflow-auto">
        <table className={cn("w-full border-collapse text-sm", minWidth)}>
          <thead className="bg-muted/35 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 text-left font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">{empty ? null : children}</tbody>
        </table>
      </div>
      {empty ? (
        <div className="flex min-h-56 items-center justify-center p-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : null}
    </div>
  );
}

export function AdminTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-5 py-4 align-middle", className)}>{children}</td>
  );
}

export function AdminTableRow({ children }: { children: React.ReactNode }) {
  return <tr className="bg-card transition-colors hover:bg-muted/20">{children}</tr>;
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "success" &&
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        tone === "warning" &&
          "bg-amber-500/10 text-amber-700 dark:text-amber-300",
        tone === "danger" && "bg-destructive/10 text-destructive",
      )}
    >
      {children}
    </span>
  );
}
