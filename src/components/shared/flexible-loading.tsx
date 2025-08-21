import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface SpinnerLoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function SpinnerLoading({
  size = "md",
  className = "",
  text,
}: SpinnerLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`flex min-h-[400px] flex-1 items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2
          className={`${sizeClasses[size]} animate-spin text-muted-foreground`}
        />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
}

interface CardGridLoadingProps {
  count?: number;
  cols?: 1 | 2 | 3 | 4;
  showButtons?: boolean;
  className?: string;
}

export function CardGridLoading({
  count = 8,
  cols = 4,
  showButtons = true,
  className = "",
}: CardGridLoadingProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid gap-6 ${gridClasses[cols]} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-6 w-1/4" />
          </div>
          {showButtons && (
            <div className="flex items-center justify-between">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface FormLoadingProps {
  fields?: number;
  hasSubmitButton?: boolean;
  className?: string;
}

export function FormLoading({
  fields = 3,
  hasSubmitButton = true,
  className = "space-y-4",
}: FormLoadingProps) {
  return (
    <div className={className}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      {hasSubmitButton && <Skeleton className="h-10 w-full" />}
    </div>
  );
}

interface ListLoadingProps {
  count?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  className?: string;
}

export function ListLoading({
  count = 5,
  showAvatar = false,
  showActions = false,
  className = "",
}: ListLoadingProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
