
import React from 'react';
import { Link } from 'react-router-dom';
import { UserData, RegionData } from '../types';
import { BG_GRADIENTS } from '../constants';
import { Map, Crown, Landmark, ArrowRight } from 'lucide-react';

interface ExplorationPageProps {
  data: UserData;
}

const ExplorationCard: React.FC<{ region: RegionData }> = ({ region }) => {
    const percentage = region.exploration_progress / 10; // Assuming API returns 1000 for 100%? No, previous code divided by 10, checking types... 
    // Wait, mock data had 100, types say number. Let's assume passed prop is already normalized 0-100 based on previous file logic.
    // In api.ts it was: region.exploration_percentage / 10. 
    // Let's stick to the prop value.

    const radius = 30;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (region.exploration_progress / 100) * circumference;

    return (
        <Link 
            to={`/exploration/${region.id}`}
            className="group relative h-64 rounded-3xl overflow-hidden border border-white/5 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] hover:border-white/20"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-[#131720]">
                {region.image ? (
                    <img 
                        src={region.image} 
                        alt={region.name} 
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-800" />
                )}
                {/* Gradient Overlays */}
                <div className={`absolute inset-0 bg-gradient-to-r ${BG_GRADIENTS[region.element]} mix-blend-multiply opacity-80`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-3xl font-serif font-bold text-white mb-2 drop-shadow-lg">{region.name}</h3>
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                             <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                                 <Crown size={14} className="text-yellow-400" /> Lv.{region.reputation_level}
                             </div>
                             <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                                 <Landmark size={14} className="text-blue-400" /> Lv.{region.statue_level}
                             </div>
                        </div>
                    </div>

                    {/* Progress Ring */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                         <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                             <circle
                                 stroke="rgba(255,255,255,0.1)"
                                 fill="transparent"
                                 strokeWidth={stroke}
                                 r={normalizedRadius}
                                 cx={radius}
                                 cy={radius}
                             />
                             <circle
                                 stroke="#d3bc8e"
                                 fill="transparent"
                                 strokeWidth={stroke}
                                 strokeDasharray={circumference + ' ' + circumference}
                                 style={{ strokeDashoffset }}
                                 strokeLinecap="round"
                                 r={normalizedRadius}
                                 cx={radius}
                                 cy={radius}
                             />
                         </svg>
                         <div className="absolute text-xs font-bold text-white">{region.exploration_progress}%</div>
                    </div>
                </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 translate-x-4 duration-300">
                 <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white border border-white/20">
                     <ArrowRight size={20} />
                 </div>
            </div>
        </Link>
    );
};

const ExplorationPage: React.FC<ExplorationPageProps> = ({ data }) => {
  const rootRegions = (data.regions || []).filter(r => r.parentId === 0);

  return (
    <div className="animate-fade-in space-y-8">
        <div className="border-b border-white/5 pb-6">
            <h1 className="text-4xl font-serif font-black text-white tracking-wide mb-2">World Map</h1>
            <p className="text-slate-400">Tracking progress across <strong className="text-white">Teyvat</strong></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rootRegions.map(region => {
                // Adjustment logic for parent containers (copied from previous logic)
                let adjustedPercentage = region.exploration_progress;
                if (region.exploration_progress === 0) {
                      const children = (data.regions || []).filter(r => r.parentId === Number(region.id));
                      if (children.length > 0) {
                          const total = children.reduce((sum, child) => sum + child.exploration_progress, 0);
                          adjustedPercentage = total / children.length;
                      }
                }
                
                return (
                    <ExplorationCard 
                        key={region.id} 
                        region={{...region, exploration_progress: Number(adjustedPercentage.toFixed(1))}} 
                    />
                );
            })}
        </div>

        {rootRegions.length === 0 && (
            <div className="py-20 text-center text-slate-500">
                <Map size={48} className="mx-auto mb-4 opacity-30" />
                <p>No exploration data loaded.</p>
            </div>
        )}
    </div>
  );
};

export default ExplorationPage;
