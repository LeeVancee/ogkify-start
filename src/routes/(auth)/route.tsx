import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-svh bg-background px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-sm">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
