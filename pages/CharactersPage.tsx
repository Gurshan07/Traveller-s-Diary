
import React, { useState, useMemo } from 'react';
import { UserData, Character, ElementType } from '../types';
import { ELEMENT_ICONS, BG_GRADIENTS } from '../constants';
import { Search, Star, Filter, ArrowUpRight, Shield, Sword, Sparkles, Heart } from 'lucide-react';

interface CharactersPageProps {
  data: UserData;
}

// Tarot Card Component
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
                 
                 {/* Element Filter (Simplified) */}
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
                <TarotCard key={char.id} char={char} onClick={() => { /* Modal logic typically goes here */ }} />
            ))}
        </div>
        
        {filtered.length === 0 && (
            <div className="py-20 text-center text-slate-600 font-serif italic">
                No companions found matching your criteria.
            </div>
        )}
    </div>
  );
};

export default CharactersPage;
