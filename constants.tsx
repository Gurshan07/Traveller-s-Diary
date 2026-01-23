import React from 'react';
import { ElementType, WeaponType } from './types';
import { Flame, Droplets, Wind, Zap, Leaf, Snowflake, Mountain, Sword, Shield, Disc, Crosshair, Sparkles } from 'lucide-react';

export const ELEMENT_COLORS: Record<ElementType, string> = {
  Pyro: 'text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30 border-red-200/60 dark:border-red-700/50',
  Hydro: 'text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 border-blue-200/60 dark:border-blue-700/50',
  Anemo: 'text-teal-600 dark:text-teal-400 bg-teal-100/50 dark:bg-teal-900/30 border-teal-200/60 dark:border-teal-700/50',
  Electro: 'text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/30 border-purple-200/60 dark:border-purple-700/50',
  Dendro: 'text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/30 border-green-200/60 dark:border-green-700/50',
  Cryo: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100/50 dark:bg-cyan-900/30 border-cyan-200/60 dark:border-cyan-700/50',
  Geo: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/30 border-yellow-200/60 dark:border-yellow-700/50',
};

export const ELEMENT_ICONS: Record<ElementType, React.ReactNode> = {
  Pyro: <Flame className="w-4 h-4" />,
  Hydro: <Droplets className="w-4 h-4" />,
  Anemo: <Wind className="w-4 h-4" />,
  Electro: <Zap className="w-4 h-4" />,
  Dendro: <Leaf className="w-4 h-4" />,
  Cryo: <Snowflake className="w-4 h-4" />,
  Geo: <Mountain className="w-4 h-4" />,
};

export const WEAPON_ICONS: Record<WeaponType, React.ReactNode> = {
  Sword: <Sword className="w-4 h-4" />,
  Claymore: <Shield className="w-4 h-4" />, 
  Polearm: <Disc className="w-4 h-4" />,    
  Bow: <Crosshair className="w-4 h-4" />,
  Catalyst: <Sparkles className="w-4 h-4" />,
};

export const BG_GRADIENTS: Record<ElementType, string> = {
    Pyro: 'from-red-500/20 to-transparent',
    Hydro: 'from-blue-500/20 to-transparent',
    Anemo: 'from-teal-500/20 to-transparent',
    Electro: 'from-purple-500/20 to-transparent',
    Dendro: 'from-green-500/20 to-transparent',
    Cryo: 'from-cyan-500/20 to-transparent',
    Geo: 'from-yellow-500/20 to-transparent',
};
