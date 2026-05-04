import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardSidebar } from "@/components/dashboard/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/dashboard")({
 beforeLoad: ({ context }) => {
  if(!context.session){
    throw redirect({ to: "/login" });
  }
    if (context.session.user.role !== "admin") {
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
