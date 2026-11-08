"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Infinity as InfinityIcon,
  CheckCircle2,
  Bookmark,
  School,
  Armchair,
  Palette,
  Lightbulb,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { getSeedProducts, formatPrice } from "@/lib/data";
import { useMarketplace } from "@/lib/context";

export default function CategoriesPage() {
  const { products, toggleWishlist, isWishlisted } = useMarketplace();
  const allProducts = products.length > 0 ? products : getSeedProducts();

  // Helper to get products by category
  const getCatProducts = (catName: string) => allProducts.filter((p) => p.category === catName);

  const reWear = getCatProducts("RE:WEAR");
  const roots = getCatProducts("ROOTS");
  const reRead = getCatProducts("RE:READ");
  const reMake = getCatProducts("RE:MAKE");
  const reUse = getCatProducts("RE:USE");
  const reSource = getCatProducts("RE:SOURCE");

  const [activeStream, setActiveStream] = useState<string>("re-wear");

  const scrollToStream = (id: string) => {
    setActiveStream(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* ── 1. OVERVIEW & ARCHIVAL MANIFESTO ───────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pt-space-xl pb-space-2xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-3xl">
            <div className="flex items-center gap-space-xs text-secondary mb-space-sm">
              <InfinityIcon size={18} className="text-secondary" />
              <span className="text-[11px] font-semibold tracking-widest uppercase">
                Systemic Taxonomy
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-[44px] md:text-[56px] text-primary tracking-tight leading-[1.1] mb-space-md">
              Six Streams of Circular Value
            </h1>
            <p className="text-[18px] text-on-surface-variant leading-relaxed">
              Every item on AFTERLIFE belongs to a dedicated stream designed to honor materials,
              celebrate craft, and eliminate waste. Navigating by material destiny rather than
              fleeting retail novelty.
            </p>
          </div>

          {/* Provenance Metrics / Ledger Tag */}
          <div className="bg-surface-container p-space-md rounded-xl max-w-sm w-full shadow-sm border border-outline-variant/30">
            <div className="flex justify-between items-center mb-space-xs">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Platform Circulated Mass
              </span>
              <span className="text-[13px] font-bold text-primary">428,910 kg</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: "78%" }} />
            </div>
            <div className="flex justify-between items-center mt-2.5 text-on-surface-variant">
              <span className="text-[12px]">6 Specialized Protocols</span>
              <span className="text-[11px] font-bold text-secondary">100% Traceable</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STICKY CURATOR RAIL / STREAM SWITCHER ───────────────────────── */}
      <div className="sticky top-20 z-40 w-full bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30 transition-all">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <nav className="flex items-center overflow-x-auto no-scrollbar gap-2 py-3">
            {[
              { id: "re-wear", num: "01", label: "RE:WEAR" },
              { id: "roots", num: "02", label: "ROOTS" },
              { id: "re-read", num: "03", label: "RE:READ" },
              { id: "re-make", num: "04", label: "RE:MAKE" },
              { id: "re-use", num: "05", label: "RE:USE" },
              { id: "re-source", num: "06", label: "RE:SOURCE" },
            ].map((s) => {
              const isActive = activeStream === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToStream(s.id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                  }`}
                >
                  <span className={isActive ? "text-primary-fixed" : "text-outline"}>{s.num}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── 3. STREAM 01: RE:WEAR ─────────────────────────────────────────── */}
      <section className="stream-anchor w-full py-space-2xl bg-surface-container-lowest scroll-mt-36 border-b border-outline-variant/20" id="re-wear">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-xl">
            {/* Lead Framing */}
            <div className="lg:col-span-5">
              <span className="text-[11px] font-bold tracking-widest text-secondary uppercase block mb-1">
                STREAM 01 // TEXTILE CONTINUITY
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[36px] text-primary tracking-tight mb-space-xs">
                RE:WEAR
              </h2>
              <p className="font-[family-name:var(--font-playfair)] text-[18px] text-on-surface italic mb-space-md">
                Timeless garments given a second chapter.
              </p>
              <p className="text-[15px] text-on-surface-variant mb-space-lg leading-relaxed">
                From authenticated raw Japanese denim and Harris Tweed outerwear to archival silk
                jackets and vintage band tees. Every garment is inspected for textile integrity,
                graded by patina, and ready for decades more wear.
              </p>

              {/* Sub-category Filter Badges */}
              <div className="flex flex-wrap gap-2 mb-space-lg">
                {["Curated Vintage", "Designer Archive", "Everyday Thrift", "Denim & Outerwear"].map(
                  (filterTag) => (
                    <Link
                      key={filterTag}
                      href={`/marketplace?category=RE%3AWEAR&q=${encodeURIComponent(filterTag)}`}
                      className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[13px] font-medium transition-colors"
                    >
                      {filterTag}
                    </Link>
                  )
                )}
              </div>

              <div className="flex items-center gap-space-md">
                <Link
                  href="/categories/RE%3AWEAR"
                  className="inline-flex items-center gap-2 text-primary text-[13px] font-bold hover:translate-x-1 transition-transform group"
                >
                  <span>Enter RE:WEAR Gallery</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="text-outline text-xs">/</span>
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  {reWear.length} Active Garments
                </span>
              </div>
            </div>

            {/* Visual Hero Mosaic */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {reWear.slice(0, 2).map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="relative rounded-xl overflow-hidden bg-surface-container aspect-[4/5] shadow-sm group block"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 35vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent flex flex-col justify-end p-space-md">
                    <span className="text-[11px] font-semibold text-secondary-container mb-1 tracking-wider uppercase">
                      {idx === 0 ? "PROVENANCE: CURATED ARCHIVE" : "AUTHENTICATED TEXTILE"}
                    </span>
                    <h4 className="font-[family-name:var(--font-playfair)] text-[18px] text-on-primary line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[16px] font-bold text-primary-fixed mt-1">
                      {formatPrice(item.price)}
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-on-secondary-container line-through text-xs font-normal ml-2">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Curated Stream Bar Items */}
          <div className="p-space-lg bg-surface-container-low rounded-xl border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Just Cataloged Into RE:WEAR
              </span>
              <span className="text-[12px] text-outline">Updated recently</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
              {reWear.slice(2, 6).map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm hover:shadow transition-shadow block group"
                >
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    {item.condition.toUpperCase()}
                  </span>
                  <p className="text-[13px] font-medium text-on-surface truncate mt-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[15px] font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. STREAM 02: ROOTS ───────────────────────────────────────────── */}
      <section className="stream-anchor w-full py-space-2xl bg-surface-container-low scroll-mt-36 border-b border-outline-variant/20" id="roots">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Visual Presentation Left */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-surface-container shadow-sm relative">
                <Image
                  src={roots[1]?.image || roots[0]?.image || "/images/khurja-pottery-hero.jpg"}
                  alt="Artisanal master potter at work"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Guild Seal Overlay Badge */}
              <div className="absolute -bottom-6 -right-2 md:right-6 bg-surface-container-lowest p-space-md rounded-xl shadow-md max-w-xs border border-outline-variant/30">
                <div className="flex items-center gap-space-xs text-primary mb-1">
                  <CheckCircle2 size={18} className="text-secondary" />
                  <span className="text-[13px] font-bold">Artisan Direct Contract</span>
                </div>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  88% of every sale goes directly to the regional guild collective with zero
                  middleman markup.
                </p>
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-6 lg:pl-space-md mt-8 lg:mt-0">
              <span className="text-[11px] font-bold tracking-widest text-secondary uppercase block mb-1">
                STREAM 02 // HERITAGE GUILDS
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[36px] text-primary tracking-tight mb-space-xs">
                ROOTS
              </h2>
              <p className="font-[family-name:var(--font-playfair)] text-[18px] text-on-surface italic mb-space-md">
                Direct from master artisans and traditional guilds.
              </p>
              <p className="text-[15px] text-on-surface-variant mb-space-lg leading-relaxed">
                Preserving indigenous know-how and cultural handcrafts that resist mass mechanization.
                Each piece carries an immutable geographic tag and the hallmark of its maker’s
                lineage.
              </p>
              <div className="grid grid-cols-2 gap-space-sm mb-space-lg">
                {[
                  { title: "Handloom Textiles", desc: "Khadi, Ikat, Tussar silk" },
                  { title: "Terracotta & Clay", desc: "Wood-fired stoneware" },
                  { title: "Heritage Metalwork", desc: "Brass, Dhokra, Bell Metal" },
                  { title: "Woodcraft", desc: "Kashmir Walnut, Channapatna" },
                ].map((craft) => (
                  <Link
                    key={craft.title}
                    href={`/marketplace?category=ROOTS&q=${encodeURIComponent(craft.title)}`}
                    className="p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors block group"
                  >
                    <span className="text-[13px] text-primary group-hover:underline font-bold block">
                      {craft.title}
                    </span>
                    <span className="text-[12px] text-on-surface-variant">
                      {craft.desc}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-space-md">
                <Link
                  href="/categories/ROOTS"
                  className="inline-flex items-center gap-2 px-space-lg py-2.5 bg-primary text-on-primary rounded-lg text-[13px] font-semibold hover:bg-primary-container transition-colors"
                >
                  <span>Support Guild Makers</span>
                  <ArrowUpRight size={16} />
                </Link>
                <span className="text-[13px] text-secondary font-medium">34 Active Cooperatives</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. STREAM 03: RE:READ ─────────────────────────────────────────── */}
      <section className="stream-anchor w-full py-space-2xl bg-surface-container-lowest scroll-mt-36 border-b border-outline-variant/20" id="re-read">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-xl">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-bold tracking-widest text-secondary uppercase block mb-1">
                STREAM 03 // INTELLECTUAL CIRCULATION
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[36px] text-primary tracking-tight mb-space-xs">
                RE:READ
              </h2>
              <p className="font-[family-name:var(--font-playfair)] text-[18px] text-on-surface italic mb-space-md">
                Knowledge passed from one mind to another.
              </p>
              <p className="text-[15px] text-on-surface-variant mb-space-lg leading-relaxed">
                Books are meant to circulate, not gather dust on isolated shelves. RE:READ gathers
                out-of-print design monographs, verified academic syllabi, first editions, and
                annotated literary masterworks.
              </p>

              {/* Drop Box Banner for Students */}
              <div className="p-space-md bg-secondary-container text-primary rounded-xl mb-space-lg border border-secondary/20">
                <div className="flex items-start gap-space-sm">
                  <School size={24} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-[family-name:var(--font-playfair)] text-[16px] font-bold text-primary mb-1">
                      Campus Book Return &amp; Swap
                    </h4>
                    <p className="text-[12px] leading-relaxed mb-space-sm text-on-surface-variant">
                      Students get immediate circular credit when passing required texts to the next
                      cohort. Drop off at 48 campus lockers or ship with prepaid label.
                    </p>
                    <Link
                      href="/marketplace?category=RE%3AREAD&q=student"
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      Find Nearest Locker →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Academic Textbooks", "Literary Fiction", "Architecture & Design", "Rare Editions"].map(
                  (tag) => (
                    <Link
                      key={tag}
                      href={`/marketplace?category=RE%3AREAD&q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-surface-container rounded-lg text-[12px] font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      {tag}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Archival Book Displays */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              {reRead.slice(0, 3).map((book) => {
                const wishlisted = isWishlisted(book.id);
                return (
                  <div
                    key={book.id}
                    className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30 group"
                  >
                    <div>
                      <Link href={`/product/${book.id}`} className="block">
                        <div className="w-full aspect-[3/4] bg-surface-container rounded-md overflow-hidden mb-space-sm relative">
                          <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                          {book.condition.toUpperCase()}
                        </span>
                        <h5 className="font-[family-name:var(--font-playfair)] text-[15px] font-semibold text-on-surface mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h5>
                        <p className="text-[12px] text-outline mt-0.5">{book.location}</p>
                      </Link>
                    </div>
                    <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-outline-variant/20">
                      <span className="text-[15px] font-bold text-primary">
                        {formatPrice(book.price)}
                      </span>
                      <button
                        onClick={() => toggleWishlist(book.id)}
                        className="p-1.5 text-primary hover:bg-surface-container rounded-lg transition-colors"
                        title={wishlisted ? "Remove bookmark" : "Save bookmark"}
                      >
                        <Bookmark
                          size={18}
                          className={wishlisted ? "fill-primary text-primary" : "text-outline"}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. STREAM 04: RE:MAKE ─────────────────────────────────────────── */}
      <section className="stream-anchor w-full py-space-2xl bg-surface-container-high scroll-mt-36 border-b border-outline-variant/20" id="re-make">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Text & Spec */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <span className="text-[11px] font-bold tracking-widest text-secondary uppercase block mb-1">
                STREAM 04 // UP-CYCLING &amp; ARTISANAL REBIRTH
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[36px] text-primary tracking-tight mb-space-xs">
                RE:MAKE
              </h2>
              <p className="font-[family-name:var(--font-playfair)] text-[18px] text-on-surface italic mb-space-md">
                Creativity turning discarded materials into art.
              </p>
              <p className="text-[15px] text-on-surface-variant mb-space-lg leading-relaxed">
                Where industrial offcuts, decommissioned architectural timber, and garment salvage
                meet visionary craft. Nothing here is mass-manufactured; every object is a singular
                response to waste.
              </p>

              <div className="space-y-space-sm mb-space-lg">
                {[
                  {
                    icon: Armchair,
                    title: "Upcycled Furniture",
                    desc: "Beams converted to brutalist benches and tables",
                  },
                  {
                    icon: Palette,
                    title: "Textile Art & Patchwork",
                    desc: "Heirloom Kantha hangings, recycled canvas totes",
                  },
                  {
                    icon: Lightbulb,
                    title: "Repurposed Decor & Salvage",
                    desc: "Machined brass fixtures and scrap mouth-blown glass",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={`/marketplace?category=RE%3AMAKE&q=${encodeURIComponent(item.title)}`}
                      className="flex items-center gap-space-md p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors group block"
                    >
                      <Icon size={22} className="text-primary shrink-0" />
                      <div>
                        <span className="text-[13px] text-primary group-hover:underline font-bold block">
                          {item.title}
                        </span>
                        <span className="text-[12px] text-on-surface-variant">
                          {item.desc}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/categories/RE%3AMAKE"
                className="inline-flex items-center gap-2 px-space-lg py-2.5 bg-primary text-on-primary rounded-lg text-[13px] font-semibold hover:bg-primary-container transition-colors"
              >
                <span>Explore The Upcycled Archive</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Featured Upcycled Installation Card */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              {reMake[0] && (
                <Link
                  href={`/product/${reMake[0].id}`}
                  className="relative rounded-2xl overflow-hidden bg-surface-container shadow-md group block"
                >
                  <div className="relative w-full h-[440px]">
                    <Image
                      src={reMake[0].image}
                      alt={reMake[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-sm p-space-lg m-space-md rounded-xl border border-outline-variant/30">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-space-xs">
                      <div>
                        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                          RECLAIMED MATERIALS &amp; ARTISANAL CRAFT
                        </span>
                        <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-medium text-primary mt-0.5">
                          {reMake[0].title}
                        </h3>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">
                          {reMake[0].sellerName} • {reMake[0].location}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[20px] font-bold text-primary block">
                          {formatPrice(reMake[0].price)}
                        </span>
                        <span className="text-[11px] font-semibold text-outline">1 of 1 Singular Edition</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. STREAM 05: RE:USE ─────────────────────────────────────────── */}
      <section className="stream-anchor w-full py-space-2xl bg-surface-container-lowest scroll-mt-36 border-b border-outline-variant/20" id="re-use">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-xl">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-bold tracking-widest text-secondary uppercase block mb-1">
                STREAM 05 // HARDWARE LONGEVITY
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[36px] text-primary tracking-tight mb-space-xs">
                RE:USE
              </h2>
              <p className="font-[family-name:var(--font-playfair)] text-[18px] text-on-surface italic mb-space-md">
                Functional technology rescued from premature disposal.
              </p>
              <p className="text-[15px] text-on-surface-variant mb-space-lg leading-relaxed">
                Consumer electronics shouldn&apos;t sit in landfills because of a depleted capacitor or
                degraded cell. We inspect, recell, and recertify classic analog cameras, professional
                audio monitoring gear, and modular computing rigs.
              </p>

              {/* 6-Month Circular Warranty Seal */}
              <div className="bg-surface-container p-space-md rounded-xl mb-space-lg border border-outline-variant/30">
                <div className="flex items-center gap-space-sm mb-space-xs">
                  <ShieldCheck size={28} className="text-primary shrink-0" />
                  <div>
                    <span className="text-[14px] font-bold text-primary block">
                      6-Month Circular Warranty
                    </span>
                    <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block">
                      PARTS, BATTERY &amp; LABOUR REPAIR GUARANTEE
                    </span>
                  </div>
                </div>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Every certified machine includes complete diagnostic testing logs and verified
                  component integrity.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Audio & Hi-Fi", "Cameras & Optics", "Computing", "Home Essentials"].map((tech) => (
                  <Link
                    key={tech}
                    href={`/marketplace?category=RE%3AUSE&q=${encodeURIComponent(tech)}`}
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-[13px] font-medium text-on-surface transition-colors"
                  >
                    {tech}
                  </Link>
                ))}
              </div>
            </div>

            {/* Hardware Showcase Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {reUse.slice(0, 2).map((hw, idx) => (
                <Link
                  key={hw.id}
                  href={`/product/${hw.id}`}
                  className="bg-surface-container-low p-space-md rounded-xl shadow-sm border border-outline-variant/30 block group"
                >
                  <div className="w-full aspect-[4/3] rounded-lg bg-surface-container overflow-hidden mb-space-sm relative">
                    <Image
                      src={hw.image}
                      alt={hw.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 35vw"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                      {idx === 0 ? "BENCH TESTED" : "RESTORATION CERTIFIED"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                    {hw.condition.toUpperCase()}
                  </span>
                  <h4 className="font-[family-name:var(--font-playfair)] text-[16px] font-semibold text-primary mt-0.5 line-clamp-1 group-hover:text-secondary transition-colors">
                    {hw.title}
                  </h4>
                  <div className="flex justify-between items-center mt-space-sm pt-space-xs border-t border-outline-variant/20">
                    <span className="text-[16px] font-bold text-primary">{formatPrice(hw.price)}</span>
                    <span className="text-[12px] text-on-surface-variant">{hw.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. STREAM 06: RE:SOURCE ───────────────────────────────────────── */}
      <section className="stream-anchor w-full py-space-2xl bg-surface-container-low scroll-mt-36 border-b border-outline-variant/20" id="re-source">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Visual Surplus Bolt */}
            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden aspect-[16/10] bg-surface-container shadow-sm relative">
                {reSource[0] && (
                  <Image
                    src={reSource[0].image}
                    alt={reSource[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded text-[11px] font-bold text-primary uppercase tracking-wider shadow-sm">
                  AVAILABLE BY METRE OR COMPLETE LOT
                </div>
              </div>
            </div>

            {/* Copy & Business Mechanics */}
            <div className="lg:col-span-6 lg:pl-space-md">
              <span className="text-[11px] font-bold tracking-widest text-secondary uppercase block mb-1">
                STREAM 06 // INDUSTRIAL DEADSTOCK
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[36px] text-primary tracking-tight mb-space-xs">
                RE:SOURCE
              </h2>
              <p className="font-[family-name:var(--font-playfair)] text-[18px] text-on-surface italic mb-space-md">
                B2B surplus and maker materials priced for creative reuse.
              </p>
              <p className="text-[15px] text-on-surface-variant mb-space-lg leading-relaxed">
                Factories, ateliers, and architectural firms generate metric tons of virgin surplus
                destined for incinerators. We intercept these high-grade inputs and make them
                accessible to independent designers, students, and small-batch studios.
              </p>

              <div className="grid grid-cols-2 gap-space-sm mb-space-lg">
                {[
                  { title: "Deadstock Fabric", desc: "Linen, silk twill, organic canvas bolts" },
                  { title: "Leather Remnants", desc: "Veg-tan scraps from luxury luggage ateliers" },
                  { title: "Timber Offcuts", desc: "FSC kiln-dried teak, oak, and rosewood" },
                  { title: "Packaging Lots", desc: "Surplus kraft mailers, unprinted glass vials" },
                ].map((mat) => (
                  <Link
                    key={mat.title}
                    href={`/marketplace?category=RE%3ASOURCE&q=${encodeURIComponent(mat.title)}`}
                    className="p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors block group"
                  >
                    <span className="text-[13px] text-primary group-hover:underline font-bold block">
                      {mat.title}
                    </span>
                    <p className="text-[12px] text-on-surface-variant">
                      {mat.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-space-md">
                <Link
                  href="/categories/RE%3ASOURCE"
                  className="inline-flex items-center gap-2 px-space-lg py-2.5 bg-primary text-on-primary rounded-lg text-[13px] font-semibold hover:bg-primary-container transition-colors"
                >
                  <span>Request Material Sample / Wholesale</span>
                  <Building2 size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. STREAM TAXONOMY DIRECTORY MATRIX ─────────────────────────────── */}
      <section className="w-full py-space-2xl bg-surface">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-secondary uppercase block mb-1">
                DIRECT TAXONOMY ENTRY
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[28px] font-medium text-primary">
                Cross-Stream Directory
              </h2>
            </div>
            <p className="text-[13px] text-on-surface-variant max-w-md mt-2 md:mt-0">
              Jump directly into specific circular tiers or explore our curated taxonomy of verified
              sustainable resale items.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-md">
            {[
              {
                num: "01",
                stream: "RE:WEAR",
                cat: "RE:WEAR",
                links: ["Knitwear", "Outerwear", "Footwear", "Silks & Formal", "Accessories"],
              },
              {
                num: "02",
                stream: "ROOTS",
                cat: "ROOTS",
                links: ["Saris & Shawls", "Clay Vessels", "Brassware", "Carved Teak", "Natural Dyes"],
              },
              {
                num: "03",
                stream: "RE:READ",
                cat: "RE:READ",
                links: ["STEM Courses", "Humanities", "Design Folios", "Poetry Broadsheets", "Rare Books"],
              },
              {
                num: "04",
                stream: "RE:MAKE",
                cat: "RE:MAKE",
                links: ["Lighting", "Patchwork", "Wall Sculptures", "Stools & Benches", "Planters"],
              },
              {
                num: "05",
                stream: "RE:USE",
                cat: "RE:USE",
                links: ["Turntables", "35mm Cameras", "Modular Laptops", "Studio Monitors", "Espresso Units"],
              },
              {
                num: "06",
                stream: "RE:SOURCE",
                cat: "RE:SOURCE",
                links: ["Textile Rolls", "Leather Bundles", "Hardwood Scrap", "Hardware Surplus", "Glass Vials"],
              },
            ].map((col) => (
              <div key={col.stream} className="p-space-md bg-surface-container rounded-xl border border-outline-variant/20">
                <Link
                  href={`/categories/${encodeURIComponent(col.cat)}`}
                  className="text-[11px] font-bold text-secondary tracking-wider block mb-2 hover:text-primary transition-colors"
                >
                  {`${col.num} // ${col.stream}`}
                </Link>
                <ul className="space-y-1 text-on-surface-variant text-[13px]">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={`/marketplace?category=${encodeURIComponent(col.cat)}&q=${encodeURIComponent(link)}`}
                        className="hover:text-primary transition-colors block py-0.5"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
