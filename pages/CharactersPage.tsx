
import React, { useState, useEffect, useMemo } from 'react';
import { UserData, Character, ElementType, CharacterDetailData, Property } from '../types';
import { ELEMENT_COLORS, ELEMENT_ICONS, WEAPON_ICONS, BG_GRADIENTS } from '../constants';
import { fetchCharacterDetail } from '../services/api';
import { Search, Star, X, Loader2, Sword, Heart, Activity, Target, Zap, Shield, Sparkles, Eye, Share2, Info } from 'lucide-react';

interface CharactersPageProps {
  data: UserData;
}

const PROP_NAME_MAP: Record<number, string> = {
    2000: "Max HP",
    2001: "ATK",
    2002: "DEF",
    28: "Elemental Mastery",
    20: "CRIT Rate",
    22: "CRIT DMG",
    23: "Energy Recharge",
    26: "Healing Bonus",
    27: "Incoming Healing Bonus",
    30: "Physical DMG Bonus",
    40: "Pyro DMG Bonus",
    41: "Electro DMG Bonus",
    42: "Hydro DMG Bonus",
    43: "Dendro DMG Bonus",
    44: "Anemo DMG Bonus",
    45: "Geo DMG Bonus",
    46: "Cryo DMG Bonus"
};

// Map Element to Background Image URL or Gradient
const getElementBg = (el: ElementType) => {
    // Brighter, more vivid gradients for character detail modal
    switch(el) {
        case 'Pyro': return 'bg-gradient-to-br from-[#7a2225] via-[#a63030] to-[#2f1011]';
        case 'Hydro': return 'bg-gradient-to-br from-[#1e3c75] via-[#2b5ba8] to-[#101b2f]';
        case 'Anemo': return 'bg-gradient-to-br from-[#227a65] via-[#30a68d] to-[#102f26]';
        case 'Electro': return 'bg-gradient-to-br from-[#52227a] via-[#7330a6] to-[#1e102f]';
        case 'Dendro': return 'bg-gradient-to-br from-[#2d7a22] via-[#43a630] to-[#102f10]';
        case 'Cryo': return 'bg-gradient-to-br from-[#22687a] via-[#308fa6] to-[#102a2f]';
        case 'Geo': return 'bg-gradient-to-br from-[#7a5d22] via-[#a68230] to-[#2f2410]';
        default: return 'bg-slate-900';
    }
};

const getElementTextColor = (el: ElementType) => {
     switch(el) {
        case 'Pyro': return 'text-[#ff9999]';
        case 'Hydro': return 'text-[#80c0ff]';
        case 'Anemo': return 'text-[#80ffdb]';
        case 'Electro': return 'text-[#e0b0ff]';
        case 'Dendro': return 'text-[#a5c862]';
        case 'Cryo': return 'text-[#99ffff]';
        case 'Geo': return 'text-[#ffe699]';
        default: return 'text-white';
    }
};

const getElementGradientClasses = (el: ElementType) => {
    switch(el) {
       case 'Pyro': return 'from-red-600 to-orange-600';
       case 'Hydro': return 'from-blue-600 to-cyan-600';
       case 'Anemo': return 'from-teal-500 to-emerald-500';
       case 'Electro': return 'from-purple-600 to-fuchsia-600';
       case 'Dendro': return 'from-green-600 to-lime-600';
       case 'Cryo': return 'from-cyan-500 to-sky-500';
       case 'Geo': return 'from-yellow-500 to-amber-600';
       default: return 'from-slate-600 to-slate-500';
   }
};

const StatRow: React.FC<{ label: string; icon?: React.ReactNode; prop: Property; isBreakdown?: boolean }> = ({ label, icon, prop, isBreakdown }) => {
    if (!prop || !prop.final) return null;

    const displayName = PROP_NAME_MAP[prop.property_type] || label;
    const hasBase = prop.base && prop.base !== "0";

    return (
        <div className="flex justify-between items-center py-1">
             <div className="flex items-center gap-2 text-[#d3bc8e] font-medium text-sm">
                {icon && <div className="text-[#a49a93]">{icon}</div>}
                <span>{displayName}</span>
             </div>
             {isBreakdown && hasBase ? (
                 <div className="text-right flex items-center gap-2 font-bold">
                     <span className="text-white text-sm">{prop.base}</span>
                     <span className="text-[#a5c862] text-xs">+{prop.add}</span>
                     <span className="text-white text-base">{prop.final}</span>
                 </div>
             ) : (
                 <div className="text-white font-bold text-base">{prop.final}</div>
             )}
        </div>
    );
};

const CharacterDetailModal: React.FC<{ 
    char: Character; 
    user: UserData; 
    onClose: () => void 
}> = ({ char, user, onClose }) => {
    const [detail, setDetail] = useState<CharacterDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchCharacterDetail(user, char.id);
                setDetail(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load details.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [char.id, user]);

    // Firefly Particles
    const fireflies = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // Horizontal position 0-100%
        size: Math.random() * 3 + 1, // Size 1-4px
        duration: Math.random() * 10 + 10, // 10s to 20s float time
        delay: Math.random() * 20 // Random offset
    })), []);

    if (!detail && !loading) return null;

    const bgClass = getElementBg(char.element);
    
    // Sort constellations
    const sortedConstellations = detail ? [...detail.constellations].sort((a,b) => a.pos - b.pos) : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden">
             {/* Keyframes for rising fireflies */}
             <style>{`
                @keyframes firefly-rise {
                    0% { top: 110%; opacity: 0; transform: scale(0.5) translateX(0); }
                    10% { opacity: 0.6; transform: scale(1); }
                    50% { transform: scale(1) translateX(10px); }
                    90% { opacity: 0.6; }
                    100% { top: -10%; opacity: 0; transform: scale(0.5) translateX(-10px); }
                }
             `}</style>

             {/* Main Container - constrained size for game UI look */}
             <div className={`relative w-full h-full md:w-[95vw] md:h-[95vh] xl:max-w-[1400px] xl:max-h-[850px] overflow-hidden bg-[#1c2027] rounded-none md:rounded-xl shadow-2xl flex border border-[#3c3b3a]`}>
                
                {/* Background Layer - Increased opacity for brighter colors */}
                <div className={`absolute inset-0 ${bgClass} opacity-80`}></div>
                
                {/* Firefly Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {fireflies.map(p => (
                        <div 
                            key={p.id}
                            className="absolute rounded-full bg-white blur-[1px]"
                            style={{
                                left: `${p.left}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                animation: `firefly-rise ${p.duration}s linear infinite`,
                                animationDelay: `-${p.delay}s`,
                                opacity: 0 // Start invisible, animation controls opacity
                            }}
                        ></div>
                    ))}
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 z-[60] text-white/70 hover:text-white transition-colors">
                    <X size={32} />
                </button>

                {loading ? (
                    <div className="w-full h-full flex items-center justify-center z-50">
                        <Loader2 className="animate-spin text-[#d3bc8e]" size={48} />
                    </div>
                ) : detail ? (
                    <div className="w-full h-full flex flex-col md:flex-row relative z-10">
                        
                        {/* --- LEFT PANEL: Art --- */}
                        <div className="w-full md:w-[45%] h-[40vh] md:h-full relative shrink-0">
                            {/* Art */}
                            <img 
                                src={detail.base.image} 
                                alt={detail.base.name} 
                                className="w-full h-full object-cover object-top scale-110 translate-y-8 md:translate-y-12"
                                referrerPolicy="no-referrer"
                            />
                            
                            {/* Friendship (Floating left middle) */}
                            <div className="absolute bottom-28 left-6 text-white drop-shadow-md">
                                <div className="flex items-center gap-2 opacity-90">
                                    <Eye size={18} className="text-[#d3bc8e]" />
                                    <span className="font-medium text-[#d3bc8e]">Friendship Level: <span className="text-white text-lg font-bold">{detail.base.fetter}</span></span>
                                </div>
                            </div>

                            {/* Skills (Bottom Left) */}
                            <div className="absolute bottom-6 left-6 flex gap-4">
                                {detail.skills.slice(0, 3).map(skill => (
                                    <div key={skill.skill_id} className="relative group">
                                        <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center p-1.5 backdrop-blur-sm">
                                            <img src={skill.icon} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                        </div>
                                        {/* Level Badge */}
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#333] text-[#d3bc8e] text-[10px] px-1.5 rounded border border-[#555] font-bold">
                                            {skill.level}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Constellations (Vertical Right) */}
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-4">
                                {sortedConstellations.map(c => (
                                    <div key={c.pos} className="relative">
                                        <div className={`w-10 h-10 rounded-full border border-white/30 bg-black/40 p-0.5 ${!c.is_actived ? 'opacity-50 grayscale' : 'shadow-[0_0_10px_rgba(255,255,255,0.3)]'}`}>
                                            <img src={c.icon} alt="" className="w-full h-full object-contain rounded-full" referrerPolicy="no-referrer" />
                                        </div>
                                        {!c.is_actived && <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 bg-black/60 rounded-full flex items-center justify-center"><Sparkles size={8} className="text-white/50"/></div></div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- RIGHT PANEL: Stats / Info --- */}
                        <div className="flex-1 h-full overflow-y-auto md:overflow-hidden p-4 md:p-8 md:pl-0 flex flex-col gap-5 bg-gradient-to-l from-[#1c2027]/90 via-[#1c2027]/50 to-transparent">
                            
                            {/* Header: Name, Level, Stars */}
                            <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        {React.cloneElement(ELEMENT_ICONS[char.element] as React.ReactElement<any>, { className: `w-full h-full p-2 ${getElementTextColor(char.element)}` })}
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-3">
                                            <h1 className="text-3xl font-bold text-white tracking-wide">{char.name}</h1>
                                            <span className="bg-[#d3bc8e] text-[#3b4354] px-1.5 rounded text-xs font-bold font-mono">Lv.{char.level}</span>
                                        </div>
                                        <div className="flex text-[#ffcc33] mt-1">
                                            {Array.from({ length: char.rarity }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Removed Share Button */}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                
                                {/* 1. Character Stats Table */}
                                <div className="bg-[#242932]/60 rounded-lg p-1 border border-white/5">
                                    <div className="bg-[#1f242d] px-4 py-2 flex justify-between items-center rounded-t-lg">
                                        <span className="text-[#d3bc8e] text-lg font-serif">Character Stats</span>
                                        <span className="text-[#85878a] text-xs flex items-center gap-1 cursor-pointer hover:text-white transition-colors">Details <Info size={12}/></span>
                                    </div>
                                    
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                                        <StatRow label="Max HP" icon={<Heart size={14} className="text-white"/>} prop={detail.properties.hp} isBreakdown />
                                        <StatRow label="CRIT Rate" icon={<Target size={14} className="text-white"/>} prop={detail.properties.cr} />
                                        
                                        <StatRow label="ATK" icon={<Sword size={14} className="text-white"/>} prop={detail.properties.atk} isBreakdown />
                                        <StatRow label="CRIT DMG" icon={<Target size={14} className="text-white"/>} prop={detail.properties.cd} />
                                        
                                        <StatRow label="DEF" icon={<Shield size={14} className="text-white"/>} prop={detail.properties.def} isBreakdown />
                                        <StatRow label="Healing Bonus" icon={<Heart size={14} className="text-white"/>} prop={detail.properties.heal} />
                                        
                                        <StatRow label="Elemental Mastery" icon={<Sparkles size={14} className="text-white"/>} prop={detail.properties.em} />
                                        <StatRow label="Incoming Healing" icon={<Heart size={14} className="text-white"/>} prop={detail.properties.inHeal} />
                                        
                                        {detail.properties.elem?.final !== "0.0%" ? (
                                             <StatRow label="DMG Bonus" icon={<Activity size={14} className="text-white"/>} prop={detail.properties.elem} />
                                        ) : detail.properties.phys?.final !== "0.0%" ? (
                                             <StatRow label="Physical DMG" icon={<Activity size={14} className="text-white"/>} prop={detail.properties.phys} />
                                        ) : <div/>}
                                        
                                        <StatRow label="Energy Recharge" icon={<Zap size={14} className="text-white"/>} prop={detail.properties.er} />
                                    </div>
                                </div>

                                {/* 2. Weapon Section */}
                                <div className="bg-[#2a2624]/40 rounded-lg border border-white/5">
                                     <div className="px-4 py-2 border-b border-white/5">
                                         <span className="text-[#d3bc8e] text-lg font-serif">Weapons</span>
                                     </div>
                                     <div className="p-4">
                                         <div className="bg-[#3e3936] rounded-md flex overflow-hidden relative">
                                             <div className="w-24 h-24 bg-gradient-to-b from-[#5c544e] to-[#3a3532] flex items-center justify-center shrink-0 relative">
                                                 <img src={detail.weapon.icon} alt={detail.weapon.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                 {/* Refinement Badge */}
                                                 <div className="absolute top-1 left-1 bg-[#8c2626] text-white text-xs px-1 rounded border border-[#d3bc8e]/50 font-bold">
                                                     {detail.weapon.affix_level}
                                                 </div>
                                             </div>
                                             <div className="flex-1 p-3 flex flex-col justify-center">
                                                 <div className="flex justify-between items-start">
                                                     <h3 className="text-white font-bold text-lg">{detail.weapon.name}</h3>
                                                     <span className="bg-[#d3bc8e] text-[#3e3936] text-xs px-1 rounded font-bold">Lv. {detail.weapon.level}</span>
                                                 </div>
                                                 <div className="flex items-center gap-4 mt-2">
                                                     <div className="bg-[#2a2624] px-2 py-1 rounded border border-white/10">
                                                         <span className="text-[#a49a93] text-xs uppercase block">Base ATK</span>
                                                         <span className="text-white font-bold">{detail.weapon.stats.primary_value}</span>
                                                     </div>
                                                     {detail.weapon.stats.secondary_stat && (
                                                         <div className="bg-[#2a2624] px-2 py-1 rounded border border-white/10">
                                                             <span className="text-[#a49a93] text-xs uppercase block">{detail.weapon.stats.secondary_stat}</span>
                                                             <span className="text-[#d3bc8e] font-bold">{detail.weapon.stats.secondary_value}</span>
                                                         </div>
                                                     )}
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                </div>

                                {/* 3. Artifacts Section */}
                                <div className="bg-[#242932]/60 rounded-lg p-1 border border-white/5">
                                    <div className="bg-[#1f242d] px-4 py-2 flex justify-between items-center rounded-t-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#d3bc8e] text-lg font-serif">Artifacts</span>
                                            <Info size={14} className="text-[#85878a]"/>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        <div className="text-[#85878a] text-xs mb-4">
                                            When you enter for the first time, the recommended affixes will be based on in-game data gathered from recently active players.
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                            {detail.relics.map(relic => (
                                                <div key={relic.id} className="bg-[#2a2624] rounded border border-[#4a423c] flex flex-col relative overflow-hidden group hover:border-[#7a6e63] transition-colors">
                                                    {/* Card Header: Set Name & Icon */}
                                                    <div className="p-2 border-b border-[#4a423c] flex justify-between items-start h-14 bg-[#231f1d]">
                                                        <div className="flex-1 min-w-0 pr-1">
                                                            <p className="text-[#a49a93] text-[10px] leading-tight line-clamp-2" title={relic.set.name}>{relic.set.name}</p>
                                                            <span className="bg-[#3e3936] text-[#a49a93] text-[9px] px-1 rounded mt-1 inline-block">Lv. {relic.level}</span>
                                                        </div>
                                                        <div className="w-8 h-8 shrink-0">
                                                            <img src={relic.icon} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                                        </div>
                                                    </div>

                                                    {/* Main Stat */}
                                                    <div className="p-2 flex flex-col items-end border-b border-[#4a423c] bg-[#2a2624]">
                                                        <div className="flex text-[#ffcc33] mb-1">
                                                            {Array.from({ length: relic.rarity }).map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                                                        </div>
                                                        <span className="text-[#a49a93] text-[10px] uppercase font-bold">{relic.main_property.display_name}</span>
                                                        <span className="text-white text-lg font-bold">{relic.main_property.display_value}</span>
                                                    </div>

                                                    {/* Substats */}
                                                    <div className="p-2 space-y-1.5 bg-[#231f1d] flex-1">
                                                        {relic.sub_property_list.map((sub, idx) => (
                                                            <div key={idx} className="flex justify-between items-center text-[10px] sm:text-xs">
                                                                <span className="text-[#a49a93] truncate mr-1" title={sub.display_name}>
                                                                    {sub.display_name.replace('Percentage', '%').replace('Elemental Mastery', 'EM').replace('Energy Recharge', 'ER')}
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    {/* Roll Count Box */}
                                                                    {sub.times && sub.times > 0 && (
                                                                        <span className="bg-[#3e3936] text-[#d3bc8e] px-1 rounded border border-[#555] font-mono text-[9px]">
                                                                            {sub.times}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-[#ffe699] font-bold">+{sub.display_value}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Empty slots filler */}
                                            {Array.from({ length: 5 - detail.relics.length }).map((_, i) => (
                                                <div key={`empty-${i}`} className="bg-[#2a2624]/50 border border-[#4a423c] border-dashed rounded flex items-center justify-center min-h-[250px] opacity-50">
                                                    <span className="text-[#a49a93] text-xs">Empty</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-4"></div>
                            </div>
                        </div>
                    </div>
                ) : null}
             </div>
        </div>
    );
};

const CharacterCard: React.FC<{ char: Character; onClick: () => void }> = ({ char, onClick }) => {
    // Determine border color based on rarity - Thicker and brighter
    const borderClass = char.rarity === 5 
        ? "border-2 border-yellow-400 dark:border-yellow-300 shadow-[0_0_12px_-3px_rgba(250,204,21,0.6)]" 
        : "border-2 border-purple-400 dark:border-purple-300 shadow-[0_0_12px_-3px_rgba(192,132,252,0.6)]";

    // Dynamic styles for footer badges
    const constellationClass = char.constellation === 6
        ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700/50"
        : char.constellation > 0
            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50"
            : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";

    const friendshipClass = char.friendship === 10
        ? "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700/50"
        : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";

    return (
        <button 
            onClick={onClick}
            className={`w-full text-left group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm ${borderClass} overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#4e6c8e] active:scale-[0.98]`}
        >
            {/* Element Background Gradient */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${BG_GRADIENTS[char.element]} opacity-30 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none`}></div>

            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-900">
                {/* Highlight Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-b ${getElementGradientClasses(char.element)} opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0`}></div>

                <img 
                    src={char.image} 
                    alt={char.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10" 
                    referrerPolicy="no-referrer"
                />
                
                {/* Top overlay info */}
                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-20">
                     <div className={`w-6 h-6 rounded-full ${ELEMENT_COLORS[char.element].split(' ')[0].replace('text-', 'bg-')} text-white flex items-center justify-center shadow-md border border-white/20`}>
                        {React.cloneElement(ELEMENT_ICONS[char.element] as React.ReactElement<any>, { size: 14 })}
                     </div>
                </div>
                
                {/* Bottom Gradient for text readability */}
                <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10"></div>
                
                <div className="absolute bottom-0 inset-x-0 p-2 text-white z-20">
                     <h3 className="font-bold text-sm md:text-base leading-tight truncate drop-shadow-sm mb-0.5">{char.name}</h3>
                     <div className="flex justify-between items-end">
                        <div className="flex text-yellow-400 drop-shadow-sm">
                           {char.rarity === 5 ? (
                               <div className="flex"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                           ) : (
                               <div className="flex"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                           )}
                        </div>
                        <span className="text-[9px] bg-black/40 px-1 py-0.5 rounded backdrop-blur-sm border border-white/10">Lv. {char.level}</span>
                     </div>
                </div>
            </div>

            <div className="p-2 bg-white dark:bg-slate-800 relative z-10 grid grid-cols-2 gap-2">
                <div className={`flex items-center justify-center py-1 rounded-md text-[10px] font-bold border ${constellationClass}`}>
                     <span className="mr-0.5 opacity-70">C</span>
                     <span>{char.constellation}</span>
                </div>
                <div className={`flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-bold border ${friendshipClass}`}>
                    <Heart size={8} className={char.friendship === 10 ? "fill-current" : ""} />
                    <span>{char.friendship}</span>
                </div>
            </div>
        </button>
    );
};

const CharactersPage: React.FC<CharactersPageProps> = ({ data }) => {
  const [search, setSearch] = useState('');
  const [filterElement, setFilterElement] = useState<ElementType | 'All'>('All');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  const filteredCharacters = useMemo(() => {
    return data.characters
      .filter(char => {
          const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase());
          const matchesElement = filterElement === 'All' || char.element === filterElement;
          return matchesSearch && matchesElement;
      })
      .sort((a, b) => {
          // Sort by Rarity (Descending: 5 -> 4)
          if (b.rarity !== a.rarity) return b.rarity - a.rarity;
          // Then by Level (Descending)
          if (b.level !== a.level) return b.level - a.level;
          // Then by Name (Ascending)
          return a.name.localeCompare(b.name);
      });
  }, [data.characters, search, filterElement]);

  const elements: ElementType[] = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];

  return (
    <div className="space-y-6 pb-20">
        <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-200 dark:border-slate-800 md:static md:bg-transparent md:border-0 md:p-0 md:mx-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">My Characters</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Total Obtained: {data.characters.length}</p>
                </div>

                <div className="w-full md:w-auto flex flex-col gap-3">
                    {/* Search */}
                    <div className="relative group w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-[#4e6c8e]" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find a character..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/80 md:bg-white/60 md:dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4e6c8e]/50 focus:border-[#4e6c8e] w-full md:w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Horizontal Scroll Filters */}
            <div className="flex overflow-x-auto gap-2 mt-4 pb-2 md:pb-0 no-scrollbar mask-linear-fade">
                <button
                    onClick={() => setFilterElement('All')}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                        filterElement === 'All' 
                        ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-lg' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                    All
                </button>
                {elements.map(el => (
                    <button
                        key={el}
                        onClick={() => setFilterElement(el)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                            filterElement === el
                            ? `${ELEMENT_COLORS[el].split(' ')[0].replace('text-', 'bg-')} text-white shadow-md ring-2 ring-offset-1 dark:ring-offset-slate-900 ring-slate-200 dark:ring-slate-700`
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        {React.cloneElement(ELEMENT_ICONS[el] as React.ReactElement<any>, { size: 14 })}
                        {el}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredCharacters.map(char => (
                <CharacterCard 
                    key={char.id} 
                    char={char} 
                    onClick={() => setSelectedChar(char)}
                />
            ))}
            {filteredCharacters.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p>No characters found matching your criteria.</p>
                </div>
            )}
        </div>

        {selectedChar && (
            <CharacterDetailModal 
                char={selectedChar} 
                user={data} 
                onClose={() => setSelectedChar(null)} 
            />
        )}
    </div>
  );
};

export default CharactersPage;
