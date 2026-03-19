import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/shop/home/footer";
import Header from "@/components/shop/home/header";
import { getUserCart } from "@/server/cart";
import { getSession } from "@/server/getSession";

export const Route = createFileRoute("/(shop)")({
  component: RouteComponent,
  loader: async () => {
    const cartData = await getUserCart();
    const session = await getSession();

    return {
      initialCartData: cartData,
      initialSession: session || undefined,
    };
  },
});

function RouteComponent() {
  const { initialCartData, initialSession } = Route.useLoaderData();

  return (
    <div className=" min-h-screen flex flex-col">
      <Header
        initialCartData={initialCartData}
        initialSession={initialSession}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
