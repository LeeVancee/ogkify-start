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
  beforeLoad: async () => {
    const session = await getSession();

    // 检查用户是否已登录
    if (!session) {
      throw redirect({ to: "/login" });
    }

    // 检查用户是否为管理员
    if (session.user.role !== "admin") {
      throw redirect({ to: "/" });
    }
    console.log(session);
    return { session };
  },
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
