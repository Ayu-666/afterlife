"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, MapPin, Share2, ExternalLink } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useMarketplace } from "@/lib/context";
import { getSeedProducts, formatPrice, getSavingsPercent } from "@/lib/data";
import { Product } from "@/lib/types";

const LISTING_TYPE_LABELS: Record<string, string> = {
  pre_owned: "Pre-Owned",
  handmade: "Handmade",
  upcycled: "Upcycled",
  refurbished: "Refurbished",
  surplus: "Surplus",
  free: "Free / Give",
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products, toggleWishlist, isWishlisted } = useMarketplace();
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const allProducts = products.length > 0 ? products : getSeedProducts();
  const product = allProducts.find((p) => p.id === id) as Product | undefined;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-gutter">
        <div className="text-5xl">🔍</div>
        <h1 className="font-[family-name:var(--font-playfair)] text-[36px] text-primary">
          Product not found
        </h1>
        <p className="text-[15px] text-on-surface-variant">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-space-lg py-3 bg-primary text-on-primary text-[13px] font-medium rounded hover:bg-primary-container transition-colors"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const imageSrc = product.imagePreviewUrl || (imgError ? "/images/fallback.jpg" : product.image);
  const savings =
    product.originalPrice && product.originalPrice > product.price
      ? getSavingsPercent(product.price, product.originalPrice)
      : null;

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-md">
        <nav className="flex items-center gap-space-xs text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-outline-variant">/</span>
          <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          <span className="text-outline-variant">/</span>
          <Link href={`/categories/${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">
            {product.category}
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-semibold">{product.title.slice(0, 50)}{product.title.length > 50 ? "…" : ""}</span>
        </nav>
      </div>

      {/* Main detail */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pb-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-gutter-lg items-start">
          {/* Left: image */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-sm group">
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                onError={() => setImgError(true)}
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                unoptimized={!!product.imagePreviewUrl}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/95 backdrop-blur-sm text-primary text-[11px] font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {product.condition.toUpperCase()}
                </span>
                {product.isDemo && (
                  <span className="px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-sm text-outline text-[11px] font-semibold">
                    DEMO LISTING
                  </span>
                )}
              </div>
            </div>

            {/* Material provenance card */}
            <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">🌿</span>
                <span className="text-[11px] font-semibold text-primary tracking-wider uppercase">
                  Circular Provenance
                </span>
              </div>
              <p className="text-[13px] text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-on-surface-variant font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: details */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* Category + listing type */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/categories/${encodeURIComponent(product.category)}`}
                  className="text-[11px] font-bold text-secondary tracking-widest uppercase hover:underline"
                >
                  {product.category}
                </Link>
                <span className="text-outline">·</span>
                <span className="text-[11px] font-semibold text-outline uppercase">
                  {LISTING_TYPE_LABELS[product.listingType] ?? product.listingType}
                </span>
              </div>
              <span className="text-[11px] text-outline">ID: #{product.id}</span>
            </div>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-playfair)] text-[36px] font-normal text-primary leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex flex-col gap-space-sm pb-space-sm">
              <div className="flex items-baseline gap-space-md flex-wrap">
                <span className="font-[family-name:var(--font-playfair)] text-[36px] font-semibold text-primary leading-none">
                  {product.price === 0 ? "Free" : formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[20px] text-outline line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {savings !== null && (
                  <span className="px-2.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold tracking-wider">
                    SAVE {savings}%
                  </span>
                )}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[13px] font-medium self-start">
                🌱 Choosing pre-owned avoids new production waste
              </div>
            </div>

            {/* Condition */}
            <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-primary uppercase tracking-wide">
                  Condition: {product.condition}
                </span>
                <span className="text-[20px]">⭐</span>
              </div>
              <p className="text-[13px] text-on-surface-variant leading-relaxed">
                This item has been listed as <strong>{product.condition}</strong>. All demo listings
                are illustrative — in a real transaction, buyers should verify condition before
                purchase.
              </p>
            </div>

            {/* Seller */}
            <div className="p-space-md rounded-xl bg-surface-container shadow-sm flex items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[18px] shrink-0">
                  {product.sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-primary">{product.sellerName}</span>
                    <span className="text-secondary text-[16px]">✓</span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    {product.isDemo ? "Demo Seller" : "Verified Seller"}
                  </span>
                  <span className="text-[11px] text-outline flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {product.location}
                  </span>
                </div>
              </div>
              <button
                disabled
                className="px-space-md py-2 rounded-lg bg-surface text-primary text-[13px] font-medium opacity-50 cursor-not-allowed shadow-sm shrink-0"
                title="Contact feature coming soon"
              >
                Message
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <div className="flex items-center gap-space-sm">
                <button
                  disabled
                  className="flex-1 h-12 px-space-lg rounded-lg bg-primary-container text-on-primary text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm opacity-70 cursor-not-allowed"
                  title="Demo — no payment processing"
                >
                  <span>🛒</span>
                  Express Interest ({product.price === 0 ? "Free" : formatPrice(product.price)})
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`h-12 w-12 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-sm transition-colors ${
                    wishlisted
                      ? "bg-error/10 text-error"
                      : "bg-surface-container-low text-on-surface hover:text-primary"
                  }`}
                  title="Save to wishlist"
                >
                  <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 h-11 rounded-lg bg-surface text-primary text-[13px] font-medium hover:bg-surface-container-low transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  {copied ? "Copied!" : "Share Listing"}
                </button>
                <Link
                  href="/marketplace"
                  className="flex-1 h-11 rounded-lg bg-surface text-primary text-[13px] font-medium hover:bg-surface-container-low transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
                  Browse Similar
                </Link>
              </div>
            </div>

            {/* Demo notice */}
            {product.isDemo && (
              <div className="bg-surface-container-lowest rounded-xl p-space-md text-[12px] text-outline border border-outline-variant">
                <strong>Demo Listing:</strong> This listing is for demonstration purposes only.
                The seller shown is not a verified real seller. No real transactions occur.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="w-full bg-surface-container-low py-space-2xl">
          <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
            <h2 className="font-[family-name:var(--font-playfair)] text-[32px] font-normal text-primary tracking-tight mb-space-xl">
              More in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
