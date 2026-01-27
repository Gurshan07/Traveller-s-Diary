
import React from 'react';
import { ElementType, WeaponType } from './types';
import { Sword, Shield, Disc, Crosshair, Sparkles } from 'lucide-react';

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
  Pyro: <img src="https://enka.network/ui/UI_Buff_Element_Fire.png" alt="Pyro" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(255,100,100,0.6)]" referrerPolicy="no-referrer" />,
  Hydro: <img src="https://enka.network/ui/UI_Buff_Element_Water.png" alt="Hydro" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(100,100,255,0.6)]" referrerPolicy="no-referrer" />,
  Anemo: <img src="https://enka.network/ui/UI_Buff_Element_Wind.png" alt="Anemo" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(100,255,150,0.6)]" referrerPolicy="no-referrer" />,
  Electro: <img src="https://enka.network/ui/UI_Buff_Element_Electric.png" alt="Electro" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(200,100,255,0.6)]" referrerPolicy="no-referrer" />,
  Dendro: <img src="https://enka.network/ui/UI_Buff_Element_Grass.png" alt="Dendro" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(100,255,50,0.6)]" referrerPolicy="no-referrer" />,
  Cryo: <img src="https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/static/images/elements/cryo.png" alt="Cryo" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(100,255,255,0.6)]" referrerPolicy="no-referrer" />,
  Geo: <img src="https://enka.network/ui/UI_Buff_Element_Rock.png" alt="Geo" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(255,200,50,0.6)]" referrerPolicy="no-referrer" />,
};

export const WEAPON_ICONS: Record<WeaponType, React.ReactNode> = {
  Sword: <Sword className="w-4 h-4" />,
  Claymore: <Shield className="w-4 h-4" />, 
  Polearm: <Disc className="w-4 h-4" />,    
  Bow: <Crosshair className="w-4 h-4" />,
  Catalyst: <Sparkles className="w-4 h-4" />,
};

export const BG_GRADIENTS: Record<ElementType, string> = {
    Pyro: 'from-red-950/80 to-transparent',
    Hydro: 'from-blue-950/80 to-transparent',
    Anemo: 'from-teal-950/80 to-transparent',
    Electro: 'from-purple-950/80 to-transparent',
    Dendro: 'from-green-950/80 to-transparent',
    Cryo: 'from-cyan-950/80 to-transparent',
    Geo: 'from-yellow-950/80 to-transparent',
};
