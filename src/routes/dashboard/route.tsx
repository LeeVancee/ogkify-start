import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type React from "react";
import { EnhancedSidebar } from "@/components/dashboard/enhanced-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/server/getSession.server";
export const Route = createFileRoute("/dashboard")({
  loader: async () => {
    const session = await getSession();

    // 检查用户是否已登录
    if (!session) {
      throw redirect({ to: "/login" });
    }
    if (session.user.role !== "admin") {
      throw redirect({ to: "/" });
    }

    return { session };
  },

  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 15,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <EnhancedSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
