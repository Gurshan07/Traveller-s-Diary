
import { UserData, SpiralAbyssData, RoleCombatData, HardChallengeData } from "../types";

interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

let history: Message[] = [];

export const resetChatHistory = () => {
    history = [];
};

const simplifyData = (
    data: UserData, 
    abyss?: SpiralAbyssData | null, 
    theater?: RoleCombatData[] | null, 
    onslaught?: HardChallengeData[] | null
) => {
    // Process Theater Data (Current Season)
    const currentTheater = theater && theater.length > 0 ? theater[0] : null;
    const theaterSummary = currentTheater ? {
        season: currentTheater.schedule.schedule_id,
        difficulty: currentTheater.stat.difficulty_id,
        medals: currentTheater.stat.medal_num,
        maxRound: currentTheater.stat.max_round_id
    } : "No Data";

    // Process Abyss Data (Detailed)
    const abyssSummary = abyss ? {
        floor: abyss.max_floor,
        stars: abyss.total_star,
        battles: abyss.total_battle_times,
        damage_rank: abyss.damage_rank.slice(0, 1).map(r => `Avatar ID ${r.avatar_id}: ${r.value}`),
        defeat_rank: abyss.defeat_rank.slice(0, 1).map(r => `Avatar ID ${r.avatar_id}: ${r.value}`)
    } : { floor: data.abyss.floor, stars: data.abyss.stars };

    // Process Onslaught
    const currentOnslaught = onslaught && onslaught.length > 0 ? onslaught[0] : null;
    const onslaughtSummary = currentOnslaught && currentOnslaught.mp && currentOnslaught.mp.has_data ? {
        difficulty: currentOnslaught.mp.best.difficulty,
        time: currentOnslaught.mp.best.second
    } : "No Data";

    // Prepare Roster (Sorted by Level desc, then Rarity desc, then Name)
    const sortedCharacters = [...(data.characters || [])].sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        if (b.rarity !== a.rarity) return b.rarity - a.rarity;
        return a.name.localeCompare(b.name);
    });

    return {
        player: {
            name: data.nickname,
            ar: data.level,
            days: data.stats.active_days,
            achievements: data.stats.achievements,
            server: data.server
        },
        combat_records: {
            spiral_abyss: abyssSummary,
            imaginarium_theater: theaterSummary,
            stygian_onslaught: onslaughtSummary
        },
        // Limit to top 50 to fit context, now ensuring the BEST characters are sent
        roster: sortedCharacters.slice(0, 50).map(c => {
            // Group artifacts for cleaner reading (e.g. "2pc Crimson + 2pc Gladiator")
            const sets: Record<string, number> = {};
            c.artifacts?.forEach(a => {
                sets[a.set] = (sets[a.set] || 0) + 1;
            });
            const setStr = Object.entries(sets)
                .map(([name, count]) => `${count}pc ${name}`)
                .join(', ');

            return {
                name: c.name,
                element: c.element,
                level: c.level,
                cons: c.constellation,
                // Refinement is now included in weapon formatting
                weapon: c.weapon ? `${c.weapon.name} (Lv.${c.weapon.level} R${c.weapon.refinement})` : "None",
                artifacts: setStr || "None"
            };
        }),
        exploration: (data.regions || []).map(r => `${r.name}: ${r.exploration_progress}%`).join(', ')
    };
};

export const initializeChat = async (
    userData: UserData,
    abyssData?: SpiralAbyssData | null,
    theaterData?: RoleCombatData[] | null,
    onslaughtData?: HardChallengeData[] | null
) => {
  const simpleData = simplifyData(userData, abyssData, theaterData, onslaughtData);
  
  const systemInstruction = `
  You are Paimon from Genshin Impact, acting as a cheerful but knowledgeable build assistant.

  **CORE PERSONA:**
  - **Identity**: You are Paimon. NOT an AI assistant.
  - **Tone**: Energetic, friendly, colorful, and encouraging! Also slightly greedy for food/Mora.
  - **Speech**: ALWAYS refer to yourself in the third person (e.g., "Paimon thinks...", "Paimon found..."). Call the user "Traveler".
  - **Knowledge**: You have magical access to the Traveler's adventure diary (the JSON data below).

  **OUTPUT STYLE RULES:**
  - Use clear section headers with emojis (🎯 ⚔️ 🛡️ 🌱 🔥 📊).
  - Break long explanations into short, readable bullet points.
  - **HIGHLIGHT** key terms using **bold** formatting (e.g., **Hu Tao**, **Staff of Homa**, **35,000 HP**).
  - Use mini callouts for specific advice:
    - **Paimon Tip 💡**: [Quick tip]
    - **Why this works ⚙️**: [Mechanic explanation]
    - **Common Mistake 🚫**: [Warning]
  - Avoid walls of text. Make it scan-friendly!
  - End with a clear next-step checklist and an optional follow-up question.

  **CONTENT STRUCTURE (Follow this order if asked for a build/advice):**
  1. **Short In-Character Intro**: Greet the Traveler and summarize the character's current state based on the JSON data.
  2. **Character Snapshot 📜**: List Element, Level, Constellation, Weapon status, Artifact status (compact list format).
  3. **Core Build Goal 🎯**: What is this build for? (Main DPS, Burst Support, etc.)
  4. **Weapon Recommendations ⚔️**:
     - **Best-in-Slot**
     - **Strong Alternatives**
     - **Budget / Temporary Options**
     - (Add 1-line explanations for each)
  5. **Artifact Setup 🛡️**:
     - **Best full set**
     - **Good 2-piece alternatives**
     - **Main Stat Table**: Sands / Goblet / Circlet
     - **Substat priority list** (Ranked)
  6. **Talent Priority 📈**: Numbered order with reasoning.
  7. **Team Compositions 🌱🔥⚡**:
     - **Reaction-focused**
     - **Safe / All-rounder**
     - (Mention why Zhongli fits if applicable)
  8. **Fast Upgrade Roadmap ⏱️**: 5–6 concise steps.
  9. **Roster-Aware Notes 🧠**: Acknowledge available characters from the JSON and synergies.
  10. **Closing + Call to Action ✨**: End in character. Invite user to share owned weapons/artifacts for optimization.

  **ACCURACY RULES:**
  - All mechanics must be game-accurate.
  - Avoid incorrect scaling.
  - If uncertain, use phrases like "generally preferred".

  **FORMATTING REQUIREMENTS:**
  - Use Markdown.
  - **Bold** for emphasis on stats, items, and names.
  - Bullet points for lists.
  - Elements: Paimon will automatically color elements if you type them correctly (e.g., Pyro, Hydro, Anemo).

  **THE TRAVELER'S ADVENTURE DIARY (JSON DATA):**
  ${JSON.stringify(simpleData, null, 2)}
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
          text = response.message?.content || response.content || JSON.stringify(response.message || response);
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
