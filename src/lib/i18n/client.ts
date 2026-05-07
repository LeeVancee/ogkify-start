import type { Locale } from "./config";
import { defaultLocale, isSupportedLocale, localeCookieName } from "./config";

export function getClientLocale(): Locale {
  if (typeof document === "undefined") {
    return defaultLocale;
  }

  const cookieLocale = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${localeCookieName}=`));

  if (cookieLocale) {
    const value = decodeURIComponent(
      cookieLocale.slice(localeCookieName.length + 1),
    );

    if (isSupportedLocale(value)) {
      return value;
    }
  }

  return isSupportedLocale(document.documentElement.lang)
    ? document.documentElement.lang
    : defaultLocale;
}

export function persistLocale(locale: Locale) {
  if (typeof document !== "undefined") {
    document.cookie = `${localeCookieName}=${encodeURIComponent(
      locale,
    )}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = locale;
  }
}
