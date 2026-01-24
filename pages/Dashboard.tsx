
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserData, RoleCombatData, HardChallengeData } from '../types';
import { fetchRoleCombat, fetchHardChallenges } from '../services/api';
import { Trophy, Clock, Users, Box, Gem, Home as HomeIcon, Drama, Zap, ChevronRight, Star, Skull, Award, ArrowRight, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface DashboardProps {
  data: UserData;
}

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; sub?: string; color: string }> = ({ label, value, icon, sub, color }) => (
  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${color}`}></div>
    <div className="relative z-10 flex justify-between items-start">
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{label}</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{value}</h3>
            {sub && <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-3.5 rounded-2xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
            {icon}
        </div>
    </div>
  </div>
);

const TheaterWidget: React.FC<{ data: RoleCombatData | null; loading: boolean }> = ({ data, loading }) => {
    if (loading) return <div className="h-full min-h-[240px] bg-white/40 dark:bg-slate-800/40 rounded-3xl animate-pulse"></div>;
    
    if (!data || !data.has_data) {
        return (
            <div className="h-full min-h-[240px] bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/30 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                 <Drama size={48} className="text-purple-300 mb-3 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                 <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Imaginarium Theater</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No active performance data</p>
                 <Link to="/theater" className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-xs font-bold shadow-sm hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors">
                    Check History
                 </Link>
            </div>
        );
    }

    return (
        <Link to="/theater" className="block h-full min-h-[240px] group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
             <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b3d] to-[#1a1025]"></div>
             <img src="https://act-webstatic.hoyoverse.com/hk4e/e20200928calculate/item_icon/692f7e36/4a36aa29881a6b082dbd4560e53605d5.png" alt="bg" className="absolute -right-20 -bottom-20 w-64 h-64 object-contain opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/60"></div>
             
             <div className="relative z-10 p-6 flex flex-col h-full">
                 <div className="flex justify-between items-start mb-4">
                     <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-purple-300">
                         <Drama size={20} />
                     </div>
                     <span className="bg-purple-500/30 text-purple-100 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-purple-400/30">
                         Season Active
                     </span>
                 </div>
                 
                 <div className="mt-auto">
                     <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">Imaginarium Theater</h3>
                     <div className="flex items-end gap-3 mb-4">
                         <div>
                             <p className="text-purple-200 text-xs uppercase font-bold tracking-wider">Difficulty</p>
                             <p className="text-2xl font-black text-white">Tier {data.stat.difficulty_id}</p>
                         </div>
                         <div className="w-px h-8 bg-white/20"></div>
                         <div>
                             <p className="text-purple-200 text-xs uppercase font-bold tracking-wider">Medals</p>
                             <div className="flex items-center gap-1">
                                 <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                 <span className="text-xl font-bold text-white">{data.stat.medal_num}</span>
                             </div>
                         </div>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-purple-200 group-hover:text-white transition-colors">
                         View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                 </div>
             </div>
        </Link>
    );
};

const OnslaughtWidget: React.FC<{ data: HardChallengeData | null; loading: boolean }> = ({ data, loading }) => {
    if (loading) return <div className="h-full min-h-[240px] bg-white/40 dark:bg-slate-800/40 rounded-3xl animate-pulse"></div>;

    if (!data || !data.mp.has_data) {
        return (
             <div className="h-full min-h-[240px] bg-gradient-to-br from-red-500/5 to-orange-500/5 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl p-6 border border-red-100 dark:border-red-900/30 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                 <Zap size={48} className="text-red-300 mb-3 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                 <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Onslaught</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No active event records</p>
                 <Link to="/onslaught" className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-xs font-bold shadow-sm hover:bg-red-50 dark:hover:bg-slate-700 transition-colors">
                    Check Events
                 </Link>
            </div>
        );
    }

    return (
        <Link to="/onslaught" className="block h-full min-h-[240px] group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
             <div className="absolute inset-0 bg-gradient-to-br from-[#3d1b1b] to-[#251010]"></div>
             {/* Decorative background circle */}
             <div className="absolute -left-10 -top-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
             
             <div className="relative z-10 p-6 flex flex-col h-full">
                 <div className="flex justify-between items-start mb-4">
                     <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-red-300">
                         <Zap size={20} />
                     </div>
                     <span className="bg-red-500/30 text-red-100 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-red-400/30">
                         Event Live
                     </span>
                 </div>
                 
                 <div className="mt-auto">
                     <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">{data.schedule.name}</h3>
                     <div className="flex items-end gap-3 mb-4">
                         <div>
                             <p className="text-red-200 text-xs uppercase font-bold tracking-wider">Score</p>
                             <p className="text-2xl font-black text-white">{data.mp.best.difficulty}</p>
                         </div>
                         <div className="w-px h-8 bg-white/20"></div>
                         <div>
                             <p className="text-red-200 text-xs uppercase font-bold tracking-wider">Time</p>
                             <div className="flex items-center gap-1">
                                 <Clock size={16} className="text-red-400" />
                                 <span className="text-xl font-bold text-white">{data.mp.best.second}s</span>
                             </div>
                         </div>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-red-200 group-hover:text-white transition-colors">
                         View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                 </div>
             </div>
        </Link>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [theater, setTheater] = useState<RoleCombatData | null>(null);
  const [onslaught, setOnslaught] = useState<HardChallengeData | null>(null);
  const [loadingExtra, setLoadingExtra] = useState(true);

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
        } finally {
            setLoadingExtra(false);
        }
     };
     fetchData();
  }, [data]);

  const elementData = (data.characters || [])
    .filter(c => c && c.element) // Safety check
    .reduce((acc, char) => {
        const existing = acc.find(e => e.name === char.element);
        if (existing) {
            existing.value++;
        } else {
            // Colors mapping
            const colors: any = {
                'Pyro': '#ef4444', 'Hydro': '#3b82f6', 'Anemo': '#14b8a6', 
                'Electro': '#a855f7', 'Dendro': '#22c55e', 'Cryo': '#06b6d4', 'Geo': '#ca8a04'
            };
            acc.push({ name: char.element, value: 1, color: colors[char.element] || '#94a3b8' });
        }
        return acc;
    }, [] as {name: string, value: number, color: string}[])
    .filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Welcome back, Traveler.</p>
         </div>
         <div className="flex gap-2">
            <span className="px-4 py-2 bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-2xl text-xs font-bold border border-yellow-200/50 dark:border-yellow-700/30 backdrop-blur-sm shadow-sm flex items-center gap-1.5">
               <Sparkles size={12} />
               AR {data.level}
            </span>
             <span className="px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-sm shadow-sm">
               {data.server}
            </span>
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Active Days" 
          value={data.stats.active_days} 
          icon={<Clock size={20} className="text-blue-500" />} 
          color="bg-blue-500 text-blue-500"
        />
        <StatCard 
          label="Characters" 
          value={data.stats.characters_obtained} 
          icon={<Users size={20} className="text-teal-500" />} 
          color="bg-teal-500 text-teal-500"
        />
        <StatCard 
          label="Achievements" 
          value={data.stats.achievements} 
          icon={<Trophy size={20} className="text-yellow-500" />} 
          color="bg-yellow-500 text-yellow-500"
        />
        <Link to="/abyss" className="block group">
             <div className="h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 bg-indigo-500"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Spiral Abyss</p>
                        <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{data.stats.spiral_abyss}</h3>
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">Deepest Descent</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-indigo-500 bg-opacity-10 text-indigo-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <Award size={20} />
                    </div>
                </div>
             </div>
        </Link>
      </div>

      {/* Middle Section: Element Chart + Combat Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Element Distribution */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 dark:border-white/5 flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Vision Distribution</h3>
               <Link to="/characters" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                   <ChevronRight size={18} className="text-slate-400" />
               </Link>
          </div>
          <div className="flex-1 w-full relative min-h-[200px] flex items-center justify-center">
             {elementData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={elementData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {elementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                        }}
                        itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                      />
                    </PieChart>
                 </ResponsiveContainer>
             ) : (
                <div className="text-center text-slate-400 dark:text-slate-500">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No data available</p>
                </div>
             )}
          </div>
          {elementData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {elementData.slice(0, 5).map(e => (
                    <div key={e.name} className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }}></div>
                        {e.name}
                    </div>
                ))}
            </div>
          )}
        </div>

        {/* Combat Widgets (Theater & Onslaught) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <TheaterWidget data={theater} loading={loadingExtra} />
            <OnslaughtWidget data={onslaught} loading={loadingExtra} />
        </div>
      </div>

      {/* Bottom Section: Collection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl">
                      <Box size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Treasures Found</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total Opened: <span className="font-bold text-slate-700 dark:text-slate-200">{data.stats.chests_opened}</span></p>
                  </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   {/* Chest breakdown using a map for cleaner code */}
                   {[
                       { l: 'Common', v: data.stats.chest_breakdown?.common, c: 'text-slate-600 dark:text-slate-400' },
                       { l: 'Exquisite', v: data.stats.chest_breakdown?.exquisite, c: 'text-sky-600 dark:text-sky-400' },
                       { l: 'Precious', v: data.stats.chest_breakdown?.precious, c: 'text-indigo-600 dark:text-indigo-400' },
                       { l: 'Luxurious', v: data.stats.chest_breakdown?.luxurious, c: 'text-amber-600 dark:text-amber-400' },
                       { l: 'Magic', v: data.stats.chest_breakdown?.magic, c: 'text-emerald-600 dark:text-emerald-400' },
                   ].map((item) => (
                       <div key={item.l} className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl text-center border border-slate-100/50 dark:border-slate-700/30">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{item.l}</p>
                          <p className={`text-lg font-bold ${item.c}`}>{item.v || 0}</p>
                       </div>
                   ))}
              </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                      <Gem size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Oculi Collection</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total Collected: <span className="font-bold text-slate-700 dark:text-slate-200">{data.stats.oculi_collected}</span></p>
                  </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                      { l: 'Anemo', v: data.stats.oculi_breakdown?.anemoculi, c: 'text-teal-500' },
                      { l: 'Geo', v: data.stats.oculi_breakdown?.geoculi, c: 'text-amber-500' },
                      { l: 'Electro', v: data.stats.oculi_breakdown?.electroculi, c: 'text-purple-500' },
                      { l: 'Dendro', v: data.stats.oculi_breakdown?.dendroculi, c: 'text-green-500' },
                      { l: 'Hydro', v: data.stats.oculi_breakdown?.hydroculi, c: 'text-blue-500' },
                      { l: 'Pyro', v: data.stats.oculi_breakdown?.pyroculi, c: 'text-red-500' },
                  ].map((o) => (
                      <div key={o.l} className="p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl text-center border border-slate-100/50 dark:border-slate-700/30">
                          <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">{o.l}</p>
                          <p className={`text-md font-bold ${o.c}`}>{o.v || 0}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>

       {/* Homes / Serenitea Pot Section (Existing, just styled) */}
      {data.homes && data.homes.length > 0 && (
         <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-sm relative overflow-hidden">
             <div className="relative z-10 flex items-center gap-3 mb-6">
                 <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                     <HomeIcon size={20} />
                 </div>
                 <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Serenitea Pot</h3>
             </div>
             
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {data.homes.map((home, idx) => (
                     <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                         <img src={home.icon} alt={home.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                         <div>
                             <h4 className="font-bold text-slate-800 dark:text-slate-200">{home.name}</h4>
                             <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Lv. {home.level} • {home.comfort_level_name}</p>
                             <div className="flex gap-3 mt-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                                 <span title="Comfort" className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">{home.comfort_num} Comfort</span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      )}
    </div>
  );
};

export default Dashboard;
