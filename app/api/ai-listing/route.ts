import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 8000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, listingType, condition } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ fallback: true, reason: "no_api_key" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are helping a seller create a listing on AFTERLIFE, an Indian circular marketplace.
Based on the information provided, suggest improved listing content.
Return ONLY valid JSON (no markdown).

Input:
- Title: ${title || "not provided"}
- Description: ${description || "not provided"}
- Category: ${category || "not provided"}
- Listing Type: ${listingType || "not provided"}
- Condition: ${condition || "not provided"}

Return JSON:
{
  "suggestedTitle": "improved title (max 80 chars)",
  "suggestedDescription": "compelling 2-3 sentence description highlighting sustainability and value",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3"],
  "pricingNote": "one sentence about pricing if relevant, or null"
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const result = await model.generateContent(prompt);
      clearTimeout(timeoutId);

      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      const parsed = JSON.parse(cleaned);

      const suggestions = {
        suggestedTitle: typeof parsed.suggestedTitle === "string" ? parsed.suggestedTitle.slice(0, 100) : undefined,
        suggestedDescription: typeof parsed.suggestedDescription === "string" ? parsed.suggestedDescription : undefined,
        suggestedKeywords: Array.isArray(parsed.suggestedKeywords)
          ? parsed.suggestedKeywords.filter((k: unknown) => typeof k === "string").slice(0, 6)
          : [],
        pricingNote: typeof parsed.pricingNote === "string" ? parsed.pricingNote : null,
      };

      return NextResponse.json({ suggestions, fallback: false });
    } catch (innerErr) {
      clearTimeout(timeoutId);
      console.error("Gemini AI listing generation error:", innerErr);
      return NextResponse.json({ fallback: true, reason: "gemini_error" });
    }
  } catch (err) {
    console.error("AI listing generator error:", err);
    return NextResponse.json({ fallback: true, reason: "server_error" });
  }
}
