import { Link } from "@tanstack/react-router";

const footerLinks = [
  { label: "All Products", to: "/products", search: {} },
  { label: "Featured", to: "/products", search: { featured: true } },
  { label: "Login", to: "/login" },
  { label: "My Orders", to: "/myorders" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="shop-shell py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              OGKIFY
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Curated essentials for a refined, minimal lifestyle with a sharp
              editorial feel.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
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
            <h4 className="mb-4 text-sm font-medium text-foreground">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>Shipping Information</li>
              <li>Returns Policy</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>service@monostore.com</li>
              <li>+886 2 2345 6789</li>
              <li>Mon - Fri, 10:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 OGKIFY. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer transition-colors hover:text-foreground">
              Privacy Policy
            </span>
            <span className="cursor-pointer transition-colors hover:text-foreground">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
