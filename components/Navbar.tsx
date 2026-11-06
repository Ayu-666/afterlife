"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useMarketplace } from "@/lib/context";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Discover" },
  { href: "/categories", label: "Categories" },
  { href: "/ai-finder", label: "AI Finder", badge: "AI" },
  { href: "/impact", label: "Impact" },
  { href: "/my-listings", label: "My Listings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { wishlistIds } = useMarketplace();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(16,43,36,0.04)]">
      <div className="h-20 w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg flex items-center justify-between gap-space-md">
        {/* Logo */}
        <div className="flex items-center gap-space-sm shrink-0">
          <Link href="/" className="flex items-center gap-space-sm">
            <span className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold tracking-tight text-primary uppercase leading-none">
              AFTERLIFE
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-space-lg text-on-surface-variant">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium tracking-[0.01em] transition-colors hover:text-primary flex items-center gap-1.5 ${
                pathname === link.href ? "text-primary font-bold" : ""
              }`}
            >
              {link.label}
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold tracking-[0.08em]">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-space-md shrink-0">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-space-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
          >
            <Heart size={22} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-on-primary text-[10px] font-semibold flex items-center justify-center leading-none">
                {wishlistIds.length > 9 ? "9+" : wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Sell CTA */}
          <Link
            href="/sell"
            className="hidden sm:inline-flex items-center justify-center h-10 px-space-lg rounded-lg bg-primary-container text-on-primary text-[13px] font-medium tracking-wide transition-colors hover:bg-primary"
          >
            Sell / Give
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="xl:hidden bg-surface border-t border-outline-variant px-gutter py-space-lg flex flex-col gap-space-md">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-[15px] font-medium py-2 transition-colors hover:text-primary flex items-center gap-2 ${
                pathname === link.href ? "text-primary font-bold" : "text-on-surface-variant"
              }`}
            >
              {link.label}
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/sell"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center h-11 px-space-lg rounded-lg bg-primary-container text-on-primary text-[13px] font-medium tracking-wide mt-2"
          >
            Sell / Give
          </Link>
        </div>
      )}
    </header>
  );
}
