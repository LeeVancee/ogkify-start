import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardSidebar } from "@/components/dashboard/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { adminSessionQueryOptions } from "@/lib/admin/query-options";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      adminSessionQueryOptions(),
    );

    if (!session) {
      throw redirect({ to: "/login" });
    }

    if (session.user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh w-full overflow-hidden lg:p-2">
        <div className="flex h-full w-full flex-col items-stretch justify-start overflow-hidden bg-background lg:rounded-xl lg:border">
          <DashboardHeader />
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
