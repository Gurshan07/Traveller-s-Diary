
import React, { useState, useMemo, useEffect } from 'react';
import { UserData, Character, ElementType, CharacterDetailData } from '../types';
import { ELEMENT_ICONS, BG_GRADIENTS } from '../constants';
import { Search, Star, Heart, X, Loader2, Info, ChevronRight } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'Attributes' | 'Weapon' | 'Artifacts' | 'Constellation'>('Attributes');

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

    const displayImage = detail?.base.image || character.image;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md animate-fade-in cursor-pointer" 
            onClick={onClose}
        >
            <div 
                className="w-full h-full md:h-[85vh] md:max-w-6xl md:rounded-[2rem] overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(0,0,0,0.8)] cursor-default bg-[#0c0f16]"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Background Layer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${BG_GRADIENTS[character.element]} opacity-20 pointer-events-none`}></div>
                <div className="absolute inset-0 bg-[url('https://upload-os-bbs.hoyolab.com/upload/2021/08/11/1000000/df7e6f8f780829871578f70094931a19_7882046808799799650.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>

                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-30 w-10 h-10 md:w-8 md:h-8 rounded-full bg-black/40 md:bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-md"
                >
                    <X size={20} />
                </button>

                {/* LEFT: Stats & Tabs (In-Game Style: Attributes on Left) */}
                <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-[#0c0f16]/95 backdrop-blur-xl border-r border-white/5 relative z-20 h-full">
                    
                    {/* Header */}
                    <div className="p-6 md:p-8 pb-4 pt-8 md:pt-8">
                        <div className="flex items-center gap-3 mb-1">
                             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                 {React.cloneElement(ELEMENT_ICONS[character.element] as React.ReactElement<any>, { size: 24 })}
                             </div>
                             <div className="min-w-0">
                                 <h2 className="text-2xl md:text-3xl font-serif font-black text-white leading-none uppercase truncate">{character.name}</h2>
                                 <div className="flex text-yellow-400 mt-1">
                                     {Array.from({ length: character.rarity }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Navigation Tabs (Vertical/Horizontal hybrid) */}
                    <div 
                        className="flex px-6 md:px-8 border-b border-white/5 overflow-x-auto gap-6 shrink-0 [&::-webkit-scrollbar]:hidden" 
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {['Attributes', 'Weapon', 'Artifacts', 'Constellation'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-[#ffe175] border-[#ffe175]' 
                                    : 'text-slate-500 border-transparent hover:text-slate-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar pb-24 md:pb-8">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                <Loader2 size={32} className="animate-spin text-[#ffe175]" />
                                <p className="text-xs uppercase tracking-widest">Reading Stars...</p>
                            </div>
                        ) : !detail ? (
                            <div className="text-center mt-10 text-slate-500">Data unavailable.</div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-6">
                                
                                {activeTab === 'Attributes' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                            <span className="text-slate-400 font-bold uppercase text-xs">Level</span>
                                            <span className="text-xl font-black text-white">Lv. {detail.base.level} <span className="text-sm font-normal text-slate-500">/ 90</span></span>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {[
                                                 { label: "Max HP", value: detail.properties.hp.final, icon: "♥️" },
                                                 { label: "ATK", value: detail.properties.atk.final, icon: "⚔️" },
                                                 { label: "DEF", value: detail.properties.def.final, icon: "🛡️" },
                                                 { label: "Elemental Mastery", value: detail.properties.em.final, icon: "🍃" },
                                            ].map((stat, i) => (
                                                 <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                                     <span className="text-slate-400 text-sm font-bold flex items-center gap-2">
                                                         <span className="opacity-50 w-4 text-center">{stat.icon}</span> {stat.label}
                                                     </span>
                                                     <span className="text-white font-mono font-bold text-sm">{stat.value}</span>
                                                 </div>
                                            ))}
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <h3 className="text-xs text-[#ffe175] font-bold uppercase tracking-widest mb-2">Advanced Stats</h3>
                                            {[
                                                 { label: "Crit Rate", value: detail.properties.cr.final },
                                                 { label: "Crit DMG", value: detail.properties.cd.final },
                                                 { label: "Energy Recharge", value: detail.properties.er.final },
                                                 { label: "Elemental DMG Bonus", value: detail.properties.elem.final },
                                            ].map((stat, i) => (
                                                 <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                                     <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
                                                     <span className="text-white font-mono font-bold text-sm">{stat.value}</span>
                                                 </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Weapon' && (
                                    <div>
                                        <div className="relative aspect-video rounded-xl overflow-hidden mb-6 border border-white/10 shadow-lg group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent z-10"></div>
                                            <img src={detail.weapon.icon} className="absolute inset-0 w-full h-full object-contain scale-75 group-hover:scale-90 transition-transform duration-500" referrerPolicy="no-referrer" />
                                            <div className="absolute bottom-4 left-4 z-20">
                                                <div className="text-xs text-[#ffe175] font-bold uppercase mb-1">Equipped</div>
                                                <h3 className="text-xl font-bold text-white">{detail.weapon.name}</h3>
                                            </div>
                                            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono text-white border border-white/10">
                                                R{detail.weapon.affix_level}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-white/5 p-3 rounded-xl">
                                                <div className="text-xs text-slate-500 uppercase font-bold">Base ATK</div>
                                                <div className="text-lg font-bold text-white">{detail.weapon.stats.primary_value}</div>
                                            </div>
                                            {detail.weapon.stats.secondary_stat && (
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <div className="text-xs text-slate-500 uppercase font-bold">{detail.weapon.stats.secondary_stat}</div>
                                                    <div className="text-lg font-bold text-[#ffe175]">{detail.weapon.stats.secondary_value}</div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="text-sm text-slate-400 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                                            {detail.weapon.desc}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Artifacts' && (
                                    <div className="space-y-4">
                                         {detail.relics.length === 0 ? <p className="text-slate-500 text-center py-10">No artifacts equipped</p> : 
                                            detail.relics.map(r => (
                                                <div key={r.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div className="w-12 h-12 bg-black/20 rounded-lg p-1 border border-white/5">
                                                            <img src={r.icon} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-[#ffe175] font-bold uppercase">{r.pos}</div>
                                                            <div className="text-sm font-bold text-white">{r.name}</div>
                                                            <div className="text-[10px] text-green-400 font-bold mt-0.5">{r.set.name}</div>
                                                        </div>
                                                        <div className="ml-auto text-right">
                                                            <div className="text-lg font-black text-white">+{r.level}</div>
                                                            <div className="flex text-yellow-500 justify-end">
                                                                {Array.from({length: r.rarity}).map((_,i) => <Star key={i} size={8} fill="currentColor" />)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-1 pl-16">
                                                        <div className="flex justify-between text-xs font-bold text-slate-200 bg-black/20 px-2 py-1 rounded mb-2">
                                                            <span>{r.main_property.display_name}</span>
                                                            <span>{r.main_property.display_value}</span>
                                                        </div>
                                                        {r.sub_property_list.map((sub, idx) => (
                                                            <div key={idx} className="flex justify-between text-xs text-slate-400">
                                                                <span>• {sub.display_name}</span>
                                                                <span className="font-mono text-slate-300">{sub.display_value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                         }
                                    </div>
                                )}

                                {activeTab === 'Constellation' && (
                                     <div className="space-y-3">
                                         {detail.constellations.map(c => (
                                             <div key={c.id} className={`p-4 rounded-xl border flex gap-4 transition-all ${c.is_actived ? 'bg-white/10 border-[#ffe175]/30 shadow-[0_0_15px_rgba(255,225,117,0.1)]' : 'bg-black/20 border-white/5 opacity-40 grayscale'}`}>
                                                 <div className="shrink-0 w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                                                     <img src={c.icon} className="w-8 h-8" referrerPolicy="no-referrer" />
                                                 </div>
                                                 <div>
                                                     <div className="flex items-center gap-2 mb-1">
                                                         <span className="text-xs font-black text-[#ffe175] border border-[#ffe175] px-1 rounded">C{c.pos}</span>
                                                         <h4 className="font-bold text-white text-sm">{c.name}</h4>
                                                     </div>
                                                     <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: c.effect.replace(/\\n/g, ' ') }}></p>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Character Art (Hidden on Mobile) */}
                <div className="hidden md:block flex-1 relative h-full overflow-hidden bg-[#131720]">
                    {/* Dynamic Background */}
                     <div className={`absolute inset-0 bg-gradient-to-t ${BG_GRADIENTS[character.element]} opacity-40 mix-blend-screen`}></div>
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50"></div>
                     
                     {/* Character Image */}
                     <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                            src={displayImage} 
                            alt={character.name} 
                            className="h-[110%] w-auto max-w-none object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] mask-image-b" 
                            style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                            referrerPolicy="no-referrer"
                        />
                     </div>

                     {/* Footer Info on Art Side */}
                     <div className="absolute bottom-10 left-10 max-w-sm">
                         <div className="text-6xl font-serif font-black text-white/5 select-none absolute -top-10 -left-4 pointer-events-none">
                             {character.element.toUpperCase()}
                         </div>
                         <p className="text-slate-300 text-sm font-medium italic relative z-10 border-l-2 border-[#ffe175] pl-4">
                             "Traveler, I'll be waiting for you... in the stars."
                         </p>
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
                <h1 className="text-2xl font-serif font-black text-white tracking-wide">Characters</h1>
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

        {/* Scrollable Grid Area - Mobile Friendly Columns */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar pb-20">
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2.5">
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
