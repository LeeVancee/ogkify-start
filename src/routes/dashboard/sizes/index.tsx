import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SizeList } from "@/components/dashboard/size/size-list";
import { SpinnerLoading } from "@/components/shared/flexible-loading";

export const Route = createFileRoute("/dashboard/sizes/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardPageHeader
        title="Sizes"
        description="Manage size labels and values used across product variants."
      />
      <SizeList />
    </div>
  );
}
