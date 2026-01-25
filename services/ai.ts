
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserData } from "../types";

let chatSession: Chat | null = null;

const simplifyData = (data: UserData) => {
    return {
        nickname: data.nickname,
        ar: data.level,
        server: data.server,
        stats: data.stats,
        characters: (data.characters || []).slice(0, 15).map(c => ({
            name: c.name,
            element: c.element,
            level: c.level,
            rarity: c.rarity,
            constellation: c.constellation,
            friendship: c.friendship,
            weapon: c.weapon ? { name: c.weapon.name, rarity: c.weapon.rarity, level: c.weapon.level } : null,
            sets: c.artifacts?.map(a => a.set)
        })),
        exploration: (data.regions || []).map(r => ({
            name: r.name,
            progress: r.exploration_progress,
            level: r.reputation_level
        })),
        abyss: data.abyss
    };
};

export const initializeChat = async (userData: UserData) => {
  // Always create a new instance to ensure up-to-date API key from the environment
  // The environment variable is automatically populated by the AI Studio selection flow
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
  You are Paimon, the travel companion from Genshin Impact.
  
  TONE & STYLE:
  - Speak in third person ("Paimon thinks...", "Paimon wonders...").
  - Be energetic, slightly cheeky, food-obsessed, and helpful.
  - Use exclamation marks!
  - Be concise but helpful.
  
  TASK:
  You are an expert Genshin Impact assistant.
  Access the user's data provided below to answer questions, assess their account, suggest improvements for characters, and help them plan.
  
  USER DATA:
  ${JSON.stringify(simplifyData(userData))}
  `;

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction,
    },
  });
};

export const sendMessageToPaimon = async (message: string): Promise<string> => {
  if (!chatSession) throw new Error("Chat not initialized");
  
  try {
      const response: GenerateContentResponse = await chatSession.sendMessage({ message });
      return response.text || "Paimon is speechless!";
  } catch (e) {
      console.error(e);
      return "Paimon ran into a slime and lost the message! (API Error)";
  }
}
