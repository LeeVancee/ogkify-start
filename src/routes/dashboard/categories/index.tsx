import { createFileRoute } from "@tanstack/react-router";

import { CategoryList } from "@/components/dashboard/category/category-list";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SpinnerLoading } from "@/components/shared/flexible-loading";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardPageHeader
        title="Categories"
        description="Organize the catalog groups customers use to browse products."
      />
      <CategoryList />
    </div>
  );
}
