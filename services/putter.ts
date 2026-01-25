
import { GoogleGenAI } from "@google/genai";
import { UserData } from "../types";

// Initialize AI with the environment key.
// Ensure your Vercel project has API_KEY defined in Environment Variables.
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getAccountInsights = async (data: UserData): Promise<string> => {
  if (!ai) {
    console.warn("API_KEY is missing. Paimon cannot connect to the server.");
    return "Paimon can't sense the API key! Please check your Vercel environment variables.";
  }

  try {
    // Construct a summarized version of the data to avoid token limits and keep focus
    const summary = {
      nickname: data.nickname,
      level: data.level,
      activeDays: data.stats.active_days,
      achievements: data.stats.achievements,
      characters: data.characters.length,
      topCharacters: data.characters
        .filter(c => c.rarity === 5 || c.level >= 80)
        .map(c => `${c.name} (Lv.${c.level}, C${c.constellation})`)
        .slice(0, 10),
      abyss: data.abyss.floor,
      oculi: data.stats.oculi_collected,
      chests: data.stats.chests_opened,
      exploration: data.regions.map(r => `${r.name}: ${r.exploration_progress}%`).join(', ')
    };

    const prompt = `
      You are Paimon from Genshin Impact. 
      Analyze the following Traveler's account data:
      ${JSON.stringify(summary, null, 2)}
      
      Your task:
      1. Give a short, witty summary of their progress.
      2. Comment on their dedication (active days, chests, achievements).
      3. Mention their team strength based on top characters.
      4. If they haven't 36-starred Abyss or maxed exploration, tease them gently like Paimon would.
      5. Keep it under 150 words.
      6. Use Paimon's third-person speaking style (e.g., "Paimon thinks...", "Traveler has been busy!").
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
