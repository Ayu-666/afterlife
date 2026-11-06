"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, CATEGORY_META, getSeedProducts } from "@/lib/data";
import { useMarketplace } from "@/lib/context";

export default function CategoriesPage() {
  const { products } = useMarketplace();
  const allProducts = products.length > 0 ? products : getSeedProducts();

  return (
    <div className="flex flex-col w-full">
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pt-space-xl pb-space-2xl">
        <div className="mb-space-xl">
          <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
            Circular Pillars
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[40px] font-normal text-primary tracking-tight leading-tight mb-4">
            All Categories
          </h1>
          <p className="text-[18px] text-on-surface-variant max-w-2xl">
            Six distinct streams of circular commerce — each with its own character, provenance and
            community of makers and seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const catProducts = allProducts.filter((p) => p.category === cat);
            const coverImg =
              catProducts[0]?.image ||
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80";

            return (
              <Link
                key={cat}
                href={`/categories/${encodeURIComponent(cat)}`}
                className="group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-72 overflow-hidden bg-surface-container-high">
                  <Image
                    src={coverImg}
                    alt={cat}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-surface/90 text-primary text-[11px] font-semibold tracking-[0.06em]">
                    {catProducts.length} LISTINGS
                  </span>
                </div>
                <div className="p-space-lg flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-[family-name:var(--font-playfair)] text-[28px] font-medium text-primary group-hover:text-secondary transition-colors">
                      {cat}
                    </h2>
                    <ArrowRight
                      size={20}
                      className="text-outline group-hover:translate-x-1 transition-transform shrink-0"
                    />
                  </div>
                  <p className="text-[13px] text-on-surface-variant mb-4">{meta.description}</p>
                  <div className="mt-auto pt-space-sm border-t border-outline-variant/30 flex items-center justify-between text-[11px] font-semibold text-outline tracking-wider">
                    <span>{meta.badge}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
