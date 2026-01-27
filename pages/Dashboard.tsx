
import React from 'react';
import { UserData, ElementType } from '../types';
import { ELEMENT_ICONS, BG_GRADIENTS } from '../constants';
import { Swords, Map, User, Trophy, Calendar, Sparkles, Compass, Star } from 'lucide-react';

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

// Journey Event Item
const TimelineItem: React.FC<{ title: string; date?: string; type: 'Combat' | 'Acquisition' | 'Exploration' }> = ({ title, date, type }) => {
    const icons = {
        Combat: <Swords size={14} className="text-red-400" />,
        Acquisition: <Star size={14} className="text-yellow-400" />,
        Exploration: <Compass size={14} className="text-green-400" />
    };

    return (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors min-w-[280px]">
             <div className="w-8 h-8 rounded-full bg-[#0c0f16] flex items-center justify-center border border-white/10 shrink-0">
                 {icons[type]}
             </div>
             <div>
                 <div className="text-sm font-bold text-slate-200">{title}</div>
                 <div className="text-[10px] text-slate-500 font-mono uppercase">{date || 'Recent'}</div>
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
  
  // Calculate average exploration
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
             {/* Background Image (Mocked for now, usually Namecard) */}
             <div className="absolute inset-0 bg-[#0c0f16]">
                 <img 
                    src="https://fastcdn.hoyoverse.com/content/v1/5b0d8726e6d34e2c8e312891316b9318_1573641249.png" // Paimon BG placeholder or Namecard
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[20s]"
                    alt="Background"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/80 to-transparent"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f] via-transparent to-transparent"></div>
             </div>

             <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-8">
                 <div className="flex items-end gap-6">
                      {/* Avatar with Ring */}
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

        {/* --- ZONE 2: PERFORMANCE OVERVIEW (Constellation Grid) --- */}
        <div>
            <h2 className="text-xl font-serif font-bold text-slate-200 mb-6 flex items-center gap-3">
                <Sparkles size={20} className="text-[#d3bc8e]" />
                Adventure Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Abyss Node */}
                 <StatNode 
                     label="Spiral Abyss" 
                     value={abyssFloor} 
                     icon={<Swords size={20} />} 
                     subtext={`${data.abyss.stars} Stars collected`}
                     accentColor="indigo" // Tailwind class builder needs safelist or strict names, assuming safelist for example
                 />
                 {/* Collection Node */}
                 <StatNode 
                     label="Characters" 
                     value={charCount} 
                     icon={<User size={20} />} 
                     subtext="Full Roster Size"
                     accentColor="orange"
                 />
                 {/* Exploration Node */}
                 <StatNode 
                     label="World Explored" 
                     value={`${avgExploration}%`} 
                     icon={<Map size={20} />} 
                     subtext="Average Completion"
                     accentColor="green"
                 />
                 {/* Achievements Node */}
                 <StatNode 
                     label="Achievements" 
                     value={achievements} 
                     icon={<Trophy size={20} />} 
                     subtext="Total Unlocked"
                     accentColor="yellow"
                 />
            </div>
        </div>

        {/* --- ZONE 3: JOURNEY SNAPSHOT (Horizontal Scroll) --- */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold text-slate-200 flex items-center gap-3">
                    <Compass size={20} className="text-[#d3bc8e]" />
                    Recent Journey
                </h2>
                <button className="text-xs font-bold text-[#d3bc8e] hover:text-white transition-colors uppercase tracking-widest">
                    View Full Log
                </button>
            </div>
            
            {/* Horizontal Scroller */}
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
                <TimelineItem title={`Cleared Floor ${abyssFloor}`} type="Combat" />
                <TimelineItem title="Obtained 5-Star Artifact" type="Acquisition" date="Today" />
                <TimelineItem title="Explored Fontaine" type="Exploration" date="Yesterday" />
                <TimelineItem title="Unlocked 'Deepwood' Achievement" type="Acquisition" date="2 Days ago" />
                <TimelineItem title="Maxed Reputation: Sumeru" type="Exploration" date="1 Week ago" />
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
