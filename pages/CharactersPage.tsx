
import React, { useState, useMemo, useEffect } from 'react';
import { UserData, Character, ElementType, CharacterDetailData } from '../types';
import { ELEMENT_ICONS, BG_GRADIENTS } from '../constants';
import { Search, Star, Heart, X, Loader2, Info } from 'lucide-react';
import { fetchCharacterDetail } from '../services/api';

interface CharactersPageProps {
  data: UserData;
}

// --- Character Modal Component (Unchanged logic, just ensure z-index is high) ---

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
    const displayImage = detail?.base.image || character.image;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div 
                className="bg-[#131720] border border-white/20 w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                onClick={stopProp}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white border border-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* LEFT: Art */}
                <div className="w-full md:w-5/12 relative h-48 md:h-full shrink-0 overflow-hidden bg-[#0c0f16]">
                     <div className={`absolute inset-0 bg-gradient-to-br ${BG_GRADIENTS[character.element]} opacity-60 mix-blend-overlay`}></div>
                     <img 
                        src={displayImage} 
                        alt={character.name} 
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
                         <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-wide drop-shadow-xl mb-2">{character.name}</h2>
                         <div className="flex gap-3 text-slate-300 font-medium">
                             <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                                 Lv. {character.level}
                             </span>
                         </div>
                     </div>
                </div>

                {/* RIGHT: Stats */}
                <div className="flex-1 flex flex-col bg-[#0c0f16]/95 backdrop-blur-xl relative">
                    <div className="flex border-b border-white/10 px-6 pt-4 gap-6 overflow-x-auto no-scrollbar">
                        {['stats', 'artifacts', 'constellation'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-[#ffe175] border-[#ffe175]' 
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
                                <Loader2 size={40} className="animate-spin text-[#ffe175]" />
                                <p>Consulting Irminsul...</p>
                            </div>
                        ) : !detail ? (
                            <div className="text-center mt-20 text-slate-500">
                                Detailed stats unavailable.
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                {activeTab === 'stats' && (
                                    <div className="space-y-6">
                                        {/* Weapon */}
                                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ffe175]/20 to-transparent border border-[#ffe175]/30 shrink-0">
                                                <img src={detail.weapon.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-[#ffe175] font-bold uppercase mb-0.5">Weapon</div>
                                                <h3 className="text-lg font-bold text-white">{detail.weapon.name}</h3>
                                                <div className="text-xs text-slate-400">Lv. {detail.weapon.level} • R{detail.weapon.affix_level}</div>
                                            </div>
                                        </div>

                                        {/* Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                             {[
                                                 { label: "Max HP", value: detail.properties.hp.final },
                                                 { label: "ATK", value: detail.properties.atk.final },
                                                 { label: "DEF", value: detail.properties.def.final },
                                                 { label: "Crit Rate", value: detail.properties.cr.final },
                                                 { label: "Crit DMG", value: detail.properties.cd.final },
                                                 { label: "EM", value: detail.properties.em.final },
                                             ].map((stat, i) => (
                                                 <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                     <span className="text-slate-400 text-xs font-bold uppercase">{stat.label}</span>
                                                     <span className="text-white font-mono font-bold text-sm">{stat.value}</span>
                                                 </div>
                                             ))}
                                        </div>
                                    </div>
                                )}
                                {/* Other tabs logic remains similar but compacted if needed */}
                                {activeTab === 'artifacts' && (
                                    <div className="space-y-3">
                                         {detail.relics.length === 0 ? <p className="text-slate-500 text-center">None equipped</p> : 
                                            detail.relics.map(r => (
                                                <div key={r.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                                    <img src={r.icon} className="w-10 h-10" referrerPolicy="no-referrer" />
                                                    <div>
                                                        <div className="text-xs text-[#ffe175]">{r.name}</div>
                                                        <div className="text-[10px] text-slate-400">{r.main_property.display_name} +{r.main_property.display_value}</div>
                                                    </div>
                                                </div>
                                            ))
                                         }
                                    </div>
                                )}
                                {activeTab === 'constellation' && (
                                     <div className="grid grid-cols-1 gap-2">
                                         {detail.constellations.map(c => (
                                             <div key={c.id} className={`p-3 rounded-xl border flex items-center gap-3 ${c.is_actived ? 'bg-white/10 border-[#ffe175]/30' : 'bg-black/20 border-white/5 opacity-50'}`}>
                                                 <img src={c.icon} className="w-8 h-8" referrerPolicy="no-referrer" />
                                                 <div className="text-xs font-bold text-white">{c.name}</div>
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

// --- Very Compact Card ---

const MicroTarotCard: React.FC<{ char: Character; onClick: () => void }> = ({ char, onClick }) => {
    const gradient = BG_GRADIENTS[char.element] || 'from-slate-800 to-transparent';
    
    return (
        <button 
            onClick={onClick}
            className="group relative w-full aspect-[3/4.2] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10 bg-[#131720]"
        >
            <div className="absolute inset-0 bg-slate-800">
                <img 
                    src={char.image} 
                    alt={char.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                />
            </div>
            
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-50 mix-blend-hard-light`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

            <div className="absolute inset-0 p-2 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center p-0.5 shadow-lg">
                        {React.cloneElement(ELEMENT_ICONS[char.element] as React.ReactElement<any>, { size: 12 })}
                    </div>
                    {char.rarity === 5 && <Star size={10} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />}
                </div>

                <div className="text-left translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-[9px] text-slate-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">Lv.{char.level}</div>
                    <div className="text-[11px] font-bold text-white truncate leading-tight">{char.name}</div>
                    {char.constellation > 0 && (
                        <div className="absolute -top-5 right-0 bg-[#ffe175] text-black text-[8px] font-black px-1 rounded-sm shadow-sm">
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
        .sort((a,b) => b.level - a.level); 
  }, [data.characters, search, filterElement]);

  return (
    <div className="animate-fade-in h-full flex flex-col">
        {/* Header */}
        <div className="flex-none flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-4 mb-4">
            <div>
                <h1 className="text-2xl font-serif font-black text-white tracking-wide">Roster</h1>
                <p className="text-slate-400 text-xs">
                    <strong className="text-white">{data.characters?.length}</strong> Companions
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                 <div className="relative group">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ffe175] transition-colors" size={14} />
                     <input 
                        type="text" 
                        placeholder="Search..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-40 bg-[#131720] border border-white/10 rounded-full py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-[#ffe175]/50 focus:ring-1 focus:ring-[#ffe175]/20 transition-all placeholder:text-slate-600"
                     />
                 </div>
                 
                 <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                     <button 
                        onClick={() => setFilterElement('All')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            filterElement === 'All' 
                            ? 'bg-[#ffe175] text-[#080a0f] border-[#ffe175]' 
                            : 'bg-[#131720] text-slate-500 border-white/5 hover:border-white/20'
                        }`}
                     >
                         All
                     </button>
                     {['Pyro','Hydro','Anemo','Electro','Dendro','Cryo','Geo'].map((el) => (
                         <button 
                             key={el}
                             onClick={() => setFilterElement(el as ElementType)}
                             className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                                 filterElement === el 
                                 ? 'bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                                 : 'bg-[#131720] border-white/5 text-slate-600 hover:text-slate-300 hover:border-white/20'
                             }`}
                             title={el}
                         >
                             {React.cloneElement(ELEMENT_ICONS[el as ElementType] as React.ReactElement<any>, { size: 12 })}
                         </button>
                     ))}
                 </div>
            </div>
        </div>

        {/* Scrollable Grid Area - Denser Layout */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar pb-20">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2.5">
                {filtered.map(char => (
                    <MicroTarotCard key={char.id} char={char} onClick={() => setSelectedChar(char)} />
                ))}
            </div>
            
            {filtered.length === 0 && (
                <div className="py-20 text-center text-slate-600 font-serif italic text-sm">
                    No companions found.
                </div>
            )}
        </div>

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
