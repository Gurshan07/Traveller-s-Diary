
import { UserData, Character, RegionData } from '../types';

const characters: Character[] = [
  {
    id: '1',
    name: 'Raiden Shogun',
    element: 'Electro',
    rarity: 5,
    level: 90,
    friendship: 10,
    constellation: 2,
    weapon: { name: 'Engulfing Lightning', rarity: 5, level: 90, type: 'Polearm', refinement: 1 },
    artifacts: [{ set: 'Emblem of Severed Fate', count: 4 }],
    image: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: '2',
    name: 'Yelan',
    element: 'Hydro',
    rarity: 5,
    level: 90,
    friendship: 10,
    constellation: 1,
    weapon: { name: 'Aqua Simulacra', rarity: 5, level: 90, type: 'Bow', refinement: 1 },
    artifacts: [{ set: 'Emblem of Severed Fate', count: 4 }],
    image: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: '3',
    name: 'Hu Tao',
    element: 'Pyro',
    rarity: 5,
    level: 90,
    friendship: 10,
    constellation: 1,
    weapon: { name: 'Staff of Homa', rarity: 5, level: 90, type: 'Polearm', refinement: 1 },
    artifacts: [{ set: 'Crimson Witch of Flames', count: 4 }],
    image: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: '4',
    name: 'Zhongli',
    element: 'Geo',
    rarity: 5,
    level: 90,
    friendship: 10,
    constellation: 0,
    weapon: { name: 'Black Tassel', rarity: 3, level: 90, type: 'Polearm', refinement: 5 },
    artifacts: [{ set: 'Tenacity of the Millelith', count: 4 }],
    image: 'https://picsum.photos/200/200?random=4'
  },
  {
    id: '5',
    name: 'Nahida',
    element: 'Dendro',
    rarity: 5,
    level: 90,
    friendship: 9,
    constellation: 2,
    weapon: { name: 'A Thousand Floating Dreams', rarity: 5, level: 90, type: 'Catalyst', refinement: 1 },
    artifacts: [{ set: 'Deepwood Memories', count: 4 }],
    image: 'https://picsum.photos/200/200?random=5'
  },
  {
    id: '6',
    name: 'Kazuha',
    element: 'Anemo',
    rarity: 5,
    level: 90,
    friendship: 10,
    constellation: 0,
    weapon: { name: 'Freedom-Sworn', rarity: 5, level: 90, type: 'Sword', refinement: 1 },
    artifacts: [{ set: 'Viridescent Venerer', count: 4 }],
    image: 'https://picsum.photos/200/200?random=6'
  },
  {
    id: '7',
    name: 'Ayaka',
    element: 'Cryo',
    rarity: 5,
    level: 80,
    friendship: 7,
    constellation: 0,
    weapon: { name: 'Mistsplitter Reforged', rarity: 5, level: 90, type: 'Sword', refinement: 1 },
    artifacts: [{ set: 'Blizzard Strayer', count: 4 }],
    image: 'https://picsum.photos/200/200?random=7'
  },
  {
    id: '8',
    name: 'Bennett',
    element: 'Pyro',
    rarity: 4,
    level: 90,
    friendship: 10,
    constellation: 5,
    weapon: { name: 'Aquila Favonia', rarity: 5, level: 90, type: 'Sword', refinement: 1 },
    artifacts: [{ set: 'Noblesse Oblige', count: 4 }],
    image: 'https://picsum.photos/200/200?random=8'
  },
    {
    id: '9',
    name: 'Xingqiu',
    element: 'Hydro',
    rarity: 4,
    level: 80,
    friendship: 10,
    constellation: 6,
    weapon: { name: 'Sacrificial Sword', rarity: 4, level: 90, type: 'Sword', refinement: 5 },
    artifacts: [{ set: 'Emblem of Severed Fate', count: 4 }],
    image: 'https://picsum.photos/200/200?random=9'
  }
];

const regions: RegionData[] = [
    {
        id: 'mondstadt',
        name: 'Mondstadt',
        element: 'Anemo',
        exploration_progress: 100,
        reputation_level: 8,
        max_reputation_level: 8,
        statue_level: 10,
        image: 'https://picsum.photos/800/400?random=10',
        icon: 'https://picsum.photos/50/50?random=100',
        parentId: 0,
        type: 'region',
        offerings: [],
        subRegions: [],
        bosses: []
    },
    {
        id: 'liyue',
        name: 'Liyue',
        element: 'Geo',
        exploration_progress: 98,
        reputation_level: 8,
        max_reputation_level: 8,
        statue_level: 10,
        image: 'https://picsum.photos/800/400?random=11',
        icon: 'https://picsum.photos/50/50?random=101',
        parentId: 0,
        type: 'region',
        offerings: [],
        subRegions: [],
        bosses: []
    },
    {
        id: 'inazuma',
        name: 'Inazuma',
        element: 'Electro',
        exploration_progress: 95,
        reputation_level: 10,
        max_reputation_level: 10,
        statue_level: 10,
        offerings: [{
            name: 'Sacred Sakura',
            level: 50,
            icon: 'https://picsum.photos/50/50?random=102'
        }],
        image: 'https://picsum.photos/800/400?random=12',
        icon: 'https://picsum.photos/50/50?random=103',
        parentId: 0,
        type: 'region',
        subRegions: [],
        bosses: []
    },
    {
        id: 'sumeru',
        name: 'Sumeru',
        element: 'Dendro',
        exploration_progress: 82,
        reputation_level: 10,
        max_reputation_level: 10,
        statue_level: 9,
        offerings: [{
            name: 'Tree of Dreams',
            level: 42,
            icon: 'https://picsum.photos/50/50?random=104'
        }],
        image: 'https://picsum.photos/800/400?random=13',
        icon: 'https://picsum.photos/50/50?random=105',
        parentId: 0,
        type: 'region',
        subRegions: [],
        bosses: []
    },
    {
        id: 'fontaine',
        name: 'Fontaine',
        element: 'Hydro',
        exploration_progress: 65,
        reputation_level: 6,
        max_reputation_level: 10,
        statue_level: 6,
        offerings: [{
            name: 'Fountain of Lucine',
            level: 25,
            icon: 'https://picsum.photos/50/50?random=106'
        }],
        image: 'https://picsum.photos/800/400?random=14',
        icon: 'https://picsum.photos/50/50?random=107',
        parentId: 0,
        type: 'region',
        subRegions: [],
        bosses: []
    }
];

export const MOCK_USER_DATA: UserData = {
  nickname: "Lumine",
  uid: "800012345",
  server: "Asia",
  level: 60,
  stats: {
    active_days: 852,
    achievements: 945,
    characters_obtained: 54,
    spiral_abyss: "12-3",
    oculi_collected: 850,
    chests_opened: 4320,
    chest_breakdown: {
      common: 2000,
      exquisite: 1500,
      precious: 500,
      luxurious: 200,
      magic: 120,
    },
    oculi_breakdown: {
      anemoculi: 66,
      geoculi: 131,
      electroculi: 181,
      dendroculi: 271,
      hydroculi: 216,
      pyroculi: 0,
    }
  },
  characters: characters,
  regions: regions,
  homes: [
    {
      level: 10,
      visit_num: 1542,
      comfort_num: 20000,
      item_num: 340,
      name: "Cool Isle",
      icon: "https://picsum.photos/50/50?random=201",
      comfort_level_name: "Fit for a King",
      comfort_level_icon: "https://picsum.photos/50/50?random=202"
    }
  ],
  abyss: {
    floor: "12-3",
    stars: 36,
    total_stars: 36,
    max_floor: "12-3",
    battles: 14
  }
};
