"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, X, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMarketplace } from "@/lib/context";
import { formatPrice } from "@/lib/data";
import BrandLogo from "@/components/BrandLogo";

const NAV_LINKS = [
  { href: "/marketplace", label: "Discover" },
  { href: "/categories", label: "Categories" },
  { href: "/ai-finder", label: "AI Finder", badge: "AI" },
  { href: "/impact", label: "Impact" },
  { href: "/my-listings", label: "My Listings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlistIds, products } = useMarketplace();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = searchQuery.trim().toLowerCase();
  const searchResults = trimmed
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(trimmed) ||
            p.category.toLowerCase().includes(trimmed) ||
            p.sellerName.toLowerCase().includes(trimmed) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(trimmed)))
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(16,43,36,0.04)] border-b border-outline-variant/30">
      <div className="h-20 w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg flex items-center justify-between gap-space-md">
        {/* Brand Logo & Editorial Wordmark */}
        <BrandLogo />

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-space-lg text-on-surface-variant">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium tracking-[0.01em] transition-colors hover:text-primary flex items-center gap-1.5 ${
                  isActive ? "text-primary font-bold" : "text-on-surface-variant"
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold tracking-[0.08em]">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-space-md shrink-0">
          {/* Search Archive Pill & Autocomplete (Stitch Desktop Feature) */}
          <div ref={searchContainerRef} className="relative hidden md:block">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center h-10 px-space-md rounded-lg bg-surface-container-low border border-outline-variant/30 focus-within:border-primary/50 focus-within:bg-surface-container transition-colors w-64 lg:w-72"
            >
              <Search
                size={17}
                className="mr-2 text-outline shrink-0"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search circular archive..."
                className="bg-transparent text-[13px] text-on-surface placeholder:text-outline focus:outline-none w-full"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-outline hover:text-on-surface p-0.5"
                  aria-label="Clear search query"
                >
                  <X size={14} />
                </button>
              ) : (
                <kbd className="text-[11px] font-semibold bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant border border-outline-variant/40 shrink-0 pointer-events-none">
                  ⌘K
                </kbd>
              )}
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchOpen && trimmed && (
              <div className="absolute top-full mt-2 left-0 right-0 w-80 lg:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-2 z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col gap-1 max-h-[360px] overflow-y-auto">
                    <div className="px-2 py-1.5 text-[11px] font-semibold tracking-wider text-outline uppercase flex items-center justify-between">
                      <span>Products</span>
                      <span>{searchResults.length} match{searchResults.length === 1 ? "" : "es"}</span>
                    </div>
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          router.push(`/product/${item.id}`);
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container text-left transition-colors w-full group"
                      >
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-surface-container shrink-0">
                          <Image
                            src={item.imagePreviewUrl || item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-on-surface group-hover:text-primary truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant font-mono uppercase tracking-wider">
                              {item.category}
                            </span>
                            <span className="text-[11px] font-semibold text-primary">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-outline-variant/30 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-1.5 text-[12px] font-medium text-primary hover:underline"
                      >
                        View all results for &ldquo;{searchQuery}&rdquo; →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-[13px] text-on-surface-variant">
                      No products found for &ldquo;{searchQuery}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="mt-2 text-[12px] text-primary hover:underline font-medium inline-block"
                    >
                      Search catalogue in marketplace →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-space-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
            title="Saved listings"
            aria-label="Wishlist"
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
            className="hidden sm:inline-flex items-center justify-center h-10 px-space-lg rounded-lg bg-primary-container text-on-primary text-[13px] font-medium tracking-wide transition-colors hover:bg-primary shadow-sm"
          >
            Sell / Give
          </Link>

          {/* Curator Profile Avatar */}
          <Link
            href="/my-listings"
            className="hidden sm:flex items-center pl-space-xs group"
            title="Curator Dashboard / My Listings"
            aria-label="Curator Profile"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-outline-variant/70 group-hover:ring-primary transition-all">
              <Image
                src="/images/brand/curator-avatar.jpg"
                alt="Curator Profile"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
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
        <div className="xl:hidden bg-surface border-t border-outline-variant px-gutter py-space-lg flex flex-col gap-space-md animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`text-[15px] font-medium py-1.5 transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary font-bold" : "text-on-surface-variant"
            }`}
          >
            Home
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-[15px] font-medium py-1.5 transition-colors hover:text-primary flex items-center justify-between ${
                pathname === link.href ? "text-primary font-bold" : "text-on-surface-variant"
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-2 border-t border-outline-variant/40 flex flex-col gap-2">
            <Link
              href="/sell"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center h-11 px-space-lg rounded-lg bg-primary-container text-on-primary text-[13px] font-medium tracking-wide"
            >
              Sell / Give
            </Link>
            <Link
              href="/marketplace"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface-variant text-[13px]"
            >
              <Search size={16} className="mr-2 text-outline" /> Search Archive
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
