import React, { useEffect, useState } from 'react';
import { UserData, SpiralAbyssData, AbyssRankItem } from '../types';
import { fetchSpiralAbyss } from '../services/api';
import { Star, Swords, Shield, Clock, Zap, Target, Skull, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface AbyssPageProps {
  data: UserData;
}

const RankCard: React.FC<{ 
    title: string; 
    data: AbyssRankItem[]; 
    icon: React.ReactNode; 
    colorClass: string;
    valueLabel?: string;
    charMap: Map<number, string>;
}> = ({ title, data, icon, colorClass, valueLabel, charMap }) => {
    if (!data || data.length === 0) return null;
    
    // Sort slightly to be sure, though API usually sorts
    const topItem = data[0];
    const name = charMap.get(topItem.avatar_id) || `ID: ${topItem.avatar_id}`;

    return (
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/50 dark:border-white/10 hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${colorClass} bg-opacity-20`}>
                    {icon}
                </div>
                {title}
            </h3>
            <div className="flex items-center gap-4">
                <img 
                    src={topItem.avatar_icon} 
                    alt={name} 
                    className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-700 shadow-sm object-cover bg-slate-200 dark:bg-slate-700" 
                    referrerPolicy="no-referrer"
                />
                <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {topItem.value} {valueLabel || ''}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FloorAccordion: React.FC<{ floor: any; charMap: Map<number, string> }> = ({ floor, charMap }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 overflow-hidden transition-all">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-lg">Floor {floor.index}</div>
                    <div className="flex gap-1">
                        {Array.from({length: 3}).map((_, i) => (
                             <Star 
                                key={i} 
                                size={16} 
                                className={`${i < floor.star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
                             />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <span className={`text-xs px-2 py-1 rounded-full ${floor.is_unlock ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                        {floor.is_unlock ? 'Unlocked' : 'Locked'}
                     </span>
                     {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
            </button>

            {isOpen && (
                <div className="p-4 pt-0 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="space-y-4 mt-4">
                        {floor.levels.map((level: any) => (
                            <div key={level.index} className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chamber {level.index}</span>
                                    <div className="flex gap-0.5">
                                        {Array.from({length: 3}).map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={12} 
                                                className={`${i < level.star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {level.battles.map((battle: any) => (
                                        <div key={battle.index} className="flex flex-col gap-2">
                                            <span className="text-[10px] uppercase font-bold text-slate-400">
                                                {battle.index === 1 ? 'First Half' : 'Second Half'}
                                            </span>
                                            <div className="flex gap-2">
                                                {battle.avatars.map((av: any) => (
                                                    <div key={av.id} className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" title={charMap.get(av.id)}>
                                                        <img src={av.icon} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                {new Date(parseInt(battle.timestamp) * 1000).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const AbyssPage: React.FC<AbyssPageProps> = ({ data }) => {
  const [abyssData, setAbyssData] = useState<SpiralAbyssData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [charMap, setCharMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
     // Create a map of ID -> Name from the user data characters to helper display
     const map = new Map<number, string>();
     if (data.characters) {
         data.characters.forEach(c => {
             map.set(parseInt(c.id), c.name);
         });
     }
     setCharMap(map);

     const loadAbyss = async () => {
         try {
             setLoading(true);
             const result = await fetchSpiralAbyss(data);
             setAbyssData(result);
         } catch (err) {
             console.error(err);
             setError("Failed to load detailed Abyss data. Summary data shown below.");
         } finally {
             setLoading(false);
         }
     };

     loadAbyss();
  }, [data]);

  // Fallback values if API fetch fails but summary data exists in UserData
  const floor = abyssData?.max_floor || data.abyss.floor;
  const battles = abyssData?.total_battle_times || data.abyss.battles;
  const stars = abyssData?.total_star || data.abyss.total_stars;
  
  const startTime = abyssData ? new Date(parseInt(abyssData.start_time) * 1000).toLocaleDateString() : '';
  const endTime = abyssData ? new Date(parseInt(abyssData.end_time) * 1000).toLocaleDateString() : '';

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Spiral Abyss</h2>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                {abyssData ? (
                    <span className="flex items-center gap-1">
                        <Calendar size={14} /> {startTime} - {endTime}
                    </span>
                ) : 'Current Phase Progress'}
            </p>
          </div>
       </div>

       {loading ? (
           <div className="py-20 flex justify-center text-slate-400">
               <Loader2 size={40} className="animate-spin text-[#4e6c8e]" />
           </div>
       ) : (
        <>
            <div className="bg-[#1e293b] dark:bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative shadow-xl border border-white/10">
                {/* Abstract Decoration */}
                <div className="absolute -right-10 -top-10 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex flex-col justify-center items-center md:items-start space-y-2">
                        <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest">Deepest Descent</p>
                        <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200 filter drop-shadow-lg">
                            {floor}
                        </h1>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Total Battles</p>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-300">
                                    <Swords size={24} />
                                </div>
                                <span className="text-4xl font-bold text-white">
                                {battles}
                                </span>
                            </div>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Abyssal Stars</p>
                        <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-full">
                                <Star size={24} className="text-yellow-400 fill-yellow-400" />
                                </div>
                            <span className="text-4xl font-bold text-white">
                                {stars}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {abyssData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RankCard 
                        title="Strongest Strike" 
                        data={abyssData.damage_rank} 
                        icon={<Swords className="w-5 h-5 text-red-500" />} 
                        colorClass="bg-red-500 text-red-500"
                        valueLabel="DMG"
                        charMap={charMap}
                    />
                    <RankCard 
                        title="Most Damage Taken" 
                        data={abyssData.take_damage_rank} 
                        icon={<Shield className="w-5 h-5 text-blue-500" />} 
                        colorClass="bg-blue-500 text-blue-500"
                        valueLabel="DMG Taken"
                        charMap={charMap}
                    />
                    <RankCard 
                        title="Elemental Burst Usage" 
                        data={abyssData.energy_skill_rank} 
                        icon={<Star className="w-5 h-5 text-yellow-500" />} 
                        colorClass="bg-yellow-500 text-yellow-500"
                        valueLabel="Times"
                        charMap={charMap}
                    />
                    <RankCard 
                        title="Elemental Skill Usage" 
                        data={abyssData.normal_skill_rank} 
                        icon={<Zap className="w-5 h-5 text-purple-500" />} 
                        colorClass="bg-purple-500 text-purple-500"
                        valueLabel="Times"
                        charMap={charMap}
                    />
                    <RankCard 
                        title="Most Defeats" 
                        data={abyssData.defeat_rank} 
                        icon={<Skull className="w-5 h-5 text-slate-500" />} 
                        colorClass="bg-slate-500 text-slate-500"
                        valueLabel="Defeats"
                        charMap={charMap}
                    />
                    <RankCard 
                        title="Most Played" 
                        data={abyssData.reveal_rank} 
                        icon={<Target className="w-5 h-5 text-green-500" />} 
                        colorClass="bg-green-500 text-green-500"
                        valueLabel="Battles"
                        charMap={charMap}
                    />
            </div>
            )}

            {abyssData?.floors && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">Floor Breakdown</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {[...abyssData.floors].reverse().map(floor => (
                            <FloorAccordion key={floor.index} floor={floor} charMap={charMap} />
                        ))}
                    </div>
                </div>
            )}

            {!abyssData && !error && (
                <div className="p-8 text-center bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <p>No detailed Abyss data available.</p>
                </div>
            )}
        </>
       )}

        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl text-sm text-center border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm">
            * Data retrieved from HoYoLab Game Record.
        </div>
    </div>
  );
};

export default AbyssPage;
