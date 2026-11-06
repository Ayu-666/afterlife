"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { filterByIntent, keywordSearch, extractFallbackCriteria, getSeedProducts } from "@/lib/data";
import { SearchIntent, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

type SearchStatus = "idle" | "loading" | "success" | "error";

const INSPIRATIONS = [
  "Find engineering textbooks under ₹300",
  "I need affordable earthy decor for my hostel room",
  "Handmade anniversary gifts under ₹1,500",
  "Second-hand laptop under ₹30,000",
  "Surplus organic cotton fabric for DIY",
  "Vintage clothing under ₹2,000",
];

export default function AIFinderPage() {
  const { products } = useMarketplace();
  const allProducts = products.length > 0 ? products : getSeedProducts();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [intent, setIntent] = useState<SearchIntent | null>(null);
  const [aiUsed, setAiUsed] = useState(false);
  const [conversation, setConversation] = useState<
    { role: "user" | "ai"; content: string; results?: Product[] }[]
  >([]);

  const runSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) return;
      setStatus("loading");

      const userMsg = { role: "user" as const, content: q };
      setConversation((prev) => [...prev, userMsg]);

      try {
        // Try Gemini AI intent extraction
        const res = await fetch("/api/ai-finder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
          signal: AbortSignal.timeout(10000),
        });

        const data = await res.json();

        let found: Product[] = [];
        let usedAI = false;

        if (!data.fallback && data.intent) {
          const intentResult = filterByIntent(allProducts, data.intent);
          found = intentResult.slice(0, 12);
          setIntent(data.intent);
          usedAI = true;
        } else {
          // Fallback: smart keyword & budget search
          found = keywordSearch(allProducts, q).slice(0, 12);
          const criteria = extractFallbackCriteria(q);
          setIntent({
            category: criteria.category,
            max_price: criteria.maxPrice,
            min_price: criteria.minPrice,
            keywords: criteria.keywords,
          });
        }

        setAiUsed(usedAI);
        setStatus("success");

        const aiMsg = {
          role: "ai" as const,
          content: found.length > 0
            ? `Found ${found.length} matching item${found.length !== 1 ? "s" : ""} in the catalogue.${usedAI ? " (AI intent extraction used)" : " (smart fallback search used)"}`
            : "No matching items found in the current catalogue. Try broadening your budget or keywords.",
          results: found,
        };
        setConversation((prev) => [...prev, aiMsg]);
      } catch {
        // Network/timeout fallback
        const found = keywordSearch(allProducts, q).slice(0, 12);
        const criteria = extractFallbackCriteria(q);
        setIntent({
          category: criteria.category,
          max_price: criteria.maxPrice,
          min_price: criteria.minPrice,
          keywords: criteria.keywords,
        });
        setAiUsed(false);
        setStatus("success");
        const aiMsg = {
          role: "ai" as const,
          content: found.length > 0
            ? `Smart search found ${found.length} result${found.length !== 1 ? "s" : ""} in the catalogue.`
            : "No matching items found in the current catalogue.",
          results: found,
        };
        setConversation((prev) => [...prev, aiMsg]);
      }
    },
    [allProducts]
  );

  const handleSubmit = () => {
    if (query.trim()) {
      runSearch(query);
      setQuery("");
    }
  };

  const handleInspiration = (s: string) => {
    setQuery(s);
    runSearch(s);
  };

  const clearConversation = () => {
    setConversation([]);
    setStatus("idle");
    setIntent(null);
    setQuery("");
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-xl">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold tracking-wider mb-space-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Gemini AI Powered · {allProducts.length}+ Catalogue Items
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[48px] font-normal text-primary tracking-tight mb-space-sm leading-tight">
            AFTERLIFE AI Finder
          </h1>
          <p className="text-[18px] text-on-surface-variant max-w-2xl leading-relaxed">
            Describe what you need in plain words. The AI extracts your intent and searches only
            real items in the catalogue — it never invents products.
          </p>
          <div className="flex items-center gap-space-lg mt-space-md text-outline text-[11px] font-semibold tracking-wider">
            <span className="flex items-center gap-1">✅ Only real catalogue items</span>
            <span className="flex items-center gap-1">🔒 AI runs server-side</span>
            <span className="flex items-center gap-1">⚡ Keyword fallback if AI unavailable</span>
          </div>
        </div>

        {/* Input workbench */}
        <div className="max-w-4xl mx-auto mb-space-2xl">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xl">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-start gap-space-sm">
                <Sparkles size={24} className="text-primary mt-2 shrink-0" />
                <div className="flex-1">
                  <textarea
                    className="w-full bg-transparent border-0 text-[18px] text-on-surface placeholder:text-outline focus:outline-none resize-none"
                    id="concierge-prompt"
                    placeholder="Find engineering textbooks under ₹300, or a solid brass desk lamp for my study..."
                    rows={2}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
                <span className="text-[11px] text-outline tracking-wider hidden sm:inline">
                  Press ⌘ + Enter to search
                </span>
                <div className="flex items-center gap-space-xs ml-auto">
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary text-[13px] font-medium transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={status === "loading" || !query.trim()}
                    className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary text-[13px] font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Assemble Match
                        <Sparkles size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Inspirations */}
          <div className="flex flex-wrap items-center gap-space-xs mt-space-md justify-center">
            <span className="text-[11px] font-semibold text-outline uppercase tracking-wider mr-1">
              Inspirations:
            </span>
            {INSPIRATIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleInspiration(s)}
                className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-[13px] font-medium transition-all shadow-sm"
              >
                &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        {conversation.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-space-md">
              <h2 className="font-[family-name:var(--font-playfair)] text-[22px] text-primary font-medium">
                Results
              </h2>
              <button
                onClick={clearConversation}
                className="text-[11px] text-outline hover:text-error flex items-center gap-1 font-semibold"
              >
                <X size={14} /> Clear conversation
              </button>
            </div>

            <div className="flex flex-col gap-space-lg">
              {conversation.map((msg, i) => (
                <div key={i}>
                  {msg.role === "user" ? (
                    <div className="flex items-start justify-end gap-space-md">
                      <div className="bg-surface-container-high rounded-2xl rounded-tr-sm p-space-md max-w-xl shadow-sm text-right">
                        <span className="text-[11px] font-semibold text-outline block mb-1">
                          You
                        </span>
                        <p className="text-[15px] text-on-surface">&ldquo;{msg.content}&rdquo;</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm">
                        ME
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-space-md">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md">
                        <Sparkles size={20} />
                      </div>
                      <div className="flex-1 flex flex-col gap-space-md">
                        {/* AI summary card */}
                        <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm">
                          <div className="flex items-center justify-between mb-space-xs">
                            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                              ✨ AFTERLIFE AI CONCIERGE
                            </span>
                            {aiUsed && i === conversation.length - 1 && (
                              <span className="text-[11px] bg-surface-container px-2 py-0.5 rounded text-outline">
                                Gemini AI
                              </span>
                            )}
                          </div>
                          <p className="font-[family-name:var(--font-playfair)] text-[18px] text-primary mb-space-xs">
                            {msg.content}
                          </p>

                          {/* Intent breakdown */}
                          {intent && i === conversation.length - 1 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-2">
                              {intent.category && (
                                <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                                  Category: {intent.category}
                                </span>
                              )}
                              {intent.max_price && (
                                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-primary text-[11px] font-semibold">
                                  Max: ₹{intent.max_price.toLocaleString("en-IN")}
                                </span>
                              )}
                              {intent.keywords && intent.keywords.length > 0 && (
                                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px]">
                                  Keywords: {intent.keywords.join(", ")}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Results grid */}
                        {msg.results && msg.results.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                            {msg.results.map((p) => (
                              <ProductCard key={p.id} product={p} />
                            ))}
                          </div>
                        )}

                        {msg.results && msg.results.length === 0 && (
                          <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center border border-outline-variant">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-[15px] text-on-surface-variant mb-4">
                              No matching items found in the current catalogue.
                            </p>
                            <Link
                              href="/marketplace"
                              className="inline-flex items-center gap-2 px-space-lg py-3 bg-primary text-on-primary text-[13px] font-medium rounded"
                            >
                              Browse All Listings <ArrowRight size={16} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idle state */}
        {conversation.length === 0 && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <div className="lg:col-span-8">
              <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center border border-outline-variant/50">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[24px] text-primary mb-3">
                  Ask anything about the catalogue
                </h3>
                <p className="text-[15px] text-on-surface-variant leading-relaxed max-w-md mx-auto">
                  Try natural language like &ldquo;engineering books under ₹300&rdquo; or &ldquo;handmade gifts for
                  under ₹500&rdquo;. The AI finds only real items.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-space-sm">
              <p className="text-[11px] font-semibold text-outline uppercase tracking-wider mb-1">
                How it works
              </p>
              {[
                { icon: "1️⃣", text: "You type a natural language request" },
                { icon: "2️⃣", text: "Gemini AI extracts your intent (category, budget, keywords)" },
                { icon: "3️⃣", text: "We filter the real catalogue — no invented products" },
                { icon: "4️⃣", text: "Results link to actual product detail pages" },
              ].map((s) => (
                <div
                  key={s.text}
                  className="flex items-start gap-2 bg-surface-container-low rounded-lg p-space-sm"
                >
                  <span className="text-[16px] shrink-0">{s.icon}</span>
                  <span className="text-[13px] text-on-surface-variant">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
