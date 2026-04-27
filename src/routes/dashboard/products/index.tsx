import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ProductsView } from "@/components/dashboard/product/products-view";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/products/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardPageHeader
        title="Products"
        description="Review, search, and maintain the products available in the storefront."
        action={
          <Link to="/dashboard/products/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        }
      />
      <ProductsView />
    </div>
  );
}
