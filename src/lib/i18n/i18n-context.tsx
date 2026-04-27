import i18next from "i18next";
import type { TFunction } from "i18next";
import { useCallback, useMemo } from "react";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from "react-i18next";

import { persistLocale } from "./client";
import { defaultLocale, isSupportedLocale } from "./config";
import type { Locale } from "./config";
import { messages } from "./messages";

type TranslationValues = Record<string, string | number>;

interface I18nProviderProps {
  initialLocale?: Locale;
  children: React.ReactNode;
}

export function I18nProvider({
  initialLocale = defaultLocale,
  children,
}: I18nProviderProps) {
  const locale = isSupportedLocale(initialLocale)
    ? initialLocale
    : defaultLocale;

  const i18n = useMemo(() => {
    const instance = i18next.createInstance();

    instance.use(initReactI18next).init({
      fallbackLng: defaultLocale,
      initAsync: false,
      interpolation: {
        escapeValue: false,
      },
      lng: locale,
      resources: {
        en: { translation: messages.en },
        "zh-TW": { translation: messages["zh-TW"] },
        "zh-CN": { translation: messages["zh-CN"] },
      },
    });

    return instance;
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export function useI18n() {
  const { i18n, t: translate } = useTranslation();
  const locale = isSupportedLocale(i18n.language)
    ? i18n.language
    : defaultLocale;

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      persistLocale(nextLocale);
      i18n.changeLanguage(nextLocale);
    },
    [i18n],
  );

  const t = useCallback(
    (key: string, values: TranslationValues = {}) =>
      normalizeTranslation(translate, key, values),
    [translate],
  );

  return {
    locale,
    setLocale,
    t,
  };
}

function normalizeTranslation(
  translate: TFunction,
  key: string,
  values: TranslationValues,
): string {
  const result = translate(key, values);
  return typeof result === "string" ? result : key;
}
