"use client";

import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMarketplace } from "@/lib/context";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { products, wishlistIds } = useMarketplace();
  const wishlisted = products.filter((p) => wishlistIds.includes(p.id));

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
            Continue browsing
          </Link>
          <div className="flex items-center gap-4">
            <Heart size={32} className="text-on-primary/60" fill="currentColor" />
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-[36px] md:text-[48px] font-normal leading-tight">
                Your Wishlist
              </h1>
              <p className="text-on-primary/70 text-sm mt-1">
                {wishlisted.length === 0
                  ? "Nothing saved yet"
                  : `${wishlisted.length} item${wishlisted.length !== 1 ? "s" : ""} saved`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {wishlisted.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
              <Heart size={36} className="text-outline" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-primary mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-on-surface-variant text-sm max-w-sm mb-8">
              Browse the marketplace and tap the heart icon on any product to save it here.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-container transition-colors"
            >
              <ShoppingBag size={16} />
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-on-surface-variant text-sm">
                Saved items are stored in your browser. Add an account to sync across devices.
              </p>
              <Link
                href="/marketplace"
                className="text-secondary text-sm font-medium hover:text-primary transition-colors underline underline-offset-2"
              >
                Keep browsing
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlisted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
