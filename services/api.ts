import { UserData, RegionData, Character, Stats, ElementType, WeaponType, Achievement, SpiralAbyssData, Home, CharacterDetailData, Property, HardChallengeData, RoleCombatData } from '../types';

// Points to the Vercel Serverless Function defined in api/game_record.js
const PROXY_PATH = '/api/game_record';

export interface AuthCredentials {
  ltuid: string;
  ltoken: string;
}

const CACHE_PREFIX = 'genshin_char_detail_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper to format server name from ID
const formatServerName = (server: string): string => {
  const map: Record<string, string> = {
    'os_asia': 'Asia',
    'os_usa': 'America',
    'os_euro': 'Europe',
    'os_cht': 'TW, HK, MO'
  };
  return map[server] || server;
};

// Helper to get weapon type from ID
const getWeaponType = (type: number): WeaponType => {
  switch (type) {
    case 1: return 'Sword';
    case 11: return 'Claymore';
    case 12: return 'Bow';
    case 13: return 'Polearm';
    case 10: return 'Catalyst';
    default: return 'Sword';
  }
};

// Helper to infer element from region name
const getRegionElement = (name: string): ElementType => {
  if (name.includes('Mondstadt')) return 'Anemo';
  if (name.includes('Liyue')) return 'Geo';
  if (name.includes('Inazuma')) return 'Electro';
  if (name.includes('Sumeru')) return 'Dendro';
  if (name.includes('Fontaine')) return 'Hydro';
  if (name.includes('Natlan')) return 'Pyro';
  if (name.includes('Snezhnaya')) return 'Cryo';
  return 'Anemo';
};

// Helper to get credentials from local storage
const getStoredCredentials = (): AuthCredentials | null => {
  const stored = localStorage.getItem('genshin_tracker_credentials');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const authenticateAndFetchData = async (credentials: AuthCredentials): Promise<UserData> => {
  if (!credentials.ltuid || !credentials.ltoken) {
    throw new Error('Invalid credentials. Please provide both ltuid_v2 and ltoken_v2.');
  }

  try {
    console.log('Frontend: Fetching account list...');
    
    const queryParams = new URLSearchParams({
      ltuid_v2: credentials.ltuid,
      ltoken_v2: credentials.ltoken,
      endpoint: 'list'
    });

    const listResponse = await fetch(`${PROXY_PATH}?${queryParams.toString()}`, { method: 'GET' });
    const listJson = await listResponse.json();

    if (listJson.retcode !== 0) {
      throw new Error(listJson.message || 'Failed to fetch account list');
    }

    const genshinAccount = listJson.data?.list?.find((acc: any) => acc.game_id === 2);
    
    if (!genshinAccount) {
      throw new Error('No Genshin Impact account found on this HoYoLab ID.');
    }

    const { region, game_role_id: uid, nickname, level } = genshinAccount;
    // Map server name right away
    const displayServer = formatServerName(region);
    
    console.log(`Found account: ${nickname} (${uid}) on ${displayServer}`);

    console.log('Frontend: Fetching detailed game record...');
    const detailsParams = new URLSearchParams({
      ltuid_v2: credentials.ltuid,
      ltoken_v2: credentials.ltoken,
      endpoint: 'details',
      server: region, // Use original technical region ID for API call
      role_id: uid
    });

    const detailsResponse = await fetch(`${PROXY_PATH}?${detailsParams.toString()}`, { method: 'GET' });
    const detailsJson = await detailsResponse.json();

    if (detailsJson.retcode !== 0) {
      throw new Error(detailsJson.message || 'Failed to fetch detailed game data');
    }

    const data = detailsJson.data || {};
    
    // --- MAPPING DATA ---
    const rawStats = data.stats || {};
    const stats: Stats = {
      active_days: rawStats.active_day_number || 0,
      achievements: rawStats.achievement_number || 0,
      characters_obtained: rawStats.avatar_number || 0,
      spiral_abyss: rawStats.spiral_abyss || "-",
      oculi_collected: 
        (rawStats.anemoculus_number || 0) + 
        (rawStats.geoculus_number || 0) + 
        (rawStats.electroculus_number || 0) + 
        (rawStats.dendroculus_number || 0) + 
        (rawStats.hydroculus_number || 0) + 
        (rawStats.pyroculus_number || 0),
      chests_opened: 
        (rawStats.common_chest_number || 0) + 
        (rawStats.exquisite_chest_number || 0) + 
        (rawStats.precious_chest_number || 0) + 
        (rawStats.luxurious_chest_number || 0) + 
        (rawStats.magic_chest_number || 0),
      chest_breakdown: {
        common: rawStats.common_chest_number || 0,
        exquisite: rawStats.exquisite_chest_number || 0,
        precious: rawStats.precious_chest_number || 0,
        luxurious: rawStats.luxurious_chest_number || 0,
        magic: rawStats.magic_chest_number || 0,
      },
      oculi_breakdown: {
        anemoculi: rawStats.anemoculus_number || 0,
        geoculi: rawStats.geoculus_number || 0,
        electroculi: rawStats.electroculus_number || 0,
        dendroculi: rawStats.dendroculus_number || 0,
        hydroculi: rawStats.hydroculus_number || 0,
        pyroculi: rawStats.pyroculus_number || 0,
      }
    };

    let characters: Character[] = (data.avatars || []).map((char: any) => ({
      id: char.id.toString(),
      name: char.name,
      element: char.element as ElementType,
      rarity: char.rarity > 5 ? 5 : char.rarity as 4 | 5,
      level: char.level,
      friendship: char.fetter,
      constellation: char.actived_constellation_num,
      image: char.image,
      // Default placeholder if weapon data is missing in summary
      weapon: {
        name: char.weapon?.name || 'Unknown Weapon',
        rarity: char.weapon?.rarity || 1,
        level: char.weapon?.level || 1,
        type: getWeaponType(char.weapon?.type || 1),
      },
      artifacts: (char.relics || []).map((relic: any) => ({
        set: relic.set?.name || relic.relic_set_name || 'Unknown Set',
        count: 1
      }))
    }));

    // --- Bulk Fetch Detailed Character Info (to get Weapon/Artifacts correctly) ---
    if (characters.length > 0) {
        try {
            console.log('Frontend: Fetching bulk character details for weapon info...');
            const charIds = characters.map(c => Number(c.id));
            
            // Call the character_detail endpoint with all IDs
            const bulkDetailsResponse = await fetch(`${PROXY_PATH}?${new URLSearchParams({
                ltuid_v2: credentials.ltuid,
                ltoken_v2: credentials.ltoken,
                endpoint: 'character_detail',
                server: region,
                role_id: uid
            }).toString()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role_id: uid,
                    server: region,
                    character_ids: charIds
                })
            });

            const bulkDetailsJson = await bulkDetailsResponse.json();

            if (bulkDetailsJson.retcode === 0 && bulkDetailsJson.data?.list) {
                const detailMap = new Map(bulkDetailsJson.data.list.map((d: any) => [d.base.id.toString(), d]));

                characters = characters.map(char => {
                    const detail: any = detailMap.get(char.id);
                    if (detail) {
                        return {
                            ...char,
                            weapon: {
                                name: detail.weapon.name,
                                rarity: detail.weapon.rarity,
                                level: detail.weapon.level,
                                type: getWeaponType(detail.weapon.type),
                            },
                            artifacts: (detail.relics || []).map((r: any) => ({
                                set: r.set?.name || r.relic_set_name,
                                count: 1
                            }))
                        };
                    }
                    return char;
                });
            } else {
                console.warn("Bulk character details fetch returned non-zero retcode or empty list", bulkDetailsJson);
            }
        } catch (e) {
            console.warn("Failed to fetch bulk character details", e);
        }
    }

    const regions: RegionData[] = (data.world_explorations || [])
      .filter((region: any) => region.id > 0)
      .map((region: any) => ({
        id: region.id.toString(),
        name: region.name,
        element: getRegionElement(region.name),
        exploration_progress: region.exploration_percentage / 10,
        reputation_level: region.level,
        max_reputation_level: 10,
        statue_level: region.seven_statue_level || 0,
        offerings: (region.offerings || []).map((off: any) => ({
            name: off.name,
            level: off.level,
            icon: off.icon
        })),
        image: region.background_image || region.cover || region.icon,
        icon: region.icon,
        parentId: region.parent_id,
        type: region.type,
        subRegions: (region.area_exploration_list || []).map((sub: any) => ({
            name: sub.name,
            exploration_percentage: sub.exploration_percentage / 10
        })),
        bosses: (region.boss_list || []).map((boss: any) => ({
            name: boss.name,
            kill_num: boss.kill_num
        }))
      }));

    const homes: Home[] = (data.homes || []).map((home: any) => ({
        level: home.level,
        visit_num: home.visit_num,
        comfort_num: home.comfort_num,
        item_num: home.item_num,
        name: home.name,
        icon: home.icon,
        comfort_level_name: home.comfort_level_name,
        comfort_level_icon: home.comfort_level_icon
    }));

    return {
      nickname: (data.role && data.role.nickname) || nickname,
      uid: uid,
      server: displayServer, 
      level: (data.role && data.role.level) || level,
      profileIcon: (data.role && data.role.game_head_icon) || "",
      stats: stats,
      characters: characters,
      regions: regions,
      homes: homes,
      abyss: {
        floor: stats.spiral_abyss,
        stars: 0,
        total_stars: 0,
        max_floor: stats.spiral_abyss,
        battles: (data.role_combat && data.role_combat.battle_count) || 0
      }
    };

  } catch (error) {
    console.error('Error fetching real data:', error);
    throw error;
  }
};

export const fetchAchievements = async (user: UserData): Promise<Achievement[]> => {
  const credentials = getStoredCredentials();
  if (!credentials) {
    throw new Error("No credentials found. Please log in again.");
  }
  
  const serverMap: Record<string, string> = {
      'Asia': 'os_asia',
      'America': 'os_usa',
      'Europe': 'os_euro',
      'TW, HK, MO': 'os_cht'
  };
  const technicalServer = serverMap[user.server] || user.server;

  const queryParams = new URLSearchParams({
    ltuid_v2: credentials.ltuid,
    ltoken_v2: credentials.ltoken,
    endpoint: 'achievements',
    server: technicalServer,
    role_id: user.uid
  });

  const response = await fetch(`${PROXY_PATH}?${queryParams.toString()}`, { method: 'GET' });
  const json = await response.json();

  if (json.retcode !== 0) {
    throw new Error(json.message || "Failed to fetch achievements");
  }

  const list = json.data?.list || [];

  return list.map((item: any) => ({
    id: parseInt(item.id),
    name: item.name,
    percentage: item.percentage,
    finish_num: item.finish_num,
    show_percent: item.show_percent,
    icon: item.icon
  }));
};

export const fetchSpiralAbyss = async (user: UserData, scheduleType: number = 1): Promise<SpiralAbyssData> => {
  const credentials = getStoredCredentials();
  if (!credentials) {
    throw new Error("No credentials found. Please log in again.");
  }

  const serverMap: Record<string, string> = {
      'Asia': 'os_asia',
      'America': 'os_usa',
      'Europe': 'os_euro',
      'TW, HK, MO': 'os_cht'
  };
  const technicalServer = serverMap[user.server] || user.server;

  const queryParams = new URLSearchParams({
    ltuid_v2: credentials.ltuid,
    ltoken_v2: credentials.ltoken,
    endpoint: 'spiral_abyss',
    server: technicalServer,
    role_id: user.uid,
    schedule_type: scheduleType.toString()
  });

  const response = await fetch(`${PROXY_PATH}?${queryParams.toString()}`, { method: 'GET' });
  const json = await response.json();

  if (json.retcode !== 0) {
    throw new Error(json.message || "Failed to fetch spiral abyss data");
  }

  return json.data;
};

export const fetchHardChallenges = async (user: UserData): Promise<HardChallengeData[]> => {
  const credentials = getStoredCredentials();
  if (!credentials) {
    throw new Error("No credentials found. Please log in again.");
  }

  const serverMap: Record<string, string> = {
      'Asia': 'os_asia',
      'America': 'os_usa',
      'Europe': 'os_euro',
      'TW, HK, MO': 'os_cht'
  };
  const technicalServer = serverMap[user.server] || user.server;

  const queryParams = new URLSearchParams({
    ltuid_v2: credentials.ltuid,
    ltoken_v2: credentials.ltoken,
    endpoint: 'hard_challenge',
    server: technicalServer,
    role_id: user.uid
  });

  const response = await fetch(`${PROXY_PATH}?${queryParams.toString()}`, { method: 'GET' });
  const json = await response.json();

  if (json.retcode !== 0) {
    throw new Error(json.message || "Failed to fetch onslaught data");
  }

  return json.data?.data || [];
};

export const fetchRoleCombat = async (user: UserData): Promise<RoleCombatData[]> => {
    const credentials = getStoredCredentials();
    if (!credentials) {
      throw new Error("No credentials found. Please log in again.");
    }
  
    const serverMap: Record<string, string> = {
        'Asia': 'os_asia',
        'America': 'os_usa',
        'Europe': 'os_euro',
        'TW, HK, MO': 'os_cht'
    };
    const technicalServer = serverMap[user.server] || user.server;
  
    const queryParams = new URLSearchParams({
      ltuid_v2: credentials.ltuid,
      ltoken_v2: credentials.ltoken,
      endpoint: 'role_combat',
      server: technicalServer,
      role_id: user.uid
    });
  
    const response = await fetch(`${PROXY_PATH}?${queryParams.toString()}`, { method: 'GET' });
    const json = await response.json();
  
    if (json.retcode !== 0) {
      throw new Error(json.message || "Failed to fetch theater data");
    }
  
    return json.data?.data || [];
};

export const fetchCharacterDetail = async (user: UserData, characterId: string): Promise<CharacterDetailData> => {
    // Check Local Cache First
    const cacheKey = `${CACHE_PREFIX}${user.uid}_${characterId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            // Check expiry
            if (Date.now() - parsed.timestamp < CACHE_EXPIRY_MS) {
                console.log('Using cached character detail for', characterId);
                return parsed.data;
            }
        } catch(e) {
            localStorage.removeItem(cacheKey);
        }
    }

    const credentials = getStoredCredentials();
    if (!credentials) {
      throw new Error("No credentials found. Please log in again.");
    }
  
    const serverMap: Record<string, string> = {
        'Asia': 'os_asia',
        'America': 'os_usa',
        'Europe': 'os_euro',
        'TW, HK, MO': 'os_cht'
    };
    const technicalServer = serverMap[user.server] || user.server;
  
    const queryParams = new URLSearchParams({
      ltuid_v2: credentials.ltuid,
      ltoken_v2: credentials.ltoken,
      endpoint: 'character_detail',
      server: technicalServer,
      role_id: user.uid
    });
  
    // Endpoint expects POST with body containing character_ids, role_id, and server
    const response = await fetch(`${PROXY_PATH}?${queryParams.toString()}`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            role_id: user.uid,
            server: technicalServer,
            character_ids: [Number(characterId)]
        })
    });
    
    const json = await response.json();
  
    if (json.retcode !== 0) {
      throw new Error(json.message || "Failed to fetch character detail");
    }
  
    const charData = json.data?.list?.[0];
    if (!charData) throw new Error("Character data not found in response");

    // Use property_map from response to resolve property names (API returns IDs like 2000, 2001, etc.)
    const propertyMap = json.data?.property_map || {};
    const getPropName = (id: number) => propertyMap[id]?.filter_name || propertyMap[id]?.name || "Stat";

    // Helper to find property by ID in the various property lists
    const findProp = (id: number): Property => {
        const selected = (charData.selected_properties || []).find((p: any) => p.property_type == id);
        const base = (charData.base_properties || []).find((p: any) => p.property_type == id);
        
        return {
            property_type: id,
            base: base?.final || base?.value || "",
            add: selected?.add || "", 
            final: selected?.final || selected?.value || "0"
        };
    };

    // Helper to extract element dmg bonus which might be under different IDs
    const findElemProp = () => {
        const elems = (charData.selected_properties || []).filter((p: any) => 
            (p.property_type >= 40 && p.property_type <= 46) || p.property_type === 30
        );
        const active = elems.find((p: any) => parseFloat(p.final) > 0) || elems[0];
        
        if (!active) return { property_type: 0, base: "0", add: "0", final: "0.0%" };

        return {
            property_type: active.property_type,
            base: "",
            add: "",
            final: active.final
        };
    };

    // Map raw data to strictly typed CharacterDetailData
    const mapped: CharacterDetailData = {
        base: {
            id: charData.base.id,
            name: charData.base.name,
            element: charData.base.element,
            rarity: charData.base.rarity,
            level: charData.base.level,
            fetter: charData.base.fetter,
            actived_constellation_num: charData.base.actived_constellation_num,
            image: charData.base.image,
            icon: charData.base.icon,
            side_icon: charData.base.side_icon
        },
        weapon: {
            id: charData.weapon.id,
            name: charData.weapon.name,
            icon: charData.weapon.icon,
            type: charData.weapon.type,
            rarity: charData.weapon.rarity,
            level: charData.weapon.level,
            promote_level: charData.weapon.promote_level,
            type_name: charData.weapon.type_name,
            desc: charData.weapon.desc,
            affix_level: charData.weapon.affix_level,
            stats: {
                primary_stat: getPropName(charData.weapon.main_property?.property_type),
                primary_value: charData.weapon.main_property?.final || charData.weapon.main_property?.value,
                secondary_stat: charData.weapon.sub_property ? getPropName(charData.weapon.sub_property.property_type) : undefined,
                secondary_value: charData.weapon.sub_property?.final || charData.weapon.sub_property?.value
            }
        },
        relics: (charData.relics || []).map((r: any) => ({
            id: r.id,
            name: r.name,
            icon: r.icon,
            pos: r.pos,
            rarity: r.rarity,
            level: r.level,
            set: {
                id: r.set?.id,
                name: r.set?.name,
                affixes: r.set?.affixes || []
            },
            main_property: {
                display_name: getPropName(r.main_property?.property_type),
                display_value: r.main_property?.display_value || r.main_property?.value,
                times: 0
            },
            sub_property_list: (r.sub_property_list || []).map((sub: any) => ({
                display_name: getPropName(sub.property_type),
                display_value: sub.display_value || sub.value,
                times: sub.times || 0 
            }))
        })),
        constellations: (charData.constellations || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            effect: c.effect,
            is_actived: c.is_actived,
            pos: c.pos
        })),
        skills: (charData.skills || []).map((s: any) => ({
            skill_id: s.skill_id,
            name: s.name,
            level: s.level,
            desc: s.desc,
            icon: s.icon,
            skill_affix_list: s.skill_affix_list || []
        })),
        properties: {
             hp: findProp(2000), 
             atk: findProp(2001), 
             def: findProp(2002), 
             em: findProp(28),    
             er: findProp(23),    
             cr: findProp(20),    
             cd: findProp(22),    
             phys: findProp(30),  
             elem: findElemProp(), 
             heal: findProp(26),   
             inHeal: findProp(27), 
             cooldown: findProp(80),
             shield: findProp(81)
        }
    };

    try {
        localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: mapped
        }));
    } catch(e) {
        console.warn('Failed to cache character detail', e);
    }

    return mapped;
};