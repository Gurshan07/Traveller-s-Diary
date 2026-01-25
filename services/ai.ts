
import { UserData } from "../types";

interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

let history: Message[] = [];

const simplifyData = (data: UserData) => {
    return {
        player: {
            name: data.nickname,
            ar: data.level,
            days: data.stats.active_days,
            achievements: data.stats.achievements,
            abyss: data.abyss.floor
        },
        // Increased limit to 45 to ensure main characters are included
        // Shortened keys to keep token count efficient: n=name, w=weapon, a=artifacts, c=constellation
        roster: (data.characters || []).slice(0, 45).map(c => ({
            n: c.name,
            lvl: c.level,
            c: c.constellation,
            w: c.weapon ? `${c.weapon.name} (R${c.weapon.rarity})` : "No Weapon",
            sets: c.artifacts?.map(a => a.set).join('+') || "None"
        })),
        exploration: (data.regions || []).map(r => `${r.name}:${r.exploration_progress}%`).join(', ')
    };
};

export const initializeChat = async (userData: UserData) => {
  const simpleData = simplifyData(userData);
  
  const systemInstruction = `
  You are Paimon, the Traveler's guide and companion in Genshin Impact.
  
  **CRITICAL DIRECTIVES:**
  1. **USE THE DATA**: You have the user's ACTUAL account data below. **DO NOT GUESS.**
     - If asked "How is my Zhongli?", CHECK the 'roster' list first.
     - STATE what they are currently wearing (e.g., "Paimon sees you have Black Tassel equipped...").
     - If the character is not in the 'roster' list, say you can't find them in their top characters.
  2. **PERSONA**: Speak in third-person ("Paimon thinks...", "Paimon suggests..."). Be cheery, slightly sassy, and concise.
  3. **BREVITY**: Keep responses **SHORT** (max 3-4 sentences). NO long bullet lists. Write like a chat message, not a wiki guide.
  
  **ACCOUNT DATA:**
  ${JSON.stringify(simpleData)}
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
      // We pass the entire history array so the model remembers previous turns AND the system data
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
      // Remove the last user message if it failed so they can try again
      history.pop();
      return "Paimon ran into a slime and lost the connection! (AI Error)";
  }
}
