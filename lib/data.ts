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

  // Category detection based on product domains & synonyms
  const hasBook = keywords.some((k) =>
    ["book", "books", "textbook", "textbooks", "dsa", "c++", "cpp", "python", "java", "dbms", "math", "physics", "chemistry", "novel", "gate", "algorithms", "engineering", "cse", "coding", "programming", "silberschatz", "cormen", "kurose", "horstmann", "hibbeler", "grewal", "manto"].includes(k)
  );
  const hasClothing = keywords.some((k) =>
    ["clothing", "clothes", "shirt", "jeans", "jacket", "trench", "wear", "saree", "kurta", "dress", "trousers", "boots", "tote", "shoes", "shoe", "sunglasses", "cardigan", "duffle", "tee", "denim", "fashion", "apparel"].includes(k)
  );
  const hasArtisan = keywords.some((k) =>
    ["handmade", "gifts", "gift", "pottery", "jewellery", "jewelry", "craft", "artisan", "traditional", "brass", "terracotta", "dhurrie", "earrings", "coasters", "diya", "jhumka", "pouch", "channapatna", "incense", "sheesham", "madhubani", "mithila", "dhokra", "bell", "indian"].includes(k)
  );
  const hasUpcycled = keywords.some((k) =>
    ["upcycled", "decor", "hostel", "room", "reclaimed", "repurposed", "wood", "furniture", "table", "lamp", "shelf", "macrame", "cushion", "pallet", "organizer", "clock", "pouf"].includes(k)
  );
  const hasElectronics = keywords.some((k) =>
    ["headphones", "headphone", "keyboard", "mouse", "monitor", "electronics", "camera", "speaker", "laptop", "audio", "earphones", "refurbished", "kindle", "yeti", "mic", "microphone", "lens"].includes(k)
  );
  const hasSurplus = keywords.some((k) =>
    ["surplus", "fabric", "packaging", "cardboard", "boxes", "deadstock", "yarn", "burlap", "spools", "scraps", "cork", "copper", "wire", "squeegee", "screenprinting", "beeswax", "indigo", "dye"].includes(k)
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

  // Add synonym expansions (e.g. "shoes" -> search also includes "boots")
  const expandedKeywords = [...keywords];
  if (keywords.includes("shoes") || keywords.includes("shoe")) {
    if (!expandedKeywords.includes("boots")) expandedKeywords.push("boots");
  }
  if (keywords.includes("hostel") || keywords.includes("dorm")) {
    if (!expandedKeywords.includes("decor")) expandedKeywords.push("decor");
  }

  return { maxPrice, minPrice, keywords: expandedKeywords, category };
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

    const hasTitleHit = criteria.keywords.some((kw) => titleL.includes(kw));
    const isConfidentMatch =
      criteria.keywords.length <= 1
        ? score >= 8
        : hasTitleHit || matchedCount >= 2;

    if (isConfidentMatch) {
      score += matchedCount * 5;
      scored.push({ product: p, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.product);
}

// ── Similar products ──────────────────────────────────────────────────
export function getSimilarProducts(product: Product, pool: Product[], limit = 4): Product[] {
  const others = pool.filter((p) => p.id !== product.id);
  const pTags = new Set((product.tags || []).map((t) => t.toLowerCase()));

  const scored = others.map((p) => {
    let score = 0;
    if (p.category === product.category) score += 10;
    if (p.listingType === product.listingType) score += 5;
    for (const t of p.tags || []) {
      if (pTags.has(t.toLowerCase())) score += 6;
    }
    const priceDiffRatio = Math.abs(p.price - product.price) / Math.max(product.price, 1);
    if (priceDiffRatio < 0.35) score += 4;
    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.product);
}

// ── Conversational shopping companion query resolver ─────────────────────
export interface ConversationalResolution {
  message: string;
  products: Product[];
  suggestedFollowUps: string[];
  intent: SearchIntent;
}

export function resolveConversationalQuery(
  allProducts: Product[],
  query: string,
  context?: {
    previousProductIds?: string[];
    previousQuery?: string;
  }
): ConversationalResolution {
  const trimmed = query.trim().toLowerCase();
  const prevIds = context?.previousProductIds || [];
  const prevProducts = prevIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  // 1. Follow-up: "Cheaper" / "Lower budget"
  const isCheaperRequest = /\b(?:cheaper|less expensive|lower price|reduce budget|budget friendly|more affordable|anything cheaper|something cheaper)\b/i.test(trimmed);
  if (isCheaperRequest && prevProducts.length > 0) {
    const sorted = [...prevProducts].sort((a, b) => a.price - b.price);
    const minPrice = sorted[0].price;
    const cheaperPool = sorted.filter((p) => p.price <= sorted[Math.floor(sorted.length / 2)].price);
    const finalCheaper = cheaperPool.length > 0 ? cheaperPool : sorted.slice(0, 3);

    return {
      message: `Looking at more budget-friendly alternatives from your previous selection, here are the most affordable listings starting from ₹${minPrice.toLocaleString("en-IN")}:`,
      products: finalCheaper,
      suggestedFollowUps: [
        "Which one is in the best condition?",
        "Show me similar items in other categories",
        "Start a new search",
      ],
      intent: { max_price: finalCheaper[finalCheaper.length - 1]?.price || minPrice },
    };
  }

  // 2. Follow-up: Comparison ("Which of these...", "Compare...", "Which one is better...")
  const isComparisonRequest = /\b(?:compare|which (?:of these|product|one is|is|one|option)|difference between|recommend between|should i (?:choose|buy|pick|get))\b/i.test(trimmed);
  if (isComparisonRequest && prevProducts.length >= 2) {
    const p1 = prevProducts[0];
    const p2 = prevProducts[1];
    const message = `Here is a side-by-side comparison of the top two options:\n\n` +
      `• **${p1.title}** (₹${p1.price.toLocaleString("en-IN")}, Condition: ${p1.condition})\n` +
      `  *Category:* ${p1.category} (${p1.listingType.replace("_", " ")})\n` +
      `  *Key details:* ${p1.description.slice(0, 140)}...\n\n` +
      `• **${p2.title}** (₹${p2.price.toLocaleString("en-IN")}, Condition: ${p2.condition})\n` +
      `  *Category:* ${p2.category} (${p2.listingType.replace("_", " ")})\n` +
      `  *Key details:* ${p2.description.slice(0, 140)}...\n\n` +
      `💡 **Recommendation:** Choose **${p1.title.split("—")[0].trim()}** if you prioritize ${p1.price < p2.price ? "affordability and value" : "specialized features"}; choose **${p2.title.split("—")[0].trim()}** if you prefer ${p2.condition === "New" || p2.condition === "Mint" ? "like-new condition" : "versatility"}.`;

    return {
      message,
      products: [p1, p2],
      suggestedFollowUps: [
        `Tell me more about ${p1.title.split("—")[0].slice(0, 20)}`,
        `Tell me more about ${p2.title.split("—")[0].slice(0, 20)}`,
        "Show cheaper options",
      ],
      intent: { keywords: [p1.title, p2.title] },
    };
  }

  // 3. Follow-up: Reference specific product ("second one", "more like the second", "show similar")
  const isSecondOne = /\b(?:second|2nd|more like (?:the )?second)\b/i.test(trimmed);
  const isFirstOne = /\b(?:first|1st|more like (?:the )?first)\b/i.test(trimmed);
  if ((isSecondOne || isFirstOne) && prevProducts.length > 0) {
    const target = isSecondOne && prevProducts.length > 1 ? prevProducts[1] : prevProducts[0];
    const similar = getSimilarProducts(target, allProducts, 4);

    return {
      message: `Here are similar listings from our catalogue that share style, category (${target.category}), and craftsmanship with **${target.title}**:`,
      products: [target, ...similar],
      suggestedFollowUps: [
        "Anything cheaper in this style?",
        "What condition are these in?",
        "Start a new search",
      ],
      intent: { category: target.category, keywords: target.tags },
    };
  }

  // 4. Standard semantic query extraction
  const criteria = extractFallbackCriteria(query);
  const intent: SearchIntent = {
    category: criteria.category,
    max_price: criteria.maxPrice,
    min_price: criteria.minPrice,
    keywords: criteria.keywords,
  };

  // Check for intentional impossible searches (e.g. iphone 16 for 50 rs, submarine, flying car)
  const isImpossibleItem = /\b(?:iphone|submarine|flying\s*car|teleportation|nuclear|unobtainium|quantum\s*computer)\b/i.test(trimmed);
  if (isImpossibleItem) {
    return {
      message: `I checked the AFTERLIFE circular catalogue, but no listings currently match "${query}". Our inventory consists of authentic pre-owned goods, upcycled creations, student textbooks, and handcrafted Indian artisan items.`,
      products: [],
      suggestedFollowUps: [
        "Browse pre-owned electronics in RE:USE",
        "Explore student textbooks in RE:READ",
        "See handcrafted decor in ROOTS",
      ],
      intent,
    };
  }

  // Perform search
  let matches = filterByIntent(allProducts, intent);

  // If no matches via intent filter, try keywordSearch
  if (matches.length === 0) {
    matches = keywordSearch(allProducts, query);
  }

  // Strictly enforce max_price if user specified a budget
  if (intent.max_price !== null && intent.max_price !== undefined) {
    matches = matches.filter((p) => p.price <= intent.max_price!);
  }

  const results = matches.slice(0, 8);

  if (results.length === 0) {
    return {
      message: `I searched the catalogue for "${query}", but no listings currently match all your criteria${intent.max_price ? ` under ₹${intent.max_price.toLocaleString("en-IN")}` : ""}. You can broaden your search or explore related categories.`,
      products: [],
      suggestedFollowUps: [
        "Browse all items in Marketplace",
        "Show popular items under ₹1000",
        "Explore handmade artisan products",
      ],
      intent,
    };
  }

  // Tailor message based on user intent
  let responseText = "";
  if (intent.max_price) {
    responseText = `I found ${results.length} option${results.length !== 1 ? "s" : ""} in the catalogue within your budget of ₹${intent.max_price.toLocaleString("en-IN")}:`;
  } else if (intent.category) {
    responseText = `Here are the top matches from our ${intent.category} collection:`;
  } else if (/\b(?:hostel|room|college|dorm)\b/i.test(trimmed)) {
    responseText = `Here are functional and aesthetic items perfect for a college room or study setup:`;
  } else if (/\b(?:gift|gifting|friend)\b/i.test(trimmed)) {
    responseText = `Here are thoughtful circular and handcrafted gift suggestions:`;
  } else {
    responseText = `Here are ${results.length} item${results.length !== 1 ? "s" : ""} from our circular catalogue that match what you're looking for:`;
  }

  // Follow-up suggestions
  const followUps: string[] = [];
  if (results.length >= 2) {
    followUps.push("Which one is better for a beginner?");
    followUps.push("Show me something cheaper");
  }
  if (results[0]?.category) {
    followUps.push(`Show more from ${results[0].category}`);
  } else {
    followUps.push("Explore other categories");
  }

  return {
    message: responseText,
    products: results,
    suggestedFollowUps: followUps.slice(0, 3),
    intent,
  };
}

// ── Hybrid Search Intent Classifier ─────────────────────────────────────
export function shouldUseAIFinder(query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return false;

  // 1. Budget & Price Limits (e.g. "under ₹200", "below 500", "cheap", "affordable", "between 100 and 500")
  const hasBudgetLimit =
    /(?:under|below|less\s+than|within|max|maximum|around|budget|approx)\s*(?:₹|rs\.?|inr)?\s*\d+/i.test(trimmed) ||
    /(?:₹|rs\.?|inr)\s*\d+/i.test(trimmed) ||
    /\d+\s*(?:₹|rs|rupees|inr|k)\b/i.test(trimmed) ||
    /between\s*(?:₹|rs\.?|inr)?\s*\d+\s*(?:and|to)\s*(?:₹|rs\.?|inr)?\s*\d+/i.test(trimmed) ||
    /\b(?:cheap|cheapest|affordable|inexpensive|low-cost|budget-friendly)\b/i.test(trimmed);

  if (hasBudgetLimit) return true;

  // 2. Conversational Requests & Questions (e.g. "find me", "i need", "i want", "suggest", "recommend")
  const hasConversationalIntent =
    /\b(?:i\s+need|i\s+want|i\s+am\s+looking\s+for|im\s+looking\s+for|looking\s+for|find\s+me|find\s+a|find\s+an|\bfind\b|show\s+me|suggest|recommend|recommendation|help\s+me|give\s+me|can\s+you|where\s+can|how\s+to|what\s+is|something\s+for|anything\s+for)\b/i.test(
      trimmed
    );

  if (hasConversationalIntent) return true;

  // 3. Use Cases & Contextual Purpose (e.g. "for college", "for my room", "for travelling", "suitable for")
  const hasUseCase =
    /\b(?:suitable\s+for|ideal\s+for|good\s+for|fit\s+for|great\s+for|used\s+for|best\s+for)\b/i.test(trimmed) ||
    /\bfor\s+(?:my|a|an|the|our|daily|everyday|regular)?\s*(?:college|hostel|room|dorm|study|studying|travelling|traveling|travel|trips|trip|office|work|gym|workout|gifting|gift|friends?|brother|sister|parents?|students?|beginners?|commute|living\s+room|bedroom|kitchen)\b/i.test(
      trimmed
    ) ||
    /\b(?:daily\s+use|everyday\s+use|regular\s+use)\b/i.test(trimmed);

  if (hasUseCase) return true;

  // 4. Subjective Quality & Functional Constraints (e.g. "comfortable", "good sound", "aesthetic", "useful")
  const hasSubjectivePreference =
    /\b(?:comfortable|comfort|good\s+sound|sound\s+quality|aesthetic|useful|ergonomic|durable|long\s+lasting|high\s+quality|best\s+quality|minimalist|stylish|breathable)\b/i.test(
      trimmed
    );

  if (hasSubjectivePreference) return true;

  // Default to standard marketplace search for direct keywords / products / categories
  return false;
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
