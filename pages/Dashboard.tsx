
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserData, RoleCombatData, HardChallengeData } from '../types';
import { fetchRoleCombat, fetchHardChallenges } from '../services/api';
import { HelpCircle, ChevronRight, Swords, Drama, Zap, Clock, Trophy, Award } from 'lucide-react';

interface DashboardProps {
  data: UserData;
}

const SummaryStat: React.FC<{ label: string; value: string | number; subLabel?: string }> = ({ label, value, subLabel }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center group cursor-default">
        <span className="text-2xl lg:text-3xl font-bold text-slate-200 group-hover:text-white transition-colors">{value}</span>
        <span className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wide mt-1 group-hover:text-slate-400">{label}</span>
        {subLabel && <span className="text-[10px] text-slate-600 mt-0.5">{subLabel}</span>}
    </div>
);

// Navigation Widget for "Battle Records" section
const BattleRecordWidget: React.FC<{ 
    title: string; 
    status: string; 
    icon: React.ReactNode; 
    link: string;
    bgClass: string; 
    accentColor: string;
}> = ({ title, status, icon, link, bgClass, accentColor }) => (
    <Link to={link} className="block relative group overflow-hidden rounded-xl border border-white/5 bg-[#131720] hover:border-white/10 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 z-10"></div>
        <div className={`absolute top-0 right-0 p-20 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${bgClass}`}></div>
        
        <div className="relative z-20 p-5 flex items-center justify-between">
            <div>
                <h3 className="text-slate-200 font-bold text-lg mb-1 group-hover:text-white transition-colors">{title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{status}</span>
                </div>
            </div>
            <div className={`p-3 rounded-full bg-[#1c212e] border border-white/5 text-slate-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                {icon}
            </div>
        </div>
        {/* Progress Bar Aesthetic */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1c212e]">
            <div className={`h-full w-2/3 ${accentColor} opacity-50`}></div>
        </div>
    </Link>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [theater, setTheater] = useState<RoleCombatData | null>(null);
  const [onslaught, setOnslaught] = useState<HardChallengeData | null>(null);

  useEffect(() => {
     const fetchData = async () => {
        try {
            const [tData, oData] = await Promise.all([
                fetchRoleCombat(data).catch(() => []),
                fetchHardChallenges(data).catch(() => [])
            ]);
            if (tData.length > 0) setTheater(tData[0]);
            if (oData.length > 0) setOnslaught(oData[0]);
        } catch (e) {
            console.error("Error fetching dashboard extra data", e);
        }
     };
     fetchData();
  }, [data]);

  // Calculations for Summary Panel
  const theaterLabel = theater?.has_data ? `Act ${theater.stat.max_round_id}` : 'No Data';
  const onslaughtLabel = onslaught?.mp?.has_data ? `Score ${onslaught.mp.best.difficulty}` : 'Not Started';

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. Top Summary Panel (High Density) */}
      <div className="bg-[#131720] rounded-xl border border-white/5 p-1 relative overflow-hidden shadow-xl">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-900 via-[#4e6c8e] to-indigo-900 opacity-50"></div>
           
           <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#181d29]">
               <div className="flex items-center gap-2">
                   <div className="w-1 h-4 bg-[#d3bc8e] rounded-full"></div>
                   <h2 className="text-slate-200 font-bold text-sm uppercase tracking-widest">Summary</h2>
                   <HelpCircle size={14} className="text-slate-600 cursor-help hover:text-slate-400" />
               </div>
               <div className="text-[10px] text-slate-500 font-mono">
                   UID: {data.uid}
               </div>
           </div>

           <div className="p-6 md:p-8">
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
                    <SummaryStat label="Days Active" value={data.stats.active_days} />
                    <SummaryStat label="Achievements" value={data.stats.achievements} />
                    <SummaryStat label="Characters" value={data.stats.characters_obtained} />
                    <SummaryStat label="Spiral Abyss" value={data.stats.spiral_abyss} />
                    <div className="hidden lg:block"></div> {/* Spacer for symmetry if needed */}

                    <SummaryStat label="Imaginarium Theater" value={theaterLabel} />
                    <SummaryStat label="Stygian Onslaught" value={onslaughtLabel} />
                    <SummaryStat label="Oculi Collected" value={data.stats.oculi_collected} />
                    <SummaryStat label="Chests Opened" value={data.stats.chests_opened} />
                    <div className="hidden lg:block"></div>
               </div>
               
               {/* Divider with counts */}
               <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.anemoculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Anemoculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.geoculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Geoculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.electroculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Electroculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.dendroculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Dendroculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.hydroculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Hydroculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.pyroculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Pyroculi</span>
                    </div>
               </div>
           </div>
      </div>

      {/* 2. Events & Battle Records */}
      <div className="space-y-3">
          <div className="flex items-center gap-2 pl-1">
               <div className="w-1.5 h-1.5 bg-[#d3bc8e] rotate-45"></div>
               <h2 className="text-slate-300 font-bold text-sm uppercase tracking-wide">Battle Records Review</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <BattleRecordWidget 
                   title="Spiral Abyss" 
                   status="Abyssal Moon Spire" 
                   icon={<Swords size={20} />} 
                   link="/abyss"
                   bgClass="bg-indigo-600"
                   accentColor="bg-indigo-500"
               />
               <BattleRecordWidget 
                   title="Imaginarium Theater" 
                   status={theater?.schedule.schedule_id ? "Season Active" : "Season Ended"} 
                   icon={<Drama size={20} />} 
                   link="/theater"
                   bgClass="bg-purple-600"
                   accentColor="bg-purple-500"
               />
               <BattleRecordWidget 
                   title="Stygian Onslaught" 
                   status={onslaught?.schedule?.is_valid ? "Event Active" : "Event Ended"} 
                   icon={<Zap size={20} />} 
                   link="/onslaught"
                   bgClass="bg-red-600"
                   accentColor="bg-red-500"
               />
          </div>
      </div>

      {/* 3. My Characters Preview (Grid style matching reference) */}
      <div className="bg-[#131720] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
               <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#d3bc8e] rotate-45"></div>
                   <h2 className="text-slate-300 font-bold text-sm uppercase tracking-wide">My Characters</h2>
               </div>
               <Link to="/characters" className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
                   All Characters <ChevronRight size={12} />
               </Link>
          </div>
          
          <div className="p-6">
              {/* Featured Character Banner (Mockup based on reference) */}
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden border border-white/5 bg-[#0c0f16]">
                  {/* If we have a favorite/main character, we could show them here. Defaulting to first 5-star or first char */}
                  {data.characters.length > 0 && (() => {
                      const featured = data.characters.find(c => c.rarity === 5) || data.characters[0];
                      return (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-slate-900/90 z-0"></div>
                            <img src={featured.image} alt={featured.name} className="absolute left-[-20%] md:left-0 top-0 h-full w-auto object-cover opacity-80 z-0" referrerPolicy="no-referrer" />
                            
                            <div className="absolute right-0 top-0 h-full w-full md:w-1/2 p-6 flex flex-col justify-center z-10 bg-gradient-to-l from-[#0c0f16] to-transparent">
                                <div className="text-right space-y-4">
                                    <div>
                                        <h3 className="text-3xl font-bold text-white mb-1">{featured.name}</h3>
                                        <div className="flex justify-end gap-1 text-yellow-500">
                                            {Array.from({length: featured.rarity}).map((_, i) => <span key={i}>★</span>)}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-right">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Level</p>
                                            <p className="text-xl font-mono text-slate-200">{featured.level}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Friendship</p>
                                            <p className="text-xl font-mono text-slate-200">{featured.friendship}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Element</p>
                                            <p className="text-sm font-bold text-slate-200">{featured.element}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Constellation</p>
                                            <p className="text-sm font-bold text-slate-200">C{featured.constellation}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 truncate w-32">{featured.weapon.name}</p>
                                            <div className="h-1 w-full bg-slate-800 rounded mt-1 overflow-hidden">
                                                <div className="h-full bg-yellow-600 w-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </>
                      );
                  })()}
              </div>
          </div>
      </div>

    </div>
  );
};

export default Dashboard;
