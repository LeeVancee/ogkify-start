import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const footerLinks = [
    { label: t("shop.header.allProducts"), to: "/products", search: {} },
    {
      label: t("shop.footer.featured"),
      to: "/products",
      search: { featured: true },
    },
    { label: t("shop.userMenu.login"), to: "/login" },
    { label: t("shop.userMenu.myOrders"), to: "/myorders" },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="shop-shell py-14 sm:py-18">
        <div className="mb-10 border-b border-border pb-10">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-[-0.03em] text-foreground uppercase"
          >
            OGKIFY
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-5 text-muted-foreground">
            {t("shop.footer.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h4 className="geist-label mb-4 text-foreground">
              {t("shop.footer.shop")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    search={link.search}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="geist-label mb-4 text-foreground">
              {t("shop.footer.customerCare")}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="cursor-default transition-colors hover:text-foreground">
                {t("shop.footer.shippingInformation")}
              </li>
              <li className="cursor-default transition-colors hover:text-foreground">
                {t("shop.footer.returnsPolicy")}
              </li>
              <li className="cursor-default transition-colors hover:text-foreground">
                {t("shop.footer.faq")}
              </li>
              <li className="cursor-default transition-colors hover:text-foreground">
                {t("shop.footer.contactUs")}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="geist-label mb-4 text-foreground">
              {t("shop.footer.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>service@ogkify.com</li>
              <li>+886 2 2345 6789</li>
              <li>{t("shop.footer.hours")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>{t("shop.footer.copyright")}</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer transition-colors hover:text-foreground">
              {t("shop.footer.privacyPolicy")}
            </span>
            <span className="cursor-pointer transition-colors hover:text-foreground">
              {t("shop.footer.termsOfService")}
            </span>
            <a
              href="https://github.com/LeeVancee/ogkify-start"
              target="_blank"
              rel="noreferrer"
              aria-label={t("shop.footer.github")}
              className="transition-colors hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.7 1.24 3.35.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.17.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.48 3.16-1.17 3.16-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.13v3.15c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
