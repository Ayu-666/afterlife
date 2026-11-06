"use client";

import { Leaf, Package, BookOpen, Recycle, Shirt, Zap, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useMarketplace } from "@/lib/context";
import { CATEGORIES, CATEGORY_META } from "@/lib/data";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "RE:WEAR": Shirt,
  "ROOTS": Leaf,
  "RE:READ": BookOpen,
  "RE:MAKE": Recycle,
  "RE:USE": Package,
  "RE:SOURCE": Zap,
};

const DEMO_IMPACT_STATS = [
  { label: "Demo items in catalogue", value: "36", unit: "listings", note: "Seed data" },
  { label: "Illustrative CO₂ saved", value: "~2,400", unit: "kg", note: "Hypothetical figure" },
  { label: "Estimated litres of water", value: "~180,000", unit: "L", note: "Illustrative only" },
  { label: "Items given a second life", value: "36", unit: "items", note: "Seed data" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "List what you have",
    description: "Sell, give away, or offer surplus materials in minutes. No fees, no gatekeeping.",
  },
  {
    step: "02",
    title: "AI connects buyers and sellers",
    description: "AFTERLIFE Finder uses natural language to match people with the exact items they need.",
  },
  {
    step: "03",
    title: "Value flows, waste shrinks",
    description: "Every transaction keeps an item out of a landfill and puts money in a seller's hands.",
  },
];

export default function ImpactPage() {
  const { products } = useMarketplace();
  const totalProducts = products.length;
  const demoCount = products.filter((p) => p.isDemo).length;
  const userCount = products.filter((p) => !p.isDemo).length;

  const categoryBreakdown = CATEGORIES.map((cat) => ({
    category: cat,
    count: products.filter((p) => p.category === cat).length,
    meta: CATEGORY_META[cat],
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-on-primary py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-on-primary/10 rounded-full px-4 py-1.5 mb-6">
            <Leaf size={14} />
            <span className="text-xs font-semibold tracking-widest uppercase">Impact & Circulation</span>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[36px] md:text-[56px] font-normal leading-tight mb-4">
            Every item here has a story.<br />
            <span className="italic">Give it a second chapter.</span>
          </h1>
          <p className="text-on-primary/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            AFTERLIFE is a circular marketplace. We believe the most sustainable product is one that already exists.
          </p>
        </div>
      </div>

      {/* Important disclaimer */}
      <div className="bg-surface-container border-b border-outline-variant px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3 text-sm text-on-surface-variant">
            <AlertTriangle size={16} className="text-outline shrink-0 mt-0.5" />
            <div>
              <strong className="text-on-surface">Transparency notice:</strong>{" "}
              All environmental statistics and impact figures shown on this page are{" "}
              <strong>illustrative and hypothetical</strong> — they are not independently verified.
              AFTERLIFE is currently in its early demonstration phase. Real verified impact data will
              be published once the platform reaches scale.
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
        {/* Catalogue stats — real numbers */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-primary mb-2">
              What&apos;s in the catalogue
            </h2>
            <p className="text-on-surface-variant text-sm">Real numbers from our current demo catalogue.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total listings", value: totalProducts, note: "Seed + user" },
              { label: "Demo listings", value: demoCount, note: "Pre-loaded" },
              { label: "User listings", value: userCount, note: "Community added" },
              { label: "Categories", value: 6, note: "Active" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 text-center"
              >
                <div className="text-3xl font-semibold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-on-surface">{stat.label}</div>
                <div className="text-xs text-outline mt-0.5">{stat.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo impact figures */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant rounded-full px-4 py-1.5 mb-4">
              <AlertTriangle size={12} className="text-outline" />
              <span className="text-xs text-outline font-semibold tracking-widest uppercase">
                Illustrative Data — Not Verified
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-primary mb-2">
              Potential environmental impact
            </h2>
            <p className="text-on-surface-variant text-sm max-w-xl mx-auto">
              These are hypothetical estimates based on published lifecycle analysis data for second-hand goods.
              They are for illustration only and do not represent actual verified savings.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEMO_IMPACT_STATS.map((s) => (
              <div
                key={s.label}
                className="bg-surface-container border border-outline-variant/50 rounded-2xl p-5 text-center"
              >
                <div className="text-3xl font-semibold text-primary mb-1">{s.value}</div>
                <div className="text-xs text-outline uppercase tracking-wide mb-0.5">{s.unit}</div>
                <div className="text-sm text-on-surface">{s.label}</div>
                <div className="text-[10px] text-outline mt-1 italic">{s.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Category breakdown */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-primary mb-2">
              Six categories, one marketplace
            </h2>
            <p className="text-on-surface-variant text-sm">
              Listings across the circular economy spectrum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryBreakdown.map(({ category, count, meta }) => {
              const Icon = CATEGORY_ICONS[category] || Leaf;
              return (
                <Link
                  key={category}
                  href={`/categories/${encodeURIComponent(category)}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:border-secondary hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Icon size={18} className="text-secondary group-hover:text-on-primary transition-colors" />
                    </div>
                    <span className="text-2xl font-semibold text-primary">{count}</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-primary mb-1">
                    {category}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {meta.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-primary mb-2">
              How AFTERLIFE works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6"
              >
                <div className="font-[family-name:var(--font-playfair)] text-5xl font-normal text-primary/10 mb-3 leading-none">
                  {step.step}
                </div>
                <h3 className="font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="bg-primary text-on-primary rounded-3xl px-8 py-12 text-center">
          <Leaf size={32} className="text-on-primary/50 mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl mb-4">
            Find value in what the world overlooks.
          </h2>
          <p className="text-on-primary/70 max-w-2xl mx-auto text-base leading-relaxed mb-8">
            AFTERLIFE connects buyers, sellers, artisans, students and small businesses through pre-owned goods,
            handmade items, refurbished products, upcycled creations and surplus materials.
            Every transaction is a vote for a better way to consume.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/marketplace"
              className="bg-on-primary text-primary px-6 py-3 rounded-full text-sm font-semibold hover:bg-inverse-on-surface transition-colors"
            >
              Explore the marketplace
            </Link>
            <Link
              href="/sell"
              className="border border-on-primary/40 text-on-primary px-6 py-3 rounded-full text-sm font-semibold hover:border-on-primary transition-colors"
            >
              List an item
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
