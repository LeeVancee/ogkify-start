import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { seo } from "@/lib/seo";
import { authOptions } from "@/lib/session-query";
import { getSession } from "@/server/getSession";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: Awaited<ReturnType<typeof getSession>> | undefined;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "OGKIFY",
        description:
          "OGKIFY - Premium fashion shopping platform offering high-quality clothing, accessories and more with convenient shopping experience",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
        //  suppressHydrationWarning: true,
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),

  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(authOptions);

    return {
      session: session || undefined,
    };
  },

  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
