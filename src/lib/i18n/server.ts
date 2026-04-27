import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { defaultLocale, isSupportedLocale, localeCookieName } from "./config";
import type { Locale } from "./config";

export function getLocaleFromCookieHeader(
  cookieHeader: string | null | undefined,
): Locale {
  if (!cookieHeader) return defaultLocale;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const localeCookie = cookies.find((cookie) =>
    cookie.startsWith(`${localeCookieName}=`),
  );

  if (!localeCookie) return defaultLocale;

  const rawValue = localeCookie.slice(localeCookieName.length + 1);
  const value = decodeURIComponent(rawValue);

  return isSupportedLocale(value) ? value : defaultLocale;
}

export const getLocale = createServerFn().handler(async () =>
  getLocaleFromCookieHeader(getRequest().headers.get("cookie")),
);
