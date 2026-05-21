import { createFileRoute, Outlet } from "@tanstack/react-router";

import Footer from "@/components/shop/home/footer";
import Header from "@/components/shop/home/header";
import { shopCartQueryOptions } from "@/lib/shop/query-options";
import { getSession } from "@/server/getSession";

export const Route = createFileRoute("/(shop)")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(shopCartQueryOptions());

    return {
      session: await getSession(),
    };
  },
});

function RouteComponent() {
  const { session } = Route.useLoaderData();

  return (
    <div className=" min-h-screen flex flex-col">
      <Header initialSession={session} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
