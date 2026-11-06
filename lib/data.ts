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

// ── Stopwords for natural search filtering ──────────────────────────────
const STOP_WORDS = new Set([
  "find", "show", "search", "get", "give", "need", "want", "looking", "for",
  "i", "me", "my", "we", "our", "a", "an", "the", "and", "or", "in", "on",
  "at", "to", "from", "with", "under", "below", "above", "over", "between",
  "less", "than", "more", "about", "some", "any", "all", "of", "is", "are",
  "rupees", "rs", "inr", "please", "item", "items", "product", "products", "something"
]);

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
    const kws = intent.keywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
    if (kws.length === 0) return result;

    const scored: { product: Product; score: number }[] = [];
    for (const p of result) {
      let score = 0;
      let matchedCount = 0;
      const titleL = p.title.toLowerCase();
      const descL = p.description.toLowerCase();
      const tagsL = (p.tags || []).map((t) => t.toLowerCase());

      for (const kw of kws) {
        let hit = false;
        if (titleL.includes(kw)) {
          score += 12;
          hit = true;
        }
        if (tagsL.some((t) => t.includes(kw) || kw.includes(t))) {
          score += 8;
          hit = true;
        }
        if (descL.includes(kw)) {
          score += 3;
          hit = true;
        }
        if (hit) matchedCount++;
      }

      if (score > 0) {
        score += matchedCount * 5;
        scored.push({ product: p, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.product);
  }

  return result;
}

// ── Smart local fallback search (category + budget + keyword scoring) ───
export function extractFallbackCriteria(query: string): {
  maxPrice: number | null;
  minPrice: number | null;
  keywords: string[];
  category: Category | null;
} {
  const lower = query.toLowerCase();

  // Extract budget
  let maxPrice: number | null = null;
  let minPrice: number | null = null;

  const betweenMatch = lower.match(/(?:between|from)\s*₹?\s*(\d+)\s*(?:and|to)\s*₹?\s*(\d+)/i);
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1], 10);
    maxPrice = parseInt(betweenMatch[2], 10);
  } else {
    const maxMatch =
      lower.match(/(?:under|below|less than|within|max|maximum)\s*₹?\s*(\d+)/i) ||
      lower.match(/₹\s*(\d+)\s*(?:or less|budget|max)/i);
    if (maxMatch) {
      maxPrice = parseInt(maxMatch[1], 10);
    }
  }

  // Keywords with stop-word removal
  const rawWords = lower.replace(/[^\w\s\+]/g, " ").split(/\s+/).filter(Boolean);
  const keywords = rawWords.filter((w) => !STOP_WORDS.has(w) && isNaN(Number(w)));

  // Category detection based on product domains
  const hasBook = keywords.some((k) =>
    ["book", "books", "textbook", "textbooks", "dsa", "c++", "cpp", "python", "java", "dbms", "math", "physics", "chemistry", "novel", "gate", "algorithms", "engineering"].includes(k)
  );
  const hasClothing = keywords.some((k) =>
    ["clothing", "clothes", "shirt", "jeans", "jacket", "trench", "wear", "saree", "kurta", "dress", "trousers", "boots", "tote"].includes(k)
  );
  const hasArtisan = keywords.some((k) =>
    ["handmade", "gifts", "gift", "pottery", "jewellery", "jewelry", "craft", "artisan", "traditional", "brass", "terracotta", "dhurrie", "earrings", "coasters"].includes(k)
  );
  const hasUpcycled = keywords.some((k) =>
    ["upcycled", "decor", "hostel", "room", "reclaimed", "repurposed", "wood", "furniture", "table", "lamp", "shelf", "macrame"].includes(k)
  );
  const hasElectronics = keywords.some((k) =>
    ["headphones", "keyboard", "mouse", "monitor", "electronics", "camera", "speaker", "laptop", "audio", "earphones", "refurbished"].includes(k)
  );
  const hasSurplus = keywords.some((k) =>
    ["surplus", "fabric", "packaging", "cardboard", "boxes", "deadstock", "yarn", "burlap", "spools", "scraps"].includes(k)
  );

  let category: Category | null = null;
  const matchedCats: Category[] = [];
  if (hasBook) matchedCats.push("RE:READ");
  if (hasClothing) matchedCats.push("RE:WEAR");
  if (hasArtisan) matchedCats.push("ROOTS");
  if (hasUpcycled) matchedCats.push("RE:MAKE");
  if (hasElectronics) matchedCats.push("RE:USE");
  if (hasSurplus) matchedCats.push("RE:SOURCE");

  if (matchedCats.length === 1) {
    category = matchedCats[0];
  }

  return { maxPrice, minPrice, keywords, category };
}

// ── Keyword-only fallback search ─────────────────────────────────────────
export function keywordSearch(products: Product[], query: string): Product[] {
  if (!query.trim()) return products.slice(0, 12);

  const criteria = extractFallbackCriteria(query);
  let pool = [...products];

  // Apply category if uniquely recognized
  if (criteria.category) {
    pool = pool.filter((p) => p.category === criteria.category);
  }

  // Strictly enforce budget
  if (criteria.maxPrice !== null) {
    pool = pool.filter((p) => p.price <= criteria.maxPrice!);
  }
  if (criteria.minPrice !== null) {
    pool = pool.filter((p) => p.price >= criteria.minPrice!);
  }

  if (criteria.keywords.length === 0) {
    return pool.slice(0, 12);
  }

  const scored: { product: Product; score: number }[] = [];
  for (const p of pool) {
    let score = 0;
    let matchedCount = 0;
    const titleL = p.title.toLowerCase();
    const descL = p.description.toLowerCase();
    const tagsL = (p.tags || []).map((t) => t.toLowerCase());

    for (const kw of criteria.keywords) {
      let hit = false;
      if (titleL.includes(kw)) {
        score += 12;
        hit = true;
      }
      if (tagsL.some((t) => t.includes(kw) || kw.includes(t))) {
        score += 8;
        hit = true;
      }
      if (descL.includes(kw)) {
        score += 3;
        hit = true;
      }
      if (hit) matchedCount++;
    }

    if (score > 0) {
      score += matchedCount * 5;
      scored.push({ product: p, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.product);
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

export const CATEGORY_FALLBACKS: Record<Category, string> = {
  "RE:WEAR": "/images/fallback-rewear.svg",
  ROOTS: "/images/fallback-roots.svg",
  "RE:READ": "/images/fallback-reread.svg",
  "RE:MAKE": "/images/fallback-remake.svg",
  "RE:USE": "/images/fallback-reuse.svg",
  "RE:SOURCE": "/images/fallback-resource.svg",
};

export function getProductFallback(category?: Category): string {
  if (category && CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }
  return "/images/fallback.svg";
}
