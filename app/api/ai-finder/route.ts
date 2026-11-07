import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getSeedProducts, resolveConversationalQuery } from "@/lib/data";
import { Product } from "@/lib/types";

const TIMEOUT_MS = 8000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.message || body.query;
    const conversationHistory: Array<{
      role: "user" | "assistant";
      content: string;
      productIds?: string[];
    }> = body.conversationHistory || [];

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Message or query is required" }, { status: 400 });
    }

    const trimmedQuery = query.trim();
    const allProducts = getSeedProducts();

    // Context from previous assistant message
    const lastAssistantMsg = [...conversationHistory].reverse().find((m) => m.role === "assistant");
    const previousProductIds = lastAssistantMsg?.productIds || [];

    // Deterministic catalogue retrieval layer (always provides grounded candidates)
    const localResolution = resolveConversationalQuery(allProducts, trimmedQuery, {
      previousProductIds,
    });

    const apiKey = process.env.GEMINI_API_KEY;

    // If no Gemini API key, immediately return high-quality grounded resolution
    if (!apiKey) {
      return NextResponse.json({
        message: localResolution.message,
        products: localResolution.products,
        suggestedFollowUps: localResolution.suggestedFollowUps,
        intent: localResolution.intent,
        aiUsed: false,
        fallback: true,
      });
    }

    // With Gemini API Key: Enhance with Gemini conversational reasoning
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      });

      // Prepare candidate summary for grounding
      const candidateList = localResolution.products.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category,
        condition: p.condition,
        tags: p.tags,
        description: p.description,
      }));

      const systemPrompt = `You are the AFTERLIFE AI Shopping Concierge, a friendly, intelligent, and helpful circular shopping assistant for an Indian sustainable marketplace.
Brand categories:
- RE:WEAR (pre-loved & vintage fashion)
- ROOTS (handmade artisan Indian crafts, pottery, handloom, tribal art)
- RE:READ (used textbooks, DSA/programming books, engineering references, literature)
- RE:MAKE (upcycled furniture, hostel/room decor, salvaged wood lamps)
- RE:USE (pre-owned electronics, refurbished audio, monitors, keyboards, cameras)
- RE:SOURCE (surplus fabrics, packaging, deadstock materials)

CRITICAL RULES:
1. GROUNDING: Recommend ONLY from the provided CANDIDATES list. Never invent or hallucinate product names, IDs, prices, discounts, or specifications.
2. If CANDIDATES is empty, explain honestly that no items in the catalogue currently match the criteria, and suggest broad categories to explore.
3. CONVERSATIONAL TONE: Be warm, concise, and articulate. Highlight *why* an item fits the user's specific need (e.g. college room, coding, gifting, budget).
4. COMPARISONS / FOLLOW-UPS: If the user asks for comparison or follow-ups ("cheaper", "second one", "which is better"), compare based solely on the provided candidate details.
5. Provide 3 short, interactive follow-up prompts the user could click next.

Output MUST be strictly valid JSON (no markdown formatting, no code fence):
{
  "message": "Your conversational response to the user",
  "recommendedProductIds": ["id1", "id2"],
  "suggestedFollowUps": ["Follow-up 1", "Follow-up 2", "Follow-up 3"]
}`;

      const historySummary = conversationHistory
        .slice(-4)
        .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`)
        .join("\n");

      const prompt = `Conversation history:
${historySummary || "None (new conversation)"}

Current user message: "${trimmedQuery}"

REAL CATALOGUE CANDIDATES:
${JSON.stringify(candidateList, null, 2)}

Respond with the JSON object.`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const result = await model.generateContent([
        { text: systemPrompt },
        { text: prompt },
      ]);
      clearTimeout(timeoutId);

      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      const parsed = JSON.parse(cleaned);

      // Verify and resolve recommended product IDs
      const recommendedIds: string[] = Array.isArray(parsed.recommendedProductIds)
        ? parsed.recommendedProductIds
        : [];

      const matchedProducts: Product[] = [];
      for (const id of recommendedIds) {
        const found = allProducts.find((p) => p.id === id);
        if (found) matchedProducts.push(found);
      }

      // If Gemini returned valid products, use them; otherwise use localResolution products
      const finalProducts = matchedProducts.length > 0 ? matchedProducts : localResolution.products;

      return NextResponse.json({
        message: parsed.message || localResolution.message,
        products: finalProducts,
        suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps) && parsed.suggestedFollowUps.length > 0
          ? parsed.suggestedFollowUps.slice(0, 3)
          : localResolution.suggestedFollowUps,
        intent: localResolution.intent,
        aiUsed: true,
        fallback: false,
      });
    } catch (geminiError) {
      console.warn("Gemini call failed or timed out, using deterministic catalogue resolver:", geminiError);
      return NextResponse.json({
        message: localResolution.message,
        products: localResolution.products,
        suggestedFollowUps: localResolution.suggestedFollowUps,
        intent: localResolution.intent,
        aiUsed: false,
        fallback: true,
      });
    }
  } catch (err) {
    console.error("API error in /api/ai-finder:", err);
    return NextResponse.json({
      error: "Internal server error",
      fallback: true,
    }, { status: 500 });
  }
}
