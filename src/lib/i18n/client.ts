import type { Locale } from "./config";
import { localeCookieName } from "./config";

export function persistLocale(locale: Locale) {
  if (typeof document !== "undefined") {
    document.cookie = `${localeCookieName}=${encodeURIComponent(
      locale,
    )}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = locale;
  }
}
