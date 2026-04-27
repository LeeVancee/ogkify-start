import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeLabels, supportedLocales, useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("common.language.label")}
            title={t("common.language.label")}
          >
            <Languages className="h-5 w-5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40">
        {supportedLocales.map((supportedLocale) => (
          <DropdownMenuItem
            key={supportedLocale}
            onClick={() => setLocale(supportedLocale)}
            className={supportedLocale === locale ? "font-medium" : undefined}
          >
            {localeLabels[supportedLocale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
