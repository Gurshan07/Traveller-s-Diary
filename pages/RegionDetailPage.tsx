import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserData } from '../types';
import { ELEMENT_COLORS, ELEMENT_ICONS, BG_GRADIENTS } from '../constants';
import { Crown, Sprout, Landmark, ArrowLeft, Skull, Map } from 'lucide-react';

interface RegionDetailPageProps {
  data: UserData;
}

const RegionDetailPage: React.FC<RegionDetailPageProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();
  
  if (!data || !data.regions) return <div>Loading...</div>;

  const region = data.regions.find(r => r.id === id);
  const childRegions = data.regions.filter(r => r.parentId === Number(id));

  if (!region) {
      return (
          <div className="p-8 text-center">
              <h2 className="text-xl font-bold">Region not found</h2>
              <Link to="/exploration" className="text-blue-500 hover:underline mt-4 inline-block">Back to Exploration</Link>
          </div>
      );
  }

  // Aggregate sub-areas from both the subRegions property and separate child region entries
  const allSubAreas = [
      ...region.subRegions,
      ...childRegions.map(child => ({ name: child.name, exploration_percentage: child.exploration_progress }))
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
        <Link to="/exploration" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft size={20} />
            Back to World Map
        </Link>

        {/* Hero Section */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-r ${BG_GRADIENTS[region.element]} mix-blend-multiply dark:mix-blend-overlay opacity-80`}></div>
            <img 
                src={region.image} 
                alt={region.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${ELEMENT_COLORS[region.element]} bg-white/10 backdrop-blur-md border border-white/20 shadow-lg`}>
                            {React.cloneElement(ELEMENT_ICONS[region.element] as React.ReactElement<any>, { size: 32, className: "w-8 h-8" })}
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-wide drop-shadow-lg mb-2">{region.name}</h1>
                            <div className="flex items-center gap-4 text-white/90">
                                {region.reputation_level > 0 && (
                                    <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                        <Crown size={14} className="text-yellow-400" />
                                        <span className="text-sm font-bold">Reputation Lv. {region.reputation_level}</span>
                                    </div>
                                )}
                                {region.statue_level > 0 && (
                                    <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                        <Landmark size={14} className="text-blue-400" />
                                        <span className="text-sm font-bold">Statue Lv. {region.statue_level}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                         <p className="text-slate-300 text-sm font-medium mb-1">Total Exploration</p>
                         <div className="text-5xl font-bold text-white tracking-tighter drop-shadow-md">
                             {region.exploration_progress}%
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Offerings & Bosses */}
            <div className="space-y-6">
                 {region.offerings && region.offerings.length > 0 && (
                     <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <Sprout className="text-pink-500" size={20} />
                            Offerings
                        </h3>
                        <div className="space-y-4">
                            {region.offerings.map((off, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <img src={off.icon} alt={off.name} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                                    <div>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{off.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Level {off.level}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}

                 {region.bosses && region.bosses.length > 0 && (
                     <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <Skull className="text-red-500" size={20} />
                            Bosses Defeated
                        </h3>
                        <div className="space-y-2">
                            {region.bosses.map((boss, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{boss.name}</span>
                                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300">
                                        {boss.kill_num}
                                    </span>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}
            </div>

            {/* Right Col: Sub Areas */}
            <div className="lg:col-span-2">
                 <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-sm min-h-[300px]">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <Map className="text-blue-500" size={20} />
                        Area Details
                    </h3>
                    
                    {allSubAreas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allSubAreas.map((area, idx) => (
                                <div key={idx} className="group p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-[#4e6c8e]/30 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{area.name}</span>
                                        <span className={`font-bold ${area.exploration_percentage === 100 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {area.exploration_percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${area.exploration_percentage === 100 ? 'bg-green-500' : 'bg-[#4e6c8e]'}`}
                                            style={{ width: `${area.exploration_percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                            <Map size={32} className="mb-2 opacity-50" />
                            <p>No sub-area data available</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    </div>
  );
};

export default RegionDetailPage;