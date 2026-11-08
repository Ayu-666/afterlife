"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Package,
  CheckCircle2,
  Eye,
  Heart,
  ShoppingBag,
  Sparkles,
  Download,
  HelpCircle,
  Gavel,
  Flame,
  Search,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { formatPrice } from "@/lib/data";

export default function MyListingsPage() {
  const { userListings, removeListing } = useMarketplace();
  const [activeTab, setActiveTab] = useState<string>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("all");
  const [offerActionMsg, setOfferActionMsg] = useState<string | null>(null);

  // Demo fallback items for curator display if user hasn't added custom items yet
  const demoCuratorItems = [
    {
      id: "al-9921",
      title: "Hand-Carved Bell-Metal Brass Urli Bowl",
      category: "ROOTS",
      price: 2200,
      originalPrice: 3400,
      condition: "Excellent",
      location: "Indiranagar, Bangalore",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqvM5Psb-4GlGIrMsdCQ2nusPOAeEqOyih9lBx2V3CBtBTmcBhzV9dTlmix9672GDZzDJIeYWIgrYFn0WuMUWwPQd2bH3j-FPRyvtjkT0nAIXrPr1Rw2P1NtDsBssoO1iiGQm7R1Aj3qf5ElwclSlTJ7NYLyI_UWXOrqQ4KsnYgCCEanULjWffRVDZiXKAr8zKUG_hKAdttlucP1jz5V-AqRaBAFV2RvPbYR9dNkc8",
      views: 148,
      saves: 24,
      bags: 2,
      status: "Active",
      sku: "AL-9921",
      daysAgo: "3 days ago",
    },
    {
      id: "al-8409",
      title: "Vintage Yashica Electro 35 Film Camera (Serviced CLA)",
      category: "RE:USE",
      price: 5400,
      originalPrice: 8500,
      condition: "Restored",
      location: "Indiranagar, Bangalore",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDa4xjhO66rZnFBo_V0uDPEW05MSxjTsFA1dnmGHJ-j7gSLEWLq0V5_wF9bRy02KGBxQEcVBC1JOt9mtiyiDj58zQdiaXgGJUSsw5nWTalP14LcpUOr7ftqD4MiZzE3_TsTCiejlinESfsVflpRTNVfHynwU9Ui47cmt_yD0Jj6qgWiSlnVD1ScubxD0_HYtSyDxaJwwKdFwmIm8ReOrpb13OsUWw52meHIRjgl8Udo",
      views: 290,
      saves: 41,
      bags: 1,
      status: "Reserved",
      sku: "AL-8409",
      daysAgo: "Courier Scheduled",
    },
    {
      id: "al-6120",
      title: "Lot of 6 Organic Handloom Linen Offcuts (Zero Waste)",
      category: "RE:SOURCE",
      price: 950,
      originalPrice: 1800,
      condition: "New",
      location: "Indiranagar, Bangalore",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAjKcyl1iIaDPdhNYlwXvEpD1D-aUaMzqF9xWzZlp1hy2RaOFFuekSnCCQJudufcYlaHaTvOY_2Abr776KlXMGP-TZQVa-efvrrT2Xu3g-BtEqo6BppzMTGODarPwIVSsqH8D2s0bStrfYhOBDK1-KmFN0ujxc24ZHCR4ipx3qJhfGJ9htRxt1SewlcIvPQwK8HmuGenyu1GlJ--i-RT0Pu2lVJNPY-4I8vWyeQIKKI",
      views: 89,
      saves: 12,
      bags: 0,
      status: "Active",
      sku: "AL-6120",
      daysAgo: "6 days ago",
    },
    {
      id: "al-3091",
      title: "Engineering Mechanics — Stephen Timoshenko (5th Edition)",
      category: "RE:READ",
      price: 280,
      originalPrice: 650,
      condition: "Good",
      location: "Indiranagar, Bangalore",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC1HdTk0sQFmxrWyRiMkClJGJNrBZSFxAuDTkfTP0_gnPAv23UKmlG6NQGQjifD3uDJiw2V6_-t8U7gzezG-VKqDLUWIBV43TqN-97tDEx_lb2IFL7QfyWc80gNjR6LlLnwVZUVJHT_grJ0YRX1nCCe1I0dCNWBEK5zW_7OXL6h6qedkUfwx4-inUE9tOafMSARzh66Yl0bqOniuDTATJHeQA_hev5CipktYOz614Mu",
      views: 310,
      saves: 18,
      bags: 0,
      status: "Sold",
      sku: "AL-3091",
      daysAgo: "Sold Oct 14",
    },
  ];

  // Combined list: user-created listings first, followed by demo curator items
  const combinedItems = [
    ...userListings.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price * 1.5,
      condition: p.condition,
      location: p.location,
      image: p.image,
      views: 12,
      saves: 3,
      bags: 0,
      status: "Active",
      sku: `AL-${p.id.toUpperCase().slice(0, 6)}`,
      daysAgo: "Listed recently",
      isUserListing: true,
    })),
    ...demoCuratorItems.map((item) => ({ ...item, isUserListing: false })),
  ];

  const filteredItems = combinedItems.filter((item) => {
    if (activeTab === "active" && item.status !== "Active") return false;
    if (activeTab === "reserved" && item.status !== "Reserved") return false;
    if (activeTab === "sold" && item.status !== "Sold") return false;
    if (activeTab === "free" && item.price !== 0) return false;

    if (selectedPillar !== "all" && item.category !== selectedPillar) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["SKU,Title,Category,Price,Status,Location"]
        .concat(
          combinedItems.map(
            (i) => `"${i.sku}","${i.title}","${i.category}",${i.price},"${i.status}","${i.location}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "afterlife_curator_dossier.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg pt-space-lg pb-space-2xl">
        {/* Top Meta Utility Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
          <div className="flex items-center gap-space-xs text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            <span className="text-primary font-bold">Workspace</span>
            <span>/</span>
            <span className="text-outline">Curator Operations</span>
            <span>/</span>
            <span className="text-on-surface">Archive Registry #942</span>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded bg-secondary-container text-primary text-[11px] font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Circular Ledger Synced (Just now)
            </span>
            <button
              onClick={() => alert("Curator Guidelines: Every listed piece must meet our 100% Circular Protocol standards for material authenticity and zero planned obsolescence.")}
              className="flex items-center gap-1 px-3 py-1 rounded text-on-surface-variant hover:text-primary transition-colors text-[12px] font-medium"
            >
              <HelpCircle size={15} />
              <span>Curator Guidelines</span>
            </button>
          </div>
        </div>

        {/* ── 1. SELLER WORKSPACE HEADER CARD ─────────────────────────────── */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-lg lg:p-space-xl mb-space-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl relative z-10">
            {/* Identity & Provenance Crest */}
            <div className="flex items-start sm:items-center gap-space-lg">
              <div className="relative shrink-0">
                <Image
                  src="/images/brand/curator-avatar.jpg"
                  alt="Curator Maya Krishnan"
                  width={96}
                  height={96}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-sm border-2 border-surface"
                />
                <div className="absolute bottom-0 right-0 p-1 bg-surface-container-lowest rounded-full shadow-sm">
                  <CheckCircle2 size={18} className="text-secondary" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-space-xs mb-1">
                  <h1 className="font-[family-name:var(--font-playfair)] text-[28px] md:text-[34px] font-semibold text-primary tracking-tight">
                    Maya Krishnan
                  </h1>
                  <span className="text-[13px] text-outline font-medium">(@mayak_archive)</span>
                </div>

                <div className="flex items-center gap-2 mb-space-sm">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-tertiary-fixed text-primary text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles size={13} className="text-secondary" />
                    Verified Circular Curator • Level 3
                  </span>
                  <span className="hidden sm:inline-block text-outline text-xs">•</span>
                  <span className="text-[12px] text-on-surface-variant hidden sm:inline-block">
                    Studio: Indiranagar, Bengaluru
                  </span>
                </div>

                <p className="text-[13px] text-on-surface-variant max-w-xl leading-relaxed">
                  Specialist in heirloom bell-metal castings, revival handloom yardage, and
                  mid-century analog optics. Committed to zero-landfill dispatch.
                </p>
              </div>
            </div>

            {/* Primary Workspace Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm shrink-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-[12px] font-bold border border-outline-variant/30 shadow-sm transition-colors"
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>

              <Link
                href="/sell"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[12px] font-bold shadow-sm transition-colors"
              >
                <Plus size={16} />
                <span>+ Create New Listing</span>
              </Link>
            </div>
          </div>

          {/* Performance Stat Ribbons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-space-sm mt-space-lg pt-space-lg bg-surface-container-low/60 rounded-xl p-space-md border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                Active Catalog
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-primary">
                  {combinedItems.filter((i) => i.status === "Active").length}
                </span>
                <span className="text-[11px] font-semibold text-secondary">Pieces live</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                Rehomed Total
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-primary">32</span>
                <span className="text-[11px] font-medium text-on-surface-variant">92% Sell-thru</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                Collector Score
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-primary">4.95</span>
                <span className="text-[11px] text-secondary font-bold">★ (48 reviews)</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                Circulated Capital
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-primary">₹46,200</span>
                <span className="text-[11px] font-semibold text-secondary">Earned net</span>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                Fulfillment Punctuality
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-primary">100%</span>
                <span className="text-[10px] font-bold text-secondary uppercase">On-Time</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN INVENTORY HUB + COMMUNICATIONS DRAWER ─────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl">
          {/* Left: Inventory Table & Filters (8 cols) */}
          <div className="xl:col-span-8 flex flex-col">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-space-sm mb-space-md no-scrollbar">
              {[
                {
                  id: "active",
                  label: "Active Listings",
                  count: combinedItems.filter((i) => i.status === "Active").length,
                },
                {
                  id: "reserved",
                  label: "Reserved & Pending",
                  count: combinedItems.filter((i) => i.status === "Reserved").length,
                },
                {
                  id: "sold",
                  label: "Sold & Archived",
                  count: combinedItems.filter((i) => i.status === "Sold").length,
                },
                {
                  id: "free",
                  label: "Free / Community",
                  count: combinedItems.filter((i) => i.price === 0).length,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2 shrink-0 ${
                      isActive
                        ? "bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/30"
                        : "text-on-surface-variant hover:bg-surface-container-high/50"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-secondary-container text-primary"
                          : "bg-surface-container text-outline"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 mb-space-lg flex flex-col md:flex-row items-center gap-space-sm">
              <div className="relative w-full md:flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  type="text"
                  placeholder="Search listings by SKU, craft provenance, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg text-[13px] text-on-surface placeholder:text-outline focus:outline-none border border-outline-variant/20 focus:border-primary"
                />
              </div>

              <div className="w-full md:w-auto flex items-center gap-2">
                <select
                  value={selectedPillar}
                  onChange={(e) => setSelectedPillar(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low rounded-lg text-[12px] font-semibold text-primary focus:outline-none border border-outline-variant/20 cursor-pointer"
                >
                  <option value="all">Pillar: All Sectors</option>
                  <option value="ROOTS">ROOTS — Handloom &amp; Crafts</option>
                  <option value="RE:WEAR">RE:WEAR — Thrift Fashion</option>
                  <option value="RE:USE">RE:USE — Analog &amp; Tech</option>
                  <option value="RE:READ">RE:READ — Literature</option>
                  <option value="RE:MAKE">RE:MAKE — Upcycled Art</option>
                  <option value="RE:SOURCE">RE:SOURCE — Materials</option>
                </select>
              </div>
            </div>

            {/* Inventory List */}
            <div className="flex flex-col gap-space-md">
              {filteredItems.length === 0 ? (
                <div className="p-12 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                  <Package size={36} className="text-outline mx-auto mb-2" />
                  <p className="text-[14px] text-on-surface-variant font-medium">
                    No listings match the current filter.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md border border-outline-variant/30 transition-all flex flex-col md:flex-row gap-space-md items-start md:items-center"
                  >
                    <div className="relative w-full md:w-32 h-40 md:h-32 shrink-0 rounded-lg overflow-hidden bg-surface-container">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 130px"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface/90 text-[10px] font-bold text-primary uppercase shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between w-full">
                      <div className="flex flex-wrap items-start justify-between gap-space-xs mb-1">
                        <div>
                          <Link
                            href={`/product/${item.id}`}
                            className="font-[family-name:var(--font-playfair)] text-[17px] text-primary font-semibold hover:text-secondary transition-colors"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-space-xs text-[11px] font-bold text-outline uppercase tracking-wider mt-0.5">
                            <span>SKU: #{item.sku}</span>
                            <span>•</span>
                            <span>{item.daysAgo}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 text-primary">
                              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                              {item.status}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[18px] font-bold text-primary">
                            {item.price === 0 ? "Free" : formatPrice(item.price)}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-[11px] text-outline line-through block">
                              {formatPrice(item.originalPrice)} Benchmark
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metrics & Context */}
                      <div className="flex flex-wrap items-center justify-between gap-space-sm py-2 bg-surface-container-low/60 rounded-lg px-3 my-1 border border-outline-variant/20">
                        <div className="flex items-center gap-4 text-[12px] text-on-surface-variant font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Eye size={14} className="text-outline" /> {item.views} views
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Heart size={14} className="text-outline" /> {item.saves} saves
                          </span>
                          {item.bags > 0 && (
                            <span className="inline-flex items-center gap-1 text-secondary font-bold">
                              <ShoppingBag size={14} /> In {item.bags} Active Bags
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
                          <Sparkles size={12} /> High collector demand
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${item.id}`}
                            className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary text-[12px] font-semibold transition-colors"
                          >
                            View Live
                          </Link>
                          {item.isUserListing && (
                            <button
                              type="button"
                              onClick={() => removeListing(item.id)}
                              className="px-3 py-1 rounded bg-surface-container hover:bg-error-container text-error text-[12px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                        <span className="text-[11px] text-outline font-medium">
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Pending Counter-Offers & Communications (4 cols) */}
          <aside className="xl:col-span-4 flex flex-col gap-space-lg">
            {/* Live Offers Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/20 mb-space-md">
                <div className="flex items-center gap-2">
                  <Gavel size={18} className="text-primary" />
                  <h2 className="font-[family-name:var(--font-playfair)] text-[18px] font-semibold text-primary">
                    Pending Counter-Offers
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary text-[10px] font-bold uppercase tracking-wider">
                  2 Awaiting
                </span>
              </div>

              {offerActionMsg && (
                <div className="mb-3 p-2.5 rounded-lg bg-secondary-container text-primary text-[12px] font-semibold text-center">
                  {offerActionMsg}
                </div>
              )}

              {/* Offer 1 */}
              <div className="bg-surface-container-low rounded-xl p-space-md mb-space-md border border-outline-variant/20">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      Urli Bowl (#AL-9921)
                    </span>
                    <p className="text-[14px] text-primary font-bold mt-0.5">
                      Offer: <strong className="text-primary">₹1,900</strong>{" "}
                      <span className="text-outline font-normal text-[12px]">(Listed at ₹2,200)</span>
                    </p>
                  </div>
                  <span className="text-[10px] text-secondary font-bold bg-surface-container px-2 py-0.5 rounded uppercase">
                    Expires 6h
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center text-[10px] font-bold">
                    RS
                  </div>
                  <span className="text-[12px] font-semibold text-on-surface">
                    Rhea Sen • 14 Purchases on AFTERLIFE
                  </span>
                </div>

                <p className="text-[12px] text-on-surface-variant italic mb-3 bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/20 leading-relaxed">
                  &ldquo;Seeking this for an ancestral temple restoration. Can settle immediately
                  via UPI.&rdquo;
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setOfferActionMsg("Counter-offer accepted! Escrow initiated.")}
                    className="py-1.5 px-2 rounded-lg bg-primary text-on-primary text-[11px] font-bold hover:bg-primary-container transition-colors text-center"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setOfferActionMsg("Counter proposal sent: ₹2,050.")}
                    className="py-1.5 px-2 rounded-lg bg-surface-container text-primary text-[11px] font-bold hover:bg-surface-container-high transition-colors text-center border border-outline-variant/30"
                  >
                    Counter
                  </button>
                  <button
                    onClick={() => setOfferActionMsg("Offer declined politely.")}
                    className="py-1.5 px-2 rounded-lg bg-transparent text-outline hover:text-error text-[11px] font-bold transition-colors text-center"
                  >
                    Decline
                  </button>
                </div>
              </div>

              {/* Offer 2 */}
              <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      Linen Offcuts (#AL-6120)
                    </span>
                    <p className="text-[14px] text-primary font-bold mt-0.5">
                      Offer: <strong className="text-primary">₹800</strong>{" "}
                      <span className="text-outline font-normal text-[12px]">(Listed at ₹950)</span>
                    </p>
                  </div>
                  <span className="text-[10px] text-secondary font-bold bg-surface-container px-2 py-0.5 rounded uppercase">
                    Expires 14h
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center text-[10px] font-bold">
                    DK
                  </div>
                  <span className="text-[12px] font-semibold text-on-surface">
                    Dev K. • NID Student Upcycler
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <button
                    onClick={() => setOfferActionMsg("Student offer accepted! Parcel label created.")}
                    className="py-1.5 px-2 rounded-lg bg-primary text-on-primary text-[11px] font-bold hover:bg-primary-container transition-colors text-center"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setOfferActionMsg("Counter proposed at ₹875.")}
                    className="py-1.5 px-2 rounded-lg bg-surface-container text-primary text-[11px] font-bold hover:bg-surface-container-high transition-colors text-center border border-outline-variant/30"
                  >
                    Counter
                  </button>
                  <button
                    onClick={() => setOfferActionMsg("Offer declined.")}
                    className="py-1.5 px-2 rounded-lg bg-transparent text-outline hover:text-error text-[11px] font-bold transition-colors text-center"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>

            {/* Circular Demand Alerts */}
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary font-bold text-[12px] uppercase tracking-wider mb-2">
                <Flame size={16} className="text-secondary" />
                <span>Regional Demand Pulse</span>
              </div>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                High search velocity in Bangalore for <strong>1970s handloom textiles</strong> and{" "}
                <strong>reclaimed brass vessels</strong>. +38 verified seekers active this week.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
