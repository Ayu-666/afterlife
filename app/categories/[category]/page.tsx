"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CATEGORY_META, getSeedProducts } from "@/lib/data";
import { useMarketplace } from "@/lib/context";
import { Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCat } = use(params);
  const cat = decodeURIComponent(rawCat) as Category;
  const { products } = useMarketplace();
  const allProducts = products.length > 0 ? products : getSeedProducts();
  const catProducts = allProducts.filter((p) => p.category === cat);
  const meta = CATEGORY_META[cat];

  if (!meta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-[36px] text-primary">Category not found</h1>
        <Link href="/categories" className="text-secondary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-surface-container-low py-space-2xl">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-[13px] text-on-surface-variant hover:text-primary transition-colors mb-space-lg"
          >
            <ArrowLeft size={16} /> All Categories
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div>
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block mb-2">
                {meta.badge}
              </span>
              <h1 className="font-[family-name:var(--font-playfair)] text-[48px] font-normal text-primary tracking-tight leading-tight mb-4">
                {cat}
              </h1>
              <p className="text-[18px] text-on-surface-variant max-w-xl leading-relaxed">
                {meta.description}
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl px-space-lg py-space-md shadow-sm text-right">
              <div className="text-[32px] font-semibold text-primary">{catProducts.length}</div>
              <div className="text-[11px] font-semibold text-outline tracking-wider uppercase">
                Listings Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        {catProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
            {catProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="text-5xl">🌱</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-[28px] text-primary">
              No listings yet
            </h2>
            <p className="text-[15px] text-on-surface-variant max-w-md">
              Be the first to list something in {cat}!
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-space-lg py-3.5 bg-primary text-on-primary text-[13px] font-medium rounded shadow-sm hover:bg-primary-container transition-all"
            >
              Sell / Give
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
