import { ShoppingBasket } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";

interface NoOrdersProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  icon?: ReactNode;
}

export function NoOrders({
  title,
  description,
  buttonText,
  buttonHref = "/",
  icon = <ShoppingBasket className="h-10 w-10" />,
}: NoOrdersProps) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      actionText={buttonText}
      actionHref={buttonHref}
    />
  );
}

export function EmptyCart() {
  return (
    <NoOrders
      title="Your cart is empty"
      description="Browse our products and add your favorite items to cart"
      buttonText="Continue Shopping"
    />
  );
}
