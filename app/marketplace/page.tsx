"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useMarketplace } from "@/lib/context";
import {
  filterProducts,
  CATEGORIES,
  LISTING_TYPES,
  CONDITIONS,
  getSeedProducts,
} from "@/lib/data";
import { FilterState, Category, ListingType, Condition } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  categories: [],
  listingTypes: [],
  conditions: [],
  minPrice: null,
  maxPrice: null,
  sortBy: "newest",
};

function MarketplaceContent() {
  const { products } = useMarketplace();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const catParam = searchParams.get("cat") || "";

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    search: qParam,
    categories: catParam ? [catParam as Category] : [],
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allProducts = products.length > 0 ? products : getSeedProducts();
  const filtered = filterProducts(allProducts, filters);

  useEffect(() => {
    if (qParam) setFilters((f) => ({ ...f, search: qParam }));
    if (catParam) setFilters((f) => ({ ...f, categories: [catParam as Category] }));
  }, [qParam, catParam]);

  const toggleCategory = (cat: Category) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const toggleListingType = (lt: ListingType) => {
    setFilters((f) => ({
      ...f,
      listingTypes: f.listingTypes.includes(lt)
        ? f.listingTypes.filter((t) => t !== lt)
        : [...f.listingTypes, lt],
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.listingTypes.length > 0 ||
    filters.conditions.length > 0 ||
    filters.search ||
    filters.minPrice !== null ||
    filters.maxPrice !== null;

  const Sidebar = () => (
    <aside className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-primary" />
          <span className="font-[family-name:var(--font-playfair)] text-[22px] font-medium text-primary">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-[11px] font-semibold text-outline hover:text-error transition-colors flex items-center gap-1"
          >
            <X size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Count */}
      <div className="bg-surface-container-low px-space-sm py-2 rounded-lg flex items-center justify-between">
        <span className="text-[11px] font-semibold text-outline tracking-wider">MATCHING</span>
        <span className="text-[13px] font-semibold text-primary">{filtered.length} Results</span>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-space-xs">
        <label className="text-[11px] font-semibold text-primary uppercase tracking-wider">
          Pillars & Categories
        </label>
        <div className="space-y-1.5 mt-1">
          {CATEGORIES.map((cat) => {
            const count = allProducts.filter((p) => p.category === cat).length;
            return (
              <label
                key={cat}
                className="flex items-center justify-between p-1.5 rounded-md hover:bg-surface-container cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  <span className="text-[13px] text-on-surface">{cat}</span>
                </div>
                <span className="text-[11px] text-outline">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Listing types */}
      <div className="flex flex-col gap-space-xs">
        <label className="text-[11px] font-semibold text-primary uppercase tracking-wider">
          Listing Type
        </label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {LISTING_TYPES.map((lt) => (
            <button
              key={lt.value}
              onClick={() => toggleListingType(lt.value)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filters.listingTypes.includes(lt.value)
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-surface-container hover:bg-secondary-container text-on-surface-variant"
              }`}
            >
              {lt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            Price Range
          </label>
        </div>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                minPrice: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-1/2 bg-surface-container-low text-on-surface text-[13px] p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                maxPrice: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-1/2 bg-surface-container-low text-on-surface text-[13px] p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pt-space-xl pb-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
          <div className="max-w-2xl">
            <div className="flex items-center gap-space-xs mb-space-xs text-primary text-[11px] font-semibold tracking-wider">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary" />
              CURATED CIRCULAR LEDGER
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-[40px] font-normal text-primary tracking-tight mb-space-xs leading-tight">
              The Marketplace Catalog
            </h1>
            <p className="text-[18px] text-on-surface-variant leading-relaxed">
              {allProducts.length}+ authenticated pre-loved, handcrafted, refurbished and surplus
              goods.
            </p>
          </div>

          <div className="flex items-center gap-space-lg py-space-sm px-space-md bg-surface-container rounded-xl self-start shadow-sm">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-outline tracking-wider">LISTINGS</span>
              <span className="text-[16px] font-semibold text-primary">{allProducts.length} Items</span>
            </div>
            <div className="w-px h-8 bg-surface-variant" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-outline tracking-wider">RESULTS</span>
              <span className="text-[16px] font-semibold text-secondary">{filtered.length} Shown</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-2.5 rounded-lg">
            <Search size={22} className="text-outline" />
            <input
              className="w-full bg-transparent text-[15px] text-on-surface placeholder:text-outline focus:outline-none"
              id="marketplaceSearch"
              placeholder="Search by material, era, craft cluster, designer..."
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: "" }))}
                className="text-outline hover:text-primary"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick pills + sort */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium transition-all ${
                    filters.categories.includes(cat)
                      ? "bg-primary-container text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-[13px] font-medium"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-outline whitespace-nowrap hidden sm:block">
                  SORT BY
                </span>
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container-low text-on-surface text-[13px] font-medium py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none"
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        sortBy: e.target.value as FilterState["sortBy"],
                      }))
                    }
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2 top-2 text-outline"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pb-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <Sidebar />
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="relative ml-auto w-80 h-full bg-surface overflow-y-auto p-space-md">
                <div className="flex justify-between items-center mb-space-md">
                  <span className="font-[family-name:var(--font-playfair)] text-[22px] text-primary font-medium">
                    Filters
                  </span>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X size={22} className="text-on-surface-variant" />
                  </button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Product grid */}
          <main className="lg:col-span-9 flex flex-col gap-space-lg">
            <div className="flex items-center justify-between bg-surface-container-low px-space-md py-space-sm rounded-lg">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-on-surface-variant tracking-wider">
                <span>SHOWING:</span>
                <span className="bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">
                  {filtered.length} of {allProducts.length}
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-outline hover:text-error flex items-center gap-1 ml-2"
                  >
                    <X size={12} /> Clear filters
                  </button>
                )}
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-space-md">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-4xl">
                  🔍
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[28px] text-primary">
                  No matches found
                </h3>
                <p className="text-[15px] text-on-surface-variant max-w-md">
                  Try adjusting your filters or search terms. The catalogue is growing every day.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-space-lg py-3 bg-primary text-on-primary text-[13px] font-medium rounded hover:bg-primary-container transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
