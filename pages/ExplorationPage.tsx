import React from 'react';
import { Link } from 'react-router-dom';
import { UserData, RegionData } from '../types';
import { ELEMENT_ICONS, BG_GRADIENTS, ELEMENT_COLORS } from '../constants';
import { Crown, Sprout, Landmark } from 'lucide-react';

interface ExplorationPageProps {
  data: UserData;
}

const RegionCard: React.FC<{ region: RegionData; adjustedPercentage?: number }> = ({ region, adjustedPercentage }) => {
    // Use the adjusted percentage if provided (for parent regions with 0%), otherwise match the API
    const displayPercentage = adjustedPercentage !== undefined ? adjustedPercentage : region.exploration_progress;
    
    // Safety check for NaN
    const safePercentage = isNaN(displayPercentage) ? 0 : Number(displayPercentage.toFixed(1));

    return (
        <Link to={`/exploration/${region.id}`} className="block group">
            <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-sm border border-white/50 dark:border-white/10 overflow-hidden hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                {/* Header Image */}
                <div className="h-40 relative bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${BG_GRADIENTS[region.element]} mix-blend-multiply dark:mix-blend-overlay opacity-60`}></div>
                    <img 
                        src={region.image} 
                        alt={region.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 p-5 w-full">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${ELEMENT_COLORS[region.element]} bg-white/10 backdrop-blur-md border border-white/20 shadow-lg`}>
                                {ELEMENT_ICONS[region.element]}
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-wide drop-shadow-md truncate pr-4">{region.name}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-5 flex-1 flex flex-col">
                    {/* Main Progress */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Exploration Progress</span>
                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{safePercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 relative ${safePercentage === 100 ? 'bg-green-500' : 'bg-[#4e6c8e]'}`}
                                style={{ width: `${safePercentage}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Reputation */}
                        <div className="p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <Crown size={14} className="text-yellow-600 dark:text-yellow-500" />
                                Reputation
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Lv. {region.reputation_level}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">/ {region.max_reputation_level}</span>
                            </div>
                        </div>

                        {/* Statue */}
                        <div className="p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <Landmark size={14} className="text-blue-500 dark:text-blue-400" />
                                Statue
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Lv. {region.statue_level}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">/ 10</span>
                            </div>
                        </div>
                    </div>

                    {/* Offerings Preview */}
                    {region.offerings && region.offerings.length > 0 && (
                        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
                            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <Sprout size={14} className="text-pink-500" />
                                Offerings
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {region.offerings.slice(0, 3).map((off, idx) => (
                                    <div key={idx} className="flex-shrink-0 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                        <img src={off.icon} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{off.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

const ExplorationPage: React.FC<ExplorationPageProps> = ({ data }) => {
  // 1. Identify root regions (parentId === 0)
  const rootRegions = (data.regions || []).filter(r => r.parentId === 0);

  return (
    <div className="space-y-6 pb-10">
        <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">World Exploration</h2>
            <p className="text-slate-500 dark:text-slate-400">Track your journey across Teyvat.</p>
        </div>

        {rootRegions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {rootRegions.map(region => {
                  // 2. Fix 0% exploration for parent containers (like Chenyu Vale)
                  // If exploration is 0, check if it has children in the raw list
                  let adjustedPercentage = undefined;
                  
                  if (region.exploration_progress === 0) {
                      const children = (data.regions || []).filter(r => r.parentId === Number(region.id));
                      if (children.length > 0) {
                          const total = children.reduce((sum, child) => sum + child.exploration_progress, 0);
                          adjustedPercentage = total / children.length;
                      }
                  }

                  return (
                    <RegionCard 
                        key={region.id} 
                        region={region} 
                        adjustedPercentage={adjustedPercentage}
                    />
                  );
              })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <Landmark size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-1">No Exploration Data</h3>
            <p>Detailed world exploration data is not available via this connection.</p>
          </div>
        )}
    </div>
  );
};

export default ExplorationPage;
