import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, listingType, condition } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ fallback: true });
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

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const suggestions = JSON.parse(cleaned);

    return NextResponse.json({ suggestions, fallback: false });
  } catch (err) {
    console.error("AI listing generator error:", err);
    return NextResponse.json({ fallback: true });
  }
}
