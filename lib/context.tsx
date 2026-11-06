"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Product } from "./types";
import {
  getAllProducts,
  getSeedProducts,
  getUserListings,
  saveUserListing,
  deleteUserListing,
  getWishlistIds,
  toggleWishlist as toggleWishlistFn,
} from "./data";

interface MarketplaceContextValue {
  products: Product[];
  userListings: Product[];
  wishlistIds: string[];
  addListing: (product: Product) => void;
  removeListing: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  refreshProducts: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(getSeedProducts);
  const [userListings, setUserListings] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const refreshProducts = useCallback(() => {
    setProducts(getAllProducts());
    setUserListings(getUserListings());
    setWishlistIds(getWishlistIds());
  }, []);

  // Merge localStorage user listings and wishlist after mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(getAllProducts());
    setUserListings(getUserListings());
    setWishlistIds(getWishlistIds());
  }, []);

  const addListing = useCallback(
    (product: Product) => {
      saveUserListing(product);
      refreshProducts();
    },
    [refreshProducts]
  );

  const removeListing = useCallback(
    (id: string) => {
      deleteUserListing(id);
      refreshProducts();
    },
    [refreshProducts]
  );

  const toggleWishlist = useCallback(
    (id: string) => {
      toggleWishlistFn(id);
      setWishlistIds(getWishlistIds());
    },
    []
  );

  const isWishlisted = useCallback(
    (id: string) => wishlistIds.includes(id),
    [wishlistIds]
  );

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        userListings,
        wishlistIds,
        addListing,
        removeListing,
        toggleWishlist,
        isWishlisted,
        refreshProducts,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return ctx;
}
