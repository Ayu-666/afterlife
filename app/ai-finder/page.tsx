"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  ShoppingBag,
  Camera,
  Mic,
  CheckCircle2,
  Palette,
  ShieldCheck,
  TrendingDown,
  RefreshCw,
  ChevronRight,
  Award,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { getSeedProducts, formatPrice } from "@/lib/data";
import { Product, SearchIntent } from "@/lib/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  suggestedFollowUps?: string[];
  aiUsed?: boolean;
  intent?: SearchIntent;
}

const INSPIRATION_PROMPTS = [
  "Find engineering textbooks under ₹500",
  "Affordable earthy decor for a hostel room under ₹2,000",
  "Handmade anniversary gifts under ₹1,500",
  "Comfortable vintage denim jacket or boots",
  "Surplus organic cotton fabric for DIY tote",
];

function AIFinderContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || searchParams.get("q") || "";
  const initialSearchTriggered = useRef(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { products: contextProducts } = useMarketplace();
  const allProducts = contextProducts.length > 0 ? contextProducts : getSeedProducts();

  const [input, setInput] = useState(
    "I'm setting up a quiet reading corner on a budget of ₹4,000. I need warm ambient lighting, a comfortable wooden footstool or small table, and a couple of classic novels."
  );
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bundleAlert, setBundleAlert] = useState(false);

  // Smooth scroll
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = useCallback(
    async (textToSend: string) => {
      const q = textToSend.trim();
      if (!q || loading) return;

      const userMsgId = `user-${Date.now()}`;
      const newUserMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: q,
      };

      setMessages((prev) => [...prev, newUserMsg]);
      setLoading(true);

      const currentHistory = [...messages, newUserMsg].map((m) => ({
        role: m.role,
        content: m.content,
        productIds: m.products?.map((p) => p.id),
      }));

      try {
        const res = await fetch("/api/ai-finder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: q,
            conversationHistory: currentHistory,
          }),
          signal: AbortSignal.timeout(12000),
        });

        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const data = await res.json();

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            data.message ||
            "I curated a harmonious circular set matching your request across verified artisans and sellers:",
          products: Array.isArray(data.products) && data.products.length > 0
            ? data.products
            : allProducts.slice(0, 3),
          suggestedFollowUps: Array.isArray(data.suggestedFollowUps)
            ? data.suggestedFollowUps
            : [],
          aiUsed: !!data.aiUsed,
          intent: data.intent,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("AI Concierge search error:", err);
        // Fallback with relevant catalogue items
        const lowerQ = q.toLowerCase();
        let fallbackMatch = allProducts.filter(
          (p) =>
            p.title.toLowerCase().includes(lowerQ) ||
            p.description.toLowerCase().includes(lowerQ) ||
            p.category.toLowerCase().includes(lowerQ)
        );
        if (fallbackMatch.length === 0) {
          fallbackMatch = allProducts.slice(0, 3);
        }

        const fallbackMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "I curated a harmonious circular bundle from our catalogue matching your aesthetic and budget criteria:",
          products: fallbackMatch.slice(0, 3),
          suggestedFollowUps: [
            "Show options under ₹1,000",
            "Browse RE:READ textbooks",
            "Show handcrafted ROOTS items",
          ],
          aiUsed: false,
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, allProducts]
  );

  // Auto-run if query param present
  useEffect(() => {
    const q = queryParam.trim();
    if (q && !initialSearchTriggered.current) {
      initialSearchTriggered.current = true;
      setInput(q);
      handleSend(q);
    }
  }, [queryParam, handleSend]);

  // Initial demonstration conversation if empty
  const defaultProducts = [
    allProducts.find((p) => p.category === "ROOTS") || allProducts[0],
    allProducts.find((p) => p.category === "RE:MAKE") || allProducts[1],
    allProducts.find((p) => p.category === "RE:READ") || allProducts[2],
  ].filter(Boolean) as Product[];

  const activeAssistantMessage =
    [...messages].reverse().find((m) => m.role === "assistant") || null;

  const currentProducts =
    activeAssistantMessage?.products && activeAssistantMessage.products.length > 0
      ? activeAssistantMessage.products
      : defaultProducts;

  const bundleTotal = currentProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleOriginal = currentProducts.reduce(
    (sum, p) => sum + (p.originalPrice || p.price * 1.6),
    0
  );
  const bundleSavings = Math.max(0, bundleOriginal - bundleTotal);

  // Alternate swap candidates
  const swapCandidates = allProducts
    .filter((p) => !currentProducts.some((cp) => cp.id === p.id))
    .slice(0, 2);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-background">
      <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-space-xl">
        {/* ── 1. AI CONCIERGE EDITORIAL HEADER ─────────────────────────────── */}
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container text-primary text-[11px] font-bold uppercase tracking-wider mb-space-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Neural Circular Concierge • Indexing {allProducts.length} Verified Sustainable Artefacts
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-[44px] md:text-[56px] text-primary tracking-tight leading-[1.1] mb-space-sm">
            AFTERLIFE AI Concierge
          </h1>

          <p className="text-[17px] text-on-surface-variant max-w-2xl leading-relaxed">
            Describe what you need in plain words. Our neural circular engine assembles coherent
            multi-item bundles across pre-loved wardrobes, artisan workshops, and student libraries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-space-lg gap-y-2 mt-space-md text-outline text-[11px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-secondary" /> 100% Provenance Checked
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw size={15} className="text-secondary" /> Consolidated Escrow &amp; Logistics
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={15} className="text-secondary" /> Real-Time CO₂e Offsets
            </span>
          </div>
        </section>

        {/* ── 2. QUERY WORKBENCH & INPUT SURFACE ───────────────────────────── */}
        <section className="max-w-4xl mx-auto mb-space-2xl">
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xl border border-outline-variant/30 transition-all">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-start gap-space-sm">
                <Sparkles size={24} className="text-primary mt-2 shrink-0" />
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        handleSend(input);
                      }
                    }}
                    placeholder="Find engineering textbooks under ₹300, or a solid brass desk lamp for my study..."
                    className="w-full bg-transparent border-0 text-[16px] text-on-surface placeholder:text-outline focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/20">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <button
                    type="button"
                    onClick={() => alert("Visual Search: upload a reference image to find similar circular pieces across the archive.")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold transition-colors shadow-sm"
                  >
                    <Camera size={16} className="text-primary" />
                    <span>Visual Search</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Voice Note: speak your aesthetic or budget request to synthesize an instant bundle.")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold transition-colors shadow-sm"
                  >
                    <Mic size={16} className="text-secondary" />
                    <span>Voice Note</span>
                  </button>
                  <span className="text-outline text-[11px] font-medium ml-2 hidden sm:inline-block">
                    Press ⌘ + Enter to synthesize
                  </span>
                </div>

                <div className="flex items-center gap-space-xs">
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary text-[12px] font-semibold transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSend(input)}
                    disabled={loading || !input.trim()}
                    className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary text-[13px] font-bold transition-colors shadow-md disabled:opacity-50"
                  >
                    <span>{loading ? "Synthesizing..." : "Assemble Match"}</span>
                    <Sparkles size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Editorial Chips */}
          <div className="flex flex-wrap items-center gap-space-xs mt-space-md justify-center">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider mr-1">
              Inspirations:
            </span>
            {INSPIRATION_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInput(prompt);
                  handleSend(prompt);
                }}
                className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-[12px] font-medium transition-all shadow-sm border border-outline-variant/30"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </section>

        {/* ── 3. MAIN CONVERSATION FLOW & SYNTHESIS STREAM ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Primary Concierge Stream (Left 8 Cols) */}
          <section className="lg:col-span-8 flex flex-col gap-space-lg">
            {/* User Query Bubble */}
            <div className="flex items-start justify-end gap-space-md">
              <div className="bg-surface-container-high rounded-2xl rounded-tr-sm p-space-md max-w-xl shadow-sm text-right border border-outline-variant/30">
                <span className="text-[10px] font-bold text-outline block mb-1 uppercase tracking-wider">
                  You • Circular Brief
                </span>
                <p className="text-[14px] text-on-surface leading-relaxed">
                  &ldquo;
                  {messages.length > 0 && messages[messages.length - 2]?.role === "user"
                    ? messages[messages.length - 2].content
                    : input || "Curated Reading Corner Request"}
                  &rdquo;
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm">
                YOU
              </div>
            </div>

            {/* Assistant Thinking & Synthesis Banner */}
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md">
                <Sparkles size={18} />
              </div>

              <div className="flex-1 flex flex-col gap-space-md">
                {/* Thought Card */}
                <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-secondary" />
                      Harmonized Circular Synthesis
                    </span>
                    <span className="text-[10px] font-semibold bg-surface-container px-2 py-0.5 rounded text-outline uppercase tracking-wider">
                      {currentProducts.length} Sellers Consolidated
                    </span>
                  </div>

                  <p className="font-[family-name:var(--font-playfair)] text-[18px] text-primary mb-space-xs leading-snug">
                    {activeAssistantMessage?.content ||
                      "I curated a harmonious circular bundle tailored to your request across regional circular artisans and collectors."}
                  </p>

                  <div className="flex flex-wrap items-center gap-space-md pt-2 border-t border-outline-variant/20 mt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                        Bundle Total:
                      </span>
                      <span className="text-[20px] font-bold text-primary">
                        {formatPrice(bundleTotal)}
                      </span>
                      <span className="text-[13px] text-outline line-through">
                        {formatPrice(bundleOriginal)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-container text-primary text-[11px] font-bold uppercase tracking-wider">
                      <TrendingDown size={14} /> Saved {formatPrice(bundleSavings)}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-tertiary-fixed text-primary text-[11px] font-bold uppercase tracking-wider">
                      ~14.8 kg CO₂e Prevented
                    </span>
                  </div>
                </div>

                {/* Horizontal Recommendation Cards Stream */}
                <div className="flex flex-col gap-space-md">
                  {currentProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md border border-outline-variant/30 transition-all flex flex-col sm:flex-row gap-space-md group"
                    >
                      <div className="relative w-full sm:w-44 h-44 rounded-lg overflow-hidden bg-surface-container shrink-0">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 180px"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-tertiary-fixed text-primary text-[10px] font-bold tracking-wider uppercase">
                          {p.condition.toUpperCase()}
                        </span>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-bold tracking-wider uppercase">
                          {p.category}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
                                Pillar • {p.category}
                              </span>
                              <h3 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-primary group-hover:text-secondary transition-colors">
                                {p.title}
                              </h3>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[18px] font-bold text-primary block">
                                {formatPrice(p.price)}
                              </span>
                              {p.originalPrice && (
                                <span className="block text-[11px] text-outline line-through">
                                  {formatPrice(p.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[13px] text-on-surface-variant line-clamp-2 mb-space-sm leading-relaxed">
                            {p.description}
                          </p>

                          <div className="flex items-center gap-space-md py-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-secondary-fixed text-primary flex items-center justify-center text-[10px] font-bold">
                                {p.sellerName.charAt(0)}
                              </div>
                              <span className="text-[12px] font-semibold text-on-surface">
                                {p.sellerName}
                              </span>
                              <span className="text-[11px] text-outline">• {p.location}</span>
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-secondary">
                              <Award size={13} /> 99.8% Trust Score
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-space-xs bg-surface-container-low px-3 py-2 rounded-lg mt-space-xs border border-outline-variant/20">
                          <span className="text-[11px] text-outline flex items-center gap-1">
                            <ShieldCheck size={14} className="text-secondary" /> Verified Circular
                            Specimen
                          </span>
                          <Link
                            href={`/product/${p.id}`}
                            className="text-[12px] font-bold text-primary hover:underline flex items-center gap-0.5"
                          >
                            <span>Inspect Item</span>
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Integrated Bundle Action Bar */}
                <div className="bg-surface-container rounded-xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md shadow-sm border border-outline-variant/30">
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <ShoppingBag size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                          Curated Sanctuary Bundle
                        </span>
                        <span className="bg-secondary-container text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Consolidated Parcel
                        </span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant">
                        All items ship together with carbon-neutral transit via AFTERLIFE Unified Hub.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-space-xs w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setBundleAlert(true)}
                      className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary text-[13px] font-bold transition-colors shadow-md"
                    >
                      <span>Bundle All • {formatPrice(bundleTotal)}</span>
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div ref={chatBottomRef} />
          </section>

          {/* ── 4. REASONING DRAWER & PROVENANCE BREAKDOWN (Right 4 Cols) ───── */}
          <aside className="lg:col-span-4 flex flex-col gap-space-lg">
            {/* Why This Was Chosen Engine Logic */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-sm mb-space-md bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg pt-space-lg rounded-t-xl border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-primary" />
                  <h2 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-primary">
                    Why This Was Chosen
                  </h2>
                </div>
                <span className="text-[10px] font-bold bg-secondary-container text-primary px-2 py-0.5 rounded uppercase tracking-wider">
                  98.2% Fit
                </span>
              </div>

              {/* Matching Criteria Breakdown */}
              <div className="space-y-space-md">
                {/* Aesthetic Synergy */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-bold text-on-surface flex items-center gap-1.5">
                      <Palette size={14} className="text-secondary" />
                      Aesthetic &amp; Tonal Cohesion
                    </span>
                    <span className="text-[13px] font-bold text-primary">96%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "96%" }} />
                  </div>
                  <p className="text-[11px] text-outline mt-1 leading-normal">
                    Harmonizes raw textures, natural handloom and timber joinery for tranquil study mood.
                  </p>
                </div>

                {/* Material Authenticity */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-bold text-on-surface flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-secondary" />
                      Material Authenticity
                    </span>
                    <span className="text-[13px] font-bold text-primary">100%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                  </div>
                  <p className="text-[11px] text-outline mt-1 leading-normal">
                    Zero virgin synthetic composites: authenticated solid wood, cotton rags, and brass.
                  </p>
                </div>

                {/* Budget Optimization */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-bold text-on-surface flex items-center gap-1.5">
                      <TrendingDown size={14} className="text-secondary" />
                      Budget Optimization
                    </span>
                    <span className="text-[13px] font-bold text-primary">91.2%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "91.2%" }} />
                  </div>
                  <p className="text-[11px] text-outline mt-1 leading-normal">
                    Maintained comfort ceiling within budget while maximizing multi-merchant courier savings.
                  </p>
                </div>

                {/* Trust Index */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-bold text-on-surface flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-secondary" />
                      Seller Collective Trust Score
                    </span>
                    <span className="text-[13px] font-bold text-primary">99.4</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "99.4%" }} />
                  </div>
                  <p className="text-[11px] text-outline mt-1 leading-normal">
                    All merchants hold verified AFTERLIFE circular credentials with full escrow tracking.
                  </p>
                </div>
              </div>

              {/* Lifecycle Impact Gauge (Inline SVG Visual) */}
              <div className="mt-space-lg p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-space-xs">
                  Lifecycle Impact Gauge
                </span>
                <div className="flex items-center gap-space-md">
                  <svg className="w-16 h-16 -rotate-90 shrink-0" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-highest"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-primary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="72, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div>
                    <div className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-primary leading-tight">
                      72% Diversion
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                      Virgin industrial extraction averted compared to buying new retail goods.
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-outline uppercase tracking-wider">
                      Verified by OpenCircularity v2
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternate Swap Candidates */}
            <div className="bg-surface-container rounded-xl p-space-md shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h4 className="text-[11px] font-bold text-primary tracking-wider uppercase">
                  Alternate Swap Candidates
                </h4>
                <RefreshCw size={14} className="text-outline" />
              </div>

              <div className="space-y-space-sm">
                {swapCandidates.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/product/${candidate.id}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high transition-colors group border border-outline-variant/20 block"
                  >
                    <div className="flex items-center gap-space-xs">
                      <div className="w-10 h-10 rounded bg-surface-container overflow-hidden shrink-0 relative">
                        <Image
                          src={candidate.image}
                          alt={candidate.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <h5 className="text-[12px] font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                          {candidate.title}
                        </h5>
                        <span className="text-[10px] text-outline font-semibold">
                          {formatPrice(candidate.price)} • {candidate.sellerName}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider shrink-0 ml-2">
                      Inspect →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── BUNDLE CONFIRMATION MODAL ─────────────────────────────────────── */}
      {bundleAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/40 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto mb-3">
              <ShoppingBag size={24} />
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-1">
              Consolidated Bundle Reserved
            </h3>
            <p className="text-[13px] text-on-surface-variant mb-4 leading-relaxed">
              All {currentProducts.length} circular artefacts bundled for{" "}
              <span className="font-bold text-primary">{formatPrice(bundleTotal)}</span>. A single
              consolidated parcel will be dispatched with escrow protection.
            </p>
            <div className="p-3 bg-surface-container rounded-lg text-left text-[12px] text-on-surface-variant space-y-1 mb-5">
              <p>• Saved {formatPrice(bundleSavings)} compared to virgin retail</p>
              <p>• Carbon-neutral shipping unified hub</p>
              <p>• Zero plastic packaging guaranteed</p>
            </div>
            <button
              onClick={() => setBundleAlert(false)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIFinderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-outline">
          <Sparkles className="animate-spin mr-2" size={20} />
          <span>Initializing AI Concierge...</span>
        </div>
      }
    >
      <AIFinderContent />
    </Suspense>
  );
}
