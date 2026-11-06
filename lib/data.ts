import type { Product, FilterState, SearchIntent, Category, ListingType, Condition } from "./types";
import seedProducts from "../data/products.json";

const STORAGE_KEY_LISTINGS = "afterlife_user_listings";
const STORAGE_KEY_WISHLIST = "afterlife_wishlist";

// ── Seed products (read-only) ─────────────────────────────────────────────
export function getSeedProducts(): Product[] {
  return seedProducts as Product[];
}

// ── User listings (localStorage) ────────────────────────────────────────
export function getUserListings(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LISTINGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserListing(product: Product): void {
  if (typeof window === "undefined") return;
  const listings = getUserListings();
  const idx = listings.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    listings[idx] = product;
  } else {
    listings.unshift(product);
  }
  localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
}

export function deleteUserListing(id: string): void {
  if (typeof window === "undefined") return;
  const listings = getUserListings().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
}

// ── Merged catalogue ────────────────────────────────────────────────────
export function getAllProducts(): Product[] {
  const seed = getSeedProducts();
  const user = getUserListings();
  // user listings come first (newest), seed after
  return [...user, ...seed];
}

// ── Wishlist ─────────────────────────────────────────────────────────────
export function getWishlistIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WISHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(id: string): boolean {
  const ids = getWishlistIds();
  const isNowWishlisted = !ids.includes(id);
  const updated = isNowWishlisted ? [...ids, id] : ids.filter((i) => i !== id);
  localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(updated));
  return isNowWishlisted;
}

// ── Fetch by ID ──────────────────────────────────────────────────────────
export function getProductById(id: string): Product | null {
  return getAllProducts().find((p) => p.id === id) ?? null;
}

// ── Filter & Sort ────────────────────────────────────────────────────────
export function filterProducts(products: Product[], filters: FilterState): Product[] {
  let result = [...products];

  // Search
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }

  // Categories
  if (filters.categories.length > 0) {
    result = result.filter((p) => filters.categories.includes(p.category));
  }

  // Listing types
  if (filters.listingTypes.length > 0) {
    result = result.filter((p) => filters.listingTypes.includes(p.listingType));
  }

  // Conditions
  if (filters.conditions.length > 0) {
    result = result.filter((p) => filters.conditions.includes(p.condition));
  }

  // Price
  if (filters.minPrice !== null) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== null) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  // Sort
  if (filters.sortBy === "price_low") {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === "price_high") {
    result.sort((a, b) => b.price - a.price);
  } else {
    // newest
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}

// ── AI-intent-based filter ───────────────────────────────────────────────
export function filterByIntent(products: Product[], intent: SearchIntent): Product[] {
  let result = [...products];

  if (intent.category) {
    result = result.filter((p) => p.category === intent.category);
  }
  if (intent.listing_types && intent.listing_types.length > 0) {
    result = result.filter((p) => intent.listing_types!.includes(p.listingType));
  }
  if (intent.condition) {
    result = result.filter((p) => p.condition === intent.condition);
  }
  if (intent.max_price != null) {
    result = result.filter((p) => p.price <= intent.max_price!);
  }
  if (intent.min_price != null) {
    result = result.filter((p) => p.price >= intent.min_price!);
  }
  if (intent.keywords && intent.keywords.length > 0) {
    const kws = intent.keywords.map((k) => k.toLowerCase());
    result = result.filter((p) =>
      kws.some(
        (kw) =>
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(kw))
      )
    );
  }

  return result;
}

// ── Keyword-only fallback search ─────────────────────────────────────────
export function keywordSearch(products: Product[], query: string): Product[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return products.slice(0, 12);
  return products.filter((p) =>
    words.some(
      (w) =>
        p.title.toLowerCase().includes(w) ||
        p.description.toLowerCase().includes(w) ||
        p.category.toLowerCase().includes(w) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(w))
    )
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function getSavingsPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const CATEGORIES: Category[] = [
  "RE:WEAR",
  "ROOTS",
  "RE:READ",
  "RE:MAKE",
  "RE:USE",
  "RE:SOURCE",
];

export const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: "pre_owned", label: "Pre-Owned" },
  { value: "handmade", label: "Handmade" },
  { value: "upcycled", label: "Upcycled" },
  { value: "refurbished", label: "Refurbished" },
  { value: "surplus", label: "Surplus" },
  { value: "free", label: "Free / Give" },
];

export const CONDITIONS: Condition[] = [
  "New",
  "Mint",
  "Excellent",
  "Good",
  "Fair",
  "Restored",
  "Refurbished",
];

export const CATEGORY_META: Record<
  Category,
  { description: string; tagline: string; badge: string }
> = {
  "RE:WEAR": {
    description: "Pre-loved clothing, vintage fashion, shoes, bags and accessories.",
    tagline: "Thrift fashion, archival luxury wear, selvedge denim & classic trench coats.",
    badge: "UP TO 75% OFF RETAIL",
  },
  ROOTS: {
    description: "Handmade jewellery, pottery, handloom products, crafts and artisan home decor.",
    tagline: "Indigenous handlooms, beaten brass vessels, studio ceramics & folk traditions.",
    badge: "DIRECT CRAFT REMITTANCE",
  },
  "RE:READ": {
    description: "Used textbooks, engineering books, competitive exam books, novels and educational resources.",
    tagline: "Second-hand university textbooks, out-of-print poetry, monographs & philosophy.",
    badge: "STUDENT SUBSIDIES",
  },
  "RE:MAKE": {
    description: "Upcycled furniture, recycled decor, repurposed products and DIY materials.",
    tagline: "Upcycled furniture, bespoke joinery, patchwork wall tapestries & lamps.",
    badge: "RECLAIMED TIMBER & RESIN",
  },
  "RE:USE": {
    description: "Pre-owned electronics, accessories, furniture and household essentials.",
    tagline: "Diagnostics-verified audio gear, cameras, monitors & reliable daily hardware.",
    badge: "6-MONTH REPAIR WARRANTY",
  },
  "RE:SOURCE": {
    description: "Surplus fabrics, packaging, leftover materials and business inventory.",
    tagline: "Factory deadstock bolts, vegetable tanned leather offcuts & surplus yarn.",
    badge: "BULK & MAKER FRIENDLY",
  },
};

export const CATEGORY_IMAGES: Record<Category, string> = {
  "RE:WEAR": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  ROOTS: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80",
  "RE:READ": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
  "RE:MAKE": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  "RE:USE": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
  "RE:SOURCE": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
};
