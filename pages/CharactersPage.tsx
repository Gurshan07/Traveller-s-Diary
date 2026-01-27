
import React, { useState, useMemo, useEffect } from 'react';
import { UserData, Character, ElementType, CharacterDetailData } from '../types';
import { ELEMENT_ICONS, BG_GRADIENTS, ELEMENT_COLORS } from '../constants';
import { Search, Star, Filter, ArrowUpRight, Shield, Sword, Sparkles, Heart, X, Loader2, Info } from 'lucide-react';
import { fetchCharacterDetail } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CharactersPageProps {
  data: UserData;
}

// --- Character Modal Component ---

const CharacterDetailModal: React.FC<{ 
    character: Character; 
    onClose: () => void; 
    userData: UserData 
}> = ({ character, onClose, userData }) => {
    const [detail, setDetail] = useState<CharacterDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'stats' | 'artifacts' | 'constellation'>('stats');

    useEffect(() => {
        const loadDetail = async () => {
            try {
                setLoading(true);
                const data = await fetchCharacterDetail(userData, character.id);
                setDetail(data);
            } catch (e) {
                console.error("Failed to load char detail", e);
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [character.id, userData]);

    const stopProp = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div 
                className="bg-[#131720] border border-white/10 w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
                onClick={stopProp}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white border border-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* LEFT: Character Art & Basic Info */}
                <div className="w-full md:w-5/12 relative h-64 md:h-full shrink-0 overflow-hidden">
                     {/* Background & Art */}
                     <div className={`absolute inset-0 bg-gradient-to-br ${BG_GRADIENTS[character.element]} opacity-50`}></div>
                     <img 
                        src={detail?.base.image || character.image} 
                        alt={character.name} 
                        className="absolute inset-0 w-full h-full object-cover object-top scale-110" 
                        referrerPolicy="no-referrer"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#131720] via-transparent to-transparent"></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-[#131720]/50 to-transparent md:hidden"></div>
                     
                     {/* Info Overlay */}
                     <div className="absolute bottom-0 left-0 p-8 w-full">
                         <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center p-1.5 shadow-lg">
                                 {ELEMENT_ICONS[character.element]}
                             </div>
                             <div className="flex text-yellow-400 drop-shadow-md">
                                 {Array.from({ length: character.rarity }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                             </div>
                         </div>
                         <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-wide drop-shadow-xl mb-2">{character.name}</h2>
                         <div className="flex gap-3 text-slate-300 font-medium">
                             <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                                 Lv. {detail?.base.level || character.level}
                             </span>
                             <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/5 flex items-center gap-1">
                                 <Heart size={14} className="text-pink-400 fill-pink-400" /> {detail?.base.fetter || character.friendship}
                             </span>
                         </div>
                     </div>
                </div>

                {/* RIGHT: Details Panel */}
                <div className="flex-1 flex flex-col bg-[#0c0f16]/95 backdrop-blur-xl relative">
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-white/5 px-6 pt-4 gap-6 overflow-x-auto no-scrollbar">
                        {['stats', 'artifacts', 'constellation'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-[#d3bc8e] border-[#d3bc8e]' 
                                    : 'text-slate-500 border-transparent hover:text-slate-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                <Loader2 size={40} className="animate-spin text-[#d3bc8e]" />
                                <p>Consulting Irminsul...</p>
                            </div>
                        ) : !detail ? (
                            <div className="text-center text-red-400 mt-20">Failed to load detailed data.</div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                
                                {activeTab === 'stats' && (
                                    <div className="space-y-8">
                                        {/* Weapon Card */}
                                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#d3bc8e]/20 to-transparent border border-[#d3bc8e]/30 shrink-0">
                                                <img src={detail.weapon.icon} alt={detail.weapon.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-[#d3bc8e] font-bold uppercase mb-1">Equipped Weapon</div>
                                                <h3 className="text-xl font-bold text-white">{detail.weapon.name}</h3>
                                                <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                                                    <span>Lv. {detail.weapon.level}</span>
                                                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-slate-300">R{detail.weapon.affix_level}</span>
                                                </div>
                                                <div className="mt-2 text-xs text-slate-500 flex gap-4">
                                                     <span>{detail.weapon.stats.primary_stat}: <span className="text-white">{detail.weapon.stats.primary_value}</span></span>
                                                     {detail.weapon.stats.secondary_stat && (
                                                         <span>{detail.weapon.stats.secondary_stat}: <span className="text-[#d3bc8e]">{detail.weapon.stats.secondary_value}</span></span>
                                                     )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Attributes Grid */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Info size={16} /> Combat Attributes</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                 {[
                                                     { label: "Max HP", value: detail.properties.hp.final, icon: "❤️" },
                                                     { label: "ATK", value: detail.properties.atk.final, icon: "⚔️" },
                                                     { label: "DEF", value: detail.properties.def.final, icon: "🛡️" },
                                                     { label: "Elemental Mastery", value: detail.properties.em.final, icon: "🍃" },
                                                     { label: "Crit Rate", value: detail.properties.cr.final, icon: "🎯" },
                                                     { label: "Crit DMG", value: detail.properties.cd.final, icon: "💥" },
                                                     { label: "Energy Recharge", value: detail.properties.er.final, icon: "⚡" },
                                                     { label: "Elemental DMG", value: detail.properties.elem.final, icon: "🔮" },
                                                 ].map((stat, i) => (
                                                     <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                         <span className="text-slate-400 text-sm flex items-center gap-2">{stat.icon} {stat.label}</span>
                                                         <span className="text-white font-mono font-bold">{stat.value}</span>
                                                     </div>
                                                 ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'artifacts' && (
                                    <div className="space-y-4">
                                        {detail.relics.length === 0 ? (
                                            <div className="text-center text-slate-500 py-10">No artifacts equipped.</div>
                                        ) : (
                                            detail.relics.map((relic) => (
                                                <div key={relic.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex gap-4">
                                                    <div className="w-16 h-16 shrink-0 bg-[#1c212e] rounded-full border border-white/10 overflow-hidden relative">
                                                        <div className={`absolute inset-0 bg-gradient-to-b ${relic.rarity === 5 ? 'from-yellow-600/20' : 'from-purple-600/20'} to-transparent`}></div>
                                                        <img src={relic.icon} alt={relic.name} className="w-full h-full object-cover scale-75" referrerPolicy="no-referrer" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className={`font-bold text-sm ${relic.rarity === 5 ? 'text-yellow-200' : 'text-purple-200'}`}>{relic.name}</h4>
                                                                <p className="text-[10px] text-slate-400 uppercase mt-0.5">{relic.set.name}</p>
                                                            </div>
                                                            <span className="bg-[#1c212e] px-2 py-0.5 rounded text-xs text-[#d3bc8e] border border-[#d3bc8e]/20">+{relic.level}</span>
                                                        </div>
                                                        
                                                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                                                            <div className="w-full text-[#d3bc8e] font-bold text-sm flex justify-between border-b border-white/5 pb-1 mb-1">
                                                                <span>{relic.main_property.display_name}</span>
                                                                <span>{relic.main_property.display_value}</span>
                                                            </div>
                                                            {relic.sub_property_list.map((sub, i) => (
                                                                <div key={i} className="text-xs text-slate-300 flex items-center gap-1 w-[45%]">
                                                                    <span>• {sub.display_name}</span>
                                                                    <span className="ml-auto font-mono text-slate-400">+{sub.display_value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'constellation' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 mb-6">
                                             <div className="text-6xl font-black text-[#d3bc8e] opacity-20">C{detail.base.actived_constellation_num}</div>
                                             <div>
                                                 <h3 className="text-lg font-bold text-white">Constellation Level</h3>
                                                 <p className="text-slate-400 text-sm">Unlock constellations to enhance abilities.</p>
                                             </div>
                                        </div>
                                        
                                        {detail.constellations.map((c) => (
                                            <div key={c.id} className={`flex gap-4 p-4 rounded-2xl border ${c.is_actived ? 'bg-white/10 border-[#d3bc8e]/30' : 'bg-black/20 border-white/5 opacity-50'}`}>
                                                <div className="w-12 h-12 shrink-0 rounded-full bg-black/40 flex items-center justify-center border border-white/10">
                                                    <img src={c.icon} alt={c.name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold ${c.is_actived ? 'text-white' : 'text-slate-500'}`}>{c.name}</h4>
                                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: c.effect.replace(/\\n/g, '<br/>') }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

const TarotCard: React.FC<{ char: Character; onClick: () => void }> = ({ char, onClick }) => {
    // Determine gradient based on Element
    const gradient = BG_GRADIENTS[char.element] || 'from-slate-800 to-transparent';
    
    return (
        <button 
            onClick={onClick}
            className="group relative w-full aspect-[9/16] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/5 bg-[#131720]"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src={char.image} 
                    alt={char.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                />
            </div>
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-80 mix-blend-multiply`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-transparent to-transparent opacity-90"></div>

            {/* Content Layout */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
                {/* Top: Element & Stars */}
                <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center p-1 shadow-lg">
                        {ELEMENT_ICONS[char.element]}
                    </div>
                    {char.rarity === 5 && (
                        <div className="flex gap-0.5 text-yellow-400 drop-shadow-md">
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                        </div>
                    )}
                </div>

                {/* Bottom: Name & Level */}
                <div className="text-left">
                    <h3 className="text-xl font-serif font-bold text-white leading-none mb-1 drop-shadow-md group-hover:text-[#d3bc8e] transition-colors">{char.name}</h3>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
                        <span className="bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">Lv.{char.level}</span>
                        <span className="flex items-center gap-1">
                            <span className="opacity-50">C</span>{char.constellation}
                        </span>
                        <span className="flex items-center gap-1">
                             <Heart size={10} className={char.friendship === 10 ? "fill-pink-500 text-pink-500" : "text-slate-500"} />
                             {char.friendship}
                        </span>
                    </div>
                </div>
            </div>

            {/* Hover Reveal: Weapon Icon */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                 <div className="text-[#d3bc8e] font-serif font-bold text-lg mb-2">Build Summary</div>
                 <div className="text-xs text-slate-300 mb-1">Weapon</div>
                 <div className="font-bold text-white mb-4">{char.weapon?.name}</div>
                 <div className="text-xs text-slate-300 mb-1">Artifacts</div>
                 <div className="font-bold text-white text-xs">
                     {char.artifacts && char.artifacts.length > 0 
                        ? char.artifacts.map(a => a.set).join(', ').slice(0, 30) + (char.artifacts[0]?.set.length > 30 ? '...' : '') 
                        : 'None'}
                 </div>
                 <div className="mt-6 flex items-center gap-2 text-[#d3bc8e] text-xs font-bold uppercase tracking-widest">
                     View Details <ArrowUpRight size={14} />
                 </div>
            </div>
        </button>
    );
};

const CharactersPage: React.FC<CharactersPageProps> = ({ data }) => {
  const [search, setSearch] = useState('');
  const [filterElement, setFilterElement] = useState<ElementType | 'All'>('All');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  
  const filtered = useMemo(() => {
     return (data.characters || [])
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        .filter(c => filterElement === 'All' || c.element === filterElement)
        .sort((a,b) => b.level - a.level); // Sort by level default
  }, [data.characters, search, filterElement]);

  return (
    <div className="animate-fade-in space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
            <div>
                <h1 className="text-4xl font-serif font-black text-white tracking-wide mb-2">Roster</h1>
                <p className="text-slate-400 font-sans">
                    Managing <strong className="text-white">{data.characters?.length}</strong> companions
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                 {/* Search */}
                 <div className="relative group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d3bc8e] transition-colors" size={18} />
                     <input 
                        type="text" 
                        placeholder="Search by name..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64 bg-[#131720] border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#d3bc8e]/50 focus:ring-1 focus:ring-[#d3bc8e]/20 transition-all placeholder:text-slate-600"
                     />
                 </div>
                 
                 {/* Element Filter */}
                 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                     <button 
                        onClick={() => setFilterElement('All')}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                            filterElement === 'All' 
                            ? 'bg-[#d3bc8e] text-[#080a0f] border-[#d3bc8e]' 
                            : 'bg-[#131720] text-slate-500 border-white/5 hover:border-white/20'
                        }`}
                     >
                         All
                     </button>
                     {['Pyro','Hydro','Anemo','Electro','Dendro','Cryo','Geo'].map((el) => (
                         <button 
                             key={el}
                             onClick={() => setFilterElement(el as ElementType)}
                             className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                                 filterElement === el 
                                 ? 'bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                                 : 'bg-[#131720] border-white/5 text-slate-600 hover:text-slate-300 hover:border-white/20'
                             }`}
                             title={el}
                         >
                             {React.cloneElement(ELEMENT_ICONS[el as ElementType] as React.ReactElement<any>, { size: 18 })}
                         </button>
                     ))}
                 </div>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filtered.map(char => (
                <TarotCard key={char.id} char={char} onClick={() => setSelectedChar(char)} />
            ))}
        </div>
        
        {filtered.length === 0 && (
            <div className="py-20 text-center text-slate-600 font-serif italic">
                No companions found matching your criteria.
            </div>
        )}

        {/* Detail Modal */}
        {selectedChar && (
            <CharacterDetailModal 
                character={selectedChar} 
                userData={data}
                onClose={() => setSelectedChar(null)} 
            />
        )}
    </div>
  );
};

export default CharactersPage;
