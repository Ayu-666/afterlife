"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Send,
  ShoppingBag,
  Compass,
  BookOpen,
  Palette,
  Laptop,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { getSeedProducts, formatPrice } from "@/lib/data";
import { Product, SearchIntent } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

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
  {
    icon: <BookOpen size={16} className="text-secondary" />,
    text: "Find engineering textbooks under ₹500",
    category: "RE:READ",
  },
  {
    icon: <Palette size={16} className="text-secondary" />,
    text: "Handmade traditional Indian gifts under ₹1,000",
    category: "ROOTS",
  },
  {
    icon: <ShoppingBag size={16} className="text-secondary" />,
    text: "Comfortable vintage denim jacket or boots",
    category: "RE:WEAR",
  },
  {
    icon: <Compass size={16} className="text-secondary" />,
    text: "Useful study decor for my college room",
    category: "RE:MAKE",
  },
  {
    icon: <Laptop size={16} className="text-secondary" />,
    text: "Refurbished mechanical keyboard or headphones",
    category: "RE:USE",
  },
];

function AIFinderContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || searchParams.get("q") || "";
  const initialSearchTriggered = useRef(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { products: contextProducts } = useMarketplace();
  const allProducts = contextProducts.length > 0 ? contextProducts : getSeedProducts();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Smooth scroll to chat bottom
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

      // Add user message to UI immediately
      setMessages((prev) => [...prev, newUserMsg]);
      setInput("");
      setLoading(true);

      // Prepare conversation history payload for contextual memory
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

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();

        // Assistant response message
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message || "Here are matching circular listings from the catalogue:",
          products: Array.isArray(data.products) ? data.products : [],
          suggestedFollowUps: Array.isArray(data.suggestedFollowUps) ? data.suggestedFollowUps : [],
          aiUsed: !!data.aiUsed,
          intent: data.intent,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("AI Finder search error:", err);
        // Fallback message if network or route failed
        const fallbackMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "I encountered a temporary connection glitch. However, all our circular listings are live in the marketplace.",
          products: allProducts.slice(0, 4),
          suggestedFollowUps: [
            "Browse RE:READ books",
            "Browse ROOTS handmade crafts",
            "Show items under ₹500",
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

  // Execute search once if URL contains ?query=...
  useEffect(() => {
    const q = queryParam.trim();
    if (q && !initialSearchTriggered.current) {
      initialSearchTriggered.current = true;
      handleSend(q);
    }
  }, [queryParam, handleSend]);

  const handleReset = () => {
    setMessages([]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-surface">
      {/* Top Banner */}
      <section className="w-full border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-[family-name:var(--font-playfair)] text-[17px] font-semibold text-primary leading-none">
                  AFTERLIFE Shopping Companion
                </h1>
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              </div>
              <p className="text-[11px] text-outline mt-0.5">
                Conversational discovery · Grounded in {allProducts.length} verified catalogue items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/60 text-outline hover:text-error hover:border-error text-[12px] font-medium transition-colors"
                title="Clear conversation"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset Chat</span>
              </button>
            )}
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary text-[12px] font-medium transition-colors"
            >
              Marketplace <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Conversation Container */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-gutter lg:px-margin-lg py-space-lg flex flex-col justify-between">
        {/* Welcome / Inspirations Screen when no messages */}
        {messages.length === 0 && (
          <div className="my-auto py-space-xl flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-space-md shadow-md">
              <Sparkles size={32} />
            </div>

            <h2 className="font-[family-name:var(--font-playfair)] text-[36px] sm:text-[44px] font-normal text-primary tracking-tight mb-space-xs leading-tight">
              What can I help you find today?
            </h2>
            <p className="text-[16px] text-on-surface-variant max-w-xl mx-auto mb-space-xl leading-relaxed">
              Ask about products, explain your budget, request recommendations for college or gifting,
              or compare options. I search real, circular listings in the AFTERLIFE catalogue.
            </p>

            {/* Suggested Prompt Cards */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-left">
              {INSPIRATION_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="group flex items-start gap-3 p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/40 hover:border-secondary/50 shadow-sm transition-all"
                >
                  <div className="p-2 rounded-lg bg-surface-container group-hover:bg-secondary-container transition-colors shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                      &ldquo;{p.text}&rdquo;
                    </p>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mt-1">
                      {p.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-xl text-[12px] text-outline">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-secondary" /> 100% Real items only
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-secondary" /> Context-aware comparisons
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-secondary" /> Budget strictness
              </span>
            </div>
          </div>
        )}

        {/* Chat Timeline */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-space-xl pb-space-xl">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-space-sm">
                {msg.role === "user" ? (
                  // User Message
                  <div className="flex items-start justify-end gap-3 max-w-3xl ml-auto">
                    <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm px-space-lg py-space-md shadow-sm">
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm">
                      YOU
                    </div>
                  </div>
                ) : (
                  // Assistant Message
                  <div className="flex items-start gap-3 max-w-full">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md mt-1">
                      <Sparkles size={16} />
                    </div>

                    <div className="flex-1 flex flex-col gap-space-md max-w-4xl">
                      {/* Assistant speech bubble */}
                      <div className="bg-surface-container-lowest rounded-2xl rounded-tl-sm p-space-lg shadow-sm border border-outline-variant/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                            AFTERLIFE CONCIERGE
                          </span>
                          {msg.aiUsed && (
                            <span className="text-[10px] bg-secondary-container text-on-secondary-container font-semibold px-2 py-0.5 rounded-full">
                              Gemini Powered
                            </span>
                          )}
                        </div>

                        <div className="text-[15px] text-on-surface leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </div>

                        {/* Intent metadata pill */}
                        {msg.intent && (msg.intent.category || msg.intent.max_price) && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-outline-variant/30">
                            {msg.intent.category && (
                              <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-bold uppercase tracking-wider">
                                {msg.intent.category}
                              </span>
                            )}
                            {msg.intent.max_price && (
                              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[10px] font-semibold">
                                Budget: ≤ {formatPrice(msg.intent.max_price)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Recommended Product Cards Grid */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                          {msg.products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                          ))}
                        </div>
                      )}

                      {/* Interactive Follow-Up Chips */}
                      {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] font-semibold text-outline uppercase tracking-wider mr-1 flex items-center gap-1">
                            <HelpCircle size={12} /> Suggestions:
                          </span>
                          {msg.suggestedFollowUps.map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(chip)}
                              className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container text-on-surface-variant text-[12px] font-medium transition-all shadow-sm border border-outline-variant/30"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md animate-pulse">
                  <Sparkles size={16} />
                </div>
                <div className="bg-surface-container-lowest rounded-2xl rounded-tl-sm px- space-md py-3 shadow-sm border border-outline-variant/40 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[12px] text-outline font-medium ml-1">
                    Searching catalogue &amp; formulating recommendations...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        )}

        {/* Input Workbench */}
        <div className="sticky bottom-4 z-10 w-full max-w-4xl mx-auto mt-space-md">
          <div className="bg-surface-container-lowest rounded-2xl p-space-sm sm:p-space-md shadow-2xl border border-outline-variant/60 focus-within:border-primary transition-all">
            <div className="flex items-center gap-2">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent border-0 text-[15px] sm:text-[16px] text-on-surface placeholder:text-outline focus:outline-none resize-none max-h-32 py-1"
                placeholder="Ask anything... e.g. 'Show me programming books under ₹500' or 'Compare the first two'"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
              />

              <button
                onClick={() => handleSend(input)}
                disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between px-1 pt-1 text-[11px] text-outline">
              <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for newline</span>
              <span className="hidden sm:inline">AFTERLIFE circular intelligence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIFinderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <AIFinderContent />
    </Suspense>
  );
}
