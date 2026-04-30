import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "default" | "destructive";
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  tone = "default",
}: EmptyStateProps) {
  const toneClasses =
    tone === "destructive"
      ? "border-destructive/30 bg-destructive/5 text-destructive"
      : "border-border bg-muted/20 text-muted-foreground";

  return (
    <div
      className={`flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center ${toneClasses}`}
    >
      <div className="flex h-10 w-10 items-center justify-center opacity-70">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
