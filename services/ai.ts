
import { UserData } from "../types";

interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

let history: Message[] = [];

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

  history = [
      { role: "system", content: systemInstruction }
  ];
};

export const sendMessageToPaimon = async (message: string): Promise<string> => {
  const puter = (window as any).puter;
  if (!puter) return "Paimon can't find the Puter library! (Script not loaded)";
  
  // Add user message to history
  history.push({ role: "user", content: message });

  try {
      // Puter AI chat call
      const response = await puter.ai.chat(history);
      
      // Handle response parsing
      let text = "";
      if (typeof response === 'string') {
          text = response;
      } else if (typeof response === 'object' && response !== null) {
          // @ts-ignore
          text = response.message?.content || response.content || "Paimon is confused.";
      } else {
          text = "Paimon is speechless!";
      }

      // Add assistant response to history
      history.push({ role: "assistant", content: text });
      
      return text;
  } catch (e) {
      console.error(e);
      // Remove the last user message if it failed, or just inform user
      return "Paimon ran into a slime and lost the connection! (AI Error)";
  }
}
