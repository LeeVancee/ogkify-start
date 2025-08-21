import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionText: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  const content = (
    <div
      className={`flex min-h-[300px] flex-col items-center justify-center rounded-lg border bg-card p-10 text-center animate-in fade-in-50 ${className}`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">
        {actionHref ? (
          <Link to={actionHref}>
            <Button>{actionText}</Button>
          </Link>
        ) : (
          <Button onClick={onAction}>{actionText}</Button>
        )}
      </div>
    </div>
  );

  return content;
}
