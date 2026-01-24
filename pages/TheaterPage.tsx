
import React, { useEffect, useState } from 'react';
import { UserData, RoleCombatData } from '../types';
import { fetchRoleCombat } from '../services/api';
import { Loader2, Calendar, Star, Skull, Award } from 'lucide-react';
import { ELEMENT_ICONS } from '../constants';

interface TheaterPageProps {
  data: UserData;
}

const TheaterPage: React.FC<TheaterPageProps> = ({ data }) => {
  const [theaterData, setTheaterData] = useState<RoleCombatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await fetchRoleCombat(data);
        setTheaterData(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load Imaginarium Theater data.");
      } finally {
        setLoading(false);
      }
    };
    if (data) {
        load();
    }
  }, [data]);

  const activeSeason = theaterData.length > 0 ? theaterData[0] : null;

  return (
    <div className="space-y-6 pb-20">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Imaginarium Theater</h2>
            <p className="text-slate-500 dark:text-slate-400">Seasonal Role Combat</p>
          </div>
       </div>

       {loading ? (
           <div className="py-20 flex justify-center text-slate-400">
               <Loader2 size={40} className="animate-spin text-[#4e6c8e]" />
           </div>
       ) : error ? (
           <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300">
               <p>{error}</p>
           </div>
       ) : !activeSeason || !activeSeason.has_data ? (
           <div className="p-12 text-center bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
               <p>No Imaginarium Theater data available for the current season.</p>
           </div>
       ) : (
           <div className="animate-in fade-in duration-500 space-y-6">
               
               {/* Season Summary */}
               <div className="bg-[#2a1b3d] dark:bg-[#1a1025] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                   <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                   
                   <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                           <div>
                                <span className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-1 block">Current Season</span>
                                <h2 className="text-2xl font-black">Performance Review</h2>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-slate-400 mt-2 md:mt-0 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
                               <Calendar size={14} />
                               {new Date(parseInt(activeSeason.schedule.start_time) * 1000).toLocaleDateString()} - {new Date(parseInt(activeSeason.schedule.end_time) * 1000).toLocaleDateString()}
                           </div>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                               <p className="text-xs text-slate-300 uppercase font-bold mb-1">Medals</p>
                               <div className="flex items-center justify-center gap-2 text-xl font-bold">
                                   <Award className="text-yellow-400" size={20} />
                                   {activeSeason.stat.medal_num}
                               </div>
                           </div>
                           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                               <p className="text-xs text-slate-300 uppercase font-bold mb-1">Difficulty</p>
                               <div className="text-xl font-bold text-white">
                                   Tier {activeSeason.stat.difficulty_id}
                               </div>
                           </div>
                           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                               <p className="text-xs text-slate-300 uppercase font-bold mb-1">Rounds</p>
                               <div className="text-xl font-bold text-white">
                                   {activeSeason.stat.max_round_id}
                               </div>
                           </div>
                           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                               <p className="text-xs text-slate-300 uppercase font-bold mb-1">Coins</p>
                               <div className="text-xl font-bold text-yellow-200">
                                   {activeSeason.stat.coin_num}
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               {/* Rounds List */}
               {activeSeason.detail?.rounds?.length > 0 && (
                   <div className="space-y-4">
                       <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-1">Battle Acts</h3>
                       <div className="grid grid-cols-1 gap-4">
                           {activeSeason.detail.rounds.map((round) => (
                               <div key={round.round_id} className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-sm">
                                   <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/50">
                                       <div className="flex items-center gap-3">
                                            <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">Act {round.round_id}</span>
                                            {round.is_get_medal && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                                       </div>
                                       <span className="text-xs text-slate-500 font-mono">{round.finish_time}s</span>
                                   </div>

                                   <div className="flex flex-col md:flex-row gap-6">
                                       {/* Boss */}
                                       <div className="flex items-center gap-4 min-w-[200px]">
                                            <img src={round.boss_icon} alt="Boss" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                                            <div>
                                                <div className="text-xs text-slate-400 uppercase font-bold">Opponent</div>
                                                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Lv. {round.boss_level}</div>
                                            </div>
                                       </div>

                                       {/* Team */}
                                       <div className="flex-1">
                                            <div className="text-xs text-slate-400 uppercase font-bold mb-2">Cast</div>
                                            <div className="flex flex-wrap gap-2">
                                                {round.avatars.map(av => (
                                                    <div key={av.avatar_id} className="relative group">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                                                            <img src={av.image} alt={av.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5 border border-white/20">
                                                             {React.cloneElement(ELEMENT_ICONS[av.element] as React.ReactElement<any>, { size: 8, className: "text-white" })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                       </div>
                                   </div>
                               </div>
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
