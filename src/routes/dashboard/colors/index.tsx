import { createFileRoute } from "@tanstack/react-router";

import { ColorList } from "@/components/dashboard/color/color-list";
import { SpinnerLoading } from "@/components/shared/flexible-loading";

export const Route = createFileRoute("/dashboard/colors/")({
  component: RouteComponent,
  pendingComponent: () => <SpinnerLoading />,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Colors</h1>
      </div>
      <div className="grid gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Colors List</h2>
          <ColorList />
        </div>
      </div>
    </div>
  );
}
