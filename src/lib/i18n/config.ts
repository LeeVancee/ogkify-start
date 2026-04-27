export const supportedLocales = ["en", "zh-TW", "zh-CN"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

export const localeCookieName = "ogkify-locale";
export const localeStorageKey = "ogkify-locale";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  "zh-TW": "繁體中文",
  "zh-CN": "简体中文",
};

export function isSupportedLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && supportedLocales.includes(value as Locale)
  );
}
