import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { authSearchSchema } from "@/lib/auth-redirect";
import { useI18n } from "@/lib/i18n";
import { getSession } from "@/server/getSession";

export const Route = createFileRoute("/(auth)")({
  validateSearch: authSearchSchema,
  beforeLoad: async ({ search }) => {
    const session = await getSession();
    if (session) throw redirect({ href: search.redirect });
  },
  component: AuthLayout,
});
function AuthLayout() {
  const { locale, t } = useI18n();
  return (
    <div className="shop-theme min-h-svh">
      <header className="shop-shell flex h-24 items-center justify-between border-b border-border">
        <Link to="/" className="store-wordmark">
          ogkify
        </Link>
        <Link to="/products" className="flex items-center gap-2 text-xs">
          <ArrowLeft className="size-4" />
          {t("shop.productDetail.backToProducts")}
        </Link>
      </header>
      <main className="shop-shell grid min-h-[70vh] items-center gap-16 py-16 lg:grid-cols-2">
        <div className="hidden border-r border-border py-24 pr-16 lg:block">
          <p className="mb-8 text-xs tracking-[0.16em] text-muted-foreground">
            A PLACE FOR YOUR COLLECTION.
          </p>
          <p className="text-6xl font-medium leading-tight tracking-[-0.05em]">
            {locale === "en" ? (
              <>
                Your next
                <br />
                favourite awaits.
              </>
            ) : locale === "zh-CN" ? (
              <>
                下一件喜欢，
                <br />
                从这里开始。
              </>
            ) : (
              <>
                下一件喜歡，
                <br />
                從這裡開始。
              </>
            )}
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
