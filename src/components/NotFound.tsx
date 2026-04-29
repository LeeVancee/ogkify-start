import { Link } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";
import type { ReactNode } from "react";

import { useI18n } from "@/lib/i18n";

export function NotFound({ children }: { children?: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-6 py-24 text-center">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-emerald-400/5 blur-[100px]" />
        <div className="absolute right-[10%] bottom-[20%] h-96 w-96 rounded-full bg-cyan-400/5 blur-[120px]" />
      </div>

      {/* Main Content */}
      <div className="relative">
        <h1 className="animate-in fade-in zoom-in duration-700 select-none bg-gradient-to-b from-slate-900 to-slate-400 bg-clip-text text-[12rem] font-bold leading-none text-transparent opacity-20 sm:text-[18rem]">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="mb-2 text-2xl font-light tracking-tight text-slate-900 sm:text-4xl">
            {t("common.states.notFound")}
          </h2>
          <div className="max-w-md text-slate-500">
            {children || (
              <p className="text-sm sm:text-base">
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <button
          onClick={() => window.history.back()}
          className="group flex h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-600 transition-all hover:border-slate-900 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t("common.actions.goBack")}
        </button>

        <Link
          to="/"
          className="flex h-12 items-center gap-2 rounded-full bg-slate-900 px-8 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200 active:scale-95"
        >
          <Home className="h-4 w-4" />
          {t("common.actions.home")}
        </Link>
      </div>
    </div>
  );
}
