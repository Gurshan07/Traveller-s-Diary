
import { GoogleGenAI } from "@google/genai";
import { UserData } from "../types";

// The 'process.env.API_KEY' string is replaced by Vite at build time with the actual key value.
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to remove token-heavy fields that don't help the AI (images, icons, raw IDs)
const sanitizeDataForAI = (key: string, value: any) => {
  // Filter out image URLs and icon paths to save tokens
  if (key === 'image' || key === 'icon' || key === 'side_icon' || key === 'profileIcon') {
    return undefined;
  }
  // Filter out specific raw IDs that might confuse or bloat context
  if (key === 'avatar_icon' || key === 'boss_icon') {
    return undefined;
  }
  return value;
};

export const getAccountInsights = async (data: UserData): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Check your Vercel Project Settings or local .env file.");
    return "Paimon can't sense the API key! Please check your Vercel environment variables.";
  }

  try {
    // We send the full data object but stripped of visual assets.
    // Gemini Flash has a large context window (1M tokens), so it can handle the full roster/exploration data easily.
    const fullContextString = JSON.stringify(data, sanitizeDataForAI, 2);

    const prompt = `
      You are Paimon from Genshin Impact. 
      You have access to the Traveler's ENTIRE adventure log below.
      
      DATA:
      ${fullContextString}
      
      Your task:
      1. Analyze their account holistically. Look for patterns in their characters, weapons, and exploration.
      2. Point out specifically impressive feats (e.g., specific high-constellation characters, 100% exploration in difficult regions, rare achievements).
      3. If they are neglecting something (like a specific region, or have good characters at low levels), tease them about it.
      4. Comment on their "main" team based on the highest investment characters.
      5. Keep it under 200 words.
      6. Use Paimon's third-person speaking style (e.g., "Paimon thinks...", "Wow, Traveler!"). Be energetic and helpful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Paimon is hungry and can't think right now! Try again later!";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Paimon ran into a problem connecting to the Irminsul! (Error generating insights)";
  }
};
