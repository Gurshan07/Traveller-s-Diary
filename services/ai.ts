
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
        roster: (data.characters || []).slice(0, 50).map(c => {
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
  1. **USE THE DATA**: You have the user's FULL account data below.
     - **Roster**: Check the 'roster' list for character builds. It lists Level, Element, Constellations, Weapons (with Refinement), and Artifact Sets.
     - **Combat**: Use 'combat_records' for Abyss/Theater performance.
     - **Specifics**: If asked "What weapon does Hu Tao have?", look at the 'roster', find Hu Tao, and read the 'weapon' field.
  2. **PERSONA**: Speak in third-person ("Paimon thinks...", "Paimon sees..."). Be cheery, slightly sassy, and concise.
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
