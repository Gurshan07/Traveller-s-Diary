
import { UserData } from "../types";

export const getAccountInsights = async (data: UserData): Promise<string> => {
  try {
    // Access the global puter object loaded via the script tag in index.html
    // This avoids bundling the NPM package which can cause "unref is not a function" errors in browsers.
    const puter = (window as any).puter;

    if (!puter) {
        throw new Error("Puter.js library not loaded");
    }

    // 1. Construct a simplified data object to save tokens.
    // Sending the entire UserData object with all artifacts/weapons/regions often exceeds context limits.
    const summary = {
        nickname: data.nickname,
        ar: data.level,
        server: data.server,
        stats: data.stats,
        // Only take top 12 characters (usually the built ones) to save space
        characters: (data.characters || []).slice(0, 12).map(c => ({
            name: c.name,
            element: c.element,
            level: c.level,
            rarity: c.rarity,
            constellation: c.constellation,
            friendship: c.friendship,
            weapon: c.weapon ? { name: c.weapon.name, rarity: c.weapon.rarity, level: c.weapon.level } : null,
            sets: c.artifacts?.map(a => a.set) // Just set names, not details
        })),
        // Simplify regions to just name and percentage
        exploration: (data.regions || []).map(r => ({
            name: r.name,
            progress: r.exploration_progress,
            level: r.reputation_level
        })),
        abyss: data.abyss
    };

    const paimonPrompt = `
      You are Paimon, the travel companion from Genshin Impact.
      
      TONE & STYLE:
      - Speak in third person ("Paimon thinks...", "Paimon wonders...").
      - Be energetic, slightly cheeky, food-obsessed, and helpful.
      - Use exclamation marks!
      - Do NOT be overly robotic. Be chatty.
      
      TASK:
      Analyze the Traveler's (user's) game data provided below.
      
      1. **Summary**: Give a quick, punchy summary of their Adventure Rank and days active.
      2. **Roster Check**: Look at their top characters.
         - If they have many Level 90s, praise their dedication.
         - If they have C6 4-stars or high constellation 5-stars, act impressed (or jealous of their luck).
         - Mention their "Main" element based on the provided characters.
      3. **Exploration**: Look at region progress.
         - If exploration is low (<60%), tell them to stop slacking off and go exploring!
         - If it's high (100%), call them a treasure hunter maniac.
      4. **Collections**: Comment on their chest count or achievement count.
      
      CONSTRAINTS:
      - Keep the response under 150 words.
      - Do not output Markdown formatting like **bold** or # Headers, just plain text with normal punctuation.
      - Do not hallucinate data not present in the JSON.

      TRAVELER DATA:
      ${JSON.stringify(summary)}
    `;

    // Call Puter.js directly via the window object
    const response = await puter.ai.chat(paimonPrompt);
    
    // Handle different response structures from Puter.js versions
    let content = "";
    if (typeof response === 'string') {
        content = response;
    } else if (typeof response === 'object' && response !== null) {
        // @ts-ignore - Puter types might vary
        content = response.message?.content || response.content || JSON.stringify(response);
    } else {
        content = String(response);
    }

    // Basic cleanup if Paimon returns quotes
    content = content.replace(/^"|"$/g, '').trim();

    return content || "Paimon fell asleep and didn't write anything...";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Paimon ran into a problem connecting to the Irminsul! (AI Error)";
  }
};
