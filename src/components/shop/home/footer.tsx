import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";

function GithubMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.76.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

const linkClass =
  "block w-fit text-sm text-muted-foreground transition-colors hover:text-foreground";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-24 border-t border-border bg-secondary">
      <div className="shop-shell">
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
          <div className="max-w-sm">
            <Link to="/" className="store-wordmark">
              ogkify
            </Link>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              {t("shop.footer.description")}
            </p>
            <a
              href="https://github.com/LeeVancee/ogkify-start"
              target="_blank"
              rel="noreferrer"
              aria-label={t("shop.footer.github")}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-background"
            >
              <GithubMark />
              <span>GitHub</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <div className="space-y-3">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t("shop.footer.shop")}
              </p>
              <Link to="/products" className={linkClass}>
                {t("shop.header.allProducts")}
              </Link>
              <Link
                to="/products"
                search={{ featured: true }}
                className={linkClass}
              >
                {t("shop.footer.featured")}
              </Link>
              <Link
                to="/products"
                search={{ sort: "newest" }}
                className={linkClass}
              >
                {t("shop.home.newArrivals")}
              </Link>
              <Link to="/search" className={linkClass}>
                {t("shop.header.search")}
              </Link>
            </div>

            <div className="space-y-3">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t("shop.userMenu.profile")}
              </p>
              <Link to="/profile" className={linkClass}>
                {t("shop.userMenu.profile")}
              </Link>
              <Link to="/myorders" className={linkClass}>
                {t("shop.userMenu.myOrders")}
              </Link>
              <Link to="/cart" className={linkClass}>
                {t("shop.cart.title")}
              </Link>
              <Link to="/login" className={linkClass}>
                {t("shop.userMenu.login")}
              </Link>
            </div>

            <div className="col-span-2 space-y-3 sm:col-span-1">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t("shop.footer.customerCare")}
              </p>
              <p className="text-sm text-foreground">
                {t("shop.footer.contact")}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {t("shop.footer.hours")}
              </p>
              <p className="pt-2 text-xs leading-5 text-muted-foreground">
                {t("shop.footer.shippingInformation")} ·{" "}
                {t("shop.footer.returnsPolicy")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {t("shop.footer.copyright").replace(
              "2026",
              String(new Date().getFullYear()),
            )}
          </span>
          <div className="flex items-center gap-5">
            <span>{t("shop.footer.termsOfService")}</span>
            <span>{t("shop.footer.privacyPolicy")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
