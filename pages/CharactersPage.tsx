
import React, { useState, useEffect, useMemo } from 'react';
import { UserData, Character, ElementType, CharacterDetailData, Property } from '../types';
import { ELEMENT_COLORS, ELEMENT_ICONS, BG_GRADIENTS } from '../constants';
import { fetchCharacterDetail } from '../services/api';
import { Search, Star, X, Loader2, Sword, Heart, Activity, Target, Zap, Shield, Sparkles, Eye, Info } from 'lucide-react';

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
    27: "Incoming Healing",
    30: "Physical DMG",
    40: "Pyro DMG",
    41: "Electro DMG",
    42: "Hydro DMG",
    43: "Dendro DMG",
    44: "Anemo DMG",
    45: "Geo DMG",
    46: "Cryo DMG"
};

// Map Element to Darker Background Gradients
const getElementBg = (el: ElementType) => {
    switch(el) {
        case 'Pyro': return 'bg-gradient-to-br from-[#1a0505] via-[#2d0a0a] to-[#000000]';
        case 'Hydro': return 'bg-gradient-to-br from-[#050a1a] via-[#0a142d] to-[#000000]';
        case 'Anemo': return 'bg-gradient-to-br from-[#051a15] via-[#0a2d25] to-[#000000]';
        case 'Electro': return 'bg-gradient-to-br from-[#12051a] via-[#1f0a2d] to-[#000000]';
        case 'Dendro': return 'bg-gradient-to-br from-[#081a05] via-[#0f2d0a] to-[#000000]';
        case 'Cryo': return 'bg-gradient-to-br from-[#05161a] via-[#0a252d] to-[#000000]';
        case 'Geo': return 'bg-gradient-to-br from-[#1a1205] via-[#2d200a] to-[#000000]';
        default: return 'bg-[#0a0a0a]';
    }
};

const getElementTextColor = (el: ElementType) => {
     switch(el) {
        case 'Pyro': return 'text-red-400';
        case 'Hydro': return 'text-blue-400';
        case 'Anemo': return 'text-teal-400';
        case 'Electro': return 'text-purple-400';
        case 'Dendro': return 'text-green-400';
        case 'Cryo': return 'text-cyan-400';
        case 'Geo': return 'text-yellow-400';
        default: return 'text-white';
    }
};

const getElementGradientClasses = (el: ElementType) => {
    switch(el) {
       case 'Pyro': return 'from-red-900 to-red-800';
       case 'Hydro': return 'from-blue-900 to-blue-800';
       case 'Anemo': return 'from-teal-900 to-teal-800';
       case 'Electro': return 'from-purple-900 to-purple-800';
       case 'Dendro': return 'from-green-900 to-green-800';
       case 'Cryo': return 'from-cyan-900 to-cyan-800';
       case 'Geo': return 'from-yellow-900 to-yellow-800';
       default: return 'from-slate-800 to-slate-700';
   }
};

const StatRow: React.FC<{ label: string; icon?: React.ReactNode; prop: Property; isBreakdown?: boolean }> = ({ label, icon, prop, isBreakdown }) => {
    if (!prop || !prop.final) return null;

    const displayName = PROP_NAME_MAP[prop.property_type] || label;
    const hasBase = prop.base && prop.base !== "0";

    return (
        <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
             <div className="flex items-center gap-2.5 text-slate-300 font-medium text-sm">
                {icon && <div className="text-slate-500">{icon}</div>}
                <span>{displayName}</span>
             </div>
             {isBreakdown && hasBase ? (
                 <div className="text-right flex items-center gap-1.5 font-bold">
                     <span className="text-slate-100 text-sm">{prop.base}</span>
                     <span className="text-[#a5c862] text-xs">+{prop.add}</span>
                     <span className="text-slate-100 text-base min-w-[3rem] text-right">{prop.final}</span>
                 </div>
             ) : (
                 <div className="text-slate-100 font-bold text-base">{prop.final}</div>
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
    const fireflies = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 20
    })), []);

    if (!detail && !loading) return null;

    const bgClass = getElementBg(char.element);
    const textColor = getElementTextColor(char.element);
    
    // Sort constellations
    const sortedConstellations = detail ? [...detail.constellations].sort((a,b) => a.pos - b.pos) : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
             <style>{`
                @keyframes firefly-float {
                    0% { transform: translateY(100vh) scale(0); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(-10vh) scale(1); opacity: 0; }
                }
             `}</style>

             <div className={`relative w-full h-full md:w-[95vw] md:h-[95vh] xl:max-w-[1400px] xl:max-h-[850px] overflow-hidden bg-[#0c0c0c] rounded-none md:rounded-2xl shadow-2xl flex flex-col md:flex-row border border-white/10`}>
                
                {/* Background Layer */}
                <div className={`absolute inset-0 ${bgClass} opacity-90 transition-colors duration-1000`}></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>
                
                {/* Firefly Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {fireflies.map(p => (
                        <div 
                            key={p.id}
                            className="absolute rounded-full bg-white/30 blur-[1px]"
                            style={{
                                left: `${p.left}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                animation: `firefly-float ${p.duration}s linear infinite`,
                                animationDelay: `-${p.delay}s`,
                            }}
                        ></div>
                    ))}
                </div>

                <button onClick={onClose} className="absolute top-6 right-6 z-[60] text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                    <X size={28} />
                </button>

                {loading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center z-50 gap-4">
                        <Loader2 className={`animate-spin ${textColor}`} size={48} />
                        <p className="text-slate-400 font-mono text-sm animate-pulse">Synchronizing Resonance...</p>
                    </div>
                ) : detail ? (
                    <>
                        {/* --- LEFT PANEL: Character Art & Metadata --- */}
                        <div className="w-full md:w-[45%] h-[40vh] md:h-full relative shrink-0 overflow-visible z-10">
                            {/* Background Glow behind character */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 blur-3xl"></div>

                            {/* Character Art */}
                            <img 
                                src={detail.base.image} 
                                alt={detail.base.name} 
                                className="w-full h-full object-cover object-top md:scale-110 md:translate-y-8 drop-shadow-2xl"
                                referrerPolicy="no-referrer"
                            />
                            
                            {/* Name & Title Overlay (Mobile Friendly) */}
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-24">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                                {ELEMENT_ICONS[char.element]}
                                            </div>
                                            <span className="text-white/80 font-mono text-sm tracking-widest uppercase opacity-80">Lv.{detail.base.level} / 90</span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-wide drop-shadow-lg leading-none">{detail.base.name}</h1>
                                        <div className="flex gap-1 text-yellow-400 mt-2">
                                            {Array.from({ length: detail.base.rarity }).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    
                                    {/* Friendship Badge */}
                                    <div className="flex flex-col items-end gap-1 opacity-80">
                                        <Heart size={20} className="text-pink-400 fill-pink-400/20" />
                                        <span className="text-xs text-pink-200 font-bold">Friendship {detail.base.fetter}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Constellations (Floating Right) */}
                            <div className="absolute top-8 right-4 md:right-8 flex flex-col gap-3 z-20">
                                {sortedConstellations.map(c => (
                                    <div key={c.pos} className="relative group">
                                        <div className={`w-10 h-10 rounded-full border border-white/20 bg-black/40 p-1 transition-all duration-300 ${c.is_actived ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] bg-black/60' : 'opacity-40 grayscale'}`}>
                                            <img src={c.icon} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-30">
                                            C{c.pos}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- RIGHT PANEL: Details Grid --- */}
                        <div className="flex-1 h-full overflow-y-auto relative z-20 bg-black/40 backdrop-blur-xl border-l border-white/5">
                            <div className="p-6 md:p-8 space-y-8 min-h-full">
                                
                                {/* 1. Stats Block */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Activity size={18} className="text-slate-400" />
                                        <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Combat Stats</h3>
                                    </div>
                                    <div className="bg-black/40 rounded-xl border border-white/10 p-4 grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-1">
                                        <StatRow label="Max HP" icon={<Heart size={14} className="text-slate-500"/>} prop={detail.properties.hp} isBreakdown />
                                        <StatRow label="ATK" icon={<Sword size={14} className="text-slate-500"/>} prop={detail.properties.atk} isBreakdown />
                                        <StatRow label="DEF" icon={<Shield size={14} className="text-slate-500"/>} prop={detail.properties.def} isBreakdown />
                                        <StatRow label="Elemental Mastery" icon={<Sparkles size={14} className="text-slate-500"/>} prop={detail.properties.em} />
                                        <StatRow label="CRIT Rate" icon={<Target size={14} className="text-slate-500"/>} prop={detail.properties.cr} />
                                        <StatRow label="CRIT DMG" icon={<Target size={14} className="text-slate-500"/>} prop={detail.properties.cd} />
                                        <StatRow label="Energy Recharge" icon={<Zap size={14} className="text-slate-500"/>} prop={detail.properties.er} />
                                        {detail.properties.elem?.final !== "0.0%" ? (
                                             <StatRow label="DMG Bonus" icon={<Activity size={14} className="text-slate-500"/>} prop={detail.properties.elem} />
                                        ) : detail.properties.phys?.final !== "0.0%" ? (
                                             <StatRow label="Physical DMG" icon={<Activity size={14} className="text-slate-500"/>} prop={detail.properties.phys} />
                                        ) : null}
                                    </div>
                                </section>

                                {/* 2. Weapon & Skills Row */}
                                <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                     {/* Weapon */}
                                     <div>
                                         <div className="flex items-center gap-2 mb-4">
                                            <Sword size={18} className="text-slate-400" />
                                            <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Weapon</h3>
                                         </div>
                                         <div className="bg-gradient-to-r from-black/60 to-black/40 rounded-xl border border-white/10 p-4 flex gap-4 items-center relative overflow-hidden group">
                                             <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors"></div>
                                             
                                             <div className="w-20 h-20 shrink-0 bg-[#1a1a1a] rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                                                  <img src={detail.weapon.icon} alt={detail.weapon.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-center text-white py-0.5 font-bold">R{detail.weapon.affix_level}</div>
                                             </div>
                                             
                                             <div className="flex-1 relative z-10">
                                                 <h4 className="text-slate-100 font-bold text-lg leading-tight">{detail.weapon.name}</h4>
                                                 <p className="text-slate-400 text-xs mb-2">Lv.{detail.weapon.level}</p>
                                                 <div className="flex gap-4">
                                                     <div>
                                                         <div className="text-[10px] text-slate-500 uppercase font-bold">Base ATK</div>
                                                         <div className="text-slate-200 font-mono font-bold">{detail.weapon.stats.primary_value}</div>
                                                     </div>
                                                     {detail.weapon.stats.secondary_stat && (
                                                         <div>
                                                             <div className="text-[10px] text-slate-500 uppercase font-bold truncate max-w-[100px]">{detail.weapon.stats.secondary_stat}</div>
                                                             <div className={`font-mono font-bold ${textColor}`}>{detail.weapon.stats.secondary_value}</div>
                                                         </div>
                                                     )}
                                                 </div>
                                             </div>
                                         </div>
                                     </div>

                                     {/* Talents */}
                                     <div>
                                         <div className="flex items-center gap-2 mb-4">
                                            <Zap size={18} className="text-slate-400" />
                                            <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Talents</h3>
                                         </div>
                                         <div className="flex gap-3">
                                             {detail.skills.slice(0, 3).map((skill, idx) => (
                                                 <div key={skill.skill_id} className="flex-1 bg-black/40 rounded-xl border border-white/10 p-3 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors group">
                                                     <div className="w-10 h-10 rounded-full bg-black/50 p-1 border border-white/10 group-hover:border-white/30 transition-colors">
                                                         <img src={skill.icon} alt="Skill" className="w-full h-full object-contain opacity-80 group-hover:opacity-100" referrerPolicy="no-referrer" />
                                                     </div>
                                                     <div className="text-center">
                                                         <div className={`text-xs font-bold ${textColor} bg-white/5 px-2 py-0.5 rounded`}>Lv.{skill.level}</div>
                                                         <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider hidden sm:block">{idx === 0 ? "Normal" : idx === 1 ? "Skill" : "Burst"}</div>
                                                     </div>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>
                                </section>

                                {/* 3. Artifacts Grid */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-slate-200 uppercase tracking-wider">Artifacts</span>
                                            <div className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">Score Policy: Standard</div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                                        {detail.relics.map(relic => (
                                            <div key={relic.id} className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-lg border border-white/10 overflow-hidden group hover:border-white/20 transition-all">
                                                {/* Header */}
                                                <div className="p-3 border-b border-white/5 flex gap-3 h-16 relative overflow-hidden">
                                                     <div className="w-10 h-10 shrink-0 z-10">
                                                         <img src={relic.icon} alt="" className="w-full h-full object-contain drop-shadow-md" referrerPolicy="no-referrer" />
                                                     </div>
                                                     <div className="relative z-10">
                                                         <div className="text-xs text-slate-300 font-bold line-clamp-2 leading-tight">{relic.set.name}</div>
                                                         <div className={`text-[10px] mt-1 ${textColor} opacity-80`}>+{relic.level}</div>
                                                     </div>
                                                     {/* Subtle BG Icon */}
                                                     <img src={relic.icon} className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 rotate-12 pointer-events-none" referrerPolicy="no-referrer" />
                                                </div>
                                                
                                                {/* Main Stat */}
                                                <div className="px-3 py-2 bg-black/20 flex justify-between items-center border-b border-white/5">
                                                     <span className="text-[10px] text-slate-400 uppercase font-bold truncate max-w-[60%]">{relic.main_property.display_name}</span>
                                                     <span className="text-slate-100 font-bold text-sm">{relic.main_property.display_value}</span>
                                                </div>

                                                {/* Substats */}
                                                <div className="p-3 space-y-1">
                                                    {relic.sub_property_list.map((sub, i) => (
                                                        <div key={i} className="flex justify-between items-center text-xs group/sub">
                                                            <span className="text-slate-500 group-hover/sub:text-slate-400 transition-colors truncate pr-2">
                                                                {sub.display_name.replace('Percentage', '').replace('Elemental Mastery', 'EM').replace('Energy Recharge', 'ER')}
                                                            </span>
                                                            <span className="text-slate-300 font-mono">{sub.display_value}</span>
                                                        </div>
                                                    ))}
                                                    {/* Filler for uniform height if needed */}
                                                    {Array.from({length: 4 - relic.sub_property_list.length}).map((_, i) => (
                                                        <div key={`fill-${i}`} className="h-4"></div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        {Array.from({ length: 5 - detail.relics.length }).map((_, i) => (
                                             <div key={`empty-${i}`} className="bg-white/5 border border-white/5 border-dashed rounded-lg flex items-center justify-center min-h-[200px] text-slate-600 text-xs">
                                                 No Artifact
                                             </div>
                                        ))}
                                    </div>
                                </section>
                                
                                <div className="h-8"></div>
                            </div>
                        </div>
                    </>
                ) : null}
             </div>
        </div>
    );
};

const CharacterCard: React.FC<{ char: Character; onClick: () => void }> = ({ char, onClick }) => {
    // Determine border color based on rarity - Thicker and brighter
    const borderClass = char.rarity === 5 
        ? "border-2 border-yellow-500/50 shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)]" 
        : "border-2 border-purple-500/50 shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)]";

    const friendshipClass = char.friendship === 10
        ? "text-pink-400 bg-pink-900/20 border-pink-800/50"
        : "text-slate-400 bg-slate-800 border-slate-700";

    return (
        <button 
            onClick={onClick}
            className={`w-full text-left group relative bg-[#131720] rounded-xl shadow-md ${borderClass} overflow-hidden hover:shadow-2xl hover:border-opacity-100 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-[#4e6c8e] active:scale-[0.98]`}
        >
            {/* Background Element Gradient - Darker */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${BG_GRADIENTS[char.element]} opacity-20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:opacity-40 transition-opacity duration-500`}></div>

            <div className="relative aspect-[3/4] overflow-hidden bg-[#0c0f16]">
                {/* Character Image */}
                <img 
                    src={char.image} 
                    alt={char.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10" 
                    referrerPolicy="no-referrer"
                />
                
                {/* Top overlay info */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                     <div className={`w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/10 p-1`}>
                        {ELEMENT_ICONS[char.element]}
                     </div>
                </div>
                
                {/* Bottom Gradient for text readability */}
                <div className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-[#131720] via-[#131720]/80 to-transparent z-10"></div>
                
                <div className="absolute bottom-0 inset-x-0 p-3 z-20">
                     <h3 className="font-bold text-base text-slate-100 leading-tight truncate drop-shadow-sm mb-1 group-hover:text-white transition-colors">{char.name}</h3>
                     <div className="flex justify-between items-end">
                        <div className="flex text-yellow-500 drop-shadow-sm gap-[1px]">
                           {Array.from({ length: char.rarity }).map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                        </div>
                        <span className="text-[10px] bg-black/60 text-slate-300 px-1.5 py-0.5 rounded backdrop-blur-md border border-white/10 font-mono">Lv.{char.level}</span>
                     </div>
                </div>
            </div>

            <div className="px-3 py-2 bg-[#181d29] relative z-10 grid grid-cols-2 gap-2 border-t border-white/5">
                <div className={`flex items-center justify-center py-1 rounded text-[10px] font-bold border bg-slate-800 border-slate-700 text-slate-300`}>
                     <span className="mr-1 opacity-50">C</span>
                     <span>{char.constellation}</span>
                </div>
                <div className={`flex items-center justify-center gap-1.5 py-1 rounded text-[10px] font-bold border ${friendshipClass}`}>
                    <Heart size={10} className={char.friendship === 10 ? "fill-current" : ""} />
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
          if (b.rarity !== a.rarity) return b.rarity - a.rarity;
          if (b.level !== a.level) return b.level - a.level;
          return a.name.localeCompare(b.name);
      });
  }, [data.characters, search, filterElement]);

  const elements: ElementType[] = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
        <div className="sticky top-0 z-30 bg-[#0c0f16]/95 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/5 md:static md:bg-transparent md:border-0 md:p-0 md:mx-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-100 tracking-tight">My Characters</h2>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                        <span>Total: <span className="text-slate-200 font-bold">{data.characters.length}</span></span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span>Level 90: <span className="text-slate-200 font-bold">{data.characters.filter(c => c.level === 90).length}</span></span>
                    </p>
                </div>

                <div className="w-full md:w-auto flex flex-col gap-3">
                    <div className="relative group w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#4e6c8e]" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find a character..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-[#131720] border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4e6c8e]/50 focus:border-[#4e6c8e] w-full md:w-64 transition-all shadow-inner"
                        />
                    </div>
                </div>
            </div>

            <div className="flex overflow-x-auto gap-2 mt-5 pb-2 md:pb-0 no-scrollbar">
                <button
                    onClick={() => setFilterElement('All')}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                        filterElement === 'All' 
                        ? 'bg-slate-100 text-slate-900 border-slate-100' 
                        : 'bg-[#131720] text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200'
                    }`}
                >
                    All
                </button>
                {elements.map(el => (
                    <button
                        key={el}
                        onClick={() => setFilterElement(el)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${
                            filterElement === el
                            ? 'bg-[#1c212e] text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                            : 'bg-[#131720] text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200'
                        }`}
                    >
                        <div className="w-4 h-4">
                             {ELEMENT_ICONS[el]}
                        </div>
                        {el}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredCharacters.map(char => (
                <CharacterCard 
                    key={char.id} 
                    char={char} 
                    onClick={() => setSelectedChar(char)}
                />
            ))}
            {filteredCharacters.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500 bg-[#131720] rounded-2xl border border-dashed border-white/5">
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
