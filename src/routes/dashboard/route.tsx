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
      <div className="h-svh w-full overflow-hidden bg-[color:var(--color-sidebar)] p-1.5 lg:p-3">
        <div className="flex h-full w-full flex-col items-stretch justify-start overflow-hidden rounded-[calc(var(--radius)*1.75)] border border-border/70 bg-background shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <DashboardHeader />
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
