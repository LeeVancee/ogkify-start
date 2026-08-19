import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "border-amber-200/70 bg-amber-50/70 text-amber-700",
    PAID: "border-slate-200 bg-slate-50 text-slate-700",
    COMPLETED: "border-emerald-200/70 bg-emerald-50/70 text-emerald-700",
    CANCELLED: "border-rose-200/70 bg-rose-50/70 text-rose-700",
  } as const;

  return (
    <span
      className={cn(
        "dashboard-status",
        styles[status as keyof typeof styles] ??
          "border-border bg-muted text-muted-foreground",
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
