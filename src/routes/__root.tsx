import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { getLocale, I18nProvider } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { getSession } from "@/server/getSession";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: Awaited<ReturnType<typeof getSession>> | undefined;
  locale: Locale;
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
      { rel: "icon", href: "/logo-black.svg" },
    ],
  }),

  beforeLoad: async () => {
    const [session, locale] = await Promise.all([getSession(), getLocale()]);

    return {
      session: session || undefined,
      locale,
    };
  },

  component: () => {
    const { locale } = Route.useRouteContext();

    return (
      <RootDocument locale={locale}>
        <I18nProvider initialLocale={locale}>
          <Outlet />
        </I18nProvider>
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
});

function RootDocument({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <html lang={locale}>
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
