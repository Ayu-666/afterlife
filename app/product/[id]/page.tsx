"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  CheckCircle2,
  Lock,
  Package,
  RotateCcw,
  Sparkles,
  Droplets,
  Clock,
  Infinity as InfinityIcon,
  MessageSquare,
  ShoppingBag,
  Fingerprint,
  X,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { getSeedProducts, formatPrice, getSavingsPercent, getProductFallback } from "@/lib/data";
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
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);

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
  const fallbackSrc = product.fallbackImage || getProductFallback(product.category);
  const baseImageSrc = product.imagePreviewUrl || (imgError ? fallbackSrc : product.image);

  // Cross-category pairs well with finds (picks 3 distinct products from OTHER categories)
  const crossCategoryPairs = allProducts
    .filter((p) => p.category !== product.category && p.id !== product.id)
    .slice(0, 3);

  // Display images explicitly associated with this product
  const productImages: string[] = Array.isArray((product as { images?: string[] }).images) && (product as { images?: string[] }).images!.length > 0
    ? (product as { images?: string[] }).images!
    : [baseImageSrc];
  const galleryImages = productImages;

  const currentDisplayImage = galleryImages[selectedImgIdx] || baseImageSrc;

  const savings =
    product.originalPrice && product.originalPrice > product.price
      ? getSavingsPercent(product.price, product.originalPrice)
      : null;

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyHash = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`0x${product.id.replace(/-/g, "")}7b9148c2a9381e`);
      setHashCopied(true);
      setTimeout(() => setHashCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* ── BREADCRUMB ────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-md">
        <nav className="flex items-center gap-space-xs text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-outline-variant">/</span>
          <Link href="/marketplace" className="hover:text-primary transition-colors">
            Marketplace
          </Link>
          <span className="text-outline-variant">/</span>
          <Link
            href={`/categories/${encodeURIComponent(product.category)}`}
            className="hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-semibold">
            {product.title.slice(0, 40)}
            {product.title.length > 40 ? "…" : ""}
          </span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ──────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pb-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-gutter-lg items-start">
          {/* Left Column: Image Gallery & Blockchain Passport */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Main Stage Image */}
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-sm group">
              <Image
                src={currentDisplayImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                onError={() => setImgError(true)}
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                unoptimized={!!product.imagePreviewUrl || imgError}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-space-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/95 backdrop-blur-sm text-primary text-[11px] font-bold shadow-sm uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  ARCHIVE PIECE • {product.condition.toUpperCase()}
                </span>
                {product.isDemo && (
                  <span className="px-3 py-1 rounded-full bg-surface/90 backdrop-blur-sm text-outline text-[10px] font-semibold uppercase tracking-wider self-start">
                    PROTOTYPE SPECIMEN
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-sm text-on-surface hover:text-primary transition-colors shadow-sm flex items-center gap-1.5 text-[11px] font-semibold"
                  title="Share Listing"
                >
                  <Share2 size={16} />
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation Strip - only rendered when multiple genuine images exist */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-space-sm sm:gap-space-md">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-surface-container transition-all ${
                      selectedImgIdx === idx
                        ? "ring-2 ring-primary opacity-100 shadow-sm"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`View ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Blockchain Circular Passport Card */}
            <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between gap-space-md flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-secondary" />
                  <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
                    Blockchain Circular Passport
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-outline px-2 py-0.5 rounded bg-surface-container tracking-wider uppercase">
                  LEDGER ID: #0x{product.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6)}...C19 (Demo)
                </span>
              </div>
              <p className="text-[13px] text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
              <div className="pt-space-xs flex items-center justify-between text-primary text-[13px] font-semibold border-t border-outline-variant/20">
                <button
                  onClick={handleCopyHash}
                  className="inline-flex items-center gap-1.5 hover:underline text-secondary text-[12px]"
                >
                  <Fingerprint size={16} />
                  <span>
                    {hashCopied ? "Provenance Hash Copied!" : "View cryptographic provenance hash"}
                  </span>
                </button>
                <span className="text-[11px] text-outline font-normal">
                  Location: {product.location}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Specs, Seller & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* Stream Kicker & SKU */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-secondary tracking-widest uppercase">
                  {product.category} • {LISTING_TYPE_LABELS[product.listingType] ?? product.listingType}
                </span>
                <span className="text-[11px] font-semibold text-outline">
                  SKU #AL-{product.id.toUpperCase()}
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] text-[32px] md:text-[38px] text-primary leading-tight mt-1">
                {product.title}
              </h1>
            </div>

            {/* Price & Avoided Impact Banner */}
            <div className="flex flex-col gap-space-sm pb-space-sm">
              <div className="flex items-baseline gap-space-md flex-wrap">
                <span className="font-[family-name:var(--font-playfair)] text-[34px] font-bold text-primary">
                  {product.price === 0 ? "Free" : formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[18px] text-outline line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {savings !== null && (
                  <span className="px-2.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold tracking-wider uppercase">
                    SAVE {savings}%
                  </span>
                )}
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[12px] font-semibold">
                  <Sparkles size={14} className="text-primary" />
                  Avoids ~8.2 kg CO₂e vs manufacturing new virgin inventory
                </span>
              </div>
            </div>

            {/* Condition Verification Report */}
            <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-primary uppercase tracking-wide">
                  Condition: {product.condition} Vintage Grade
                </span>
                <span className="text-[16px]">✦</span>
              </div>
              <p className="text-[13px] text-on-surface-variant leading-relaxed">
                Inspected for material integrity, seam durability, and authentic surface patina. Free
                of structural flaws, sanitised using environmentally benign cedar vapour, and ready
                for its next circular chapter.
              </p>
            </div>

            {/* Dimensional Specifications Grid */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Specification &amp; Dimensions
                </span>
                <span className="text-[11px] text-secondary font-semibold">Verified Measure</span>
              </div>
              <div className="grid grid-cols-3 gap-space-sm text-center">
                <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">
                    Primary Dimension
                  </span>
                  <span className="text-[15px] text-primary font-bold">Standard</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">
                    Circulation Tier
                  </span>
                  <span className="text-[15px] text-primary font-bold">Grade A</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">
                    Material Origin
                  </span>
                  <span className="text-[15px] text-primary font-bold">
                    {product.location.split(",")[0] || "India"}
                  </span>
                </div>
              </div>
            </div>

            {/* Curator & Seller Profile Card */}
            <div className="p-space-md rounded-xl bg-surface-container shadow-sm border border-outline-variant/30 flex items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[18px] shrink-0">
                  {product.sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-primary">{product.sellerName}</span>
                    <CheckCircle2 size={15} className="text-secondary" />
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    Verified Curator • 4.9★ (86 circular sales)
                  </span>
                  <span className="text-[11px] text-outline mt-0.5">
                    {product.location} • Dispatches within 24h
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMessageOpen(true)}
                className="px-space-md py-2 rounded-lg bg-surface text-primary text-[12px] font-bold hover:bg-surface-container-lowest transition-colors shadow-sm shrink-0 border border-outline-variant/30"
              >
                Message
              </button>
            </div>

            {/* CTAs: Buy Now, Save Wishlist, Make an Offer */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <div className="flex items-center gap-space-sm">
                <button
                  onClick={() => setIsBuyModalOpen(true)}
                  className="flex-1 h-12 px-space-lg rounded-lg bg-primary-container text-on-primary text-[13px] font-bold tracking-wide hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag size={18} />
                  <span>
                    Express Interest &amp; Buy ({product.price === 0 ? "Free" : formatPrice(product.price)})
                  </span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="h-12 w-12 rounded-lg bg-surface-container-low text-on-surface hover:text-primary transition-colors flex flex-col items-center justify-center shrink-0 shadow-sm border border-outline-variant/30"
                  title={wishlisted ? "Remove from saved" : "Save to circular archive"}
                >
                  <Heart
                    size={20}
                    className={wishlisted ? "fill-primary text-primary" : "text-outline"}
                  />
                  <span className="text-[9px] font-bold leading-none text-outline mt-0.5">
                    {wishlisted ? "SAVED" : "SAVE"}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setIsOfferOpen(true)}
                className="w-full h-11 rounded-lg bg-surface text-primary text-[13px] font-bold hover:bg-surface-container-low transition-colors shadow-sm border border-outline-variant/40"
              >
                Make an Offer
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="flex flex-col gap-space-sm pt-space-sm text-on-surface-variant text-[13px]">
              <div className="flex items-start gap-3">
                <RotateCcw size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-primary font-semibold">7-Day Circular Return:</strong> Full
                  refund if item condition does not strictly align with provenance dossier.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Lock size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-primary font-semibold">Escrow Protection:</strong> Funds
                  remain securely held until buyer inspection confirms receipt.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Package size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-primary font-semibold">Zero-Plastic Delivery:</strong> Shipped
                  in compostable kraft packaging and seed-paper tags.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: CURATOR NOTES & CIRCULAR PHILOSOPHY ────────────────── */}
      <section className="w-full bg-surface-container-low py-space-2xl border-y border-outline-variant/30">
        <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <span className="text-[11px] font-bold text-secondary tracking-widest uppercase">
                Curator Notes &amp; Lineage
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[28px] md:text-[34px] text-primary leading-tight">
                The Philosophy of Visible Mending &amp; Material Longevity
              </h2>
              <p className="text-[15px] text-on-surface-variant leading-relaxed">
                Every physical creation carries energy, human effort, and earth extraction. When an
                object transitions between caretakers, its narrative enriches rather than diminishes.
                This {product.category.toLowerCase()} piece exemplifies the timeless discipline of
                keeping materials actively circulating in our living spaces.
              </p>
              <p className="text-[15px] text-on-surface-variant leading-relaxed">
                By choosing this piece through AFTERLIFE, you participate in the active rejection of
                planned obsolescence and fast consumption, safeguarding indigenous craftsmanship,
                textile artistry, and hardware preservation across India.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <Droplets size={20} className="text-primary" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold text-primary">
                  ~9,400 Litres
                </h3>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Clean water conserved by extending the lifespan of this piece instead of virgin
                  industrial manufacturing.
                </p>
              </div>

              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <Clock size={20} className="text-primary" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold text-primary">
                  Decades
                </h3>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Verified structural longevity, proving the physical endurance of ethical materials
                  and meticulous craftsmanship.
                </p>
              </div>

              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <InfinityIcon size={20} className="text-primary" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold text-primary">
                  Perpetual Cycle
                </h3>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Engineered or woven from authentic elements that allow future repair, circular
                  resale, or natural biodegradation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: CURATION HARMONIZATION (PAIRS WELL WITH) ───────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-2xl">
        <div className="flex flex-col gap-space-lg">
          <div className="flex items-end justify-between flex-wrap gap-space-md">
            <div>
              <span className="text-[11px] font-bold text-secondary tracking-widest uppercase">
                Curation Harmonization
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-[28px] font-medium text-primary mt-1">
                Pairs Well with These Circular Finds
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="text-[13px] font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
            >
              <span>Explore Archive</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {crossCategoryPairs.map((pair) => (
              <Link
                key={pair.id}
                href={`/product/${pair.id}`}
                className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col gap-space-md group hover:shadow-md transition-shadow"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container">
                  <Image
                    src={pair.image}
                    alt={pair.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface/90 text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm">
                    {pair.category} • {pair.condition.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">
                    {pair.location}
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-[16px] font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                    {pair.title}
                  </h3>
                  <div className="flex items-baseline gap-space-sm mt-1">
                    <span className="text-[16px] font-bold text-primary">
                      {formatPrice(pair.price)}
                    </span>
                    {pair.originalPrice && pair.originalPrice > pair.price && (
                      <span className="text-[12px] text-outline line-through">
                        {formatPrice(pair.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAKE AN OFFER MODAL (PROTOTYPE DEMONSTRATION) ──────────────────── */}
      {isOfferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary">
                Make an Offer
              </h3>
              <button
                onClick={() => {
                  setIsOfferOpen(false);
                  setOfferSubmitted(false);
                }}
                className="p-1 rounded-lg hover:bg-surface-container text-outline"
              >
                <X size={20} />
              </button>
            </div>

            {offerSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-[family-name:var(--font-playfair)] text-[18px] text-primary font-semibold mb-1">
                  Offer Transmitted
                </h4>
                <p className="text-[13px] text-on-surface-variant mb-4">
                  Your proposed offer of <strong>₹{offerAmount}</strong> has been forwarded to{" "}
                  <strong>{product.sellerName}</strong>. You will receive an alert if accepted.
                </p>
                <button
                  onClick={() => {
                    setIsOfferOpen(false);
                    setOfferSubmitted(false);
                    setOfferAmount("");
                  }}
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-semibold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (offerAmount) setOfferSubmitted(true);
                }}
                className="flex flex-col gap-4"
              >
                <p className="text-[13px] text-on-surface-variant">
                  Propose an ethical counter-offer for <strong>{product.title}</strong>. Listed at{" "}
                  <span className="font-semibold text-primary">{formatPrice(product.price)}</span>.
                </p>
                <div>
                  <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                    Your Proposed Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder={`e.g. ${Math.round(product.price * 0.85)}`}
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container text-primary font-semibold text-[16px] focus:outline-none focus:border-primary"
                  />
                  <span className="text-[11px] text-outline mt-1 block">
                    Curator recommendation: reasonable offers within 10–20% of list price are most
                    frequently accepted.
                  </span>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOfferOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors"
                  >
                    Send Offer to Curator
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MESSAGE CURATOR MODAL ─────────────────────────────────────────── */}
      {isMessageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary">
                Message {product.sellerName}
              </h3>
              <button
                onClick={() => {
                  setIsMessageOpen(false);
                  setMessageSent(false);
                }}
                className="p-1 rounded-lg hover:bg-surface-container text-outline"
              >
                <X size={20} />
              </button>
            </div>

            {messageSent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto mb-3">
                  <MessageSquare size={24} />
                </div>
                <h4 className="font-[family-name:var(--font-playfair)] text-[18px] text-primary font-semibold mb-1">
                  Message Dispatched
                </h4>
                <p className="text-[13px] text-on-surface-variant mb-4">
                  Your inquiry regarding <strong>{product.title}</strong> has been delivered to{" "}
                  {product.sellerName}.
                </p>
                <button
                  onClick={() => {
                    setIsMessageOpen(false);
                    setMessageSent(false);
                    setMessageText("");
                  }}
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (messageText) setMessageSent(true);
                }}
                className="flex flex-col gap-4"
              >
                <p className="text-[13px] text-on-surface-variant">
                  Ask about dimensions, provenance lineage, or local pickup in{" "}
                  <strong>{product.location}</strong>.
                </p>
                <textarea
                  rows={4}
                  placeholder="Hi, is this item still available? Could you confirm..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-primary text-[13px] focus:outline-none focus:border-primary resize-none"
                />
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsMessageOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors"
                  >
                    Dispatch Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── EXPRESS INTEREST & BUY MODAL ──────────────────────────────────── */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/40 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto mb-3">
              <ShoppingBag size={24} />
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-1">
              Escrow Reservation Initiated
            </h3>
            <p className="text-[13px] text-on-surface-variant mb-4 leading-relaxed">
              You are acquiring <strong>{product.title}</strong> for{" "}
              <span className="font-bold text-primary">
                {product.price === 0 ? "Free" : formatPrice(product.price)}
              </span>
              . In our circular exchange protocol, funds are held in escrow until you receive and
              physically verify the item.
            </p>
            <div className="p-3 bg-surface-container rounded-lg text-left text-[12px] text-on-surface-variant space-y-1 mb-5">
              <p>• Zero virgin production emissions</p>
              <p>• Plastic-free dispatch from {product.location}</p>
              <p>• 7-day complete circular inspection window</p>
            </div>
            <button
              onClick={() => setIsBuyModalOpen(false)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors"
            >
              Confirm Circular Acquisition (Demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
