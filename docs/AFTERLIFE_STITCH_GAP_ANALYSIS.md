# AFTERLIFE — Original Stitch Design vs. Current Implementation Audit
## Gap Analysis, Design System Specifications & Restoration Roadmap

**Auditor:** Senior Frontend Architect & Design Implementation Specialist  
**Target Application:** AFTERLIFE (Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript)  
**Reference Design:** Google Stitch Design System (`docs/original-stitch-design/stitch-afterlife.zip`)  
**Status:** Audit & Restoration Plan (Read-Only; No Code Modified)  
**Date:** November 2026

---

## 1. Executive Summary

AFTERLIFE was originally designed in Google Stitch as an editorial, circular luxury and sustainable commerce platform. The design combines **warm ivory backgrounds** (`#fcf9f1`), **deep forest-green typography** (`#00271d`), **classical serif headings** (`Playfair Display`), and **meticulous material provenance storytelling** across six curated streams of circular value (**RE:WEAR**, **ROOTS**, **RE:READ**, **RE:MAKE**, **RE:USE**, and **RE:SOURCE**).

During initial translation into Next.js, core routing, data schemas, and backend AI integration were successfully established. However, several high-impact UX workflows, editorial storytelling modules, and visual design nuances from the original Stitch prototypes were omitted or simplified into generic components.

This audit provides an exhaustive screen-by-screen gap analysis comparing the 8 original Stitch screens with the live codebase, identifies the brand assets and design tokens needed for restoration, establishes technical requirements, and outlines a prioritized phased implementation roadmap.

---

## 2. Branding & Design System Recovery

### 2.1 Brand Logo & Editorial Wordmark
| Element | Original Stitch Specification | Current Implementation | Action Required |
|---|---|---|---|
| **Brand Logo Asset** | Distinctive circular leaf/loop motif (`h-8 w-auto object-contain`) located at `https://lh3.googleusercontent.com/aida-public/AB6AXuB06p...` | Missing entirely; only text is rendered in `Navbar.tsx` | Recover the original logo asset into `public/images/brand/afterlife-logo.png`, implement `<Image />` beside wordmark |
| **Editorial Wordmark** | `AFTERLIFE` in uppercase Playfair Display, tracking `-0.02em`, `font-title-editorial text-title-editorial` (`18px/24px`, weight `600`), text color `#00271d` | Implemented in Playfair Display (`22px`), but missing the accompanying logo mark and tracking precision | Wrap logo icon and wordmark in a unified flex container with `gap-space-sm` |
| **Search Pill in Header** | Quick search bar (`hidden md:flex`, `bg-surface-container-low`, `text-[13px]`, search icon, placeholder `"Search circular archive..."`, keyboard badge `<kbd>⌘K</kbd>`) | Omitted from desktop header; search only exists on individual pages | Restore search trigger pill in `Navbar.tsx` that links to `/marketplace` or triggers a search modal |
| **Header Profile Pill** | Circular user avatar (`w-8 h-8 rounded-full object-cover`) linking to `my-listings` or profile | Missing; only Wishlist and "Sell / Give" button present | Restore avatar pill linking to `/my-listings` |
| **Navigation Active State** | Active link uses `text-primary font-bold` with `font-label-md` (`13px/18px`, tracking `0.01em`) | Partially present, but font sizing and spacing use ad-hoc Tailwind values | Standardize navigation link tokens to match Stitch specification |

### 2.2 Color System & Design Tokens
The original Stitch design is built on Material Design 3 tokens mapped to an editorial earthy palette. The live `tailwind.config.ts` contains these tokens, but several page components currently bypass them with arbitrary Tailwind utilities.

```
Warm Ivory Surface:        #fcf9f1  (surface / background)
Surface Lowest (Cards):    #ffffff  (surface-container-lowest)
Surface Low (Borders/BG):  #f6f3eb  (surface-container-low)
Surface Mid:               #f1eee6  (surface-container)
Surface High:              #ebe8e0  (surface-container-high)
Surface Highest:           #e5e2da  (surface-container-highest)
Deep Forest Green:         #00271d  (primary — main text & headers)
Muted Forest Green:        #183d32  (primary-container)
Sage Green:                #49645b  (secondary)
Soft Sage Container:       #c8e6db  (secondary-container)
Charcoal Charcoal:         #1c1c17  (on-surface)
Muted Slate Outline:       #717975  (outline)
Subtle Border:             #c1c8c4  (outline-variant)
```

### 2.3 Typography Scale
| Style Token | Font Family | Size / Line Height | Tracking | Weight | Used For |
|---|---|---|---|---|---|
| `display-hero` | Playfair Display | `56px / 64px` | `-0.02em` | `400` | Homepage hero headline |
| `headline-lg` | Playfair Display | `40px / 48px` | `-0.015em` | `400` | Major section headlines, category titles |
| `headline-md` | Playfair Display | `28px / 36px` | `-0.01em` | `500` | Secondary section headers, stream titles |
| `headline-sm` | Playfair Display | `22px / 30px` | `0em` | `500` | Pillar card headers, card titles |
| `title-editorial`| Playfair Display | `18px / 24px` | `0.01em` | `600` | Logo wordmark, card titles |
| `body-lg` | Plus Jakarta Sans | `18px / 28px` | `-0.005em` | `400` | Lead introductory paragraphs |
| `body-md` | Plus Jakarta Sans | `15px / 24px` | `0em` | `400` | Standard body copy, descriptions |
| `body-sm` | Plus Jakarta Sans | `13px / 20px` | `0.005em` | `400` | Secondary metadata, captions |
| `label-md` | Plus Jakarta Sans | `13px / 18px` | `0.01em` | `500` | Buttons, navigation links |
| `label-caps` | Plus Jakarta Sans | `11px / 14px` | `0.08em` | `600` | Badges, kicker tags, category chips |
| `price-lg` | Plus Jakarta Sans | `20px / 26px` | `-0.02em` | `600` | Large product prices |
| `price-md` | Plus Jakarta Sans | `16px / 22px` | `-0.01em` | `600` | Standard card prices |

---

## 3. Screen-by-Screen Detailed Gap Analysis

### Screen 1: Home (`afterlife_home`)
*Current File: `app/page.tsx`*

#### Structure in Original Stitch:
1. **Header / Nav**: Fixed header with logo image, wordmark, navigation links with "AI" badge, search pill with `⌘K`, wishlist count pill, "Sell / Give" button, profile avatar.
2. **Editorial Hero**:
   - Eyebrow: `PAN-INDIA VERIFIED CIRCULAR ARCHIVE`
   - Headline: *"Find value in what the world overlooks."*
   - Subtitle: *"Discover pre-loved treasures, independent craftsmanship, traditional creations, and products waiting for a new purpose."*
   - Search Bar: Natural language prompt input with "Curate" button and `auto_awesome` badge.
   - Prompt Pills: *"Try: Minimalist desk lamp under ₹1,500, Vintage leather jacket, Engineering textbooks"*.
   - Hero Showcase: Curated floating card showcase with condition badge, price tag, and ratings.
3. **Trust & Marketplace Statistics Strip**:
   - `bg-primary-container text-on-primary`
   - 4 live telemetry metrics:
     - `14,200+ Circular Artefacts Listed` (`inventory_2`)
     - `32.4 Tons CO₂ Diverted` (`co2`)
     - `100% Direct Artisan Payout` (`handshake`)
     - `Pan-India Verified Logistics` (`verified`)
4. **Six Curated Pillars**:
   - Kicker: `TAXONOMY OF RECLAIMED VALUE`
   - Headline: *"Six Curated Pillars"*
   - Subtitle: *"Every stream vetted for integrity, material authenticity, and authentic circular life-cycle tracking."*
   - 6 detailed cards (3x2 grid):
     - **RE:WEAR**: `2,430 PIECES`, *"Thrift fashion, archival luxury wear, selvedge denim & classic trench coats."*, `UP TO 75% OFF RETAIL`, `AUTHENTICATED`.
     - **ROOTS**: `1,840 ARTIFACTS`, *"Indigenous handlooms, beaten brass vessels, studio ceramics & folk traditions."*, `DIRECT CRAFT REMITTANCE`, `HERITAGE SEAL`.
     - **RE:READ**: `3,120 EDITIONS`, *"Second-hand university textbooks, out-of-print poetry, monographs & philosophy."*, `STUDENT SUBSIDIES`, `PAGE-CHECKED`.
     - **RE:MAKE**: `890 CREATIONS`, *"Upcycled furniture, bespoke joinery, patchwork wall tapestries & lamps."*, `RECLAIMED TIMBER & RESIN`, `ONE-OF-ONE`.
     - **RE:USE**: `1,150 UNITS`, *"Precision refurbished vintage audio equipment, mechanical keyboards, and 35mm rangefinders."*, `CERTIFIED WORKING`, `RECIRCULATED TECH`.
     - **RE:SOURCE**: `640 LOTS`, *"Surplus deadstock fabric, raw vegetable-tanned leather scraps, natural dyes & salvaged architectural brass."*, `DIRECT RECOVERY`, `ZERO VIRGIN MATERIAL`.
5. **Trending Discoveries**:
   - 4-column product grid with condition badge (`EXCELLENT`), stream tag, price strike-through, discount chip, and location.
6. **Living Heritage Artisan Spotlight**:
   - Eyebrow: `LIVING HERITAGE INITIATIVE`
   - Headline: *"Preserving the Gossamer Weave of Chanderi"*
   - Narrative on Lakshmi Bai (Pranpur Village, Chanderi · 44 Years on Handloom).
   - Badges: `DIRECT ARTISAN ALLIANCE`, `ZERO INTERMEDIARY CUT`.
   - Side-by-side featured product showcase.
7. **Affordable Student Finds** (*Completely Missing in Current Implementation*):
   - Kicker: `CAMPUS CIRCULAR NETWORK`
   - Headline: *"Affordable Student Finds"*
   - Discount tag: *"Verified university ID gets additional 10% off (EDU PERKS)"*
   - 4-column budget grid (Casio scientific calculator, study desk lamp, engineering monographs, noise-cancelling study audio).
8. **Curated For Your Taste** (*Completely Missing in Current Implementation*):
   - Kicker: `AESTHETIC VECTOR ALIGNMENT`
   - Headline: *"Curated For Your Taste"*
   - Description: *"Dynamic inference matches items based on your appreciation for raw natural materials, heritage typography, and minimalist utility."*
   - Match Score Pill: `98% AESTHETIC MATCH` with reasoning: *"Matched because you saved Studio Pottery & Clayware"*.
   - 3-column aesthetic pairings grid.
9. **Circular Impact Section ("The Circular Math")**:
   - Eyebrow: `THE CIRCULAR MATH`
   - Headline: *"Every reused kilogram prevents 22kg of carbon emissions and 7,000 litres of clean water."*
   - Interactive CTA: `"Calculate My Circular Footprint"` (triggers modal/scroll) + `"Download Open Impact Audit"`.
   - Data visualizer box: Textiles Diverted (18.6 Tons), Water Preserved (4.2M Litres), Textbooks Re-circulated (5,410 Units) with progress bars.

#### Gap Assessment:
- **Implemented Correctly**: Hero heading and dual-search routing; Trending Discoveries grid; Khurja Pottery spotlight.
- **Partially Implemented**: Six Curated Pillars (simplified into 6 basic cards without the individual metadata badges or subcategory chips); Trust strip (simplified into plain text cards).
- **Completely Missing**:
  - Section 6: Affordable Student Finds (Campus Circular Network).
  - Section 7: Curated For Your Taste (Aesthetic Vector Alignment with 98% match reasoning pill).
  - Section 8: Interactive Circular Footprint Calculator CTA and progress ledger visualizer.

---

### Screen 2: Discover Marketplace (`afterlife_discover_marketplace`)
*Current File: `app/marketplace/page.tsx`*

#### Structure in Original Stitch:
1. **Header & Context**:
   - Title: *"The Marketplace Catalog"*
   - Subtitle: *"Curated circular goods across India. Every item verified for provenance, material integrity, and circular life-cycle tracking."*
2. **Top Quick-Filter Pills**:
   - Horizontal pill bar: `All Categories`, `Under ₹1,000`, `Handmade`, `Verified Sellers`, `Free Community Give`, `Restored Tech`.
3. **Layout & View Controls**:
   - View mode toggle: Grid View (`grid_view`) vs. List/Agenda View (`view_agenda`).
   - Results count: *"Showing 1–12 of 180 verified artefacts"*.
   - Sort dropdown: *"Newly Cataloged"*, *"Price: Low to High"*, *"Price: High to Low"*, *"Most In-Demand"*, *"Lowest Carbon Impact"*.
4. **Sidebar Filter Panel**:
   - Search input with clear trigger.
   - Dual-handle Price Slider with minimum and maximum input chips.
   - Listing Type checkboxes with count badges (`Pre-Owned (840)`, `Handmade & Artisan (320)`, `Upcycled (210)`, `Refurbished (180)`, `Surplus (95)`).
   - Condition checkboxes with counts (`Brand New / Archival (42)`, `Excellent (512)`, `Very Good (410)`, `Fair / Upcyclable (94)`).
   - **Circularity Assurance Protocol Card**:
     - Sidebar trust banner detailing verified material certification, carbon-neutral shipping, and 7-day return escrow.
5. **Product Cards**:
   - Detailed cards with category stream chip, seller location, condition pill, price with original price strike-through, ecological yield indicator (e.g., `Saves 12kg CO₂`), and quick-action wishlist button.

#### Gap Assessment:
- **Implemented Correctly**: Core search, category filter checkboxes, listing type filters, price inputs, sort dropdown, responsive drawer for mobile.
- **Partially Implemented**: Filter sidebar lacks product count badges beside checkboxes; sort dropdown missing "Lowest Carbon Impact" and "Most In-Demand".
- **Completely Missing**:
  - Top Quick-Filter Pills row (`Under ₹1,000`, `Handmade`, `Verified Sellers`, `Free Community Give`, `Restored Tech`).
  - Grid View vs. List/Agenda View layout switcher.
  - Sidebar Circularity Assurance Protocol trust block.
  - Product Card ecological yield pills (`Saves 12kg CO₂`, `Saves 4,200L Water`).

---

### Screen 3: Categories Hub (`afterlife_categories_hub`)
*Current File: `app/categories/page.tsx`*

#### Structure in Original Stitch:
1. **Header & Stream Subnavigation**:
   - Title: *"Six Streams of Circular Value"*
   - Subtitle: *"A structured taxonomy of recirculated materials, heirlooms, and technical goods across India."*
   - Sticky quick-anchor navigation pill bar:
     `[01 // RE:WEAR]  [02 // ROOTS]  [03 // RE:READ]  [04 // RE:MAKE]  [05 // RE:USE]  [06 // RE:SOURCE]`
2. **Six Dedicated Full-Width Stream Showcases (`stream-anchor`)**:
   - Each stream receives a dedicated high-fidelity editorial section:
     - **Stream 1: RE:WEAR** (Vintage garments, selvedge denim, trench coats, subcategory pills: *Curated Vintage*, *Designer Archive*, *Everyday Thrift*, *Denim & Outerwear*, 2 featured highlight cards).
     - **Stream 2: ROOTS** (Indigenous craft traditions, beaten brass, handlooms, subcategory pills: *Heirloom Brass*, *Terracotta*, *Khurja Ceramics*, *Tribal Dhokra*, featured craft highlight).
     - **Stream 3: RE:READ** (Textbooks, academic monographs, rare literature, *Campus Book Return & Swap* badge, subcategory pills: *Computer Science*, *Engineering*, *Philosophy*, *Vintage Indian Fiction*).
     - **Stream 4: RE:MAKE** (Sculptural luminaires, upcycled joinery, denim accessories, subcategory pills: *Reclaimed Furniture*, *Industrial Lighting*, *Textile Upcycles*, *Garden Craft*).
     - **Stream 5: RE:USE** (Restored tech, Marantz receivers, Canon 35mm cameras, subcategory pills: *Audio & Hi-Fi*, *Cameras & Lenses*, *Computing*, *Home Essentials*).
     - **Stream 6: RE:SOURCE** (Deadstock fabrics, raw leather offcuts, brass wire, organic indigo, subcategory pills: *Raw Textiles*, *Leather Offcuts*, *Natural Dyes*, *Eco Packaging*).
   - Each stream section contains a direct CTA: `"Explore All {Category} Items ({Count}) →"`.
3. **Cross-Stream Directory**:
   - Full-width 6-column structured taxonomy grid at the bottom.
   - Column 1: `01 // RE:WEAR` (Knitwear, Outerwear, Footwear, Silks, Accessories).
   - Column 2: `02 // ROOTS` (Saris, Clay Vessels, Brassware, Carved Teak, Natural Dyes).
   - Column 3: `03 // RE:READ` (Technical, Philosophy, Literature, Rare Prints, Student Notes).
   - Column 4: `04 // RE:MAKE` (Restored Chairs, Pipe Lamps, Pallet Wood, Wall Hangings).
   - Column 5: `05 // RE:USE` (Audio Systems, Analog Optics, Keyboards, Displays).
   - Column 6: `06 // RE:SOURCE` (Fabric Bolts, Scrap Leather, Jute Twine, Cork Sheets).

#### Gap Assessment:
- **Implemented Correctly**: Basic category card routing to dynamic category pages (`/categories/[category]`).
- **Partially Implemented**: 6 cards render cover images and listing counts.
- **Completely Missing**:
  - The entire page was drastically oversimplified (77 lines of code).
  - Quick-anchor stream navigation bar missing.
  - All 6 rich stream showcase sections (`stream-anchor`) with subcategory pills and featured products are missing.
  - The entire Cross-Stream Directory (6-column taxonomy index) is missing.

---

### Screen 4: Product Detail Page (`afterlife_product_detail_page`)
*Current File: `app/product/[id]/page.tsx`*

#### Structure in Original Stitch:
1. **Breadcrumb**: Category stream hierarchy navigation (`Home / Marketplace / RE:WEAR / Product Title`).
2. **Product Showcase Grid (2-Column)**:
   - **Left Column**:
     - Large main photograph with interactive zoom trigger (`zoom_in`).
     - **Blockchain Circular Passport Badge**:
       - `LEDGER ID: #0x8492...C19`
       - Material breakdown: *"100% Pure Long-Staple Cotton • Naturally fermented indigo • Estimated age: 42 years • Origin: Kansai Region, Japan."*
       - `100% Synthetic-Free` verification badge.
   - **Right Column**:
     - Category stream chip + condition pill (`EXCELLENT`) + Demo badge.
     - Headline title in Playfair Display (`36px`).
     - Price block with original price strike-through, savings percentage badge, and ecological benefit tag (*"🌱 Choosing pre-owned avoids new production waste"*).
     - Condition explanation card with star rating.
     - Seller profile card with avatar, verified curator badge, city/state, response time, and "Message" button.
     - **Action Row**:
       - Primary CTA: `"Express Interest & Buy (₹Price)"` with shopping bag icon.
       - Secondary CTA: `"Make an Offer"` button.
       - Wishlist toggle with live save count (`favorite 42`).
       - "Share Listing" and "Fit Guide / Dimensions" buttons.
3. **Storytelling Section ("The Philosophy of Visible Mending" / Curator Notes)**:
   - Full-width editorial background (`bg-surface-container-low`).
   - Deep narrative on provenance, cultural context, and material longevity.
   - **Three Prominent Impact Callouts**:
     - `9,400 Litres`: Clean water spared by re-wearing this item instead of manufacturing virgin goods.
     - `42 Years`: Proven textile/object longevity under careful maintenance.
     - `Infinite Circularity`: Eligible for return-for-credit via AFTERLIFE Circular Protocol.
4. **"Pairs Well with These Circular Finds" (Curation Harmonization)**:
   - Curated cross-category recommendation rail (e.g. Vintage Selvedge Jacket paired with handcrafted brass kadas from ROOTS, raw khadi trousers, and upcycled carryall from RE:MAKE).

#### Gap Assessment:
- **Implemented Correctly**: Core product presentation, image rendering, pricing, condition display, seller details, wishlist toggle, and "More in {Category}" grid.
- **Partially Implemented**: Provenance card is brief; "Express Interest" and "Message" buttons are disabled without explanatory context.
- **Completely Missing**:
  - Image zoom viewport trigger.
  - Blockchain Circular Passport / Material Lineage verification card.
  - "Make an Offer" modal / action drawer.
  - Fit Guide / Measurements modal trigger.
  - Storytelling & Ecological Yield Section (the 3 impact metric callouts: Water Spared, Years of Longevity, Infinite Circularity).
  - Cross-Stream "Pairs Well with These Circular Finds" (current implementation only shows random items from the same category).

---

### Screen 5: AFTERLIFE AI Concierge (`afterlife_ai_finder`)
*Current File: `app/ai-finder/page.tsx` & `app/api/ai-finder/route.ts`*

#### Structure in Original Stitch:
1. **Header & Context**:
   - Branding: **AFTERLIFE AI Concierge** (not "Shopping Companion").
   - Subtitle: *"Natural-language circular discovery. Describe an aesthetic mood, spatial constraint, functional project, or specific rarity — our semantic vector engine matches across all 6 circular streams."*
2. **Conversational Synthesis Box**:
   - Large multi-line prompt textarea.
   - One-click prompt inspiration pills:
     - *"Find engineering textbooks under ₹300"*
     - *"I need affordable earthy decor for hostel room"*
     - *"Handmade anniversary gifts under ₹1,500"*
     - *"Sustainable 100% linen trousers size M"*
     - *"Surplus organic cotton fabric for DIY tote"*
   - Action Bar inside prompt container:
     - `Visual Search` button (`add_a_photo`)
     - `Voice Note` button (`mic`)
     - Keyboard shortcut indicator: `Press ⌘ + Enter to synthesize`
     - `Clear` button
     - `Assemble Match` CTA button with sparkle icon (`auto_awesome`)
3. **Two-Column Curated Match Workspace**:
   - **Left Column (8 cols): Multi-Item Circular Bundle**:
     - Renders 3 items curated to work together as a cohesive bundle.
     - Each item card shows: match badge (`98% AESTHETIC MATCH`), stream category, title, specs, condition, price, and `"Inspect Item →"` action.
     - Bottom Action Bar:
       - `Swap Item` button (opens swap drawer)
       - `Refine Parameters` button
       - `Bundle All 3 • ₹3,650` CTA button with `shopping_bag` icon
   - **Right Column (4 cols): Curatorial & Provenance Breakdown ("Why This Was Chosen")**:
     - Detailed explanation of how the recommendation aligns with the user's aesthetic, spatial, or functional request.
     - **Budget Target Utilization**: Progress meter showing `91.2%` (₹3,650 spent of ₹4,000 target, ₹350 retained).
     - **Ecological Yield**: `14.2 kg CO₂ Diverted`, `1,200L Water Preserved`.
     - **Alternate Swap Candidates**: Vertical stack of 2–3 alternate items with thumbnail, title, price, and one-click `"Swap in"` button.

#### Gap Assessment:
- **Implemented Correctly**: Working Gemini server-side AI integration (`app/api/ai-finder/route.ts`), conversation history memory, multi-turn chat bubbles, product recommendation cards, fallback search.
- **Partially Implemented**: Prompt pills exist but are rendered as small generic cards above the chat; recommendation explanation is delivered inside assistant text bubble rather than as a dedicated sidebar panel.
- **Completely Missing**:
  - Branding is "AFTERLIFE Shopping Companion" instead of original "AFTERLIFE AI Concierge".
  - Visual Search (`add_a_photo`) and Voice Note (`mic`) entry points in the prompt bar.
  - Dedicated "Why This Was Chosen" curatorial & ecological reasoning card.
  - Multi-Product Bundle Interface with single-click "Bundle All (₹Total)" action.
  - Budget Target Utilization progress bar.
  - Interactive "Swap Item" / "Alternate Swap Candidates" drawer.

---

### Screen 6: Sell / Give (`afterlife_sell_or_give`)
*Current File: `app/sell/page.tsx`*

#### Structure in Original Stitch:
1. **Header**:
   - Title: *"List an Item for its Afterlife"*
   - Subtitle: *"Transform discarded or outgrown objects into recirculated value. Our AI provenance assistant composes descriptive archival entries from your photos."*
2. **Two-Column Side-by-Side Listing Studio**:
   - **Left Column (8 cols) — 4-Stage Form Workflow**:
     1. **Media Upload & Curatorial Viewports**:
        - Drag-and-drop zone with 4 explicit photo slots: `Cover Perspective`, `Detail Texture`, `Label / Maker Mark`, `Packaging / Fit`.
     2. **Magic AI Description & Provenance Composer**:
        - `Re-Analyze Photos` button with sparkle icon.
        - **Tone Switcher**: `Polish Tone`, `Archival / Poetic`, `Technical / Precise`, `Casual Thrift`.
        - Title input with AI suggestions.
        - Description textarea with provenance notes.
        - Dynamic tag chip cloud with `+ Add Tag` input.
     3. **Listing Attributes & Lineage Assessment**:
        - Interactive archetype selection grid with custom icons:
          - `Pre-Owned / Thrift` (`checkroom`)
          - `Handmade & Artisan` (`handyman`)
          - `Upcycled` (`autorenew`)
          - `Certified Refurbished` (`precision_manufacturing`)
          - `Surplus Materials` (`inventory_2`)
          - `Give for Free` (`volunteer_activism`)
        - Category selector (`RE:WEAR`, `ROOTS`, `RE:READ`, `RE:MAKE`, `RE:USE`, `RE:SOURCE`).
        - Condition selector (`Brand New / Archival`, `Excellent`, `Very Good`, `Fair / Upcyclable`).
     4. **Pricing Intelligence & Dispatch Routing**:
        - Price input with live benchmark recommendation (`Recommended: ₹1,600 – ₹1,950 based on 42 similar listings`).
        - Original retail price input.
        - Dispatch mode toggles (`Eco-Courier Dispatch`, `Local Campus Handover`, `Free Mutual Aid Drop`).
   - **Right Column (4 cols) — Sticky Live Preview & Ecological Yield**:
     - **Live Curatorial Preview Card**: Mirrors the exact product card seen by marketplace buyers in real time as fields are typed.
     - **Projected Ecological Yield Card**:
       - `12.4 kg CO₂e` Projected carbon avoidance.
       - `4,800 Litres` Projected water spared.
       - `Tier 1 Heritage Preservation` circular rank.
3. **Sticky Bottom Action Bar**:
   - `Save Draft` button + `Publish Listing to Archive →` CTA.

#### Gap Assessment:
- **Implemented Correctly**: Form validation, category and condition selection, image upload preview, working Gemini AI description composer (`/api/ai-listing`), local storage context integration (`addListing`).
- **Partially Implemented**: Preview is implemented as a separate full-page step ("form" vs "preview") rather than a real-time side-by-side split screen.
- **Completely Missing**:
  - Side-by-side synchronized split-screen studio layout.
  - Multi-viewport photo slots (Cover, Detail, Label, Packaging).
  - Tone switcher pills (`Archival / Poetic`, `Technical / Precise`, `Casual Thrift`).
  - Interactive archetype selector grid with iconography.
  - Projected Ecological Yield visualizer.
  - Pricing intelligence benchmark recommendation pill.

---

### Screen 7: My Listings (`afterlife_my_listings`)
*Current File: `app/my-listings/page.tsx`*

#### Structure in Original Stitch:
1. **Curator Profile Header**:
   - Avatar image with verified badge.
   - Curator Name: Maya Krishnan (`@mayak_archive`).
   - Badge: `Verified Circular Curator • Level 3 • Studio: Indiranagar, Bengaluru`.
   - Bio: *"Specialist in heirloom bell-metal castings, revival handloom yardage, and mid-century analog optics. Committed to zero-landfill dispatch."*
   - Performance Metrics:
     - `14 Active Listings`
     - `32 Items Recirculated`
     - `184 kg CO₂e Offset`
     - `4.9 ★ Rating (48 reviews)`
   - Action Buttons: `Curator Guidelines` & `+ Create New Listing`.
2. **Filter & Status Tabs**:
   - `Active Listings (14)`
   - `Reserved & Pending (3)`
   - `Sold & Archived (32)`
   - `Drafts (2)`
   - `Free / Community (4)`
3. **Interactive Listing Rows (Left Column - 8 cols)**:
   - Each row displays: item thumbnail, listing ID (`#AL-9921`), category badge, title, price, engagement metrics (`142 views`, `18 saves`, `3 inquiries`), and action buttons:
     - `Edit Listing`
     - `Promote Drop` (`rocket_launch`)
     - `Mark Reserved`
     - `Print Eco-Shipping Label` (`print`)
4. **Curator Telemetry Sidebar (Right Column - 4 cols)**:
   - **Widget 1: Pending Counter-Offers**:
     - Shows buyer offer card (e.g., Rhea Sen offering ₹1,900 on listed ₹2,200), expiry timer, buyer message, and action buttons: `Accept`, `Counter`, `Decline`.
   - **Widget 2: Your Circular Impact Ledger**:
     - Progress ring displaying abated carbon, preserved water, and packaging compostability rate.
   - **Widget 3: Marketplace Demand Surge Alert**:
     - Notification card: *"Demand Surge in Brass Bell-Metal (+38% search volume this week)"* with quick CTA *"List Similar Artefact"*.

#### Gap Assessment:
- **Implemented Correctly**: Listing count display, listing card list, item deletion, empty state with create button, local storage synchronization.
- **Partially Implemented**: Page layout simplified to a plain dark header and simple list.
- **Completely Missing**:
  - Rich Curator Profile Header (Avatar, bio, verified curator level, performance telemetry).
  - Status filter tabs (Active, Reserved, Sold, Drafts, Free/Community).
  - Detailed engagement metrics per row (views, saves, inquiries).
  - Item management actions (`Promote Drop`, `Mark Reserved`, `Print Eco-Shipping Label`).
  - Pending Counter-Offers widget.
  - Personal Circular Impact Ledger widget.
  - Marketplace Demand Surge notification widget.

---

### Screen 8: Impact / Circulation (`afterlife_impact_circulation`)
*Current File: `app/impact/page.tsx`*

#### Structure in Original Stitch:
1. **Hero**:
   - Kicker: `ARCHIVE METRIC CADENCE: HOURLY`
   - Headline: *"Our Collective Ecological Balance"*
   - Subtitle: *"Real-time ledger tracking every gram of textile diverted, every page recirculated, and every rupee kept in the hands of independent creators."*
   - Protocol Badge: `Open LCA & ISO 14044 Protocol` with third-party audit verification notice.
2. **Four Telemetry KPI Cards**:
   - `38,419 Products Revived` (`swap_horizontal_circle`, +18% vs target)
   - `184.2 Tons CO₂ Abated` (`co2`, certified cradle-to-cradle)
   - `28.4M Litres Clean Water Preserved` (`water_drop`, equivalent to 11.4 Olympic pools)
   - `₹3.8 Crore Direct Maker Value` (`currency_rupee`, zero intermediary cut)
3. **Six Streams of Circularity Breakdown**:
   - Interactive stream tabs/cards displaying category-specific metrics:
     - `RE:WEAR`: 18.2 Tons Saved (Ozone cleaned, zero chemical bleaching).
     - `ROOTS`: 140+ Artisan Families Supported (100% fair remittance).
     - `RE:READ`: 9,800 Books Recirculated (Over ₹42 Lakhs in student textbook savings).
     - `RE:MAKE`: 4.8 Tons Scrap Transformed (Salvaged timber, industrial copper).
     - `RE:USE`: 3,200 Hardware Devices (Component reclamation, e-waste avoided).
     - `RE:SOURCE`: 12 B2B Deadstock Lots (Mill offcuts placed into circular production).
4. **Interactive Personal Circular Footprint Calculator**:
   - Interactive sliders for monthly recirculated consumption:
     - Pre-loved Garments (0–12 items)
     - Second-hand Books (0–8 books)
     - Certified Refurbished Tech (0–3 units)
     - Reclaimed/Artisan Decor (0–6 pieces)
   - Dynamic real-time calculation of:
     - `Carbon Abated (kg CO₂e)`
     - `Water Spared (Litres)`
     - `Retail Capital Retained (₹ Savings)`
   - Dual CTAs: `Share My Circular Ledger Badge` & `Download Personal Impact Statement (PDF)`.
5. **Stories of Circular Revival (Before / After Transformations)**:
   - 3 documented case studies with visual transformation cards:
     - Story 1: *From Mill Scrap to Modern Living* (Discarded cotton rolls transformed into handcrafted structural lounge chair).
     - Story 2: *The Library of 100 Engineers* (IIT student textbook recirculating circle).
     - Story 3: *Kashmir Pashmina Revival* (Archival shawl restored with invisible mending).
6. **Methodology & Open Impact Protocol**:
   - Section detailing ISO 14040/14044 LCA compliance, open API data stream download, and alliance partners (*Circular Economy Forum India*, *Fair Trade Federation Guild*, *E-Waste Alliance Protocol*).

#### Gap Assessment:
- **Implemented Correctly**: Hero header, transparency disclaimer, real catalogue item count display, category breakdown list.
- **Partially Implemented**: Static hypothetical stats cards rendered, but missing the interactive calculators and stream deep-dives.
- **Completely Missing**:
  - Four Telemetry KPI Cards with trend indicators.
  - Interactive Six Streams of Circularity breakdown cards.
  - **Interactive Personal Circular Footprint Calculator** (interactive sliders with live carbon/water/savings computation).
  - Stories of Circular Revival transformation showcase.
  - Methodology & Open Impact Protocol governance section with open data stream CTAs.

---

## 4. Gap Classification Matrix

| Feature | Screen | Status | Priority | Feasibility & Approach |
|---|---|:---:|:---:|---|
| **Brand Logo Asset & Header Integration** | Global (Navbar) | Missing | P0 | Recover `public/images/brand/logo.png` from Stitch asset; update `Navbar.tsx` |
| **Header Search Pill with `⌘K` Trigger** | Global (Navbar) | Missing | P1 | Add search pill in `Navbar.tsx` that links to `/marketplace` |
| **Header Profile Avatar** | Global (Navbar) | Missing | P2 | Add avatar image in `Navbar.tsx` linking to `/my-listings` |
| **Trust & Statistics Strip** | Home | Partial | P1 | Upgrade Section 2 into 4-metric primary-container strip |
| **Six Curated Pillars Metadata Overhaul** | Home | Partial | P0 | Upgrade pillar cards with piece counts, subcategory tags, and trust seals |
| **Affordable Student Finds Section** | Home | Missing | P1 | Restore section using budget items from RE:READ and RE:USE |
| **Curated For Your Taste Section** | Home | Missing | P1 | Restore aesthetic match cards with 98% match pill and reasoning |
| **Homepage Circular Math & Footprint CTA** | Home | Missing | P1 | Restore Section 8 impact ledger visualizer and calculator trigger |
| **Top Quick-Filter Pills** | Marketplace | Missing | P1 | Add horizontal filter chips row above marketplace grid |
| **Grid View vs. List/Agenda View Switcher** | Marketplace | Missing | P2 | Add layout toggle state in `app/marketplace/page.tsx` |
| **Circularity Assurance Protocol Card** | Marketplace | Missing | P2 | Add trust assurance card in filter sidebar |
| **Categories Hub Six Stream Showcases** | Categories | Missing | P0 | Restore 6 full-width stream sections with subcategory chips and featured items |
| **Categories Cross-Stream Directory** | Categories | Missing | P1 | Restore 6-column taxonomy directory index at bottom of page |
| **PDP Curator Notes & Storytelling Section** | Product Detail | Missing | P1 | Restore Section 2 with 3 large impact callouts |
| **PDP Curation Harmonization ("Pairs Well")** | Product Detail | Partial | P1 | Enhance related items into cross-category complementary pairings |
| **PDP Circular Passport & Offer Action** | Product Detail | Missing | P2 | Add passport badge and "Make an Offer" drawer trigger |
| **AI Concierge Multi-Bundle Interface** | AI Finder | Missing | P1 | Add multi-item bundle layout with "Bundle All" CTA |
| **"Why This Was Chosen" Reasoning Card** | AI Finder | Missing | P1 | Add right-column curatorial breakdown with budget utilization meter |
| **Visual Search & Voice Note Entry Points** | AI Finder | Missing | P2 | Add UI action triggers in prompt bar (labeled as prototype mode) |
| **Alternate Swap Candidates Drawer** | AI Finder | Missing | P2 | Add swap candidates rail allowing one-click product replacement |
| **Sell Studio Side-by-Side Split Screen** | Sell / Give | Missing | P1 | Convert form into two-column layout with live real-time preview card |
| **Sell Studio Tone Selector & Multi-Viewport** | Sell / Give | Missing | P2 | Add tone switcher chips and multi-slot photo frames |
| **My Listings Curator Profile Header** | My Listings | Missing | P1 | Restore Maya Krishnan curator header with stats |
| **My Listings Status Tabs** | My Listings | Missing | P1 | Add Active, Reserved, Sold, Drafts, Community tabs |
| **My Listings Counter-Offers & Demand Sidebar**| My Listings | Missing | P2 | Add right-column sidebar widgets with mock interactive offers |
| **Interactive Personal Footprint Calculator** | Impact | Missing | P1 | Restore interactive sliders with live carbon, water, and rupee math |
| **Stories of Circular Revival (Case Studies)** | Impact | Missing | P2 | Restore 3 before/after transformation cards |
| **Methodology & Open Protocol Alliances** | Impact | Missing | P2 | Restore governance section and open data badges |

---

## 5. Technical Impact & Feasibility Assessment

### 5.1 Component Inventory & Architecture
To implement the restoration cleanly without rewriting existing working pages, the following modular components should be created or updated:

| Component | Target Location | Type | Reusable Dependencies |
|---|---|---|---|
| `Navbar.tsx` | `components/Navbar.tsx` | Modification | Update brand logo, search pill, avatar |
| `BrandLogo.tsx` | `components/BrandLogo.tsx` | New Component | Renders logo image + Playfair wordmark |
| `PillarCard.tsx` | `components/home/PillarCard.tsx` | New Component | High-fidelity pillar card with badges |
| `StudentFinds.tsx` | `components/home/StudentFinds.tsx` | New Component | Student budget discovery carousel/grid |
| `AestheticMatch.tsx` | `components/home/AestheticMatch.tsx`| New Component | 98% match reasoning card |
| `StreamShowcase.tsx` | `components/categories/StreamShowcase.tsx` | New Component | Full-width category showcase section |
| `TaxonomyDirectory.tsx`| `components/categories/TaxonomyDirectory.tsx` | New Component | 6-column cross-stream directory table |
| `ProductStorytelling.tsx`| `components/product/ProductStorytelling.tsx` | New Component | 3 impact metric callouts & provenance |
| `CurationHarmonization.tsx`| `components/product/CurationHarmonization.tsx` | New Component | Cross-stream complementary pairings |
| `BundleCard.tsx` | `components/ai-finder/BundleCard.tsx` | New Component | 3-item multi-product bundle card |
| `WhyChosenCard.tsx` | `components/ai-finder/WhyChosenCard.tsx` | New Component | Curatorial breakdown & budget meter |
| `LiveListingPreview.tsx`| `components/sell/LiveListingPreview.tsx` | New Component | Real-time preview card for Sell studio |
| `FootprintCalculator.tsx`| `components/impact/FootprintCalculator.tsx` | New Component | Interactive sliders for carbon/water math |

### 5.2 State Management & Backend Integrations
- **No Database Changes Needed**: The application is powered by `data/products.json` (180 verified products) and React Context (`lib/context.tsx`). All new sections will query the existing 180 products using existing category, price, and tag filters.
- **AI Finder Backend Preserved**: The existing Gemini API route (`app/api/ai-finder/route.ts`) remains the single source of truth for semantic search. The UI will simply package the returned products into the richer Stitch bundle card format.
- **Prototype Feature Distinction**: Features that simulate marketplace infrastructure (e.g. Counter-Offer negotiation, Blockchain Ledger ID, Verified Escrow) will be implemented as interactive demo UI with explicit prototype tooltips/badges to avoid fabricating compliance claims.

### 5.3 Performance & Bundle Budget Considerations
- **Image Optimization**: All images in the Stitch design must continue using Next.js `<Image />` with explicit `sizes` and standard responsive breakpoints.
- **Dynamic Imports**: Interactive calculators (`FootprintCalculator.tsx`) and heavy modals can be loaded via `next/dynamic` with `ssr: false` to keep initial route bundle sizes minimal.
- **Tailwind v4 Efficiency**: All design tokens already exist in `tailwind.config.ts`; using token utility classes will not increase CSS bundle size.

---

## 6. Prioritized Implementation Roadmap

Following approval of this audit, restoration should proceed in **seven logical phases**:

### Phase 1 — Branding & Navigation Shell (Low Risk, High Visual Impact)
- Recover original Stitch logo asset into `public/images/brand/logo.png`.
- Update `components/Navbar.tsx` with logo image, editorial wordmark, `⌘K` search pill, and profile avatar.
- Standardize header elevation, typography tokens, and wishlist badge.

### Phase 2 — Homepage Editorial Experience & The Missing Pillars
- Rebuild Section 3 (Six Curated Pillars) with complete metadata badges, item counts, and hover arrow animations.
- Upgrade Section 2 into the 4-metric trust strip (`14,200+ Artefacts`, `32.4 Tons CO₂`, `100% Direct Payout`, `Verified Logistics`).
- Restore Section 6 (Affordable Student Finds) with budget essentials from RE:READ and RE:USE.
- Restore Section 7 (Curated For Your Taste) with aesthetic match reasoning card.
- Restore Section 8 (The Circular Math) with footprint calculator CTA and ledger progress visualizer.

### Phase 3 — Categories Hub Overhaul
- Transform `app/categories/page.tsx` from the 77-line placeholder into the full editorial hub.
- Add sticky quick-anchor navigation pill bar (`[01 // RE:WEAR] ... [06 // RE:SOURCE]`).
- Implement 6 full-width Stream Showcases (`stream-anchor`) with subcategory chips and featured products.
- Add the 6-column Cross-Stream Directory at the bottom.

### Phase 4 — Product Detail Storytelling & Cross-Stream Curation
- Add Section 2: "The Philosophy of Visible Mending" / "Curator Notes" with the 3 large impact callouts (`Water Spared`, `Longevity`, `Infinite Circularity`).
- Replace single-category related items with Section 3: "Pairs Well with These Circular Finds" (cross-stream curation harmonization).
- Add Blockchain Circular Passport badge and "Make an Offer" modal trigger.

### Phase 5 — AFTERLIFE AI Concierge Restoration
- Rebrand header to **AFTERLIFE AI Concierge**.
- Add Visual Search (`add_a_photo`) and Voice Note (`mic`) entry point triggers to prompt bar.
- Restructure assistant response workspace into the 2-column Stitch layout (Left: 3-item curated bundle with "Bundle All" CTA; Right: "Why This Was Chosen" reasoning card with budget target utilization meter).
- Add "Swap Item" alternate candidates drawer.

### Phase 6 — Sell / Give Studio & My Listings Dashboard
- Refactor `app/sell/page.tsx` into the side-by-side split screen with real-time live curatorial preview on the right.
- Add tone selector chips (`Archival / Poetic`, `Technical / Precise`, `Casual Thrift`).
- Rebuild `app/my-listings/page.tsx` with the Maya Krishnan curator profile header, status tabs, counter-offers widget, and demand surge alerts.

### Phase 7 — Impact & Circulation Ledger
- Upgrade `app/impact/page.tsx` with the 4 telemetry KPI cards.
- Implement the Interactive Personal Circular Footprint Calculator with live sliders and dynamic math.
- Add the 3 Stories of Circular Revival case studies and open governance methodology section.

---

## 7. Next Steps & Approval Gate

In accordance with the prompt's critical instructions:
- **No application code has been modified during this audit.**
- **The complete gap analysis report is persisted in `docs/AFTERLIFE_STITCH_GAP_ANALYSIS.md`.**
- **Awaiting user review and authorization before proceeding to implementation.**
