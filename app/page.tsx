"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Calculator,
  Compass,
  CheckCircle2,
  Package,
  Leaf,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { filterProducts, CATEGORIES, shouldUseAIFinder, getSeedProducts } from "@/lib/data";
import { FilterState } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

const HERO_PRODUCTS = [
  {
    id: "rw-002",
    label: "VINTAGE DENIM ARCHIVE",
    title: "501 Original Straight Fit Jeans",
    price: "₹2,600",
    badge: "VERY GOOD",
    type: "RE:WEAR",
    img: "/images/products/rw-002.jpg",
  },
  {
    id: "rm-002",
    label: "CIRCULAR WORKSHOP",
    title: "Reclaimed Oak Monolith Lamp",
    price: "₹3,400",
    badge: "UPCYCLED DECOR",
    type: "RE:MAKE",
    img: "/images/products/rm-002.jpg",
  },
  {
    id: "ru-002",
    label: "1981 YASHICA",
    title: "Yashica 35mm Classic",
    price: "₹6,800",
    badge: "REFURBISHED",
    type: "TESTED",
    img: "/images/products/ru-002.jpg",
  },
];

const QUICK_SEARCHES = [
  "Minimalist desk lamp under ₹1,500",
  "Vintage leather jacket",
  "Engineering textbooks under ₹500",
  "Handmade terracotta vase",
  "Restored mechanical keyboard",
];

const PILLAR_DETAILS: Record<
  string,
  {
    kicker: string;
    description: string;
    tag1: string;
    tag2: string;
    countLabel: string;
    coverImg: string;
  }
> = {
  "RE:WEAR": {
    kicker: "ARCHIVAL & THRIFT FASHION",
    description: "Thrift fashion, archival luxury wear, selvedge denim & classic trench coats.",
    tag1: "UP TO 75% OFF RETAIL",
    tag2: "AUTHENTICATED",
    countLabel: "30 PIECES",
    coverImg: "/images/products/rw-001.jpg",
  },
  ROOTS: {
    kicker: "HERITAGE HANDICRAFTS",
    description: "Indigenous handlooms, beaten brass vessels, studio ceramics & folk traditions.",
    tag1: "DIRECT CRAFT REMITTANCE",
    tag2: "HERITAGE SEAL",
    countLabel: "30 ARTEFACTS",
    coverImg: "/images/products/ro-001.jpg",
  },
  "RE:READ": {
    kicker: "ACADEMIC & RARE EDITIONS",
    description: "Second-hand university textbooks, out-of-print poetry, monographs & philosophy.",
    tag1: "STUDENT SUBSIDIES",
    tag2: "PAGE-CHECKED",
    countLabel: "30 EDITIONS",
    coverImg: "/images/products/rr-001.jpg",
  },
  "RE:MAKE": {
    kicker: "UPCYCLED & HANDCRAFTED",
    description: "Upcycled furniture, bespoke joinery, patchwork wall tapestries & lamps.",
    tag1: "RECLAIMED TIMBER & RESIN",
    tag2: "ONE-OF-ONE",
    countLabel: "30 CREATIONS",
    coverImg: "/images/products/rm-001.jpg",
  },
  "RE:USE": {
    kicker: "CERTIFIED REFURBISHED TECH",
    description: "Precision refurbished audio equipment, mechanical keyboards, and 35mm rangefinders.",
    tag1: "CERTIFIED WORKING",
    tag2: "RECIRCULATED TECH",
    countLabel: "30 UNITS",
    coverImg: "/images/products/ru-001.jpg",
  },
  "RE:SOURCE": {
    kicker: "CIRCULAR RAW MATERIALS",
    description: "Surplus deadstock fabric, raw vegetable-tanned leather scraps, natural dyes & brass.",
    tag1: "DIRECT RECOVERY",
    tag2: "ZERO VIRGIN MATERIAL",
    countLabel: "30 LOTS",
    coverImg: "/images/products/rs-001.jpg",
  },
};

export default function HomePage() {
  const router = useRouter();
  const { products } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Fashion" | "Crafts" | "Tech">("All");

  const allProducts = products.length > 0 ? products : getSeedProducts();

  const TAB_FILTER: Record<string, FilterState> = {
    All: { search: "", categories: [], listingTypes: [], conditions: [], minPrice: null, maxPrice: null, sortBy: "newest" },
    Fashion: { search: "", categories: ["RE:WEAR"], listingTypes: [], conditions: [], minPrice: null, maxPrice: null, sortBy: "newest" },
    Crafts: { search: "", categories: ["ROOTS", "RE:MAKE"], listingTypes: [], conditions: [], minPrice: null, maxPrice: null, sortBy: "newest" },
    Tech: { search: "", categories: ["RE:USE"], listingTypes: [], conditions: [], minPrice: null, maxPrice: null, sortBy: "newest" },
  };

  const trendingProducts = filterProducts(allProducts, TAB_FILTER[activeTab]).slice(0, 4);

  // Student finds: items from RE:READ and budget tech under ₹1000
  const studentFinds = allProducts
    .filter((p) => (p.category === "RE:READ" || p.price <= 1000) && p.price > 0)
    .slice(0, 4);

  // Curated for your taste: high-aesthetic pairing items
  const aestheticMatches = allProducts
    .filter((p) => ["ro-002", "rm-002", "rw-001"].includes(p.id))
    .slice(0, 3);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;

    if (shouldUseAIFinder(q)) {
      router.push(`/ai-finder?query=${encodeURIComponent(q)}`);
    } else {
      router.push(`/marketplace?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* ── 1. EDITORIAL HERO ──────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pt-space-xl pb-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-space-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold tracking-[0.08em]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                PAN-INDIA VERIFIED CIRCULAR ARCHIVE
              </span>
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                180 ARTEFACTS LIVE
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(36px,5vw,56px)] leading-[1.12] font-normal tracking-tight text-primary mb-space-md max-w-2xl">
              Find value in what the world overlooks.
            </h1>

            <p className="text-[18px] text-on-surface-variant max-w-xl mb-space-xl leading-relaxed font-sans">
              Discover pre-loved treasures, independent craftsmanship, traditional creations, and
              products waiting for a new purpose.
            </p>

            {/* Natural-Language Search Interface with Curate CTA */}
            <div className="w-full max-w-2xl bg-surface-container-lowest p-2 rounded-xl shadow-md border border-outline-variant/50 mb-space-lg">
              <div className="flex items-center gap-space-sm px-space-sm py-2">
                <Search size={22} className="text-primary shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  className="w-full bg-transparent text-[15px] text-on-surface placeholder:text-outline focus:outline-none"
                  placeholder="Describe what you need, or search products, era, budget..."
                  type="text"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-space-md py-2.5 bg-primary text-on-primary text-[13px] font-medium rounded hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <Sparkles size={15} />
                  <span>Curate</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Prompt Inspiration Pills */}
              <div className="pt-2 px-space-xs flex flex-wrap items-center gap-1.5 border-t border-outline-variant/30">
                <span className="text-[10px] text-outline uppercase tracking-wider px-1.5 font-semibold">
                  Try:
                </span>
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

            {/* Direct CTAs */}
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

          {/* Right Hero Showcase Cards */}
          <div className="lg:col-span-5 relative mt-space-xl lg:mt-0">
            <div className="relative w-full h-[520px] rounded-xl bg-surface-container-low overflow-hidden p-space-md flex flex-col justify-between">
              {/* Background architectural grid */}
              <svg
                className="absolute inset-0 w-full h-full text-surface-container opacity-60 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#arch-grid)" />
              </svg>

              {HERO_PRODUCTS.map((p, i) => (
                <Link
                  key={p.title}
                  href={`/product/${p.id}`}
                  className={`group block relative z-${10 + i * 10} focus:outline-none focus:ring-2 focus:ring-primary rounded-lg ${
                    i === 0
                      ? "w-64 md:w-72 bg-surface-container-lowest rounded-lg p-2.5 shadow-md transform -rotate-2 hover:rotate-0 hover:shadow-xl transition-all duration-300"
                      : i === 1
                      ? "self-end -mt-16 w-56 md:w-64 bg-surface-container-lowest rounded-lg p-2.5 shadow-xl transform rotate-3 hover:rotate-0 hover:shadow-2xl transition-all duration-300"
                      : "self-start -mt-8 ml-4 w-52 md:w-60 bg-surface-container-lowest rounded-lg p-2.5 shadow-lg transform -rotate-1 hover:rotate-0 hover:shadow-xl transition-all duration-300"
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
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <span className="text-[10px] text-outline block tracking-wider uppercase font-semibold">
                      {p.label}
                    </span>
                    <p className="font-[family-name:var(--font-playfair)] text-[16px] font-semibold text-primary group-hover:text-secondary transition-colors truncate">
                      {p.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST & STATISTICS STRIP ───────────────────────────── */}
      <section className="w-full bg-primary-container text-on-primary py-space-lg">
        <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter items-center">
            {[
              {
                icon: <Package size={22} className="text-secondary-container" />,
                value: "180 Curated Pieces",
                label: "Six Streams of Circular Value",
              },
              {
                icon: <Leaf size={22} className="text-secondary-container" />,
                value: "~32.4 Tons CO₂e",
                label: "Projected Physical Offset",
              },
              {
                icon: <Handshake size={22} className="text-secondary-container" />,
                value: "100% Direct Remittance",
                label: "Zero Intermediary Cut on Crafts",
              },
              {
                icon: <ShieldCheck size={22} className="text-secondary-container" />,
                value: "Pan-India Verified",
                label: "Circular Exchange Protocol",
              },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-space-sm py-2">
                <div className="w-11 h-11 rounded-full bg-primary/80 flex items-center justify-center shrink-0 border border-primary-fixed/20 shadow-sm">
                  {s.icon}
                </div>
                <div>
                  <div className="text-[18px] md:text-[20px] font-semibold tracking-tight leading-none text-on-primary">
                    {s.value}
                  </div>
                  <div className="text-[11px] font-semibold tracking-[0.06em] text-on-primary-container uppercase mt-1">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SIX CURATED PILLARS ─────────────────────────────────── */}
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
          <p className="text-[15px] text-on-surface-variant max-w-md leading-relaxed font-sans">
            Every stream vetted for integrity, material authenticity, and authentic circular
            life-cycle tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
          {CATEGORIES.map((cat) => {
            const detail = PILLAR_DETAILS[cat];
            return (
              <Link
                key={cat}
                href={`/categories/${encodeURIComponent(cat)}`}
                className="group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-outline-variant/40"
              >
                <div className="relative h-64 overflow-hidden bg-surface-container-high">
                  <Image
                    src={detail.coverImg}
                    alt={cat}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-surface/90 backdrop-blur-sm text-primary text-[11px] font-semibold tracking-[0.06em] shadow-sm">
                    {detail.countLabel}
                  </span>
                </div>
                <div className="p-space-lg flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-[family-name:var(--font-playfair)] text-[24px] font-medium text-primary group-hover:text-secondary transition-colors">
                        {cat}
                      </h3>
                      <ArrowRight
                        size={20}
                        className="text-outline group-hover:text-primary group-hover:translate-x-1.5 transition-all"
                      />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider text-secondary uppercase block mb-1.5">
                      {detail.kicker}
                    </span>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed">
                      {detail.description}
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm border-t border-outline-variant/30 flex items-center justify-between text-outline text-[11px] font-semibold tracking-[0.06em]">
                    <span>{detail.tag1}</span>
                    <span className="text-primary font-semibold">{detail.tag2}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 4. TRENDING DISCOVERIES ───────────────────────────────── */}
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
                      ? "bg-primary text-on-primary shadow-sm"
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
              View Full Marketplace (180 Listings)
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. ARTISAN SPOTLIGHT ──────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        <div className="bg-surface-container-high rounded-2xl overflow-hidden p-space-lg lg:p-space-2xl border border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg items-center">
            <Link
              href="/categories/ROOTS"
              className="group relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg bg-surface-container-highest block focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Image
                src="/images/khurja-pottery-hero.jpg"
                alt="Handcrafted Khurja Pottery Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-sm p-space-md rounded-lg flex items-center justify-between group-hover:bg-surface transition-colors shadow-md">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block tracking-wider">
                    LIVING HERITAGE INITIATIVE
                  </span>
                  <h4 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-primary group-hover:text-secondary transition-colors">
                    Khurja Pottery Collective
                  </h4>
                  <p className="text-[13px] text-on-surface-variant">
                    Bulandshahr, Uttar Pradesh · Centuries of Ceramic Craft
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <ArrowRight size={20} className="text-on-secondary-container" />
                </div>
              </div>
            </Link>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-space-sm">
                <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary text-[11px] font-semibold tracking-wider">
                  DIRECT CRAFT ALLIANCE
                </span>
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  ZERO INTERMEDIARY CUT
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-[36px] font-normal text-primary mb-space-md leading-tight">
                Preserving India&apos;s Living Handmade Heritage
              </h2>
              <p className="text-[15px] text-on-surface-variant mb-space-lg leading-relaxed font-sans">
                AFTERLIFE connects conscious seekers directly with traditional Indian artisans,
                cooperatives, and generational craftspeople. From Khurja blue ceramics and Bastar
                lost-wax Dhokra brass to Odisha Pattachitra, each piece carries centuries of lineage
                and material purity.
              </p>
              <div className="bg-surface-container-lowest rounded-xl p-space-md text-[12px] text-outline border border-outline-variant/60 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-secondary shrink-0" />
                <span>100% fair remittance sent directly to artisan guilds on completed orders.</span>
              </div>
              <Link
                href="/categories/ROOTS"
                className="mt-space-lg inline-flex items-center gap-2 px-space-lg py-3.5 bg-primary text-on-primary text-[13px] font-medium rounded shadow-sm hover:bg-primary-container transition-all w-fit"
              >
                Explore ROOTS Collection
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. AFFORDABLE STUDENT FINDS (STITCH RESTORATION) ────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-secondary" />
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                Campus Circular Network
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-[40px] font-normal tracking-tight text-primary leading-tight">
              Affordable Student Finds
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-outline">Verified university ID gets additional 10% off</span>
            <span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container text-[11px] font-semibold tracking-wider">
              EDU PERKS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {studentFinds.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── 7. CURATED FOR YOUR TASTE (STITCH RESTORATION) ──────────── */}
      <section className="w-full bg-surface-container-low py-space-2xl">
        <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass size={16} className="text-secondary" />
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Aesthetic Vector Alignment
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-[40px] font-normal tracking-tight text-primary leading-tight">
                Curated For Your Taste
              </h2>
            </div>
            <p className="text-[13px] text-on-surface-variant max-w-sm leading-relaxed">
              Dynamic inference matches items based on your appreciation for raw natural materials,
              heritage typography, and minimalist utility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            {aestheticMatches.map((p, idx) => {
              const reasoning =
                idx === 0
                  ? "Matched because you explored Indian Pottery & Clayware"
                  : idx === 1
                  ? "Matched for Mid-century Reclaimed Hardwood & Ambient Warmth"
                  : "Matched for Archival Raw Selvedge Denim & Utility Tailoring";

              return (
                <div
                  key={p.id}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm p-space-md flex flex-col justify-between border border-outline-variant/40"
                >
                  <div>
                    <div className="relative h-60 rounded-lg overflow-hidden bg-surface-container mb-space-md">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary text-on-primary text-[11px] font-semibold shadow-sm">
                        <Sparkles size={13} />
                        <span>98% AESTHETIC MATCH</span>
                      </div>
                    </div>

                    <div className="mb-space-sm p-2.5 rounded bg-surface-container-low flex items-center gap-2 border border-outline-variant/30">
                      <Compass size={15} className="text-secondary shrink-0" />
                      <p className="text-[12px] text-on-surface-variant leading-tight">
                        {reasoning}
                      </p>
                    </div>

                    <span className="text-[11px] font-semibold text-outline uppercase block mb-1">
                      {p.category} · {p.location}
                    </span>
                    <h4 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-primary mb-1 truncate">
                      {p.title}
                    </h4>
                    <div className="flex items-baseline justify-between mb-space-md">
                      <span className="text-[18px] font-semibold text-primary">₹{p.price.toLocaleString("en-IN")}</span>
                      <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                        Zero Virgin Material
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/product/${p.id}`}
                    className="w-full py-2.5 bg-primary text-on-primary text-[13px] font-medium rounded hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>View Provenance</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. THE CIRCULAR MATH (STITCH RESTORATION) ──────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        <div className="bg-primary text-on-primary rounded-2xl p-space-lg lg:p-space-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-space-md">
                <Leaf size={18} className="text-primary-fixed" />
                <span className="text-[11px] font-semibold text-primary-fixed uppercase tracking-wider">
                  The Circular Math
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(28px,4vw,40px)] leading-tight text-on-primary mb-space-md">
                Every reused kilogram prevents 22kg of carbon emissions and 7,000 litres of clean water.
              </h2>
              <p className="text-[15px] text-on-primary/80 max-w-xl mb-space-lg leading-relaxed font-sans">
                By keeping authentic clothing, out-of-print books, and precision electronics in
                circulation, the AFTERLIFE community has diverted 32 tons of solid waste from domestic
                landfills this calendar season.
              </p>
              <div className="flex flex-wrap items-center gap-space-md">
                <Link
                  href="/impact"
                  className="px-space-lg py-3.5 bg-primary-fixed text-on-primary-fixed text-[13px] font-semibold rounded shadow-sm hover:bg-primary-fixed-dim transition-all flex items-center gap-2"
                >
                  <Calculator size={16} />
                  <span>Calculate My Circular Footprint</span>
                </Link>
                <Link
                  href="/categories"
                  className="text-[13px] font-semibold text-primary-fixed hover:text-on-primary transition-colors flex items-center gap-1"
                >
                  <span>Explore Pillar Taxonomy</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Inline Data Visualizer Box */}
            <div className="lg:col-span-5">
              <div className="bg-primary-container/90 backdrop-blur rounded-xl p-space-lg border border-primary-fixed/20 shadow-xl">
                <div className="flex items-center justify-between mb-space-md pb-space-sm border-b border-primary/40">
                  <span className="text-[11px] font-semibold text-on-primary-container uppercase tracking-wider">
                    AFTERLIFE LEDGER (2026)
                  </span>
                  <span className="text-[11px] font-semibold text-primary-fixed">180 ARTEFACTS</span>
                </div>

                {/* Metric Item 1 */}
                <div className="mb-space-md">
                  <div className="flex justify-between text-[13px] mb-1.5 font-medium">
                    <span className="text-on-primary">Textiles Diverted</span>
                    <span className="text-primary-fixed font-semibold">18.6 Tons</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-primary overflow-hidden">
                    <div className="h-full bg-primary-fixed rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>

                {/* Metric Item 2 */}
                <div className="mb-space-md">
                  <div className="flex justify-between text-[13px] mb-1.5 font-medium">
                    <span className="text-on-primary">Water Preserved</span>
                    <span className="text-primary-fixed font-semibold">4.2M Litres</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-primary overflow-hidden">
                    <div className="h-full bg-secondary-container rounded-full" style={{ width: "86%" }} />
                  </div>
                </div>

                {/* Metric Item 3 */}
                <div>
                  <div className="flex justify-between text-[13px] mb-1.5 font-medium">
                    <span className="text-on-primary">Student Textbooks Re-circulated</span>
                    <span className="text-primary-fixed font-semibold">5,410 Units</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-primary overflow-hidden">
                    <div className="h-full bg-tertiary-fixed rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
