"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Check,
  Leaf,
  ShoppingBag,
  RotateCcw,
  Plus,
  MapPin,
  Truck,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import {
  CATEGORIES,
  CONDITIONS,
  generateId,
  formatPrice,
  getProductFallback,
} from "@/lib/data";
import type { Category, ListingType, Condition, Product } from "@/lib/types";

interface ListingForm {
  title: string;
  description: string;
  category: Category;
  listingType: ListingType;
  price: string;
  originalPrice: string;
  condition: Condition;
  location: string;
  sellerName: string;
  tags: string[];
  newTagInput: string;
  transparencyNote: string;
  giveForFree: boolean;
  localPickup: boolean;
  ecoCourier: boolean;
}

const DEFAULT_FORM: ListingForm = {
  title: "1970s Handloom Indigo Dabu Print Cotton Kurta",
  description:
    "Lovingly worn authentic vegetable-dyed cotton kurta featuring geometric Dabu resist printing from Bagru craft clusters. Breathable tactile texture with gentle, organic patina across cuffs and neckline. Zero synthetic fibers, tailored wooden peg buttons.",
  category: "RE:WEAR",
  listingType: "pre_owned",
  price: "1450",
  originalPrice: "3800",
  condition: "Good",
  location: "Indiranagar, Bangalore",
  sellerName: "Maya Krishnan",
  tags: ["DabuPrint", "Handloom", "VegetableDye", "SlowFashion", "BagruCraft"],
  newTagInput: "",
  transparencyNote:
    "Gentle indigo fading along the sleeve cuff fold and subtle softness at collar edge. All original wooden toggle buttons firmly secured. Pre-washed in cold plant-based detergent.",
  giveForFree: false,
  localPickup: true,
  ecoCourier: true,
};

export default function SellPage() {
  const router = useRouter();
  const { addListing } = useMarketplace();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ListingForm>(DEFAULT_FORM);
  const [imagePreview, setImagePreview] = useState<string>(
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDcC0X70KYY2VAosFR520Wf5xl_4i9OiWclxKktsSwpurj3m7RLaYY1G0NVVhGba2SA8js0FS-R_4md0xr3Ltwn1Hanw1ROKIYjm-NjZBIABGTeqfHDpk2-dpD_FQV2gkl__2sxA3nyRIHauEZbAzsNVmqVUH8o1vu4ipE-crkSozQ7X8V2TQjmQYn-YkybjkXCziXtOpsX_9ZIclwfN8VbisK4d2rmFXETPNVeAjRU"
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [autoEnhance, setAutoEnhance] = useState(true);

  // Field helpers
  const updateField = <K extends keyof ListingForm>(field: K, val: ListingForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleAddTag = () => {
    const tag = form.newTagInput.trim().replace(/^#/, "");
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        newTagInput: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // AI Composer Trigger using `/api/ai-listing`
  const handleAiRecompose = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          condition: form.condition,
          currentTitle: form.title,
          currentDesc: form.description,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) updateField("title", data.title);
        if (data.description) updateField("description", data.description);
        if (data.suggestedPrice) updateField("price", String(data.suggestedPrice));
      }
    } catch (err) {
      console.error("AI Listing Composer error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Submit & Publish to userListings
  const handlePublish = () => {
    setIsPublishing(true);
    const newProduct: Product = {
      id: generateId(),
      title: form.title || "Curated Circular Specimen",
      description: form.description || "Preserved circular piece listed via AFTERLIFE Studio.",
      category: form.category,
      listingType: form.giveForFree ? "free" : form.listingType,
      price: form.giveForFree ? 0 : Number(form.price) || 0,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      condition: form.condition,
      sellerName: form.sellerName || "Maya Krishnan",
      location: form.location || "Indiranagar, Bangalore",
      image: imagePreview,
      fallbackImage: getProductFallback(form.category),
      imagePreviewUrl: imagePreview.startsWith("blob:") ? imagePreview : undefined,
      available: true,
      createdAt: new Date().toISOString(),
      isDemo: false,
      tags: form.tags,
    };

    addListing(newProduct);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishedSuccess(true);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* ── TOP ARCHIVAL BANNER ───────────────────────────────────────────── */}
      <section className="relative w-full bg-surface-container-low overflow-hidden pb-10 pt-8 border-b border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Circular Studio</span>
              <span>/</span>
              <span>Dossier Registry #CS-2025-084</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant">
              <CheckCircle2 size={14} className="text-secondary" />
              <span>Draft auto-saved just now</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-[family-name:var(--font-playfair)] text-[36px] md:text-[44px] text-primary tracking-tight mb-2">
              List an Item for its Afterlife
            </h1>
            <p className="text-[16px] text-on-surface-variant leading-relaxed">
              Pass forward what you no longer use, or sell your handcrafted creations to thoughtful
              buyers. Every object carries provenance, material dignity, and an unfinished story.
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="mt-8 pt-4 bg-surface-container-lowest/90 rounded-xl p-4 shadow-sm border border-outline-variant/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container">
                <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                  01
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold text-secondary">
                    Active Stage
                  </span>
                  <span className="block text-[12px] text-primary font-bold truncate">
                    Media &amp; Photos
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-[11px] font-bold shrink-0">
                  02
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold text-outline">
                    Intelligence
                  </span>
                  <span className="block text-[12px] text-on-surface font-semibold truncate">
                    AI Composer
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-[11px] font-bold shrink-0">
                  03
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold text-outline">
                    Integrity
                  </span>
                  <span className="block text-[12px] text-on-surface font-semibold truncate">
                    Condition &amp; Lineage
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-[11px] font-bold shrink-0">
                  04
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold text-outline">
                    Exchange
                  </span>
                  <span className="block text-[12px] text-on-surface font-semibold truncate">
                    Pricing &amp; Logistics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN STUDIO CANVAS ────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto w-full px-gutter lg:px-margin-lg py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Modules (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* ── MODULE 01: MEDIA UPLOAD ZONE ────────────────────────────── */}
            <article className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
                      Module 01
                    </span>
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                      Archival Imagery
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-[22px] font-medium text-primary">
                    Media Upload &amp; Curatorial Viewports
                  </h2>
                </div>

                <label className="inline-flex items-center gap-2.5 cursor-pointer p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <input
                    type="checkbox"
                    checked={autoEnhance}
                    onChange={(e) => setAutoEnhance(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-primary flex items-center gap-1">
                      <Sparkles size={13} className="text-secondary" /> AI Background Balancer
                    </span>
                    <span className="text-[10px] text-outline">Warm linen studio tone</span>
                  </div>
                </label>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative rounded-xl bg-surface-container-low p-8 text-center transition-all hover:bg-surface-container cursor-pointer mb-6 border border-dashed border-outline-variant/60"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-3 transition-transform group-hover:scale-105">
                    <Upload size={22} />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-[17px] font-semibold text-primary mb-1">
                    Drag high-res captures here, or browse files
                  </h3>
                  <p className="text-[12px] text-on-surface-variant mb-3 leading-relaxed">
                    Upload photos in natural lighting. We recommend capturing the item&apos;s tactile
                    materiality, labels, and authentic wear marks.
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <Check size={12} className="text-secondary" /> Accepted: JPG, PNG, WebP up to 10MB
                  </span>
                </div>
              </div>

              {/* Viewport Thumbnail Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="relative rounded-lg overflow-hidden bg-surface-container aspect-square shadow-sm flex flex-col justify-between p-2 border border-outline-variant/30">
                  <Image
                    src={imagePreview}
                    alt="Front View"
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="text-[9px] font-bold bg-primary text-on-primary px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                      Primary
                    </span>
                    <span className="w-4 h-4 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  </div>
                  <div className="relative z-10 mt-auto bg-surface/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-center">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                      Front View
                    </span>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden bg-surface-container aspect-square shadow-sm flex flex-col justify-between p-2 border border-outline-variant/30">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfbK1a7TXISliBmpeXex_FHoda-_Whw83YGHrrUQNTBmEByJ3rRiT3EJizotTcBG-bCyAuF8_FZC_OO7Wmqg_F6ZIrpWqUPjuCU9rctGM1PPm5PjFk85iFctJuJcAd7eu3RgDquk_8OVeiWPyJL677Q_p_gXpIh71-Ejod4XBUEiCVuBYSB8U9UMQEb0ksZ-eIDVpBOSnnlbMEftwT4s2fJbd3aadzHQRrO1yZ1d20"
                    alt="Weave Texture"
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="text-[9px] font-bold bg-secondary-container text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Detail
                    </span>
                  </div>
                  <div className="relative z-10 mt-auto bg-surface/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-center">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                      Weave Texture
                    </span>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden bg-surface-container aspect-square shadow-sm flex flex-col justify-between p-2 border border-outline-variant/30">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE6APZwRcjwMQFxzQb7nfeQ01BvASj-0-7ZbLnTsLBkBKtlbhMgu1E4LzYFXn3PcSdunsk2IMIqu1jEgnP_yaZr1m2roG3wpAJeGLSM6ZDZ6GI3e6I7hkiZdYO0IRAUkCIgXUIcr-darMaCg3J7WzTPCMxBYqs3KtLCek3mP1vQGMhXiCuUXt-gos6mlsay9ZoCb-Br6paKgZLFB0d1UZsu9vPhr6rb93baRL-ouYj"
                    alt="Maker Tag"
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="text-[9px] font-bold bg-surface-container-highest text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Tag
                    </span>
                  </div>
                  <div className="relative z-10 mt-auto bg-surface/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-center">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                      Maker Label
                    </span>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden bg-surface-container aspect-square shadow-sm flex flex-col justify-between p-2 border border-outline-variant/30">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKV-eWOSbC57Fvt_l-0InAa80FYbpbZCmBGC7p0pP6_2_bYh0ZMSCugj96lIO6wveLZjTcylsgk_KKBPqh4Z_17mGHVZsKcXH0b6GrD9dUBkE2efLGoNxHKdiL3LwRO-5MU40W-hK0_fa61AkM51d-5ifjjhRuADoWv4fCR2rLQTdM2Qe10uH-Tn6MkcLwJAyhJmC7k04QPb60yQYo5N4Zsphc-io2qdxjit1jtQVR"
                    alt="Patina"
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="text-[9px] font-bold bg-tertiary-fixed text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Patina
                    </span>
                  </div>
                  <div className="relative z-10 mt-auto bg-surface/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-center">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                      Cuff Wear
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* ── MODULE 02: AI LISTING COMPOSER ──────────────────────────── */}
            <article className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary-container text-primary uppercase">
                      Module 02
                    </span>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      Multimodal Vision Engine
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-[22px] font-medium text-primary">
                    Magic AI Description &amp; Provenance Composer
                  </h2>
                  <p className="text-[13px] text-on-surface-variant mt-0.5">
                    Our AI synthesizes fiber composition, era characteristics, and patina signatures.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAiRecompose}
                  disabled={isAiLoading}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-[12px] font-bold hover:bg-primary-container transition-all shadow-sm disabled:opacity-50"
                >
                  <Sparkles size={15} />
                  <span>{isAiLoading ? "Analyzing..." : "Re-Analyze Photos"}</span>
                </button>
              </div>

              <div className="rounded-xl bg-surface-container-low p-5 space-y-5 border border-outline-variant/20">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      Analyzed Provenance Dossier
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                    Confidence: 97.4% Authentic
                  </span>
                </div>

                {/* Editable Title */}
                <div>
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                    Item Title (AI Generated • Editable)
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-surface-container-lowest text-primary font-[family-name:var(--font-playfair)] text-[16px] font-medium focus:outline-none border border-outline-variant/40 focus:border-primary"
                  />
                </div>

                {/* Auto-extracted Classification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                      Auto-Classified Pillar
                    </span>
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value as Category)}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-primary text-[13px] font-semibold focus:outline-none border border-outline-variant/40"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                      Fiber / Material Signature
                    </span>
                    <div className="h-10 px-3 rounded-lg bg-surface-container-lowest flex items-center justify-between text-primary text-[13px] font-medium border border-outline-variant/40">
                      <span>100% Desi Handloom Cotton</span>
                      <CheckCircle2 size={16} className="text-secondary" />
                    </div>
                  </div>
                </div>

                {/* Narrative Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-outline uppercase tracking-wider">
                      AI-Curated Provenance Description
                    </label>
                    <button
                      type="button"
                      onClick={handleAiRecompose}
                      className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> Polish Tone
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full p-3 rounded-lg bg-surface-container-lowest text-primary text-[13px] leading-relaxed focus:outline-none border border-outline-variant/40 focus:border-primary resize-y"
                  />
                </div>

                {/* Discovery Tags */}
                <div>
                  <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-2">
                    Curated Discovery Tags
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {form.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest text-primary text-[12px] font-medium border border-outline-variant/30"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-outline hover:text-error ml-1 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Add tag..."
                        value={form.newTagInput}
                        onChange={(e) => updateField("newTagInput", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="px-2.5 py-1 rounded-full bg-surface-container text-[12px] text-primary focus:outline-none w-24 border border-outline-variant/30"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="p-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* ── MODULE 03: CLASSIFICATION & INTEGRITY ────────────────────── */}
            <article className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
                  Module 03
                </span>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                  Classification &amp; Integrity
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-[22px] font-medium text-primary mb-6">
                Listing Attributes &amp; Lineage Assessment
              </h2>

              {/* Circularity Typology Selector */}
              <div className="space-y-2 mb-6">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                  Circularity Typology
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { type: "pre_owned", title: "Pre-Owned / Thrift", desc: "Archival garment" },
                    { type: "handmade", title: "Handmade & Artisan", desc: "Workshop craft" },
                    { type: "upcycled", title: "Upcycled", desc: "Reworked salvage" },
                    { type: "refurbished", title: "Refurbished", desc: "Bench tested & restored" },
                    { type: "surplus", title: "Surplus Materials", desc: "Deadstock remnants" },
                    { type: "free", title: "Give for Free", desc: "Mutual aid & gift" },
                  ].map((typology) => {
                    const isSelected = form.listingType === typology.type;
                    return (
                      <button
                        key={typology.type}
                        type="button"
                        onClick={() => {
                          updateField("listingType", typology.type as ListingType);
                          if (typology.type === "free") updateField("giveForFree", true);
                        }}
                        className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between h-20 ${
                          isSelected
                            ? "bg-primary text-on-primary border-primary shadow-sm"
                            : "bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container"
                        }`}
                      >
                        <span className="text-[12px] font-bold leading-tight block">
                          {typology.title}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isSelected ? "text-primary-fixed" : "text-outline"
                          }`}
                        >
                          {typology.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Condition Rating Selector */}
              <div className="space-y-3 mb-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                      Condition Rating
                    </label>
                    <span className="font-[family-name:var(--font-playfair)] text-[18px] font-medium text-primary">
                      {form.condition} Condition
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-secondary-container text-primary text-[10px] font-bold uppercase tracking-wider">
                    Standard Verified Grade
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  {CONDITIONS.slice(0, 4).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => updateField("condition", cond)}
                      className={`py-1.5 px-2 rounded-lg text-[12px] font-semibold transition-colors ${
                        form.condition === cond
                          ? "bg-primary text-on-primary shadow-sm"
                          : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transparency Note */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider">
                    Provenance Transparency Note
                  </label>
                  <span className="text-[10px] font-semibold text-secondary">
                    Guaranteed Circular Honor Code
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={form.transparencyNote}
                  onChange={(e) => updateField("transparencyNote", e.target.value)}
                  className="w-full p-3 rounded-lg bg-surface-container-low text-primary text-[13px] leading-relaxed focus:outline-none border border-outline-variant/30 resize-none"
                  placeholder="Disclose any subtle patina, repaired stitches, or marks..."
                />
              </div>
            </article>

            {/* ── MODULE 04: PRICING & LOGISTICS ──────────────────────────── */}
            <article className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
                  Module 04
                </span>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                  Valuation &amp; Fulfillment
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-[22px] font-medium text-primary mb-6">
                Pricing Intelligence &amp; Dispatch Routing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                    Target Listing Price (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary font-bold text-[16px]">
                      ₹
                    </span>
                    <input
                      type="number"
                      disabled={form.giveForFree}
                      value={form.giveForFree ? "0" : form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      className="w-full h-11 pl-8 pr-3 rounded-lg bg-surface-container-low text-primary text-[16px] font-bold focus:outline-none border border-outline-variant/40 focus:border-primary disabled:opacity-50"
                    />
                  </div>
                  <p className="text-[11px] text-outline mt-1.5 leading-normal">
                    AI Valuation: Items in {form.category} sell fastest between ₹1,200 – ₹1,800.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                    Original Retail Benchmark (Optional ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline font-bold text-[16px]">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={form.originalPrice}
                      onChange={(e) => updateField("originalPrice", e.target.value)}
                      className="w-full h-11 pl-8 pr-3 rounded-lg bg-surface-container-low text-primary text-[16px] font-bold focus:outline-none border border-outline-variant/40 focus:border-primary"
                    />
                  </div>
                  <p className="text-[11px] text-outline mt-1.5 leading-normal">
                    Demonstrates circular savings against virgin retail alternatives.
                  </p>
                </div>
              </div>

              {/* Give For Free Checkbox */}
              <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3 mb-6 border border-outline-variant/20">
                <input
                  type="checkbox"
                  id="give-for-free"
                  checked={form.giveForFree}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateField("giveForFree", checked);
                    if (checked) {
                      updateField("price", "0");
                      updateField("listingType", "free");
                    }
                  }}
                  className="w-4 h-4 mt-0.5 accent-primary cursor-pointer"
                />
                <div>
                  <label
                    htmlFor="give-for-free"
                    className="text-[13px] font-bold text-primary block cursor-pointer"
                  >
                    Give for Free • Zero Price Community Gift
                  </label>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    Waives platform handling fees, awards you +45 AFTERLIFE Circular Karma credits,
                    and highlights in student &amp; community feeds.
                  </p>
                </div>
              </div>

              {/* Handover Modalities */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                  Handover &amp; Dispatch Modalities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-2.5 cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={form.localPickup}
                      onChange={(e) => updateField("localPickup", e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-primary"
                    />
                    <div>
                      <span className="text-[12px] font-bold text-primary flex items-center gap-1">
                        <MapPin size={14} className="text-secondary" /> Local Zero-Emission Handover
                      </span>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        Indiranagar, Bangalore (Coordinates revealed post-escrow).
                      </p>
                    </div>
                  </label>

                  <label className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-2.5 cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={form.ecoCourier}
                      onChange={(e) => updateField("ecoCourier", e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-primary"
                    />
                    <div>
                      <span className="text-[12px] font-bold text-primary flex items-center gap-1">
                        <Truck size={14} className="text-secondary" /> AFTERLIFE Eco-Courier
                      </span>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        100% Carbon-Neutral pan-India pickup in recyclable mailers.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column: Live Curated Card Preview (Sticky 4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Catalog Live Preview
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Synchronized
              </span>
            </div>

            {/* Catalog Card Display */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col border border-outline-variant/30">
              <div className="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden">
                <Image
                  src={imagePreview}
                  alt={form.title}
                  fill
                  className="object-cover"
                  sizes="350px"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-surface/95 text-primary shadow-sm uppercase">
                    {form.condition}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary">
                    <CheckCircle2 size={12} /> {form.category} • Verified
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-outline text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span>{form.category}</span>
                    <span>{form.location.split(",")[0] || "Bangalore"}</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-[16px] font-semibold text-primary mb-1 line-clamp-2">
                    {form.title || "Untitled Circular Artifact"}
                  </h3>
                  <p className="text-[12px] text-on-surface-variant line-clamp-2 mb-3">
                    {form.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex items-baseline justify-between">
                  <div>
                    <span className="text-[18px] font-bold text-primary mr-2">
                      {form.giveForFree ? "Free" : formatPrice(Number(form.price) || 0)}
                    </span>
                    {form.originalPrice && (
                      <span className="text-[12px] text-outline line-through">
                        {formatPrice(Number(form.originalPrice))}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary-container text-primary uppercase">
                    Verified
                  </span>
                </div>
              </div>

              {/* Seller Trust Strip */}
              <div className="px-4 py-2.5 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] font-bold">
                    {form.sellerName.charAt(0)}
                  </div>
                  <span className="text-[12px] font-semibold text-on-surface">
                    {form.sellerName}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-secondary flex items-center gap-0.5">
                  <Leaf size={12} /> 99.8% Circular Index
                </span>
              </div>
            </div>

            {/* Projected Ecological Yield */}
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[11px] font-bold text-primary tracking-wider uppercase">
                  Projected Ecological Yield
                </h4>
                <Leaf size={16} className="text-secondary" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-highest"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-secondary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="88, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
                    88%
                  </div>
                </div>
                <div>
                  <span className="block font-[family-name:var(--font-playfair)] text-[18px] font-bold text-primary leading-tight">
                    2,700 Litres
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Freshwater conserved by keeping this piece in circulation.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/20">
                <div className="p-2 rounded-lg bg-surface-container-lowest">
                  <span className="text-[9px] font-bold text-outline block uppercase">Carbon Abated</span>
                  <span className="text-[13px] font-bold text-primary">4.2 kg CO₂e</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-lowest">
                  <span className="text-[9px] font-bold text-outline block uppercase">Landfill Diverted</span>
                  <span className="text-[13px] font-bold text-primary">340 Grams</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── STICKY BOTTOM ACTION DOCK ─────────────────────────────────────── */}
      <section className="sticky bottom-0 z-40 w-full bg-surface-container-lowest shadow-[0_-4px_24px_rgba(16,43,36,0.06)] border-t border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin-lg py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ShoppingBag size={20} className="text-secondary" />
            <div>
              <span className="text-[13px] font-bold text-primary block leading-tight">
                Ready for Dispatch Registry
              </span>
              <span className="text-[11px] text-on-surface-variant">
                All 4 circular modules fulfilled • Pass-through fee 0% for community gifts
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => alert("Draft saved to local storage.")}
              className="h-10 px-4 rounded-lg bg-surface-container text-primary text-[12px] font-bold hover:bg-surface-container-high transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="h-10 px-6 rounded-lg bg-primary text-on-primary text-[12px] font-bold tracking-wide hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <span>{isPublishing ? "Registering..." : "Publish Listing to Archive"}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── PUBLISHED SUCCESS MODAL ───────────────────────────────────────── */}
      {publishedSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/40 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-primary mb-1">
              Specimen Cataloged
            </h3>
            <p className="text-[13px] text-on-surface-variant mb-4 leading-relaxed">
              Your item <strong>&ldquo;{form.title}&rdquo;</strong> is now active in the circular
              marketplace and registered in your curator dossier.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/my-listings")}
                className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors"
              >
                Go to Curator Dashboard
              </button>
              <button
                onClick={() => {
                  setPublishedSuccess(false);
                  setForm(DEFAULT_FORM);
                }}
                className="py-2.5 px-4 bg-surface-container text-primary rounded-lg text-xs font-bold hover:bg-surface-container-high transition-colors"
              >
                List Another Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
