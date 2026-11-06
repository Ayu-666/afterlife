"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Sparkles,
  Eye,
  CheckCircle,
  AlertTriangle,
  X,
  ArrowLeft,
  Loader2,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useMarketplace } from "@/lib/context";
import {
  CATEGORIES,
  LISTING_TYPES,
  CONDITIONS,
  CATEGORY_IMAGES,
  generateId,
  formatPrice,
} from "@/lib/data";
import type { Category, ListingType, Condition, Product } from "@/lib/types";

type Step = "form" | "preview";

interface FormData {
  title: string;
  description: string;
  category: Category | "";
  listingType: ListingType | "";
  price: string;
  originalPrice: string;
  condition: Condition | "";
  location: string;
  sellerName: string;
  tags: string;
}

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  category: "",
  listingType: "",
  price: "",
  originalPrice: "",
  condition: "",
  location: "",
  sellerName: "",
  tags: "",
};

interface AiListingSuggestions {
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedKeywords?: string[];
  pricingNote?: string | null;
}

export default function SellPage() {
  const router = useRouter();
  const { addListing } = useMarketplace();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [step, setStep] = useState<Step>("form");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiListingSuggestions | null>(null);
  const [aiError, setAiError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* ── Field update ───────────────────────────────────────────────── */
  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  /* ── Image handling ─────────────────────────────────────────────── */
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, _image: "Only image files are allowed." } as typeof errors));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, _image: "Image must be under 5 MB." } as typeof errors));
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  /* ── Validation ─────────────────────────────────────────────────── */
  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.category) e.category = "Select a category.";
    if (!form.listingType) e.listingType = "Select a listing type.";
    if (!form.condition) e.condition = "Select a condition.";
    if (form.listingType !== "free" && !form.price) e.price = "Enter a price.";
    if (form.price && isNaN(Number(form.price))) e.price = "Price must be a number.";
    if (Number(form.price) < 0) e.price = "Price cannot be negative.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.sellerName.trim()) e.sellerName = "Your name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── AI Listing Generator ───────────────────────────────────────── */
  async function handleAiSuggest() {
    if (!form.title && !form.description && !imageFile) {
      setAiError("Add a title, description or image first so the AI has something to work with.");
      return;
    }
    setIsAiLoading(true);
    setAiError("");
    setAiSuggestions(null);
    try {
      const res = await fetch("/api/ai-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          listingType: form.listingType,
          condition: form.condition,
        }),
      });
      const data = await res.json();
      if (data.fallback || !data.suggestions) {
        setAiError(data.reason || "AI suggestions unavailable right now. Please fill in the form manually.");
      } else {
        setAiSuggestions(data.suggestions);
      }
    } catch {
      setAiError("Could not connect to AI. Fill in the form manually.");
    } finally {
      setIsAiLoading(false);
    }
  }

  function applySuggestedTitle(val: string) {
    set("title", val);
    setAiSuggestions((prev) => (prev ? { ...prev, suggestedTitle: undefined } : null));
  }

  function applySuggestedDescription(val: string) {
    set("description", val);
    setAiSuggestions((prev) => (prev ? { ...prev, suggestedDescription: undefined } : null));
  }

  function applySuggestedKeywords(keywords: string[]) {
    const kwStr = keywords.join(", ");
    set("tags", form.tags ? `${form.tags}, ${kwStr}` : kwStr);
    setAiSuggestions((prev) => (prev ? { ...prev, suggestedKeywords: undefined } : null));
  }

  /* ── Preview → Publish ──────────────────────────────────────────── */
  function goToPreview() {
    if (validate()) setStep("preview");
  }

  function publish() {
    const price = form.listingType === "free" ? 0 : Number(form.price);
    const originalPrice = form.originalPrice ? Number(form.originalPrice) : null;

    const product: Product = {
      id: generateId(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category as Category,
      listingType: form.listingType as ListingType,
      price,
      originalPrice,
      condition: form.condition as Condition,
      sellerName: form.sellerName.trim(),
      location: form.location.trim(),
      image: imagePreview || CATEGORY_IMAGES[form.category as Category],
      imagePreviewUrl: imagePreview || undefined,
      fallbackImage: CATEGORY_IMAGES[form.category as Category],
      available: true,
      createdAt: new Date().toISOString(),
      isDemo: false,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    addListing(product);
    setSubmitted(true);
  }

  /* ── Success screen ─────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-primary" />
        </div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-primary mb-3">
          Listing published!
        </h1>
        <p className="text-on-surface-variant text-sm max-w-sm mb-8">
          Your item is now live in the marketplace. It&apos;s saved in your browser — keep this tab open to manage it.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => router.push("/marketplace")}
            className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-container transition-colors"
          >
            View in Marketplace
          </button>
          <button
            onClick={() => router.push("/my-listings")}
            className="border border-outline text-on-surface px-6 py-3 rounded-full text-sm font-semibold hover:bg-surface-container transition-colors"
          >
            My Listings
          </button>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setImageFile(null);
              setImagePreview("");
              setStep("form");
              setSubmitted(false);
              setAiSuggestions(null);
            }}
            className="text-secondary text-sm font-medium underline underline-offset-2 hover:text-primary transition-colors px-4"
          >
            List another item
          </button>
        </div>
      </div>
    );
  }

  /* ── Preview step ───────────────────────────────────────────────── */
  if (step === "preview") {
    const price = form.listingType === "free" ? 0 : Number(form.price);
    const originalPrice = form.originalPrice ? Number(form.originalPrice) : null;

    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-on-primary py-10 px-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setStep("form")}
              className="inline-flex items-center gap-2 text-on-primary/70 hover:text-on-primary text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> Back to edit
            </button>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-normal">
              Preview your listing
            </h1>
            <p className="text-on-primary/70 text-sm mt-1">
              This is exactly how your item will appear in the marketplace.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden mb-8">
            {/* Image */}
            <div className="relative w-full aspect-[16/9] bg-surface-container">
              <Image
                src={imagePreview || CATEGORY_IMAGES[form.category as Category]}
                alt={form.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized={!!imagePreview}
              />
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-bold tracking-wide uppercase">
                  {form.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[10px] font-semibold uppercase">
                  {form.condition}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-outline text-[10px] uppercase">
                  {LISTING_TYPES.find((l) => l.value === form.listingType)?.label}
                </span>
              </div>

              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-primary mb-2">
                {form.title}
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{form.description}</p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-semibold text-primary">
                  {price === 0 ? "Free" : formatPrice(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm text-outline line-through">{formatPrice(originalPrice)}</span>
                )}
              </div>

              <div className="border-t border-outline-variant pt-4 flex items-center justify-between text-sm text-on-surface-variant">
                <span>{form.sellerName}</span>
                <span>{form.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-surface-container rounded-xl p-4 mb-6 text-sm text-on-surface-variant">
            <AlertTriangle size={16} className="text-outline shrink-0 mt-0.5" />
            If you uploaded an image, it will only persist as long as this browser tab remains open. For permanent image storage, Supabase integration is needed.
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("form")}
              className="flex-1 border border-outline text-on-surface px-6 py-3 rounded-full text-sm font-semibold hover:bg-surface-container transition-colors"
            >
              Edit listing
            </button>
            <button
              onClick={publish}
              className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-container transition-colors"
            >
              Publish listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form step ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-on-primary py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-[family-name:var(--font-playfair)] text-[36px] md:text-[48px] font-normal leading-tight">
            Sell or Give Away
          </h1>
          <p className="text-on-primary/70 text-sm mt-2">
            List a pre-owned item, handmade creation, surplus material or anything that deserves a second life.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* AI Listing Generator */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <Sparkles size={20} className="text-secondary" />
            <div>
              <h2 className="font-semibold text-primary text-sm">AI Listing Generator</h2>
              <p className="text-on-surface-variant text-xs">
                Optional — fill in some basics first, then let AI suggest improvements.
              </p>
            </div>
          </div>
          <div className="px-5 py-4">
            <button
              onClick={handleAiSuggest}
              disabled={isAiLoading}
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
            >
              {isAiLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Sparkles size={15} />
              )}
              {isAiLoading ? "Generating…" : "Suggest improvements with AI"}
            </button>

            {aiError && (
              <p className="text-error text-xs mt-3">{aiError}</p>
            )}

            {aiSuggestions && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wide">
                  AI Suggestions — review and accept each one:
                </p>

                {aiSuggestions.suggestedTitle && (
                  <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-outline uppercase tracking-wide font-semibold block">Suggested Title</span>
                      <p className="text-sm text-on-surface font-medium mt-0.5">{aiSuggestions.suggestedTitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applySuggestedTitle(aiSuggestions.suggestedTitle!)}
                      className="shrink-0 text-xs font-semibold text-secondary hover:text-primary transition-colors underline underline-offset-2 mt-1"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {aiSuggestions.suggestedDescription && (
                  <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-outline uppercase tracking-wide font-semibold block">Suggested Description</span>
                      <p className="text-sm text-on-surface leading-relaxed mt-0.5">{aiSuggestions.suggestedDescription}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applySuggestedDescription(aiSuggestions.suggestedDescription!)}
                      className="shrink-0 text-xs font-semibold text-secondary hover:text-primary transition-colors underline underline-offset-2 mt-1"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {aiSuggestions.suggestedKeywords && aiSuggestions.suggestedKeywords.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-outline uppercase tracking-wide font-semibold block">Suggested Tags / Keywords</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiSuggestions.suggestedKeywords.map((kw, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-surface-container text-on-surface text-xs rounded">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => applySuggestedKeywords(aiSuggestions.suggestedKeywords!)}
                      className="shrink-0 text-xs font-semibold text-secondary hover:text-primary transition-colors underline underline-offset-2 mt-1"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {aiSuggestions.pricingNote && (
                  <div className="bg-secondary-container/40 rounded-lg border border-secondary-container p-3">
                    <span className="text-[10px] text-secondary uppercase tracking-wide font-semibold block">Pricing Insight</span>
                    <p className="text-xs text-on-surface mt-0.5 leading-relaxed">{aiSuggestions.pricingNote}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Product Image</label>
            {imagePreview ? (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container group">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  unoptimized
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center hover:bg-error-container text-on-surface hover:text-error transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-outline-variant rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-3 hover:border-secondary hover:bg-surface-container transition-colors text-on-surface-variant"
              >
                <ImageIcon size={36} className="opacity-40" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload a photo</p>
                  <p className="text-xs opacity-60 mt-0.5">JPG, PNG, WEBP — max 5 MB</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-semibold">
                  <Upload size={13} /> Choose image
                </div>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-on-surface-variant mt-1">
              Image preview is temporary. It will not survive a page refresh.
            </p>
          </div>

          {/* Title */}
          <Field label="Product title *" error={errors.title}>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Vintage denim jacket — size M"
              className={inputClass(!!errors.title)}
            />
          </Field>

          {/* Description */}
          <Field label="Description *" error={errors.description}>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the item — condition, story, dimensions, what's included…"
              rows={4}
              className={inputClass(!!errors.description)}
            />
          </Field>

          {/* Category & Listing Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category *" error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputClass(!!errors.category)}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Listing type *" error={errors.listingType}>
              <select
                value={form.listingType}
                onChange={(e) => set("listingType", e.target.value)}
                className={inputClass(!!errors.listingType)}
              >
                <option value="">Select type…</option>
                {LISTING_TYPES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Condition */}
          <Field label="Condition *" error={errors.condition}>
            <select
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
              className={inputClass(!!errors.condition)}
            >
              <option value="">Select condition…</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          {/* Price */}
          {form.listingType !== "free" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Price (₹) *" error={errors.price}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">₹</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="0"
                    min="0"
                    className={`${inputClass(!!errors.price)} pl-7`}
                  />
                </div>
              </Field>
              <Field label="Original price (₹)" error={errors.originalPrice}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">₹</span>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => set("originalPrice", e.target.value)}
                    placeholder="Optional"
                    min="0"
                    className={`${inputClass(!!errors.originalPrice)} pl-7`}
                  />
                </div>
              </Field>
            </div>
          )}

          {/* Location & Seller Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your name / shop name *" error={errors.sellerName}>
              <input
                value={form.sellerName}
                onChange={(e) => set("sellerName", e.target.value)}
                placeholder="e.g. Riya Sharma"
                className={inputClass(!!errors.sellerName)}
              />
            </Field>
            <Field label="Location *" error={errors.location}>
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra"
                className={inputClass(!!errors.location)}
              />
            </Field>
          </div>

          {/* Tags */}
          <Field label="Tags (optional)" error={errors.tags}>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="Comma-separated: vintage, denim, jacket"
              className={inputClass(false)}
            />
          </Field>

          {/* Preview & Submit */}
          <div className="pt-4">
            <button
              onClick={goToPreview}
              className="w-full bg-primary text-on-primary py-4 rounded-full text-sm font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              Preview listing
            </button>
            <p className="text-center text-xs text-on-surface-variant mt-3">
              You&apos;ll see a preview before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper components ───────────────────────────────────────────── */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-1.5">{label}</label>
      {children}
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full bg-surface-container-lowest border ${
    hasError ? "border-error" : "border-outline-variant"
  } rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors resize-none`;
}
