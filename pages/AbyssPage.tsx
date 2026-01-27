
import React, { useEffect, useState } from 'react';
import { UserData, SpiralAbyssData, AbyssRankItem } from '../types';
import { fetchSpiralAbyss } from '../services/api';
import { Star, Swords, Shield, Skull, Target, Zap, Clock, Calendar } from 'lucide-react';

interface AbyssPageProps {
  data: UserData;
}

// Rank/MVP Card (Compact)
const MVPCard: React.FC<{ 
    label: string; 
    rankItems: AbyssRankItem[]; 
    icon: React.ReactNode; 
    accentColor: string; 
    valueUnit: string;
}> = ({ label, rankItems, icon, accentColor, valueUnit }) => {
    if (!rankItems || rankItems.length === 0) return null;
    const mvp = rankItems[0];

    return (
        <div className="bg-[#131720]/80 backdrop-blur border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
            <div className="relative w-14 h-14 rounded-full border-2 border-[#1c212e] overflow-hidden bg-[#0c0f16]">
                <img src={mvp.avatar_icon} alt="MVP" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="min-w-0">
                <div className={`text-xs font-bold uppercase tracking-wider text-${accentColor}-400 flex items-center gap-1.5 mb-1`}>
                    {icon} {label}
                </div>
                <div className="text-xl font-bold text-white leading-none">
                    {mvp.value} <span className="text-sm font-normal text-slate-500">{valueUnit}</span>
                </div>
            </div>
        </div>
    );
};

const FloorTimeline: React.FC<{ floor: any }> = ({ floor }) => (
    <div className="relative pl-8 pb-8 last:pb-0 border-l-2 border-white/5 last:border-0 group">
        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#131720] border-2 border-slate-600 group-hover:border-[#d3bc8e] transition-colors"></div>
        
        <div className="flex justify-between items-start mb-4">
             <div>
                 <h3 className="text-xl font-serif font-bold text-slate-200 group-hover:text-[#d3bc8e] transition-colors">Floor {floor.index}</h3>
                 <div className="flex gap-1 mt-1">
                      {Array.from({length: 3}).map((_, i) => (
                           <Star key={i} size={14} className={i < floor.star ? "text-yellow-400 fill-yellow-400" : "text-slate-700"} />
                      ))}
                 </div>
             </div>
             <div className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
                 {floor.levels.length} Chambers
             </div>
        </div>

        {/* Chambers Grid */}
        <div className="grid grid-cols-1 gap-3">
             {floor.levels.map((level: any) => (
                 <div key={level.index} className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col md:flex-row gap-4 items-center">
                      <div className="text-sm font-bold text-slate-400 shrink-0 w-24">Chamber {level.index}</div>
                      <div className="flex-1 w-full grid grid-cols-2 gap-4">
                           {level.battles.map((b: any, idx: number) => (
                               <div key={idx} className="flex -space-x-2">
                                   {b.avatars.map((av: any) => (
                                       <div key={av.id} className="w-8 h-8 rounded-full border border-[#131720] bg-slate-800 overflow-hidden" title={`Lv.${av.level}`}>
                                           <img src={av.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                       </div>
                                   ))}
                               </div>
                           ))}
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                           {Array.from({length: 3}).map((_, i) => (
                               <Star key={i} size={12} className={i < level.star ? "text-yellow-400 fill-yellow-400" : "text-slate-700"} />
                           ))}
                      </div>
                 </div>
             ))}
        </div>
    </div>
);

const AbyssPage: React.FC<AbyssPageProps> = ({ data }) => {
  const [abyss, setAbyss] = useState<SpiralAbyssData | null>(null);

  useEffect(() => {
     fetchSpiralAbyss(data).then(setAbyss).catch(console.error);
  }, [data]);

  if (!abyss) return <div className="p-12 text-center text-slate-500 animate-pulse">Consulting the stars...</div>;

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: Battle Report Timeline --- */}
        <div className="lg:col-span-2 space-y-8">
             <div className="flex justify-between items-end border-b border-white/5 pb-6">
                 <div>
                     <h1 className="text-3xl font-serif font-black text-white tracking-wide">Abyssal Moon Spire</h1>
                     <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                         <Calendar size={14} /> Phase {abyss.schedule_id}
                     </p>
                 </div>
                 <div className="text-right">
                     <div className="text-4xl font-black text-white leading-none">{abyss.max_floor}</div>
                     <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Deepest Descent</div>
                 </div>
             </div>

             <div className="pl-2 pt-4">
                 {[...abyss.floors].reverse().map(floor => (
                     <FloorTimeline key={floor.index} floor={floor} />
                 ))}
             </div>
        </div>

        {/* --- RIGHT COLUMN: Analysis Panel --- */}
        <div className="space-y-6">
             {/* Summary Stats */}
             <div className="bg-gradient-to-br from-indigo-900/40 to-[#0c0f16] border border-indigo-500/20 rounded-3xl p-6 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
                 <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4">Performance</h3>
                 <div className="grid grid-cols-2 gap-4">
                      <div>
                          <div className="text-3xl font-black text-white">{abyss.total_star}</div>
                          <div className="text-xs text-slate-400 uppercase">Stars</div>
                      </div>
                      <div>
                          <div className="text-3xl font-black text-white">{abyss.total_battle_times}</div>
                          <div className="text-xs text-slate-400 uppercase">Battles</div>
                      </div>
                 </div>
             </div>

             {/* MVP Cards */}
             <div className="space-y-3">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Battle MVPs</h3>
                 <MVPCard 
                    label="Strongest Strike" 
                    rankItems={abyss.damage_rank} 
                    icon={<Swords size={12} />} 
                    accentColor="red" 
                    valueUnit="DMG"
                 />
                 <MVPCard 
                    label="Most Defeats" 
                    rankItems={abyss.defeat_rank} 
                    icon={<Skull size={12} />} 
                    accentColor="slate" 
                    valueUnit="Kills"
                 />
                 <MVPCard 
                    label="Damage Taken" 
                    rankItems={abyss.take_damage_rank} 
                    icon={<Shield size={12} />} 
                    accentColor="green" 
                    valueUnit="HP"
                 />
                 <MVPCard 
                    label="Burst Spams" 
                    rankItems={abyss.energy_skill_rank} 
                    icon={<Zap size={12} />} 
                    accentColor="purple" 
                    valueUnit="Casts"
                 />
                 <MVPCard 
                    label="Most Played" 
                    rankItems={abyss.reveal_rank} 
                    icon={<Target size={12} />} 
                    accentColor="blue" 
                    valueUnit="Battles"
                 />
             </div>
        </div>
    </div>
  );
};

export default AbyssPage;
