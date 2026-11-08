"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, getSavingsPercent, getProductFallback } from "@/lib/data";
import { useMarketplace } from "@/lib/context";
import { useState } from "react";

const CONDITION_COLORS: Record<string, string> = {
  New: "bg-tertiary-fixed text-primary",
  Mint: "bg-tertiary-fixed text-primary",
  Excellent: "bg-secondary-container text-on-secondary-container",
  Good: "bg-surface-container text-on-surface",
  Fair: "bg-surface-container text-on-surface",
  Restored: "bg-primary-fixed text-primary",
  Refurbished: "bg-primary-fixed text-primary",
};

const LISTING_TYPE_LABELS: Record<string, string> = {
  pre_owned: "Pre-Owned",
  handmade: "Handmade",
  upcycled: "Upcycled",
  refurbished: "Refurbished",
  surplus: "Surplus",
  free: "Free",
};

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useMarketplace();
  const [imgError, setImgError] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const fallbackSrc = product.fallbackImage || getProductFallback(product.category);
  const imageSrc = product.imagePreviewUrl || (imgError ? fallbackSrc : product.image);

  const savings =
    product.originalPrice && product.originalPrice > product.price
      ? getSavingsPercent(product.price, product.originalPrice)
      : null;

  return (
    <article className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={!!product.imagePreviewUrl || imgError}
          />
        </Link>

        {/* Top tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-bold tracking-[0.08em] uppercase">
            {product.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${CONDITION_COLORS[product.condition] ?? "bg-surface-container text-on-surface"}`}
          >
            {product.condition}
          </span>
        </div>

        {/* Demo badge */}
        {product.isDemo && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-surface/90 backdrop-blur-sm text-outline text-[10px] font-semibold tracking-[0.06em]">
            DEMO LISTING
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm z-10 ${
            wishlisted ? "text-error" : "text-on-surface-variant hover:text-error"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-outline uppercase tracking-[0.06em]">
              {LISTING_TYPE_LABELS[product.listingType] ?? product.listingType}
            </span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug mb-2">
              {product.title}
            </h3>
          </Link>

          {/* Price row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[20px] font-semibold text-primary tracking-tight leading-none">
              {product.price === 0 ? "Free" : formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[13px] text-outline line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {savings !== null && (
              <span className="text-[10px] font-semibold text-secondary bg-secondary-container px-1.5 py-0.5 rounded ml-auto">
                SAVE {savings}%
              </span>
            )}
          </div>
        </div>

        {/* Seller strip */}
        <div className="flex items-center justify-between bg-surface-container-low -mx-space-md -mb-space-md px-space-md py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold flex items-center justify-center shrink-0">
              {product.sellerName.charAt(0).toUpperCase()}
            </span>
            <span className="text-[12px] text-on-surface truncate max-w-[110px]">
              {product.sellerName}
            </span>
          </div>
          <span className="text-[11px] text-outline flex items-center gap-0.5 shrink-0">
            <MapPin size={12} />
            <span className="truncate max-w-[80px]">{product.location.split(",")[0]}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
