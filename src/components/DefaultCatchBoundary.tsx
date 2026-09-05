import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, useRouter } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";

import { Button } from "./ui/button";
export function DefaultCatchBoundary({
  error,
  reset,
}: Readonly<ErrorComponentProps>) {
  const router = useRouter();
  const { t, locale } = useI18n();
  console.error(error);
  return (
    <div
      role="alert"
      className="shop-theme mx-auto flex min-h-[60vh] max-w-lg flex-col items-start justify-center px-6 py-16"
    >
      <p className="mb-5 text-xs tracking-widest text-muted-foreground">
        OGKIFY
      </p>
      <h1 className="text-3xl font-medium">
        {locale === "en"
          ? "Unable to load this page"
          : locale === "zh-CN"
            ? "暂时无法载入页面"
            : "暫時無法載入頁面"}
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {locale === "en"
          ? "Please try again in a moment. Your saved items will still be here."
          : locale === "zh-CN"
            ? "请稍后再试，你已保存的资料不会因此丢失。"
            : "請稍後再試，你已儲存的資料不會因此遺失。"}
      </p>
      <div className="mt-8 flex items-center gap-6">
        <Button
          onClick={async () => {
            await router.invalidate();
            reset();
          }}
        >
          {t("common.actions.retry")}
        </Button>
        <Link to="/" className="text-sm underline underline-offset-4">
          {t("common.actions.home")}
        </Link>
      </div>
    </div>
  );
}
