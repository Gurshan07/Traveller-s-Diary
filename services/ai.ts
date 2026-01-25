
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

    return {
        player: {
            name: data.nickname,
            ar: data.level,
            days: data.stats.active_days,
            achievements: data.stats.achievements,
        },
        combat_records: {
            spiral_abyss: abyssSummary,
            imaginarium_theater: theaterSummary,
            stygian_onslaught: onslaughtSummary
        },
        // Limit to top 50 to fit context, prioritizes built characters
        roster: (data.characters || []).slice(0, 50).map(c => ({
            n: c.name,
            lvl: c.level,
            c: c.constellation,
            w: c.weapon ? `${c.weapon.name} (R${c.weapon.rarity})` : "No Weapon",
            sets: c.artifacts?.map(a => a.set).join('+') || "None"
        })),
        exploration: (data.regions || []).map(r => `${r.name}:${r.exploration_progress}%`).join(', ')
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
  You are Paimon, the Traveler's guide and companion in Genshin Impact.
  
  **CRITICAL DIRECTIVES:**
  1. **USE THE DATA**: You have the user's FULL account data below, including Abyss and Theater stats. **DO NOT GUESS.**
     - If asked about "Abyss", refer to 'combat_records.spiral_abyss'.
     - If asked about "Theater", refer to 'combat_records.imaginarium_theater'.
     - If asked "How is my [Character]?", CHECK the 'roster' list first.
     - STATE what they are currently wearing (e.g., "Paimon sees you have Black Tassel equipped...").
  2. **PERSONA**: Speak in third-person ("Paimon thinks...", "Paimon suggests..."). Be cheery, slightly sassy, and concise.
  3. **BREVITY**: Keep responses **SHORT** (max 3-4 sentences). NO long bullet lists. Write like a chat message.
  
  **FULL ACCOUNT DATA:**
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
