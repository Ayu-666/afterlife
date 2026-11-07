export type Category =
  | "RE:WEAR"
  | "ROOTS"
  | "RE:READ"
  | "RE:MAKE"
  | "RE:USE"
  | "RE:SOURCE";

export type ListingType =
  | "pre_owned"
  | "handmade"
  | "upcycled"
  | "refurbished"
  | "surplus"
  | "free";

export type Condition =
  | "New"
  | "Mint"
  | "Excellent"
  | "Good"
  | "Fair"
  | "Restored"
  | "Refurbished";

export interface Product {
  id: string;
  title: string;
  description: string;
  category: Category;
  listingType: ListingType;
  price: number;
  originalPrice: number | null;
  condition: Condition;
  sellerName: string;
  location: string;
  image: string;
  fallbackImage?: string;
  available: boolean;
  createdAt: string;
  isDemo: boolean;
  tags?: string[];
  imagePreviewUrl?: string; // temporary object URL for user uploads
}

export interface FilterState {
  search: string;
  categories: Category[];
  listingTypes: ListingType[];
  conditions: Condition[];
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: "newest" | "price_low" | "price_high";
}

export interface WishlistState {
  ids: string[];
}

export interface SearchIntent {
  category?: Category | null;
  max_price?: number | null;
  min_price?: number | null;
  keywords?: string[];
  listing_types?: ListingType[];
  condition?: Condition | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  suggestedFollowUps?: string[];
  createdAt?: string;
  usedAI?: boolean;
}
