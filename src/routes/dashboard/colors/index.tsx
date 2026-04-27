import { createFileRoute } from "@tanstack/react-router";

import { ColorList } from "@/components/dashboard/color/color-list";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SpinnerLoading } from "@/components/shared/flexible-loading";

export const Route = createFileRoute("/dashboard/colors/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardPageHeader
        title="Colors"
        description="Maintain color options that can be assigned to products."
      />
      <ColorList />
    </div>
  );
}
