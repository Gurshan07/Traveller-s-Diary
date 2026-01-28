
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../types';
import { Swords, Map, User, Trophy, Calendar, Sparkles, Compass, Star, ChevronRight, Scroll, Clock, Copy } from 'lucide-react';

interface DashboardProps {
  data: UserData;
}

// Stat Node Component for the "Constellation" grid
const StatNode: React.FC<{ 
    label: string; 
    value: string | number; 
    icon: React.ReactNode; 
    subtext?: string;
    color: 'indigo' | 'orange' | 'emerald' | 'amber'; 
}> = ({ label, value, icon, subtext, color }) => {
    
    const colorClasses = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-400/50',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:border-orange-400/50',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-400/50',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-400/50',
    };

    const iconBg = {
        indigo: 'bg-indigo-500/20 text-indigo-300',
        orange: 'bg-orange-500/20 text-orange-300',
        emerald: 'bg-emerald-500/20 text-emerald-300',
        amber: 'bg-amber-500/20 text-amber-300',
    };

    return (
        <div className={`relative group backdrop-blur-md rounded-2xl p-5 border transition-all hover:-translate-y-1 duration-300 ${colorClasses[color]}`}>
            <div className="flex justify-between items-start mb-3">
                 <div className={`p-2.5 rounded-xl ${iconBg[color]} ring-1 ring-white/5`}>
                     {icon}
                 </div>
            </div>
            <div className="text-3xl font-serif font-black text-white tracking-tight drop-shadow-md">{value}</div>
            <div className={`text-xs font-bold uppercase tracking-widest mt-1 opacity-70`}>{label}</div>
            {subtext && <div className="text-[10px] text-slate-400 mt-2 border-t border-white/5 pt-2">{subtext}</div>}
        </div>
    );
};

// New Quest Log Item
const QuestLogItem: React.FC<{ title: string; desc: string; time: string; type: 'Combat' | 'Loot' | 'World' }> = ({ title, desc, time, type }) => {
    const typeConfig = {
        Combat: { icon: <Swords size={14} />, color: 'text-rose-400', bg: 'bg-rose-500/20 border-rose-500/30' },
        Loot: { icon: <Star size={14} />, color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
        World: { icon: <Map size={14} />, color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' }
    };
    
    const cfg = typeConfig[type];

    return (
        <div className="flex gap-4 group">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
                 <div className={`w-8 h-8 rounded-full ${cfg.bg} ${cfg.color} border flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                     {cfg.icon}
                 </div>
                 <div className="w-0.5 flex-1 bg-white/5 group-last:hidden mt-2"></div>
            </div>
            
            <div className="flex-1 pb-6 group-last:pb-0">
                <div className="bg-[#131720]/80 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors shadow-sm group-hover:bg-[#1c212e]">
                     <div className="flex justify-between items-start mb-1">
                         <h4 className="font-bold text-slate-100 text-sm">{title}</h4>
                         <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                             <Clock size={10} /> {time}
                         </span>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const navigate = useNavigate();
  
  // Safe Accessors
  const activeDays = data.stats?.active_days || 0;
  const achievements = data.stats?.achievements || 0;
  const abyssFloor = data.stats?.spiral_abyss || "N/A";
  const charCount = data.stats?.characters_obtained || 0;
  
  const avgExploration = React.useMemo(() => {
      const regions = data.regions || [];
      if (regions.length === 0) return 0;
      const total = regions.reduce((sum, r) => sum + r.exploration_progress, 0);
      return (total / regions.length).toFixed(1);
  }, [data.regions]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
        
        {/* --- ZONE 1: PROFILE NAMECARD HERO --- */}
        <div className="relative rounded-3xl overflow-hidden min-h-[280px] h-auto shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 group">
             {/* Namecard Background */}
             <div className="absolute inset-0 bg-[#1c212e]">
                 <img 
                    src="https://picsum.photos/id/1042/1200/600" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s]"
                    alt="Namecard"
                 />
                 {/* Vignette Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f16]/90 via-[#0c0f16]/40 to-transparent"></div>
             </div>

             {/* Content Layer - Mimicking In-Game Profile */}
             <div className="relative p-6 md:p-10 flex items-center min-h-[280px]">
                 <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-4xl">
                      
                      {/* Avatar Circle */}
                      <div className="relative shrink-0">
                           <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] border-[#ffe175] bg-[#1c212e] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 relative">
                               <img 
                                  src={data.profileIcon || "https://enka.network/ui/UI_AvatarIcon_PlayerBoy.png"} 
                                  className="w-full h-full object-cover" 
                                  alt="Traveler"
                                  referrerPolicy="no-referrer"
                               />
                           </div>
                           {/* Level Badge */}
                           <div className="absolute -bottom-2 md:bottom-0 left-1/2 -translate-x-1/2 bg-[#ffe175] text-[#0c0f16] text-xs font-black px-3 py-1 rounded-full border-2 border-[#1c212e] shadow-md z-20 whitespace-nowrap">
                               AR {data.level}
                           </div>
                      </div>

                      {/* Info Block */}
                      <div className="flex-1 text-center md:text-left space-y-2 pt-2">
                           <h1 className="text-3xl md:text-5xl font-serif font-black text-white tracking-wide drop-shadow-lg leading-tight break-words">
                               {data.nickname}
                           </h1>
                           
                           {/* Pseudo-Signature */}
                           <p className="text-slate-300 italic text-sm md:text-base opacity-80 line-clamp-2 md:line-clamp-1 max-w-lg mx-auto md:mx-0">
                               "Ad astra abyssosque! Exploring Teyvat one day at a time."
                           </p>

                           {/* Tags Row */}
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                               <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5 text-xs font-bold text-slate-200">
                                   <Calendar size={12} className="text-[#ffe175]" /> 
                                   <span>Active {activeDays} Days</span>
                               </div>
                               <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5 text-xs font-bold text-slate-200 uppercase">
                                   <Map size={12} className="text-emerald-400" />
                                   <span>{data.server}</span>
                               </div>
                               {/* UID */}
                               <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5 text-xs font-mono text-slate-400 group/uid cursor-pointer hover:bg-black/60 transition-colors" title="Copy UID">
                                   <span>UID: {data.uid}</span>
                                   <Copy size={10} className="opacity-0 group-hover/uid:opacity-100 transition-opacity" />
                               </div>
                           </div>
                      </div>
                 </div>
             </div>
        </div>

        {/* --- ZONE 2: PERFORMANCE OVERVIEW --- */}
        <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <StatNode 
                     label="Abyss" 
                     value={abyssFloor} 
                     icon={<Swords size={18} />} 
                     subtext={`${data.abyss.stars} Stars`}
                     color="indigo"
                 />
                 <StatNode 
                     label="Chars" 
                     value={charCount} 
                     icon={<User size={18} />} 
                     subtext="Collected"
                     color="orange"
                 />
                 <StatNode 
                     label="World" 
                     value={`${avgExploration}%`} 
                     icon={<Map size={18} />} 
                     subtext="Avg Complete"
                     color="emerald"
                 />
                 <StatNode 
                     label="Trophies" 
                     value={achievements} 
                     icon={<Trophy size={18} />} 
                     subtext="Unlocked"
                     color="amber"
                 />
            </div>
        </div>

        {/* --- ZONE 3: QUEST LOG (Recent Journey) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                        <Scroll size={18} className="text-[#ffe175]" />
                        Adventure Log
                    </h2>
                    <button 
                        onClick={() => navigate('/achievements')}
                        className="flex items-center gap-1 text-[10px] font-bold text-[#ffe175] hover:text-white transition-colors uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full hover:bg-white/10"
                    >
                        View Archive <ChevronRight size={12} />
                    </button>
                </div>
                
                {/* Vertical Quest Log */}
                <div className="pl-1">
                    <QuestLogItem 
                        type="Combat"
                        title={`Conquered Floor ${abyssFloor}`}
                        desc="Successfully cleared the Spiral Abyss floor with 36 stars total."
                        time="2h Ago"
                    />
                    <QuestLogItem 
                        type="Loot"
                        title="Acquired 5-Star Artifact"
                        desc="Obtained 'Sands of Eon' from the Domain of Blessing."
                        time="5h Ago"
                    />
                    <QuestLogItem 
                        type="World"
                        title="Explored Fontaine Region"
                        desc="Reached 65% exploration progress in the Court of Fontaine region."
                        time="Yesterday"
                    />
                    <QuestLogItem 
                        type="Loot"
                        title="Achievement Unlocked"
                        desc="Completed the 'Deepwood' achievement series."
                        time="2d Ago"
                    />
                </div>
            </div>

            {/* Side Panel: Radar - Unhidden on mobile, stacked below */}
            <div>
                 <h2 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
                    <Compass size={18} className="text-[#ffe175]" />
                    Current Focus
                </h2>
                <div className="glass-panel rounded-2xl p-6 h-full border border-[#ffe175]/10 bg-gradient-to-b from-[#1c212e] to-[#0c0f16]">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto bg-[#ffe175]/10 rounded-full flex items-center justify-center border border-[#ffe175]/30 mb-2 text-[#ffe175] shadow-[0_0_15px_rgba(255,225,117,0.2)]">
                            <Compass size={28} />
                        </div>
                        <h3 className="font-bold text-white">Exploration</h3>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Target: Sumeru</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-300 font-bold uppercase">
                                <span>Sumeru</span>
                                <span className="text-[#ffe175]">82%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[82%] rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-300 font-bold uppercase">
                                <span>Fontaine</span>
                                <span className="text-blue-300">65%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[65%] rounded-full shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                            </div>
                        </div>
                        
                        <div className="pt-4 mt-4 border-t border-white/5">
                            <p className="text-[10px] text-slate-500 italic text-center">
                                "Recommended: Locate 42 more chests in Sumeru."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
