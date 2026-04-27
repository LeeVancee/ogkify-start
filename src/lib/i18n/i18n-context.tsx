import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { persistLocale } from "./client";
import { defaultLocale, isSupportedLocale } from "./config";
import type { Locale } from "./config";
import { messages } from "./messages";
import { translate } from "./translate";
import type { TranslationValues } from "./translate";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: TranslationValues) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  initialLocale?: Locale;
  children: React.ReactNode;
}

export function I18nProvider({
  initialLocale = defaultLocale,
  children,
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    isSupportedLocale(initialLocale) ? initialLocale : defaultLocale,
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    persistLocale(nextLocale);
  }, []);

  const t = useCallback(
    (key: string, values: TranslationValues = {}) =>
      translate(messages[locale], key, values),
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    return {
      locale: defaultLocale,
      setLocale: persistLocale,
      t: (key: string, values: TranslationValues = {}) =>
        translate(messages[defaultLocale], key, values),
    };
  }

  return context;
}
