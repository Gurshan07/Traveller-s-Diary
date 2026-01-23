import React, { useEffect, useState } from 'react';
import { UserData, Achievement } from '../types';
import { fetchAchievements } from '../services/api';
import { Search, Trophy, Loader2, Award, Percent } from 'lucide-react';

interface AchievementsPageProps {
  data: UserData;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ data }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Incomplete'>('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const list = await fetchAchievements(data);
        setAchievements(list);
      } catch (err) {
        console.error(err);
        setError('Failed to load achievements. Please check your network or try logging in again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (data) {
        loadData();
    }
  }, [data]);

  const filteredAchievements = achievements.filter(ach => {
    const matchesSearch = ach.name.toLowerCase().includes(search.toLowerCase());
    const isCompleted = ach.percentage === 100;
    
    const matchesFilter = 
        filter === 'All' ? true :
        filter === 'Completed' ? isCompleted :
        !isCompleted;

    return matchesSearch && matchesFilter;
  });

  const completedCount = achievements.filter(a => a.percentage === 100).length;

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
               <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Achievements</h2>
               <p className="text-slate-500 dark:text-slate-400 text-sm">
                 {achievements.length > 0 
                    ? `Series Completed: ${completedCount} / ${achievements.length}` 
                    : 'Track your completion progress'}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="relative group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-[#4e6c8e]" size={16} />
                   <input 
                       type="text" 
                       placeholder="Search series..." 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className="pl-9 pr-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4e6c8e]/20 focus:border-[#4e6c8e] w-full sm:w-64 transition-all"
                   />
               </div>
               <div className="flex bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                  {['All', 'Completed', 'Incomplete'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            filter === f 
                            ? 'bg-white dark:bg-slate-700 text-[#4e6c8e] dark:text-blue-300 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {f}
                      </button>
                  ))}
               </div>
            </div>
       </div>

       {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <Loader2 size={40} className="animate-spin mb-4 text-[#4e6c8e]" />
               <p>Fetching achievement data...</p>
           </div>
       ) : error ? (
           <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300">
               <p>{error}</p>
           </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map((ach) => (
                  <div key={ach.id} className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                      {/* Icon Section */}
                      <div className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50 shadow-inner relative`}>
                          {ach.icon ? (
                             <img src={ach.icon} alt={ach.name} className="w-full h-full object-cover p-1 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center">
                                <Trophy size={24} className="text-slate-400" />
                             </div>
                          )}
                          {ach.percentage === 100 && (
                            <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                                <div className="bg-yellow-400 rounded-full p-1 shadow-sm">
                                    <Trophy size={10} className="text-yellow-900" fill="currentColor" />
                                </div>
                            </div>
                          )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate text-sm mb-2" title={ach.name}>{ach.name}</h3>
                          
                          <div className="space-y-2">
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                                 <span className={`font-bold ${ach.percentage === 100 ? 'text-green-600 dark:text-green-400' : 'text-[#4e6c8e] dark:text-[#7aa2cc]'}`}>
                                    {ach.percentage}%
                                 </span>
                             </div>
                             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${ach.percentage === 100 ? 'bg-green-500' : 'bg-[#4e6c8e]'}`}
                                    style={{ width: `${ach.percentage}%` }}
                                ></div>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-slate-400">
                                 <Award size={12} />
                                 <span>{ach.finish_num} Completed</span>
                             </div>
                          </div>
                      </div>
                  </div>
              ))}
              
              {filteredAchievements.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500">
                      <Award size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No achievement series found.</p>
                  </div>
              )}
           </div>
       )}
    </div>
  );
};

export default AchievementsPage;
