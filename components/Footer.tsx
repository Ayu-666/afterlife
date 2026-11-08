"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Leaf, ShieldCheck, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low pt-space-2xl pb-margin text-on-surface border-t border-outline-variant/40 mt-20">
      <div className="w-full max-w-[1440px] mx-auto px-gutter lg:px-margin-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl pb-space-2xl">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-space-sm mb-space-md group">
              <Image
                src="/images/brand/afterlife-logo.png"
                alt="AFTERLIFE Brand Logo"
                width={28}
                height={28}
                className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold text-primary uppercase tracking-tight">
                AFTERLIFE
              </span>
            </Link>
            <p className="text-[14px] text-on-surface-variant max-w-sm mb-space-lg leading-relaxed">
              Find value in what the world overlooks. Buy differently. Sell meaningfully. Waste less.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                <CheckCircle2 size={13} className="text-secondary" />
                100% Circular Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                <Leaf size={13} className="text-secondary" />
                Zero Virgin Material
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                <ShieldCheck size={13} className="text-secondary" />
                Ethical Peer Exchange
              </span>
            </div>
          </div>

          {/* Curated Pillars */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold text-primary tracking-wider uppercase mb-space-md">
              Curated Pillars
            </h4>
            <ul className="space-y-2 text-[13px] text-on-surface-variant">
              {[
                { name: "RE:WEAR", label: "Thrift & Archival Fashion", href: "/categories/RE%3AWEAR" },
                { name: "ROOTS", label: "Indian Craft & Heritage", href: "/categories/ROOTS" },
                { name: "RE:READ", label: "Books & Academic Texts", href: "/categories/RE%3AREAD" },
                { name: "RE:MAKE", label: "Upcycled Furniture & Art", href: "/categories/RE%3AMAKE" },
                { name: "RE:USE", label: "Certified Restored Tech", href: "/categories/RE%3AUSE" },
                { name: "RE:SOURCE", label: "Surplus Raw Materials", href: "/categories/RE%3ASOURCE" },
              ].map((p) => (
                <li key={p.name}>
                  <Link href={p.href} className="hover:text-primary transition-colors block py-0.5">
                    <span className="font-semibold text-primary">{p.name}</span>
                    <span className="text-outline ml-1.5">— {p.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold text-primary tracking-wider uppercase mb-space-md">
              Marketplace
            </h4>
            <ul className="space-y-2 text-[13px] text-on-surface-variant">
              <li>
                <Link href="/marketplace" className="hover:text-primary transition-colors block py-0.5">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary transition-colors block py-0.5">
                  Categories Hub
                </Link>
              </li>
              <li>
                <Link href="/ai-finder" className="hover:text-primary transition-colors block py-0.5">
                  AI Concierge
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-primary transition-colors block py-0.5">
                  List an Item
                </Link>
              </li>
              <li>
                <Link href="/my-listings" className="hover:text-primary transition-colors block py-0.5">
                  Curator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-primary transition-colors block py-0.5">
                  Circulation Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Curated Drops */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold text-primary tracking-wider uppercase mb-space-md">
              Weekly Curated Drops
            </h4>
            <p className="text-[13px] text-on-surface-variant mb-space-md leading-relaxed">
              Rare archival fashion, student textbook circulations, and artisan drops direct to your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for joining the AFTERLIFE circular dispatch.");
              }}
              className="flex flex-col gap-2"
            >
              <div className="flex rounded-lg overflow-hidden border border-outline-variant/60 bg-surface shadow-sm focus-within:border-primary">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  required
                  className="px-3 py-2 text-[13px] bg-transparent text-primary placeholder:text-outline focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary text-[12px] font-semibold hover:bg-primary-container transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Join</span>
                  <ArrowRight size={13} />
                </button>
              </div>
              <span className="text-[11px] text-outline">Zero spam. Pure circular curation.</span>
            </form>
          </div>
        </div>

        {/* Bottom Credits & Transparency */}
        <div className="pt-space-lg border-t border-outline-variant/40 flex flex-col md:flex-row items-center justify-between gap-space-md text-[11px] text-outline">
          <p>© 2026 AFTERLIFE. Circular Commerce Platform for India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/impact" className="hover:text-primary transition-colors">
              Open Impact Protocol
            </Link>
            <span>·</span>
            <Link href="/categories" className="hover:text-primary transition-colors">
              Pillar Taxonomy
            </Link>
            <span>·</span>
            <Link href="/ai-finder" className="hover:text-primary transition-colors">
              AI Concierge
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
