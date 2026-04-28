import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

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
    <div className="min-h-svh bg-white px-6 text-slate-950">
      <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center py-10">
        <div className="mb-10 text-center">
          <Link
            to="/"
            className="inline-flex text-2xl font-black tracking-[0.18em] transition-opacity hover:opacity-70"
          >
            OGKIFY
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
