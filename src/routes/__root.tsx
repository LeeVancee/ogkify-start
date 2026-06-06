import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { NotFound } from "@/components/NotFound";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getClientLocale, I18nProvider } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { seo } from "@/lib/seo";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
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
    return {
      locale:
        typeof document === "undefined" ? await getLocale() : getClientLocale(),
    };
  },

  component: () => {
    const { locale } = Route.useRouteContext();

    return (
      <RootDocument locale={locale}>
        <I18nProvider initialLocale={locale}>
          <ThemeProvider>
            <Outlet />
            <Toaster />
          </ThemeProvider>
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
