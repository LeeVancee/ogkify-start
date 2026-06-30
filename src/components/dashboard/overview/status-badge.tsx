import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    PAID: "border-sky-200 bg-sky-50 text-sky-700",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        styles[status as keyof typeof styles] ??
          "border-border bg-muted text-muted-foreground",
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
