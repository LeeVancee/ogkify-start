import {
  defaultLocale,
  isSupportedLocale,
  localeCookieName,
  localeStorageKey,
} from "./config";
import type { Locale } from "./config";

export function persistLocale(locale: Locale) {
  if (typeof document !== "undefined") {
    document.cookie = `${localeCookieName}=${encodeURIComponent(
      locale,
    )}; path=/; max-age=31536000; samesite=lax`;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(localeStorageKey, locale);
  }
}

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  const storedLocale = window.localStorage.getItem(localeStorageKey);
  return isSupportedLocale(storedLocale) ? storedLocale : defaultLocale;
}
