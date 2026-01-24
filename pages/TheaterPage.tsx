
import React, { useEffect, useState } from 'react';
import { UserData, HardChallengeData, HardChallengeStage } from '../types';
import { fetchHardChallenges } from '../services/api';
import { Loader2, Calendar, Clock, Sword, Skull, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { ELEMENT_COLORS, ELEMENT_ICONS } from '../constants';

interface TheaterPageProps {
  data: UserData;
}

const ChallengeCard: React.FC<{ stage: HardChallengeStage }> = ({ stage }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-sm border border-white/50 dark:border-white/10 overflow-hidden hover:shadow-md transition-all">
            <div 
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/10 dark:bg-white/5 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                         <img src={stage.monster.icon} alt="Boss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base line-clamp-1">{stage.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1"><Clock size={12} /> {stage.second}s</span>
                            {/* Monster Level Badge */}
                            <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Lv.{stage.monster.level}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                     <div className="flex -space-x-3">
                         {stage.teams.map((char) => (
                             <div key={char.avatar_id} className="relative w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-sm" title={char.name}>
                                 <img src={char.image} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                 <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-slate-900 border border-white flex items-center justify-center">
                                      {/* Small element icon overlay could go here */}
                                      {React.cloneElement(ELEMENT_ICONS[char.element] as React.ReactElement<any>, { size: 8, className: "text-white" })}
                                 </div>
                             </div>
                         ))}
                     </div>
                     <div className="text-slate-400">
                         {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                     </div>
                </div>
            </div>

            {isOpen && (
                <div className="p-4 pt-0 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/30">
                     <div className="mt-4 flex flex-col md:flex-row gap-6">
                         {/* Boss Details */}
                         <div className="flex-1">
                             <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                 <Skull size={14} /> Boss Details
                             </h4>
                             <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-3 flex gap-4">
                                  <img src={stage.monster.icon} alt={stage.monster.name} className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
                                  <div className="flex-1">
                                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{stage.monster.name}</p>
                                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                                          {stage.monster.desc.filter(d => d).map((d, i) => (
                                              <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: d.replace(/<color=#FFD780FF>/g, '<span class="text-amber-500 font-bold">').replace(/<\/color>/g, '</span>') }} />
                                          ))}
                                      </div>
                                  </div>
                             </div>
                         </div>

                         {/* Team Details */}
                         <div className="flex-1">
                            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                 <Sword size={14} /> Team Roster
                             </h4>
                             <div className="grid grid-cols-2 gap-2">
                                 {stage.teams.map((char) => (
                                     <div key={char.avatar_id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                         <img src={char.image} alt={char.name} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 object-cover" referrerPolicy="no-referrer" />
                                         <div className="min-w-0">
                                             <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{char.name}</p>
                                             <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                 Lv.{char.level}
                                                 {/* Rarity Stars */}
                                                 <span className="flex text-yellow-500">
                                                     {Array.from({ length: char.rarity }).map((_, i) => <Star key={i} size={6} fill="currentColor" />)}
                                                 </span>
                                             </p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>
                </div>
            )}
        </div>
    );
}

const TheaterPage: React.FC<TheaterPageProps> = ({ data }) => {
  const [scheduleData, setScheduleData] = useState<HardChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await fetchHardChallenges(data);
        setScheduleData(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load theater data.");
      } finally {
        setLoading(false);
      }
    };
    if (data) {
        load();
    }
  }, [data]);

  const activeSeason = scheduleData[selectedSeasonIndex];

  return (
    <div className="space-y-6 pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Imaginarium Theater</h2>
            <p className="text-slate-500 dark:text-slate-400">Combat Challenges & Performance Records</p>
          </div>
          
          {scheduleData.length > 0 && (
              <div className="relative">
                  <select 
                    value={selectedSeasonIndex} 
                    onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
                    className="appearance-none bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 pl-4 pr-10 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4e6c8e]"
                  >
                      {scheduleData.map((s, idx) => (
                          <option key={idx} value={idx}>{s.schedule.name} ({s.schedule.start_date_time.month}/{s.schedule.start_date_time.day})</option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
              </div>
          )}
       </div>

       {loading ? (
           <div className="py-20 flex justify-center text-slate-400">
               <Loader2 size={40} className="animate-spin text-[#4e6c8e]" />
           </div>
       ) : error ? (
           <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300">
               <p>{error}</p>
           </div>
       ) : !activeSeason ? (
           <div className="p-12 text-center bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
               <p>No Theater records found.</p>
           </div>
       ) : (
           <div className="animate-in fade-in duration-500 space-y-6">
               
               {/* Summary Card */}
               <div className="bg-[#1e1b29] dark:bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                   <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                   
                   <div className="relative z-10">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                           <div>
                                <span className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1 block">Current Season</span>
                                <h2 className="text-2xl md:text-3xl font-black">{activeSeason.schedule.name}</h2>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-slate-400 mt-2 md:mt-0 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
                               <Calendar size={14} />
                               {activeSeason.schedule.start_date_time.year}/{activeSeason.schedule.start_date_time.month}/{activeSeason.schedule.start_date_time.day} - {activeSeason.schedule.end_date_time.month}/{activeSeason.schedule.end_date_time.day}
                           </div>
                       </div>

                       {activeSeason.mp && activeSeason.mp.has_data ? (
                           <div className="flex flex-col sm:flex-row gap-4">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                                    <p className="text-xs text-slate-300 uppercase font-bold mb-1">Best Performance</p>
                                    <div className="flex items-center gap-3">
                                         {/* Medal Icon - usually passed via best.icon which is a URL or key */}
                                         {activeSeason.mp.best.icon && (
                                             <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center p-2">
                                                 <Star className="text-yellow-400 fill-yellow-400" />
                                             </div>
                                         )}
                                         <div>
                                             <p className="text-2xl font-bold">{activeSeason.mp.best.difficulty}</p>
                                             <p className="text-xs text-slate-400">Difficulty Rating</p>
                                         </div>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                                    <p className="text-xs text-slate-300 uppercase font-bold mb-1">Total Clear Time</p>
                                    <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center p-2">
                                             <Clock className="text-blue-400" />
                                         </div>
                                         <div>
                                             <p className="text-2xl font-bold">{activeSeason.mp.best.second}s</p>
                                             <p className="text-xs text-slate-400">Seconds</p>
                                         </div>
                                    </div>
                                </div>
                           </div>
                       ) : (
                           <p className="text-slate-400 italic">No performance data recorded for this season.</p>
                       )}
                   </div>
               </div>

               {/* Challenges List */}
               {activeSeason.mp && activeSeason.mp.challenge && activeSeason.mp.challenge.length > 0 && (
                   <div className="space-y-4">
                       <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-1">Challenge Acts</h3>
                       <div className="grid grid-cols-1 gap-4">
                           {activeSeason.mp.challenge.map((stage, i) => (
                               <ChallengeCard key={i} stage={stage} />
                           ))}
                       </div>
                   </div>
               )}
           </div>
       )}
    </div>
  );
};

export default TheaterPage;
