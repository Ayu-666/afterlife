"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { filterProducts, CATEGORIES, CATEGORY_META } from "@/lib/data";
import { FilterState } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { getSeedProducts } from "@/lib/data";

const HERO_PRODUCTS = [
  {
    label: "1982 VINTAGE TEXTILE",
    title: "Raw Kanjivaram Brocade",
    price: "₹4,200",
    badge: "MINT CONDITION",
    type: "ARCHIVE PIECE",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
  },
  {
    label: "CIRCULAR WORKSHOP",
    title: "Reclaimed Oak Monolith Lamp",
    price: "₹2,850",
    badge: "UPCYCLED DECOR",
    type: "RE:MAKE",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    label: "1981 YASHICA",
    title: "Yashica 35mm Classic",
    price: "₹5,400",
    badge: "REFURBISHED",
    type: "TESTED",
    img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  },
];

const QUICK_SEARCHES = [
  "Handmade terracotta vase under ₹600",
  "90s oversized linen blazer",
  "Engineering thermodynamics book",
  "Second-hand mechanical keyboard",
];

export default function HomePage() {
  const router = useRouter();
  const { products } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Fashion" | "Crafts" | "Tech">("All");

  // For server-rendered initial products, use seed directly
  const allProducts = products.length > 0 ? products : getSeedProducts();

  const TAB_FILTER: Record<string, FilterState> = {
    All: { search: "", categories: [], listingTypes: [], conditions: [], minPrice: null, maxPrice: null, sortBy: "newest" },
    Fashion: { search: "", categories: ["RE:WEAR"], listingTypes: [], conditions: [], minPrice: null, maxPrice: null, sortBy: "newest" },
    Crafts: { search: "", categories: ["ROOTS", "RE:MAKE"], listingTypes: [], conditions: [], minPrice: null, maxPrice: null, sortBy: "newest" },
    Tech: { search: "", categories: ["RE:USE"], listingTypes: [], conditions: [], minPrice: null, maxPrice: null, sortBy: "newest" },
  };

  const trendingProducts = filterProducts(allProducts, TAB_FILTER[activeTab]).slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pt-space-xl pb-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-space-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold tracking-[0.08em]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                ISSUE Nº 14 · CIRCULAR LUXURY & ARCHIVE
              </span>
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                PAN-INDIA
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(36px,5vw,56px)] leading-[1.15] font-normal tracking-tight text-primary mb-space-md max-w-2xl">
              Find value in what the world overlooks.
            </h1>

            <p className="text-[18px] text-on-surface-variant max-w-xl mb-space-xl leading-relaxed">
              Discover pre-loved treasures, independent craftsmanship, traditional creations, and
              products waiting for a new purpose.
            </p>

            {/* Search box */}
            <div className="w-full max-w-2xl bg-surface-container-lowest p-2 rounded-xl shadow-md mb-space-lg">
              <div className="flex items-center gap-space-sm px-space-sm py-2">
                <Search size={22} className="text-primary shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  className="w-full bg-transparent text-[15px] text-on-surface placeholder:text-outline focus:outline-none"
                  placeholder="Search via natural intent, provenance, or era..."
                  type="text"
                />
                <Link
                  href={`/marketplace?q=${encodeURIComponent(searchQuery)}`}
                  className="px-space-md py-2.5 bg-primary text-on-primary text-[13px] font-medium rounded hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              {/* Quick searches */}
              <div className="pt-2 px-space-xs flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-outline uppercase tracking-wider px-1.5">Try:</span>
                {QUICK_SEARCHES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setSearchQuery(q)}
                    className="text-[12px] px-2.5 py-1 rounded-full bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container text-on-surface-variant transition-colors"
                  >
                    &ldquo;{q}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-space-md">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-space-lg py-3.5 bg-primary text-on-primary text-[13px] font-medium rounded shadow-sm hover:bg-primary-container transition-all"
              >
                <span>Explore Marketplace</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-space-lg py-3.5 bg-transparent text-primary text-[13px] font-medium rounded hover:bg-surface-container transition-all"
              >
                <span>Sell or Give Something</span>
              </Link>
            </div>
          </div>

          {/* Right editorial cards */}
          <div className="lg:col-span-5 relative mt-space-xl lg:mt-0">
            <div className="relative w-full h-[520px] rounded-xl bg-surface-container-low overflow-hidden p-space-md flex flex-col justify-between">
              {/* Grid bg */}
              <svg className="absolute inset-0 w-full h-full text-surface-container opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#arch-grid)" />
              </svg>

              {HERO_PRODUCTS.map((p, i) => (
                <div
                  key={p.title}
                  className={`relative z-${10 + i * 10} ${
                    i === 0
                      ? "w-64 md:w-72 bg-surface-container-lowest rounded-lg p-2.5 shadow-md transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                      : i === 1
                      ? "self-end -mt-16 w-56 md:w-64 bg-surface-container-lowest rounded-lg p-2.5 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                      : "self-start -mt-8 ml-4 w-52 md:w-60 bg-surface-container-lowest rounded-lg p-2.5 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded bg-surface-container ${
                      i === 0 ? "h-44" : i === 1 ? "h-36" : "h-28"
                    }`}
                  >
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-tertiary-fixed text-primary text-[10px] font-semibold">
                      {p.badge}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-primary text-on-primary text-[10px] font-semibold">
                      {p.price}
                    </span>
                  </div>
                  <div className="pt-2 px-1">
                    <span className="text-[10px] text-outline block tracking-wider uppercase">{p.label}</span>
                    <p className="font-[family-name:var(--font-playfair)] text-[16px] font-semibold text-primary truncate">
                      {p.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT BAR ─────────────────────────────────────────────── */}
      <section className="w-full bg-primary-container text-on-primary py-space-lg">
        <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter items-center">
            {[
              { icon: "📦", value: "14,200+", label: "Products Revived" },
              { icon: "🌿", value: "8.4 Tons", label: "Carbon Offset (Demo)" },
              { icon: "🤝", value: "92% Fair Pay", label: "Artisan Remittance" },
              { icon: "✅", value: "100% Demo", label: "Illustrative Data" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-space-sm py-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 text-[18px]">
                  {s.icon}
                </div>
                <div>
                  <div className="text-[20px] font-semibold tracking-tight leading-none text-on-primary">
                    {s.value}
                  </div>
                  <div className="text-[11px] font-semibold tracking-[0.08em] text-on-primary-container uppercase mt-0.5">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIX CATEGORIES ───────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.08em] text-secondary uppercase mb-1">
              Taxonomy of Reclaimed Value
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-[40px] font-normal tracking-tight text-primary leading-tight">
              Six Curated Pillars
            </h2>
          </div>
          <p className="text-[15px] text-on-surface-variant max-w-md">
            Every stream vetted for integrity, material authenticity, and authentic circular
            life-cycle tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = allProducts.filter((p) => p.category === cat).length;
            return (
              <Link
                key={cat}
                href={`/categories/${encodeURIComponent(cat)}`}
                className="group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-surface-container-high">
                  <Image
                    src={
                      allProducts.find((p) => p.category === cat)?.image ||
                      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                    }
                    alt={cat}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-surface/90 text-primary text-[11px] font-semibold tracking-[0.06em]">
                    {count} LISTINGS
                  </span>
                </div>
                <div className="p-space-lg flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-medium text-primary group-hover:text-secondary transition-colors">
                        {cat}
                      </h3>
                      <ArrowRight
                        size={20}
                        className="text-outline group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                    <p className="text-[13px] text-on-surface-variant">{meta.tagline}</p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between text-outline text-[11px] font-semibold tracking-[0.06em]">
                    <span>{meta.badge}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── TRENDING DISCOVERIES ─────────────────────────────────── */}
      <section className="w-full bg-surface-container-low py-space-2xl" id="trending-discoveries">
        <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Live Circular Stream
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-[40px] font-normal tracking-tight text-primary leading-tight">
                Trending Discoveries
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {["All", "Fashion", "Crafts", "Tech"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {trendingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {trendingProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-on-surface-variant">
              <p className="text-[18px]">No products in this category yet.</p>
            </div>
          )}

          <div className="mt-space-xl text-center">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-space-lg py-3.5 bg-primary text-on-primary text-[13px] font-medium rounded shadow-sm hover:bg-primary-container transition-all"
            >
              View Full Marketplace
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARTISAN SPOTLIGHT ────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        <div className="bg-surface-container-high rounded-2xl overflow-hidden p-space-lg lg:p-space-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg items-center">
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg bg-surface-container-highest">
              <Image
                src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80"
                alt="Master artisan at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-sm p-space-md rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block tracking-wider">
                    LIVING HERITAGE INITIATIVE
                  </span>
                  <h4 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-primary">
                    Khurja Pottery Collective
                  </h4>
                  <p className="text-[13px] text-on-surface-variant">
                    Uttar Pradesh · 60+ years of tradition
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 text-[20px]">
                  ✅
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-space-sm">
                <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary text-[11px] font-semibold tracking-wider">
                  DIRECT ARTISAN ALLIANCE
                </span>
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  ZERO INTERMEDIARY CUT
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-[36px] font-normal text-primary mb-space-md leading-tight">
                Preserving India&apos;s Handmade Heritage
              </h2>
              <p className="text-[15px] text-on-surface-variant mb-space-lg leading-relaxed">
                AFTERLIFE connects buyers directly with artisan collectives, traditional weavers,
                potters and craftspeople across India. Every purchase on ROOTS supports a maker
                directly, with zero intermediary commission. These are demonstration listings — in
                a live deployment, purchases would go directly to the artisan.
              </p>
              <div className="bg-surface-container-lowest rounded-xl p-space-md text-[12px] text-outline border border-outline-variant">
                ⚠️ <strong>Demo Note:</strong> All statistics and figures shown on this platform
                are illustrative only. No real transactions, environmental savings or seller
                verifications are claimed.
              </div>
              <Link
                href="/categories/ROOTS"
                className="mt-space-lg inline-flex items-center gap-2 px-space-lg py-3.5 bg-primary text-on-primary text-[13px] font-medium rounded shadow-sm hover:bg-primary-container transition-all w-fit"
              >
                Explore ROOTS
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI FINDER CTA ────────────────────────────────────────── */}
      <section className="w-full bg-primary py-space-2xl">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg text-center">
          <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold tracking-wider mb-space-md">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Gemini AI Powered
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-[40px] font-normal text-on-primary tracking-tight mb-space-md leading-tight">
            AFTERLIFE AI Finder
          </h2>
          <p className="text-[18px] text-on-primary/80 max-w-2xl mx-auto leading-relaxed mb-space-xl">
            Describe what you need in plain words. Our AI understands intent, not just keywords —
            and only recommends products that actually exist in the catalogue.
          </p>
          <div className="flex flex-wrap justify-center gap-space-md">
            <Link
              href="/ai-finder"
              className="inline-flex items-center gap-2 px-space-lg py-3.5 bg-on-primary text-primary text-[13px] font-medium rounded shadow-sm hover:bg-secondary-container transition-all"
            >
              Try AI Finder
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-space-lg py-3.5 bg-transparent text-on-primary border border-on-primary/40 text-[13px] font-medium rounded hover:bg-on-primary/10 transition-all"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
