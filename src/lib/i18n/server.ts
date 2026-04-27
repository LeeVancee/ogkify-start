import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { defaultLocale, isSupportedLocale, localeCookieName } from "./config";
import type { Locale } from "./config";

export function getLocaleFromRequestHeaders(headers: Headers): Locale {
  return resolveLocaleFromHeaders(
    headers.get("cookie"),
    headers.get("accept-language"),
  );
}

export function resolveLocaleFromHeaders(
  cookieHeader: string | null | undefined,
  acceptLanguageHeader: string | null | undefined,
): Locale {
  const cookieLocale = getLocaleFromCookieHeader(cookieHeader);

  if (cookieLocale) {
    return cookieLocale;
  }

  return getLocaleFromAcceptLanguageHeader(acceptLanguageHeader);
}

export function getLocaleFromCookieHeader(
  cookieHeader: string | null | undefined,
): Locale | undefined {
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const localeCookie = cookies.find((cookie) =>
    cookie.startsWith(`${localeCookieName}=`),
  );

  if (!localeCookie) return undefined;

  const rawValue = localeCookie.slice(localeCookieName.length + 1);
  const value = decodeURIComponent(rawValue);

  return isSupportedLocale(value) ? value : undefined;
}

export function getLocaleFromAcceptLanguageHeader(
  acceptLanguageHeader: string | null | undefined,
): Locale {
  if (!acceptLanguageHeader) return defaultLocale;

  const languageTags = acceptLanguageHeader
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const languageTag of languageTags) {
    if (languageTag === "zh-tw" || languageTag === "zh-hk") return "zh-TW";
    if (languageTag === "zh-mo") return "zh-TW";
    if (languageTag === "zh-cn" || languageTag === "zh-sg") return "zh-CN";
    if (languageTag.startsWith("zh-hant")) return "zh-TW";
    if (languageTag.startsWith("zh-hans")) return "zh-CN";
    if (languageTag === "zh") return "zh-CN";
    if (languageTag.startsWith("en")) return "en";
  }

  return defaultLocale;
}

export const getLocale = createServerFn().handler(async () =>
  getLocaleFromRequestHeaders(getRequest().headers),
);
