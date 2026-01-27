
import React, { useState, useMemo, useEffect } from 'react';
import { UserData, Character, ElementType, CharacterDetailData } from '../types';
import { ELEMENT_ICONS, BG_GRADIENTS } from '../constants';
import { Search, Star, Filter, Heart, X, Loader2, Info } from 'lucide-react';
import { fetchCharacterDetail } from '../services/api';

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
                // Fallback: Create partial detail from character prop to at least show something
                // This handles cases where API fetch might fail or lacks permissions
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [character.id, userData]);

    const stopProp = (e: React.MouseEvent) => e.stopPropagation();

    // Use fetched detail or fallback to basic char props
    const displayImage = detail?.base.image || character.image;
    const displayName = detail?.base.name || character.name;
    const displayLevel = detail?.base.level || character.level;
    const displayFetter = detail?.base.fetter || character.friendship;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div 
                className="bg-[#131720] border border-white/20 w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
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
                     <div className={`absolute inset-0 bg-gradient-to-br ${BG_GRADIENTS[character.element]} opacity-60 mix-blend-overlay`}></div>
                     <img 
                        src={displayImage} 
                        alt={displayName} 
                        className="absolute inset-0 w-full h-full object-cover object-top scale-110" 
                        referrerPolicy="no-referrer"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#131720] via-transparent to-transparent"></div>
                     
                     <div className="absolute bottom-0 left-0 p-8 w-full">
                         <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center p-1.5 shadow-lg">
                                 {ELEMENT_ICONS[character.element]}
                             </div>
                             <div className="flex text-yellow-400 drop-shadow-md">
                                 {Array.from({ length: character.rarity }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                             </div>
                         </div>
                         <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-wide drop-shadow-xl mb-2">{displayName}</h2>
                         <div className="flex gap-3 text-slate-300 font-medium">
                             <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                                 Lv. {displayLevel}
                             </span>
                             <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/5 flex items-center gap-1">
                                 <Heart size={14} className="text-pink-400 fill-pink-400" /> {displayFetter}
                             </span>
                         </div>
                     </div>
                </div>

                {/* RIGHT: Details Panel */}
                <div className="flex-1 flex flex-col bg-[#0c0f16]/95 backdrop-blur-xl relative">
                    <div className="flex border-b border-white/10 px-6 pt-4 gap-6 overflow-x-auto no-scrollbar">
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

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                <Loader2 size={40} className="animate-spin text-[#d3bc8e]" />
                                <p>Consulting Irminsul...</p>
                            </div>
                        ) : !detail ? (
                            <div className="text-center mt-20 space-y-4">
                                <p className="text-red-400">Detailed stats unavailable.</p>
                                <p className="text-sm text-slate-500">The API didn't return enhanced details. Showing basic info.</p>
                                {/* Fallback View */}
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 inline-block text-left">
                                     <p><strong>Weapon:</strong> {character.weapon?.name || "Unknown"}</p>
                                     <p><strong>Artifact Set:</strong> {character.artifacts?.[0]?.set || "None"}</p>
                                </div>
                            </div>
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
                                                     { label: "Crit Rate", value: detail.properties.cr.final, icon: "🎯" },
                                                     { label: "Crit DMG", value: detail.properties.cd.final, icon: "💥" },
                                                     { label: "Elemental Mastery", value: detail.properties.em.final, icon: "🍃" },
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
                                                    <div className="w-14 h-14 shrink-0 bg-[#1c212e] rounded-full border border-white/10 overflow-hidden relative">
                                                        <img src={relic.icon} alt={relic.name} className="w-full h-full object-cover scale-75" referrerPolicy="no-referrer" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`font-bold text-sm ${relic.rarity === 5 ? 'text-yellow-200' : 'text-purple-200'}`}>{relic.name}</h4>
                                                        <p className="text-[10px] text-slate-400 uppercase mt-0.5">{relic.set.name}</p>
                                                        <div className="mt-2 text-xs text-[#d3bc8e] font-bold">
                                                            {relic.main_property.display_name}: {relic.main_property.display_value}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {activeTab === 'constellation' && (
                                    <div className="space-y-3">
                                        {detail.constellations.map((c) => (
                                            <div key={c.id} className={`flex gap-3 p-3 rounded-xl border ${c.is_actived ? 'bg-white/10 border-[#d3bc8e]/30' : 'bg-black/20 border-white/5 opacity-50'}`}>
                                                <div className="w-10 h-10 shrink-0 rounded-full bg-black/40 flex items-center justify-center border border-white/10">
                                                    <img src={c.icon} alt={c.name} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-sm ${c.is_actived ? 'text-white' : 'text-slate-500'}`}>{c.name}</h4>
                                                    <p className="text-[10px] text-slate-400 mt-1" dangerouslySetInnerHTML={{ __html: c.effect.replace(/\\n/g, ' ') }} />
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

// --- Mini Card Component for Denser Grid ---

const MiniTarotCard: React.FC<{ char: Character; onClick: () => void }> = ({ char, onClick }) => {
    // Determine gradient based on Element
    const gradient = BG_GRADIENTS[char.element] || 'from-slate-800 to-transparent';
    
    return (
        <button 
            onClick={onClick}
            className="group relative w-full aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-white/10 bg-[#131720]"
        >
            {/* Background Image */}
            <div className="absolute inset-0 bg-slate-800">
                <img 
                    src={char.image} 
                    alt={char.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                />
            </div>
            
            {/* Vibrant Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-40 group-hover:opacity-60 transition-opacity mix-blend-hard-light`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Compact Info Overlay */}
            <div className="absolute inset-0 p-2 flex flex-col justify-between">
                {/* Top: Element & Stars */}
                <div className="flex justify-between items-start">
                    <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center p-0.5 shadow-lg">
                        {React.cloneElement(ELEMENT_ICONS[char.element] as React.ReactElement<any>, { size: 14 })}
                    </div>
                    {char.rarity === 5 && (
                        <div className="text-yellow-400 drop-shadow-md">
                            <Star size={12} fill="currentColor" />
                        </div>
                    )}
                </div>

                {/* Bottom: Name & Level only */}
                <div className="text-left translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-[10px] text-slate-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">Lv.{char.level}</div>
                    <div className="text-xs font-bold text-white truncate drop-shadow-md">{char.name}</div>
                    {/* Cons level if > 0 */}
                    {char.constellation > 0 && (
                        <div className="absolute -top-6 right-0 bg-[#d3bc8e] text-black text-[9px] font-bold px-1 rounded-sm">
                            C{char.constellation}
                        </div>
                    )}
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
    <div className="animate-fade-in space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
            <div>
                <h1 className="text-3xl font-serif font-black text-white tracking-wide mb-1">Roster</h1>
                <p className="text-slate-400 text-sm font-sans">
                    <strong className="text-white">{data.characters?.length}</strong> Companions
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                 {/* Search */}
                 <div className="relative group">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d3bc8e] transition-colors" size={16} />
                     <input 
                        type="text" 
                        placeholder="Search..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-48 bg-[#131720] border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#d3bc8e]/50 focus:ring-1 focus:ring-[#d3bc8e]/20 transition-all placeholder:text-slate-600"
                     />
                 </div>
                 
                 {/* Element Filter (Compact) */}
                 <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                     <button 
                        onClick={() => setFilterElement('All')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
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
                             className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                 filterElement === el 
                                 ? 'bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                                 : 'bg-[#131720] border-white/5 text-slate-600 hover:text-slate-300 hover:border-white/20'
                             }`}
                             title={el}
                         >
                             {React.cloneElement(ELEMENT_ICONS[el as ElementType] as React.ReactElement<any>, { size: 14 })}
                         </button>
                     ))}
                 </div>
            </div>
        </div>

        {/* Denser Grid for "Small" Cards */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {filtered.map(char => (
                <MiniTarotCard key={char.id} char={char} onClick={() => setSelectedChar(char)} />
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
