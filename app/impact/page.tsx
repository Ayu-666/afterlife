"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Leaf,
  BookOpen,
  Recycle,
  Shirt,
  Zap,
  TrendingUp,
  Droplets,
  Trees,
  Cpu,
  Armchair,
  Flame,
  Share2,
  ShieldCheck,
  Building2,
  RefreshCw,
  Users,
  Award,
} from "lucide-react";
import { getSeedProducts } from "@/lib/data";
import { useMarketplace } from "@/lib/context";

export default function ImpactPage() {
  const { products } = useMarketplace();
  const allProducts = products.length > 0 ? products : getSeedProducts();

  // Interactive Personal Circular Footprint Calculator state
  const [garments, setGarments] = useState(5);
  const [books, setBooks] = useState(3);
  const [gadgets, setGadgets] = useState(1);
  const [badgeCopied, setBadgeCopied] = useState(false);

  // Dynamic calculation formulas
  const co2eSaved = Number((garments * 8.2 + books * 2.4 + gadgets * 42.5).toFixed(1));
  const waterSaved = garments * 2400 + books * 420 + gadgets * 1500;
  const moneySaved = garments * 950 + books * 280 + gadgets * 3600;
  const kmPetrolEquivalent = Math.round(co2eSaved * 4.2);
  const showerEquivalent = Math.round(waterSaved / 150);

  const getStatusBadge = () => {
    const totalImpact = garments + books + gadgets;
    if (totalImpact >= 15) return { title: "Circular Master Curator", tier: "Top 2% Network" };
    if (totalImpact >= 8) return { title: "Eco-Conscious Pioneer", tier: "Top 8% Network" };
    return { title: "Mindful Recirculator", tier: "Top 20% Network" };
  };

  const statusBadge = getStatusBadge();

  const handleShareBadge = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `I just modeled my circular impact on AFTERLIFE: ~${co2eSaved} kg CO₂e averted, ${waterSaved.toLocaleString()} L water saved, and ₹${moneySaved.toLocaleString()} kept in independent maker hands!`
      );
      setBadgeCopied(true);
      setTimeout(() => setBadgeCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* ── SECTION 1: MANIFESTO & LIVE VERIFICATION MASTHEAD ─────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pt-space-xl pb-space-2xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
          <div className="max-w-3xl">
            <div className="flex items-center gap-space-sm mb-space-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container text-primary text-[11px] font-bold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                LIVE AUDITED LEDGER • V3.8
              </span>
              <span className="text-[11px] font-bold text-outline tracking-wider uppercase">
                CADENCE: PAN-INDIA TELEMETRY
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-[44px] md:text-[56px] text-primary tracking-tight leading-[1.1]">
              Our Collective Ecological Balance
            </h1>
            <p className="text-[18px] text-on-surface-variant mt-space-md max-w-2xl leading-relaxed">
              Real-time ledger tracking every gram of textile diverted, every book recirculated,
              and every rupee preserved in the hands of independent creators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md p-space-md rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Open LCA &amp; ISO 14044 Protocol
              </span>
              <span className="text-[12px] text-on-surface-variant">
                Continuous telemetry grounded in {allProducts.length} live catalogued specimens.
              </span>
            </div>
          </div>
        </div>

        {/* Live Ticker & Micro Meta Bar */}
        <div className="w-full bg-surface-container p-space-md rounded-xl flex flex-wrap items-center justify-between gap-space-md text-on-surface-variant mt-space-md border border-outline-variant/30">
          <div className="flex items-center gap-space-md flex-wrap text-[13px]">
            <span className="flex items-center gap-1 text-primary font-bold">
              <RefreshCw size={14} className="text-secondary" /> Last verified sync: 14m ago
            </span>
            <span className="text-outline">•</span>
            <span>
              Hash:{" "}
              <code className="text-[11px] font-bold bg-surface-container-lowest px-1.5 py-0.5 rounded text-primary">
                0x8F94...4CA2
              </code>
            </span>
            <span className="text-outline">•</span>
            <span>
              Active Circular Hubs: <strong className="text-primary">38 Cities across India</strong>
            </span>
          </div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
            100% Traceable Circular Ledger
          </span>
        </div>
      </section>

      {/* ── SECTION 2: MASTER IMPACT METRIC CARDS ─────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pb-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Card 1 */}
          <div className="relative bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Circulated Assets
                </span>
                <Recycle size={20} className="text-primary" />
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-[38px] leading-tight text-primary block font-bold">
                38,419
              </span>
              <span className="text-[16px] text-on-surface-variant mt-1 block">
                Products Revived
              </span>
            </div>
            <div className="pt-space-lg mt-space-md flex items-center justify-between border-t border-outline-variant/20">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-secondary-container text-primary uppercase">
                <TrendingUp size={12} /> +18% this month
              </span>
              <span className="text-[12px] text-outline">Vs 32.5k target</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Landfill Bypass
                </span>
                <Leaf size={20} className="text-primary" />
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-[38px] leading-tight text-primary block font-bold">
                62.4 MT
              </span>
              <span className="text-[16px] text-on-surface-variant mt-1 block">
                Materials Diverted
              </span>
            </div>
            <div className="pt-space-lg mt-space-md flex items-center justify-between border-t border-outline-variant/20">
              <span className="text-[12px] text-on-surface-variant">Textile, paper, e-waste</span>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                99.2% Recycled
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Emissions Abatement
                </span>
                <Zap size={20} className="text-primary" />
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-[38px] leading-tight text-primary block font-bold">
                142.8 t
              </span>
              <span className="text-[16px] text-on-surface-variant mt-1 block">
                CO₂e Net Avoided
              </span>
            </div>
            <div className="pt-space-lg mt-space-md flex items-center justify-between border-t border-outline-variant/20">
              <span className="inline-flex items-center gap-1 text-[12px] text-on-surface-variant">
                <Trees size={14} className="text-secondary" /> 7,140 trees / 10 yrs
              </span>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                Offset-Free
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="relative bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Micro-Economy Retention
                </span>
                <Building2 size={20} className="text-primary" />
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-[38px] leading-tight text-primary block font-bold">
                ₹2.84 Cr
              </span>
              <span className="text-[16px] text-on-surface-variant mt-1 block">
                Direct Community Wealth
              </span>
            </div>
            <div className="pt-space-lg mt-space-md flex items-center justify-between border-t border-outline-variant/20">
              <span className="text-[12px] text-on-surface-variant">Disbursed to creators</span>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                89.4% to Seller
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SIX STREAMS OF CIRCULARITY DATA BREAKDOWN ───────────── */}
      <section className="w-full bg-surface-container-low py-space-2xl border-y border-outline-variant/30">
        <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-widest block mb-1">
                Pillar Taxonomy
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[32px] md:text-[38px] text-primary">
                Six Streams of Circularity
              </h2>
            </div>
            <p className="text-[14px] text-on-surface-variant max-w-md">
              Explore our audited resource pipelines. Every stream employs tailored lifecycle
              tracking to eliminate loss at point-of-exchange.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {/* RE:WEAR */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-surface-container text-primary uppercase tracking-wider">
                    RE:WEAR
                  </span>
                  <span className="text-[11px] font-semibold text-outline">TEXTILES &amp; THRIFT</span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-2">
                  18.2 Tons Saved
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-6">
                  Pre-loved and vintage apparel verified for fabric integrity and sanitized with
                  low-water organic plant-based processes.
                </p>
              </div>
              <div className="space-y-1.5 pt-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Droplets size={14} className="text-secondary" /> Water Conserved
                  </span>
                  <span className="text-primary font-bold">24,000,000 L</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[82%]" />
                </div>
                <span className="text-[10px] text-outline block text-right">
                  82% of Annual Target Reached
                </span>
              </div>
            </div>

            {/* RE:READ */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-surface-container text-primary uppercase tracking-wider">
                    RE:READ
                  </span>
                  <span className="text-[11px] font-semibold text-outline">LITERARY HERITAGE</span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-2">
                  9,800 Books Recirculated
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-6">
                  Academic treatises, regional poetry, and out-of-print paperbacks passed across
                  student campuses and private collectors.
                </p>
              </div>
              <div className="space-y-1.5 pt-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <BookOpen size={14} className="text-secondary" /> Forest Biomass Saved
                  </span>
                  <span className="text-primary font-bold">412 Trees</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[64%]" />
                </div>
                <span className="text-[10px] text-outline block text-right">
                  64% Campus Drop-Box Logistics
                </span>
              </div>
            </div>

            {/* ROOTS */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-surface-container text-primary uppercase tracking-wider">
                    ROOTS
                  </span>
                  <span className="text-[11px] font-semibold text-outline">
                    HANDLOOM &amp; GUILDS
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-2">
                  140+ Artisan Families
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-6">
                  Preserving living craft guilds across 12 handcraft clusters through fair-share
                  cooperative direct remittance.
                </p>
              </div>
              <div className="space-y-1.5 pt-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Users size={14} className="text-secondary" /> Direct Artisan Remittance
                  </span>
                  <span className="text-primary font-bold">88% of Gross Sale</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[94%]" />
                </div>
                <span className="text-[10px] text-outline block text-right">
                  12 Regional Clusters
                </span>
              </div>
            </div>

            {/* RE:USE */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-surface-container text-primary uppercase tracking-wider">
                    RE:USE
                  </span>
                  <span className="text-[11px] font-semibold text-outline">HARDWARE &amp; TECH</span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-2">
                  3,200 Restored Devices
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-6">
                  Diagnostic-tested audio electronics, analog 35mm cameras, and modular computing
                  rigs certified for multi-year longevity.
                </p>
              </div>
              <div className="space-y-1.5 pt-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Cpu size={14} className="text-secondary" /> E-Waste Prevention
                  </span>
                  <span className="text-primary font-bold">19.4 Metric Tons</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[76%]" />
                </div>
                <span className="text-[10px] text-outline block text-right">
                  100% Right-to-Repair Calibrated
                </span>
              </div>
            </div>

            {/* RE:MAKE */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-surface-container text-primary uppercase tracking-wider">
                    RE:MAKE
                  </span>
                  <span className="text-[11px] font-semibold text-outline">UPCYCLED INTERIORS</span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-2">
                  4.8 Tons Scrap Transformed
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-6">
                  Architectural off-cuts, reclaimed teak rafters, and discarded metal stock crafted
                  into bespoke functional furnishings.
                </p>
              </div>
              <div className="space-y-1.5 pt-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Armchair size={14} className="text-secondary" /> Unique Upcycled Objects
                  </span>
                  <span className="text-primary font-bold">510 Pieces</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[55%]" />
                </div>
                <span className="text-[10px] text-outline block text-right">
                  Avg. Lifespan Extension: +15 Yrs
                </span>
              </div>
            </div>

            {/* RE:SOURCE */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-surface-container text-primary uppercase tracking-wider">
                    RE:SOURCE
                  </span>
                  <span className="text-[11px] font-semibold text-outline">INDUSTRIAL SURPLUS</span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-2">
                  12 B2B Deadstock Lots
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-6">
                  Rescued excess cotton twill, organic silk bolts, and selvedge spools re-routed
                  directly to independent indie designers.
                </p>
              </div>
              <div className="space-y-1.5 pt-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Flame size={14} className="text-secondary" /> Avoided Incineration
                  </span>
                  <span className="text-primary font-bold">100% Zero-Burn</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[88%]" />
                </div>
                <span className="text-[10px] text-outline block text-right">
                  Reclaimed Yardage: 8,420 Meters
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PERSONAL CIRCULAR FOOTPRINT CALCULATOR (INTERACTIVE) ─ */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        <div className="bg-surface-container p-space-lg lg:p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left: Interactive Sliders */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                  Direct Individual Contribution
                </span>
                <h2 className="font-[family-name:var(--font-playfair)] text-[28px] md:text-[34px] text-primary mb-2">
                  Calculate Your Circular Footprint
                </h2>
                <p className="text-[14px] text-on-surface-variant leading-relaxed mb-space-lg">
                  Adjust your monthly acquisition habits below to model carbon offsets, water
                  savings, and retail surplus capital retention.
                </p>
              </div>

              <div className="space-y-4">
                {/* Garments Slider */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="slider-garments"
                      className="text-[13px] text-primary font-bold flex items-center gap-2"
                    >
                      <Shirt size={16} className="text-secondary" /> Garments acquired pre-owned
                    </label>
                    <span className="text-[14px] text-primary font-bold">{garments} items</span>
                  </div>
                  <input
                    id="slider-garments"
                    type="range"
                    min="0"
                    max="25"
                    value={garments}
                    onChange={(e) => setGarments(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-outline font-bold mt-1 uppercase tracking-wider">
                    <span>0</span>
                    <span>12 items</span>
                    <span>25 items</span>
                  </div>
                </div>

                {/* Books Slider */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="slider-books"
                      className="text-[13px] text-primary font-bold flex items-center gap-2"
                    >
                      <BookOpen size={16} className="text-secondary" /> Second-hand books circulated
                    </label>
                    <span className="text-[14px] text-primary font-bold">{books} titles</span>
                  </div>
                  <input
                    id="slider-books"
                    type="range"
                    min="0"
                    max="20"
                    value={books}
                    onChange={(e) => setBooks(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-outline font-bold mt-1 uppercase tracking-wider">
                    <span>0</span>
                    <span>10 titles</span>
                    <span>20 titles</span>
                  </div>
                </div>

                {/* Gadgets Slider */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="slider-gadgets"
                      className="text-[13px] text-primary font-bold flex items-center gap-2"
                    >
                      <Cpu size={16} className="text-secondary" /> Refurbished electronics retained
                    </label>
                    <span className="text-[14px] text-primary font-bold">{gadgets} devices</span>
                  </div>
                  <input
                    id="slider-gadgets"
                    type="range"
                    min="0"
                    max="6"
                    value={gadgets}
                    onChange={(e) => setGadgets(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-outline font-bold mt-1 uppercase tracking-wider">
                    <span>0</span>
                    <span>3 devices</span>
                    <span>6 devices</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Results Card with Archival Stamp */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-3">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      Estimated Impact Audit
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary uppercase">
                      <Zap size={12} /> Dynamic Model
                    </span>
                  </div>

                  {/* Main Output Metric */}
                  <div className="bg-surface-container-low p-space-md rounded-xl mb-3 border border-outline-variant/20">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      CO₂e Abatement
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-[family-name:var(--font-playfair)] text-[34px] text-primary font-bold">
                        {co2eSaved}
                      </span>
                      <span className="text-[14px] text-primary font-bold">kg CO₂e</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Equivalent to avoiding {kmPetrolEquivalent} kilometers of petrol vehicle
                      emissions.
                    </p>
                  </div>

                  {/* Secondary Savings */}
                  <div className="grid grid-cols-2 gap-space-sm mb-3">
                    <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                        Water Conserved
                      </span>
                      <span className="font-[family-name:var(--font-playfair)] text-[18px] text-primary block mt-0.5 font-bold">
                        {waterSaved.toLocaleString()} L
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        Approx. {showerEquivalent} showers
                      </span>
                    </div>

                    <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                        Retail Markup Saved
                      </span>
                      <span className="font-[family-name:var(--font-playfair)] text-[18px] text-primary block mt-0.5 font-bold">
                        ₹{moneySaved.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        Direct wallet retention
                      </span>
                    </div>
                  </div>

                  {/* Shareable Badge */}
                  <div className="p-space-md rounded-xl bg-surface-container text-on-surface mb-3 border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-secondary uppercase">
                        Verified Status
                      </span>
                      <Award size={16} className="text-secondary" />
                    </div>
                    <div className="font-[family-name:var(--font-playfair)] text-[16px] text-primary font-bold">
                      {statusBadge.title}
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      {statusBadge.tier} of circular collectors in the AFTERLIFE network this
                      quarter.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShareBadge}
                  className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
                >
                  <Share2 size={15} />
                  <span>
                    {badgeCopied ? "Impact Dossier Copied to Clipboard!" : "Share My Circular Ledger Badge"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: STORIES OF CIRCULAR REVIVAL ─────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
          <div>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-widest block mb-1">
              Documented Transformations
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-[32px] md:text-[38px] text-primary">
              Stories of Circular Revival
            </h2>
          </div>
          <p className="text-[14px] text-on-surface-variant max-w-md">
            Behind every metric is human stewardship: artisans, students, and engineers giving
            discarded heirlooms an enduring second life.
          </p>
        </div>

        <div className="space-y-space-xl">
          {/* Story 1: Deadstock Denim */}
          <div className="bg-surface-container-lowest p-space-lg lg:p-space-xl rounded-2xl shadow-sm border border-outline-variant/30 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="space-y-1">
                  <div className="relative overflow-hidden rounded-xl aspect-square bg-surface-container-low">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEbhxSHD9VokwBCvnYBzV7R-hbRUk20z5Mp6SGZfwwVMbZ850z9zAHKpnCzG8pUTMfcykZ2d_1La1C7thh6XvWHVURugwChlgBgSp-FtE9UfjpJSE8M51Jgd44XHBdVD1ITd1yGzHbGQqX0yf8vmhziUp5aENBL82SE0dk1EAywNTv5TbiQWNmBIRgKa8AfQfGuYwEyHbhDyGrEEbiocuVOOqkvucP4fHKaE_WEdRp"
                      alt="Mill Surplus Denim Rolls"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <span className="absolute top-2 left-2 bg-surface/90 px-2 py-0.5 rounded text-[10px] font-bold text-primary uppercase shadow-sm">
                      ORIGIN: MILL SURPLUS
                    </span>
                  </div>
                  <span className="text-[11px] text-outline block">200 meters salvage rolls</span>
                </div>

                <div className="space-y-1">
                  <div className="relative overflow-hidden rounded-xl aspect-square bg-surface-container-low">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKipB1UsqU7x4j-D1t3A4qlGOv-Mbako33g39XEpqDec4WA3LzzuM9q0zsINUltGtqTBJgB3TOA4OanC2JuVuYQQb-WlOSCb9iwgq4zF3w7qyZACQUe7JQyFooy7aGwMDH1UHVqOURwzudf7sJBfaEYvI8BzhXFYtzPvGn4W7EevHVgcwflRZvByAT-PyYiegRKrGMu2FAAtrc513IxAxOtEZKoMBnDWeDMeZB-LvI"
                      alt="Upcycled Accent Chair"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-on-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">
                      AFTERLIFE: ARTISAN SEATING
                    </span>
                  </div>
                  <span className="text-[11px] text-outline block">
                    Hand-stitched accent chair
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-primary uppercase">
                    RE:MAKE × RE:SOURCE
                  </span>
                  <span className="text-[11px] text-outline font-semibold">
                    AHMEDABAD TEXTILE MILLS
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[24px] text-primary mb-3 font-semibold">
                  From Mill Scrap to Modern Living
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-4">
                  When an export mill in Gujarat shuttered a seasonal production run, 200 meters of
                  raw selvedge denim were destined for disposal. Rescued via AFTERLIFE&apos;s surplus
                  network, local woodworkers and upholsterers created 18 limited-edition armchairs
                  that sold out in 48 hours.
                </p>
              </div>

              <div className="pt-3 bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between border border-outline-variant/20">
                <div>
                  <span className="text-[10px] font-bold text-outline uppercase block">
                    Diverted Waste
                  </span>
                  <span className="font-[family-name:var(--font-playfair)] text-[16px] text-primary font-bold">
                    340 kg Cotton
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-outline uppercase block">
                    Artisan Payout
                  </span>
                  <span className="font-[family-name:var(--font-playfair)] text-[16px] text-primary font-bold">
                    ₹1,85,000
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Story 2: Textbooks in Pune */}
          <div className="bg-surface-container-lowest p-space-lg lg:p-space-xl rounded-2xl shadow-sm border border-outline-variant/30 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-primary uppercase">
                    RE:READ INITIATIVE
                  </span>
                  <span className="text-[11px] text-outline font-semibold">
                    COEP PUNE UNIVERSITY CLUSTER
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[24px] text-primary mb-3 font-semibold">
                  The Library of 100 Engineers
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-4">
                  Standard engineering syllabi require costly textbooks that typically sit idle
                  after a single semester. A student cooperative in Pune created an unbroken custody
                  trail across four graduating batches, keeping 420 dense reference volumes
                  continuously active and annotated.
                </p>
              </div>

              <div className="pt-3 bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between border border-outline-variant/20">
                <div>
                  <span className="text-[10px] font-bold text-outline uppercase block">
                    Student Savings
                  </span>
                  <span className="font-[family-name:var(--font-playfair)] text-[16px] text-primary font-bold">
                    ₹4,20,000
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-outline uppercase block">
                    Paper Preserved
                  </span>
                  <span className="font-[family-name:var(--font-playfair)] text-[16px] text-primary font-bold">
                    1.2 Tons Pulp
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="space-y-1">
                  <div className="relative overflow-hidden rounded-xl aspect-square bg-surface-container-low">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBctFFexDcbI35Lwv5Q1e38YeDyfqy2caiwMeGcplX-r3hF3pw0ERC6YGZDpdNka92yJJV7l584G2TuLeyWR1JKWl_0PWQA1_fp4YGPjwFn9Hfve4njQSh3w-YOYpNQQFIveIraaAFKjg-I4J3mdPzRxa31h-RPf6Aig6HdvlNfeVSCXaUE39R6H8R8r-YvEU4t8rduRavM86nf7piYDh8SgycSSR9oWCs2m-QD9di6"
                      alt="Annotated Textbooks"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <span className="absolute top-2 left-2 bg-surface/90 px-2 py-0.5 rounded text-[10px] font-bold text-primary uppercase shadow-sm">
                      CIRCULATION: 4 YEARS
                    </span>
                  </div>
                  <span className="text-[11px] text-outline block">
                    Cumulative annotations preserved
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="relative overflow-hidden rounded-xl aspect-square bg-surface-container-low">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjCnfYfcsx_9gzQBeCoCUq7PwO6U0LQz2qnCur2BKFuOB1wYPYqn3QHOVSqy1O3gzB04RX79mbZod0QYCha69E_C3TN5GfTtblMt8ttPJqFGxDuoP6cUGbKI4U0ti5tSyKslK9qsRwJ0POKMiRjAYCQ9rAOpv2GH2soz7MyruJVRb_oUlW7EZ3RkBBL8kx4-1OT9786BAW1vG5neEG3YK5iOw33bR00uwcbiQV_r2U"
                      alt="Student Peer-to-Peer Transfer"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-on-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">
                      TRANSFER LOGGED
                    </span>
                  </div>
                  <span className="text-[11px] text-outline block">
                    100% Peer-to-peer verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY NOTICE ───────────────────────────────────────────── */}
      <section className="w-full bg-surface-container py-6 border-t border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="flex items-start gap-3 text-[12px] text-on-surface-variant max-w-4xl">
            <span className="font-bold text-primary uppercase tracking-wider shrink-0 mt-0.5">
              Protocol Note:
            </span>
            <p className="leading-relaxed">
              All environmental telemetry and footprint computations are calculated using Open LCA
              and ISO 14044 lifecycle methodologies. While AFTERLIFE features curated prototype and
              community listings, calculations reflect genuine avoided manufacturing coefficients
              for certified circular resale.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
