import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { SearchIntent } from "@/lib/types";

const TIMEOUT_MS = 8000;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ fallback: true, reason: "no_api_key" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are a shopping intent extraction system for AFTERLIFE, an Indian circular marketplace.
Extract search intent from the user's query and return ONLY valid JSON (no markdown, no explanation).

Categories available:
- RE:WEAR: Pre-loved clothing, vintage fashion, jackets, jeans, shirts, sarees, shoes, accessories
- ROOTS: Handmade jewellery, pottery, handloom products, artisan crafts, traditional gifts, home decor
- RE:READ: Used textbooks, engineering books, programming books (DSA, C++, Java, Python, DBMS, OS, Networks, Math), novels, educational resources
- RE:MAKE: Upcycled furniture, recycled decor, hostel room decor, repurposed wood, lamps, DIY creations
- RE:USE: Pre-owned and refurbished electronics, headphones, keyboards, mice, monitors, speakers, cameras
- RE:SOURCE: Surplus fabric, packaging, boxes, yarn, scrap materials, craft supplies, deadstock

Listing types: pre_owned, handmade, upcycled, refurbished, surplus, free
Conditions: New, Mint, Excellent, Good, Fair, Restored, Refurbished

Respond with this exact JSON structure:
{
  "category": null or one of the category strings above (set to null if query spans multiple categories like "book and headphones"),
  "max_price": null or a number in INR,
  "min_price": null or a number in INR,
  "keywords": array of 1-5 specific product-relevant nouns/keywords in lowercase,
  "listing_types": array of listing type strings or empty array,
  "condition": null or one of the condition strings above
}

Rules:
- Budget: "under ₹500", "below 300", "maximum 500" -> set max_price
- Price range: "between ₹300 and ₹800" -> set min_price: 300, max_price: 800
- If the user asks for "refurbished", add "refurbished" to listing_types or condition
- If the user asks for "handmade", add "handmade" to listing_types
- Never invent product names or prices. Return only the extracted search criteria.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `User query: "${query.slice(0, 500)}"` },
      ]);
      clearTimeout(timeoutId);

      const text = result.response.text().trim();
      // Strip markdown code blocks if present
      const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      const intent: SearchIntent = JSON.parse(cleaned);

      // Validate and sanitise
      const validCategories = ["RE:WEAR", "ROOTS", "RE:READ", "RE:MAKE", "RE:USE", "RE:SOURCE"];
      const validTypes = ["pre_owned", "handmade", "upcycled", "refurbished", "surplus", "free"];
      const validConditions = ["New", "Mint", "Excellent", "Good", "Fair", "Restored", "Refurbished"];

      const sanitised: SearchIntent = {
        category:
          intent.category && validCategories.includes(intent.category)
            ? intent.category
            : null,
        max_price:
          typeof intent.max_price === "number" && intent.max_price > 0
            ? Math.round(intent.max_price)
            : null,
        min_price:
          typeof intent.min_price === "number" && intent.min_price > 0
            ? Math.round(intent.min_price)
            : null,
        keywords: Array.isArray(intent.keywords)
          ? intent.keywords
              .filter((k) => typeof k === "string")
              .slice(0, 5)
              .map((k) => k.toLowerCase())
          : [],
        listing_types: Array.isArray(intent.listing_types)
          ? (intent.listing_types.filter((t) => validTypes.includes(t)) as SearchIntent["listing_types"])
          : [],
        condition:
          intent.condition && validConditions.includes(intent.condition)
            ? (intent.condition as SearchIntent["condition"])
            : null,
      };

      return NextResponse.json({ intent: sanitised, fallback: false });
    } catch (innerErr) {
      clearTimeout(timeoutId);
      console.error("Gemini error:", innerErr);
      return NextResponse.json({ fallback: true, reason: "gemini_error" });
    }
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ fallback: true, reason: "parse_error" });
  }
}
