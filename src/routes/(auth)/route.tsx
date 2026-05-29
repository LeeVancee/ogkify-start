import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getSession } from "@/server/getSession";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: async () => {
    const session = await getSession();

    if (session) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-svh bg-white px-6 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-[470px] rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="px-8 py-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
