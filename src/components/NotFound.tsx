import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { useI18n } from "@/lib/i18n";
export function NotFound({ children }: { children?: ReactNode }) {
  const { t, locale } = useI18n();
  return (
    <div className="shop-theme mx-auto flex min-h-[65vh] max-w-xl flex-col items-start justify-center px-6 py-20">
      <p className="mb-8 text-xs tracking-[0.15em] text-muted-foreground">
        OGKIFY / 404
      </p>
      <h1 className="text-4xl font-medium tracking-tight">
        {t("common.states.notFound")}
      </h1>
      <div className="mt-5 text-sm leading-7 text-muted-foreground">
        {children ||
          (locale === "en"
            ? "This page or product is no longer available. Browse the collection to find something else."
            : locale === "zh-CN"
              ? "这件商品或页面暂时找不到了，回到商店继续看看吧。"
              : "這件商品或頁面暫時找不到了，回到商店繼續看看吧。")}
      </div>
      <Link to="/products" className="shop-pill-button mt-9 gap-8">
        {t("shop.home.shopAll")}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
