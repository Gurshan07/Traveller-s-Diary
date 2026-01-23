import React from 'react';
import { UserData } from '../types';
import { Trophy, Clock, Users, MapPin, Compass, Box, Gem, Home as HomeIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface DashboardProps {
  data: UserData;
}

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; sub?: string }> = ({ label, value, icon, sub }) => (
  <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 group">
    <div className="flex justify-between items-start">
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:scale-105 transition-transform origin-left">{value}</h3>
            {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 group-hover:bg-[#4e6c8e]/10 group-hover:text-[#4e6c8e] transition-colors">
            {icon}
        </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Overview</h2>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, Traveler.</p>
         </div>
         <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold border border-yellow-200 dark:border-yellow-700/50 backdrop-blur-sm shadow-sm">
               AR {data.level}
            </span>
             <span className="px-4 py-1.5 bg-slate-100/80 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-600 backdrop-blur-sm shadow-sm">
               {data.server}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Active Days" 
          value={data.stats.active_days} 
          icon={<Clock size={20} />} 
        />
        <StatCard 
          label="Characters" 
          value={data.stats.characters_obtained} 
          icon={<Users size={20} />} 
        />
        <StatCard 
          label="Achievements" 
          value={data.stats.achievements} 
          icon={<Trophy size={20} />} 
        />
        <StatCard 
          label="Spiral Abyss" 
          value={data.stats.spiral_abyss} 
          icon={<Compass size={20} />} 
          sub="Deepest Descent"
        />
      </div>

      {/* Homes / Serenitea Pot Section */}
      {data.homes && data.homes.length > 0 && (
         <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-sm relative overflow-hidden">
             <div className="relative z-10 flex items-center gap-3 mb-4">
                 <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                     <HomeIcon size={20} />
                 </div>
                 <h3 className="font-bold text-slate-800 dark:text-slate-100">Serenitea Pot</h3>
             </div>
             
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {data.homes.map((home, idx) => (
                     <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                         <img src={home.icon} alt={home.name} className="w-16 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                         <div>
                             <h4 className="font-bold text-slate-800 dark:text-slate-200">{home.name}</h4>
                             <p className="text-xs text-slate-500 dark:text-slate-400">Lv. {home.level} • {home.comfort_level_name}</p>
                             <div className="flex gap-3 mt-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                                 <span title="Comfort">{home.comfort_num} Comfort</span>
                                 <span title="Items">{home.item_num} Items</span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      )}

      {/* New Stats Row for Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                      <Box size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Treasures Found</h3>
                  <span className="ml-auto text-sm font-mono text-slate-500">{data.stats.chests_opened} Total</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Common</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{data.stats.chest_breakdown?.common || 0}</p>
                  </div>
                   <div className="p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Exquisite</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{data.stats.chest_breakdown?.exquisite || 0}</p>
                  </div>
                   <div className="p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Precious</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{data.stats.chest_breakdown?.precious || 0}</p>
                  </div>
                   <div className="p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Luxurious</p>
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{data.stats.chest_breakdown?.luxurious || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Magic</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">{data.stats.chest_breakdown?.magic || 0}</p>
                  </div>
              </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                      <Gem size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Oculi Collection</h3>
                  <span className="ml-auto text-sm font-mono text-slate-500">{data.stats.oculi_collected} Total</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                      { l: 'Anemo', v: data.stats.oculi_breakdown?.anemoculi, c: 'text-teal-500' },
                      { l: 'Geo', v: data.stats.oculi_breakdown?.geoculi, c: 'text-yellow-500' },
                      { l: 'Electro', v: data.stats.oculi_breakdown?.electroculi, c: 'text-purple-500' },
                      { l: 'Dendro', v: data.stats.oculi_breakdown?.dendroculi, c: 'text-green-500' },
                      { l: 'Hydro', v: data.stats.oculi_breakdown?.hydroculi, c: 'text-blue-500' },
                      { l: 'Pyro', v: data.stats.oculi_breakdown?.pyroculi, c: 'text-red-500' },
                  ].map((o) => (
                      <div key={o.l} className="p-2 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl text-center">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{o.l}</p>
                          <p className={`text-md font-bold ${o.c}`}>{o.v || 0}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Element Distribution */}
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/50 dark:border-white/10 lg:col-span-1 flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Element Distribution</h3>
          <div className="w-full h-64 relative min-w-0 flex items-center justify-center">
             {elementData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={elementData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {elementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                        }}
                        itemStyle={{ color: '#1e293b' }}
                      />
                    </PieChart>
                 </ResponsiveContainer>
             ) : (
                <div className="text-center text-slate-400 dark:text-slate-500">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No character data available</p>
                </div>
             )}
          </div>
          {elementData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
                {elementData.map(e => (
                    <div key={e.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/30 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: e.color }}></div>
                        {e.name}
                    </div>
                ))}
            </div>
          )}
        </div>

        {/* Exploration Progress */}
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-white/50 dark:border-white/10 lg:col-span-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">World Exploration</h3>
             <div className="space-y-5">
                {data.regions && data.regions.length > 0 ? data.regions.map((area) => (
                    <div key={area.id}>
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium text-slate-700 dark:text-slate-200">{area.name}</span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono">{area.exploration_progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                                className="bg-gradient-to-r from-[#4e6c8e] to-[#6b8cafff] dark:from-[#4e6c8e] dark:to-[#7aa2cc] h-3 rounded-full transition-all duration-1000 relative" 
                                style={{ width: `${area.exploration_progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
                        <MapPin size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No exploration data available</p>
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
