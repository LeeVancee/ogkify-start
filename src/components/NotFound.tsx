import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useI18n } from "@/lib/i18n";

export function NotFound({ children }: { children?: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="space-y-2 p-2">
      <div className="text-gray-600 dark:text-gray-400">
        {children || <p>{t("common.states.notFound")}</p>}
      </div>
      <p className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => window.history.back()}
          className="bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm"
        >
          {t("common.actions.goBack")}
        </button>
        <Link
          to="/"
          className="bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm"
        >
          {t("common.actions.home")}
        </Link>
      </p>
    </div>
  );
}
