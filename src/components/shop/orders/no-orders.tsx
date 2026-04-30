import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ShoppingBasket } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";

interface NoOrdersProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  icon?: LucideIcon;
}

export function NoOrders({
  title,
  description,
  buttonText,
  buttonHref = "/",
  icon = ShoppingBasket,
}: NoOrdersProps) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={
        <Link to={buttonHref}>
          <Button>{buttonText}</Button>
        </Link>
      }
    />
  );
}
