
export type ElementType = 'Pyro' | 'Hydro' | 'Anemo' | 'Electro' | 'Dendro' | 'Cryo' | 'Geo';
export type WeaponType = 'Sword' | 'Claymore' | 'Polearm' | 'Bow' | 'Catalyst';

export interface Character {
  id: string;
  name: string;
  element: ElementType;
  rarity: 4 | 5;
  level: number;
  friendship: number;
  constellation: number;
  weapon: {
    name: string;
    rarity: 3 | 4 | 5;
    level: number;
    type: WeaponType;
  };
  artifacts: {
    set: string;
    count: number;
  }[];
  image: string;
}

// --- Detailed Character Data Types ---

export interface Property {
  property_type: number;
  base: string;
  add: string;
  final: string;
}

export interface RelicStat {
  display_name: string;
  display_value: string;
  times?: number; // Number of rolls into this stat
}

export interface Relic {
  id: number;
  name: string;
  icon: string;
  pos: number;
  rarity: number;
  level: number;
  set: {
    id: number;
    name: string;
    affixes: { activation_number: number; effect: string }[];
  };
  main_property: RelicStat;
  sub_property_list: RelicStat[];
}

export interface WeaponDetail {
  id: number;
  name: string;
  icon: string;
  type: number;
  rarity: number;
  level: number;
  promote_level: number;
  type_name: string;
  desc: string;
  affix_level: number;
  stats: {
    primary_stat: string;
    primary_value: string;
    secondary_stat?: string;
    secondary_value?: string;
  };
}

export interface ConstellationDetail {
  id: number;
  name: string;
  icon: string;
  effect: string;
  is_actived: boolean;
  pos: number;
}

export interface Skill {
  skill_id: number;
  name: string;
  level: number;
  desc: string;
  icon: string;
  skill_affix_list: { name: string; value: string }[];
}

export interface CharacterDetailData {
  base: {
     id: number;
     name: string;
     element: string; // "Pyro", etc.
     rarity: number;
     level: number;
     fetter: number; // Friendship
     actived_constellation_num: number;
     image: string;
     icon: string;
     side_icon: string;
  };
  weapon: WeaponDetail;
  relics: Relic[];
  constellations: ConstellationDetail[];
  skills: Skill[];
  properties: {
     hp: Property;
     atk: Property;
     def: Property;
     em: Property; // Elemental Mastery
     er: Property; // Energy Recharge
     cr: Property; // Crit Rate
     cd: Property; // Crit DMG
     phys: Property; // Phys DMG
     elem: Property; // Elemental DMG
     heal: Property; // Healing Bonus
     inHeal: Property; // Incoming Healing
     cooldown: Property; // Cooldown Reduction
     shield: Property; // Shield Strength
  };
}

// --- End Detailed Types ---

export interface SubRegion {
  name: string;
  exploration_percentage: number;
}

export interface Boss {
  name: string;
  kill_num: number;
}

export interface Offering {
  name: string;
  level: number;
  icon: string;
}

export interface RegionData {
  id: string;
  name: string;
  element: ElementType;
  exploration_progress: number;
  reputation_level: number;
  max_reputation_level: number;
  statue_level: number;
  offerings: Offering[];
  image: string;
  icon: string;
  parentId: number;
  type: string;
  subRegions: SubRegion[];
  bosses: Boss[];
}

export interface Home {
  level: number;
  visit_num: number;
  comfort_num: number;
  item_num: number;
  name: string;
  icon: string;
  comfort_level_name: string;
  comfort_level_icon: string;
}

export interface Achievement {
  id: number;
  name: string;
  percentage: number;
  finish_num: number;
  show_percent: boolean;
  icon: string;
}

export interface Stats {
  active_days: number;
  achievements: number;
  characters_obtained: number;
  spiral_abyss: string;
  oculi_collected: number;
  chests_opened: number;
  // Detailed breakdown
  chest_breakdown: {
    common: number;
    exquisite: number;
    precious: number;
    luxurious: number;
    magic: number;
  };
  oculi_breakdown: {
    anemoculi: number;
    geoculi: number;
    electroculi: number;
    dendroculi: number;
    hydroculi: number;
    pyroculi: number;
  };
}

export interface UserData {
  nickname: string;
  uid: string;
  server: string;
  level: number;
  profileIcon?: string;
  stats: Stats;
  characters: Character[];
  regions: RegionData[];
  homes: Home[];
  abyss: {
    floor: string;
    stars: number;
    total_stars: number;
    max_floor: string;
    battles: number;
  };
}

// --- Spiral Abyss Specific Types ---

export interface AbyssRankItem {
  avatar_id: number;
  avatar_icon: string;
  value: number;
  rarity: number;
}

export interface AbyssLevel {
  index: number;
  star: number;
  max_star: number;
  battles: {
    index: number;
    timestamp: string;
    avatars: {
      id: number;
      icon: string;
      level: number;
      rarity: number;
    }[];
  }[];
}

export interface AbyssFloor {
  index: number;
  icon: string;
  is_unlock: boolean;
  star: number;
  max_star: number;
  levels: AbyssLevel[];
}

export interface SpiralAbyssData {
  schedule_id: number;
  start_time: string;
  end_time: string;
  total_battle_times: number;
  total_win_times: number;
  max_floor: string;
  total_star: number;
  is_unlock: boolean;
  reveal_rank: AbyssRankItem[];
  defeat_rank: AbyssRankItem[];
  damage_rank: AbyssRankItem[];
  take_damage_rank: AbyssRankItem[];
  normal_skill_rank: AbyssRankItem[];
  energy_skill_rank: AbyssRankItem[];
  floors: AbyssFloor[];
}
