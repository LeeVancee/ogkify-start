import { Link } from "@tanstack/react-router";

const footerLinks = [
  { label: "All Products", to: "/products", search: {} },
  { label: "Featured", to: "/products", search: { featured: true } },
  { label: "Login", to: "/login" },
  { label: "My Orders", to: "/myorders" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="shop-shell py-14 sm:py-18">
        <div className="mb-10 pb-10 border-b border-slate-100">
          <Link
            to="/"
            className="text-2xl font-bold tracking-widest text-slate-900 uppercase"
          >
            OGKIFY
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            Curated essentials for a refined, minimal lifestyle with a sharp
            editorial feel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-900">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    search={link.search}
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-900">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="hover:text-slate-900 transition-colors cursor-default">
                Shipping Information
              </li>
              <li className="hover:text-slate-900 transition-colors cursor-default">
                Returns Policy
              </li>
              <li className="hover:text-slate-900 transition-colors cursor-default">
                FAQ
              </li>
              <li className="hover:text-slate-900 transition-colors cursor-default">
                Contact Us
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-900">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>service@ogkify.com</li>
              <li>+886 2 2345 6789</li>
              <li>Mon – Fri, 10:00 – 18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 OGKIFY. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer transition-colors hover:text-slate-700">
              Privacy Policy
            </span>
            <span className="cursor-pointer transition-colors hover:text-slate-700">
              Terms of Service
            </span>
            <a
              href="https://github.com/LeeVancee/ogkify-start"
              target="_blank"
              rel="noreferrer"
              aria-label="OGKIFY GitHub repository"
              className="transition-colors hover:text-slate-700"
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
