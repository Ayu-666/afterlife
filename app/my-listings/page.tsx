"use client";

import { Plus, Trash2, Package, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMarketplace } from "@/lib/context";
import { formatPrice } from "@/lib/data";
import { useState } from "react";

export default function MyListingsPage() {
  const { userListings, removeListing } = useMarketplace();
  const [deleting, setDeleting] = useState<string | null>(null);

  function handleDelete(id: string) {
    setDeleting(id);
    setTimeout(() => {
      removeListing(id);
      setDeleting(null);
    }, 300);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-on-primary py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-on-primary/70 hover:text-on-primary text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to marketplace
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Package size={32} className="text-on-primary/60" />
              <div>
                <h1 className="font-[family-name:var(--font-playfair)] text-[36px] md:text-[48px] font-normal leading-tight">
                  My Listings
                </h1>
                <p className="text-on-primary/70 text-sm mt-1">
                  {userListings.length === 0
                    ? "No listings yet"
                    : `${userListings.length} listing${userListings.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <Link
              href="/sell"
              className="hidden md:inline-flex items-center gap-2 bg-on-primary text-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-inverse-on-surface transition-colors"
            >
              <Plus size={16} />
              New Listing
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Notice */}
        <div className="flex items-start gap-3 bg-surface-container border border-outline-variant rounded-xl p-4 mb-8">
          <AlertTriangle size={18} className="text-outline shrink-0 mt-0.5" />
          <div className="text-sm text-on-surface-variant">
            <strong className="text-on-surface">Local storage only.</strong> Your listings are saved in this browser.
            They will appear in the marketplace immediately but will not persist across devices. Demo catalogue listings are managed separately and are not shown here.
          </div>
        </div>

        {userListings.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
              <Package size={36} className="text-outline" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-primary mb-3">
              You haven&apos;t listed anything yet
            </h2>
            <p className="text-on-surface-variant text-sm max-w-sm mb-8">
              Give your pre-owned goods, handmade creations, or surplus materials a second life on AFTERLIFE.
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-container transition-colors"
            >
              <Plus size={16} />
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-primary">
                Your listings
              </h2>
              <Link
                href="/sell"
                className="md:hidden inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-semibold"
              >
                <Plus size={14} />
                New
              </Link>
            </div>

            <div className="space-y-4">
              {userListings.map((product) => (
                <div
                  key={product.id}
                  className={`bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden transition-all duration-300 ${
                    deleting === product.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <div className="flex items-start gap-4 p-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                      <Image
                        src={product.imagePreviewUrl || product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={!!product.imagePreviewUrl}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            product.fallbackImage || "/images/fallback.svg";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-[family-name:var(--font-playfair)] text-[16px] font-semibold text-primary line-clamp-1">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-bold tracking-wide uppercase">
                              {product.category}
                            </span>
                            <span className="text-[10px] text-outline uppercase tracking-wide">
                              {product.condition}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[18px] font-semibold text-primary">
                            {product.price === 0 ? "Free" : formatPrice(product.price)}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-[11px] text-outline line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-outline">{product.location}</span>
                          <span className="text-[11px] text-outline">
                            {new Date(product.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${product.id}`}
                            className="text-[12px] text-secondary hover:text-primary font-medium transition-colors underline underline-offset-2"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex items-center gap-1 text-[12px] text-error hover:text-error/80 font-medium transition-colors px-2 py-1 rounded hover:bg-error-container"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
