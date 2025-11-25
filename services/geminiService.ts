import { GoogleGenAI } from "@google/genai";
import { NewsItem, MarketTicker } from "../types";

// Helper to ensure we don't crash if API key is missing (for demo purposes)
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API_KEY found in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeMarketSentiment = async (
  news: NewsItem[],
  tickers: MarketTicker[]
): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "API Key not configured. Please set process.env.API_KEY to generate AI insights.";
  }

  const newsSummary = news.map(n => `- ${n.headline} (${n.source})`).join('\n');
  const marketSummary = tickers.map(t => `${t.symbol}: $${t.price.toFixed(2)} (${t.changePercent > 0 ? '+' : ''}${t.changePercent.toFixed(2)}%)`).join(', ');

  const prompt = `
    You are an expert quantitative financial analyst. 
    Analyze the following market data and news headlines. 
    Provide a concise, professional risk assessment and potential trading opportunities.
    Limit response to 2 paragraphs.

    Current Market Data:
    ${marketSummary}

    Recent News:
    ${newsSummary}
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating analysis. Please check your network or API key quota.";
  }
};

export const explainStrategy = async (strategyName: string, recentPerformance: number): Promise<string> => {
  const client = getClient();
  if (!client) return "API Key missing.";

  const prompt = `
    Explain the core concept of the "${strategyName}" trading strategy in simple terms for a dashboard tooltip. 
    The strategy has had a recent performance of ${recentPerformance}%.
    Explain why it might be performing this way based on general market theory (bull/bear/sideways).
    Keep it under 100 words.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    return "Service unavailable.";
  }
};