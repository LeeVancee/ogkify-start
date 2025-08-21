import type { LinkProps } from "@tanstack/react-router";
import { Link, useLocation } from "@tanstack/react-router";
import type React from "react";
import { cn } from "@/lib/utils";

interface ActiveLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

export function ActiveLink({
  children,
  className,
  activeClassName = "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
  exact = false,
  ...props
}: ActiveLinkProps) {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === props.href!
    : location.pathname.startsWith(props.href!.toString());

  return (
    <Link className={cn(className, isActive && activeClassName)} {...props}>
      {children}
    </Link>
  );
}
