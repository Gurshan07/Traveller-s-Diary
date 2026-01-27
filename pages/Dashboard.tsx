
import React from 'react';
import { UserData } from '../types';
import { Swords, Map, User, Trophy, Calendar, Sparkles, Compass, Star, ChevronRight, Scroll, Clock } from 'lucide-react';

interface DashboardProps {
  data: UserData;
}

// Reusable "Glass" Card Component
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`glass-panel rounded-3xl p-6 relative overflow-hidden ${className}`}>
        {children}
    </div>
);

// Stat Node Component for the "Constellation" grid
const StatNode: React.FC<{ 
    label: string; 
    value: string | number; 
    icon: React.ReactNode; 
    subtext?: string;
    accentColor: string; 
}> = ({ label, value, icon, subtext, accentColor }) => (
    <div className="relative group">
        <div className={`
            absolute inset-0 rounded-2xl opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40
            bg-${accentColor}-500
        `}></div>
        <div className="relative bg-[#131720]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
                 <div className={`p-2.5 rounded-xl bg-white/5 text-${accentColor}-400 ring-1 ring-white/10`}>
                     {icon}
                 </div>
                 {/* Decorative dot */}
                 <div className={`w-2 h-2 rounded-full bg-${accentColor}-500 shadow-[0_0_10px_currentColor]`}></div>
            </div>
            <div className="text-3xl font-serif font-bold text-slate-100 tracking-tight">{value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">{label}</div>
            {subtext && <div className="text-[10px] text-slate-400 mt-2 border-t border-white/5 pt-2">{subtext}</div>}
        </div>
    </div>
);

// New Quest Log Item
const QuestLogItem: React.FC<{ title: string; desc: string; time: string; type: 'Combat' | 'Loot' | 'World' }> = ({ title, desc, time, type }) => {
    const typeConfig = {
        Combat: { icon: <Swords size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
        Loot: { icon: <Star size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        World: { icon: <Map size={16} />, color: 'text-green-400', bg: 'bg-green-500/10' }
    };
    
    const cfg = typeConfig[type];

    return (
        <div className="flex gap-4 group">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
                 <div className={`w-8 h-8 rounded-full ${cfg.bg} ${cfg.color} border border-white/10 flex items-center justify-center shrink-0 z-10`}>
                     {cfg.icon}
                 </div>
                 <div className="w-0.5 flex-1 bg-white/5 group-last:hidden mt-2"></div>
            </div>
            
            <div className="flex-1 pb-8 group-last:pb-0">
                <div className="bg-[#1c212e]/50 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                     <div className="flex justify-between items-start mb-1">
                         <h4 className="font-bold text-slate-200 text-sm">{title}</h4>
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
    <div className="space-y-8 animate-fade-in">
        
        {/* --- ZONE 1: HERO SECTION --- */}
        <div className="relative rounded-[2.5rem] overflow-hidden min-h-[400px] flex items-end p-8 md:p-12 group">
             {/* Background Image */}
             <div className="absolute inset-0 bg-[#0c0f16]">
                 <img 
                    src="https://fastcdn.hoyoverse.com/content/v1/5b0d8726e6d34e2c8e312891316b9318_1573641249.png" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[20s]"
                    alt="Background"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/80 to-transparent"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f] via-transparent to-transparent"></div>
             </div>

             <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-8">
                 <div className="flex items-end gap-6">
                      <div className="relative shrink-0">
                           <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-b from-[#d3bc8e] to-[#8c7b5b] shadow-[0_0_40px_rgba(211,188,142,0.3)]">
                               <img 
                                  src={data.profileIcon || "https://github.com/shadcn.png"} 
                                  className="w-full h-full rounded-full object-cover border-4 border-[#080a0f] bg-[#1c212e]" 
                                  alt="Traveler"
                                  referrerPolicy="no-referrer"
                               />
                           </div>
                           <div className="absolute -bottom-2 -right-2 bg-[#080a0f] text-[#d3bc8e] text-xs font-bold px-3 py-1 rounded-full border border-[#d3bc8e]/30 shadow-lg">
                               AR {data.level}
                           </div>
                      </div>

                      <div className="mb-2">
                           <h1 className="text-4xl md:text-5xl font-serif font-black text-white tracking-wide drop-shadow-lg leading-none mb-2">
                               {data.nickname}
                           </h1>
                           <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                               <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                                   <Calendar size={14} /> {activeDays} Days Active
                               </span>
                               <span className="uppercase tracking-widest text-[10px] font-bold border-l border-white/10 pl-4">
                                   {data.server} Server
                               </span>
                           </div>
                      </div>
                 </div>

                 {/* Paimon Insight Bubble */}
                 <div className="hidden lg:block relative max-w-sm mb-4 animate-float">
                      <div className="absolute -top-3 -left-3 text-2xl">✨</div>
                      <div className="glass-panel rounded-2xl rounded-bl-none p-4 border border-[#d3bc8e]/20 relative">
                           <p className="text-sm text-slate-200 leading-relaxed italic">
                               "Traveler! Paimon noticed you've been working hard on exploration lately. Maybe we should check on your <strong className="text-[#d3bc8e]">Abyss</strong> progress next?"
                           </p>
                           <div className="absolute -bottom-2 left-0 w-4 h-4 bg-[#131720] border-r border-b border-[#d3bc8e]/20 transform rotate-45 translate-x-4"></div>
                      </div>
                 </div>
             </div>
        </div>

        {/* --- ZONE 2: PERFORMANCE OVERVIEW --- */}
        <div>
            <h2 className="text-xl font-serif font-bold text-slate-200 mb-6 flex items-center gap-3">
                <Sparkles size={20} className="text-[#d3bc8e]" />
                Adventure Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatNode 
                     label="Spiral Abyss" 
                     value={abyssFloor} 
                     icon={<Swords size={20} />} 
                     subtext={`${data.abyss.stars} Stars collected`}
                     accentColor="indigo"
                 />
                 <StatNode 
                     label="Characters" 
                     value={charCount} 
                     icon={<User size={20} />} 
                     subtext="Full Roster Size"
                     accentColor="orange"
                 />
                 <StatNode 
                     label="World Explored" 
                     value={`${avgExploration}%`} 
                     icon={<Map size={20} />} 
                     subtext="Average Completion"
                     accentColor="green"
                 />
                 <StatNode 
                     label="Achievements" 
                     value={achievements} 
                     icon={<Trophy size={20} />} 
                     subtext="Total Unlocked"
                     accentColor="yellow"
                 />
            </div>
        </div>

        {/* --- ZONE 3: QUEST LOG (Recent Journey) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-bold text-slate-200 flex items-center gap-3">
                        <Scroll size={20} className="text-[#d3bc8e]" />
                        Adventure Log
                    </h2>
                    <button className="flex items-center gap-1 text-xs font-bold text-[#d3bc8e] hover:text-white transition-colors uppercase tracking-widest">
                        View Archive <ChevronRight size={14} />
                    </button>
                </div>
                
                {/* Vertical Quest Log */}
                <div className="pl-2">
                    <QuestLogItem 
                        type="Combat"
                        title={`Conquered Floor ${abyssFloor}`}
                        desc="Successfully cleared the Spiral Abyss floor with 36 stars total."
                        time="2 Hours Ago"
                    />
                    <QuestLogItem 
                        type="Loot"
                        title="Acquired 5-Star Artifact"
                        desc="Obtained 'Sands of Eon' from the Domain of Blessing."
                        time="5 Hours Ago"
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
                        time="2 Days Ago"
                    />
                </div>
            </div>

            {/* Side Panel: Featured or Radar */}
            <div className="hidden lg:block">
                 <h2 className="text-xl font-serif font-bold text-slate-200 mb-6 flex items-center gap-3">
                    <Compass size={20} className="text-[#d3bc8e]" />
                    Focus
                </h2>
                <div className="glass-panel rounded-3xl p-6 h-full border border-[#d3bc8e]/10 bg-gradient-to-b from-[#1c212e] to-[#131720]">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto bg-[#d3bc8e]/10 rounded-full flex items-center justify-center border border-[#d3bc8e]/30 mb-3 text-[#d3bc8e]">
                            <Compass size={32} />
                        </div>
                        <h3 className="font-bold text-white">Exploration Focus</h3>
                        <p className="text-xs text-slate-400 mt-1">Sumeru is calling!</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-300">
                                <span>Sumeru</span>
                                <span className="font-bold text-white">82%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[82%] rounded-full"></div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-300">
                                <span>Fontaine</span>
                                <span className="font-bold text-white">65%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[65%] rounded-full"></div>
                            </div>
                        </div>
                        
                        <div className="pt-4 mt-4 border-t border-white/5">
                            <p className="text-xs text-slate-400 italic text-center">
                                "There are still 42 chests in Sumeru waiting for us!"
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
