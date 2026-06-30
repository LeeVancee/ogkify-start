import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";

export function CheckoutMessage({
  title,
  description,
  to,
}: {
  title: string;
  description?: string;
  to: "/cart" | "/";
}) {
  const { t } = useI18n();

  return (
    <div className="shop-shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="mb-3 text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mb-8 max-w-md text-sm text-slate-500">
        {description ?? t("shop.checkoutPage.returnToCartAndTryAgain")}
      </p>
      <Link
        to={to}
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        {t("shop.checkoutPage.return")}
      </Link>
    </div>
  );
}
