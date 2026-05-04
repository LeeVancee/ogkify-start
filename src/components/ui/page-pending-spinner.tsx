import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface PagePendingSpinnerProps {
  className?: string;
  label?: string;
}

export function PagePendingSpinner({
  className,
  label = "Loading",
}: PagePendingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex min-h-80 w-full flex-1 items-center justify-center p-6",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-5 shadow-sm">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted">
          <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
        </div>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
