import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-primary-container text-on-primary-container mt-16">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold tracking-tight text-on-primary uppercase block mb-space-sm">
              AFTERLIFE
            </span>
            <p className="text-[13px] text-on-primary-container leading-relaxed max-w-xs">
              Find value in what the world overlooks. Buy differently. Sell meaningfully. Waste less.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-primary-container mb-space-sm opacity-70">
              Navigate
            </p>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/marketplace", label: "Marketplace" },
                { href: "/categories", label: "Categories" },
                { href: "/ai-finder", label: "AI Finder" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-on-primary-container opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-primary-container mb-space-sm opacity-70">
              Account
            </p>
            <ul className="space-y-2">
              {[
                { href: "/sell", label: "Sell / Give" },
                { href: "/my-listings", label: "My Listings" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/impact", label: "Impact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-on-primary-container opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-primary-container mb-space-sm opacity-70">
              Categories
            </p>
            <ul className="space-y-2">
              {["RE:WEAR", "ROOTS", "RE:READ", "RE:MAKE", "RE:USE", "RE:SOURCE"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/categories/${encodeURIComponent(cat)}`}
                    className="text-[13px] text-on-primary-container opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-space-2xl pt-space-lg border-t border-on-primary-container/20 flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <p className="text-[11px] text-on-primary-container opacity-60 tracking-[0.05em]">
            © 2024 AFTERLIFE. All demo listings are illustrative only. No real transactions occur.
          </p>
          <p className="text-[11px] text-on-primary-container opacity-60 tracking-[0.05em]">
            Built with Next.js · Tailwind CSS · Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
