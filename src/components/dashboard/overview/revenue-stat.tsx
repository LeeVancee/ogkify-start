import { cn } from "@/lib/utils";

export function RevenueStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "up" | "warn" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-white p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div
        className={cn(
          "mt-2 text-xs font-medium",
          tone === "up" && "text-emerald-600",
          tone === "warn" && "text-amber-600",
          tone === "neutral" && "text-muted-foreground",
        )}
      >
        {tone === "up" ? "Healthy" : tone === "warn" ? "Watch list" : "Stable"}
      </div>
    </div>
  );
}
