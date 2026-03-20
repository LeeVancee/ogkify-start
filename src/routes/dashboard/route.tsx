import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type React from "react";
import { EnhancedSidebar } from "@/components/dashboard/layout/enhanced-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/server/getSession";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getSession();
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
          <SidebarTrigger
            variant="outline"
            size="icon"
            className="-ml-1 rounded-xl border-sidebar-border bg-background shadow-sm"
          />
        </header>
        <div className="flex flex-1 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
