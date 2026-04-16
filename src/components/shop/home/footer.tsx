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
          </div>
        </div>
      </div>
    </footer>
  );
}
