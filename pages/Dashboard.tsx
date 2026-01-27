
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserData, RoleCombatData, HardChallengeData, SpiralAbyssData } from '../types';
import { fetchRoleCombat, fetchHardChallenges, fetchSpiralAbyss } from '../services/api';
import { initializeChat, sendMessageToPaimon, resetChatHistory } from '../services/ai';
import { HelpCircle, Swords, Drama, Zap, Clock, Download, Sparkles, Send, Bot, User, LogIn, Lock, LogOut, Loader2 } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

interface DashboardProps {
  data: UserData;
}

// --- Rich Text Rendering Components ---

const InlineText: React.FC<{ text: string }> = ({ text }) => {
    // 1. Split by Bold (**text**)
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    
    return (
        <>
            {boldParts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    // Bold content: Render gold/bold
                    return <span key={i} className="font-bold text-[#ffd780] drop-shadow-sm">{part.slice(2, -2)}</span>;
                } else {
                    // Normal text: Highlight Elements automatically
                    const elementParts = part.split(/(Pyro|Hydro|Anemo|Electro|Dendro|Cryo|Geo)/g);
                    return elementParts.map((subPart, j) => {
                         const key = `${i}-${j}`;
                         switch(subPart) {
                             case 'Pyro': return <span key={key} className="text-[#ff9999] font-medium">Pyro</span>;
                             case 'Hydro': return <span key={key} className="text-[#80c0ff] font-medium">Hydro</span>;
                             case 'Anemo': return <span key={key} className="text-[#80ffd7] font-medium">Anemo</span>;
                             case 'Electro': return <span key={key} className="text-[#ffacff] font-medium">Electro</span>;
                             case 'Dendro': return <span key={key} className="text-[#a5c83b] font-medium">Dendro</span>;
                             case 'Cryo': return <span key={key} className="text-[#99ffff] font-medium">Cryo</span>;
                             case 'Geo': return <span key={key} className="text-[#ffe699] font-medium">Geo</span>;
                             default: return <span key={key}>{subPart}</span>;
                         }
                    });
                }
            })}
        </>
    )
};

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    
    return (
        <div className="space-y-1.5 font-sans">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-2" />;

                // Handle Lists
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const content = trimmed.substring(2);
                    return (
                        <div key={i} className="flex gap-2 ml-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#d3bc8e] mt-2 shrink-0 opacity-80" />
                            <p className="text-sm leading-relaxed text-slate-200"><InlineText text={content} /></p>
                        </div>
                    );
                }
                
                // Handle Headers
                if (trimmed.startsWith('## ')) {
                     return <h3 key={i} className="text-base font-bold text-[#d3bc8e] mt-3 mb-1"><InlineText text={trimmed.substring(3)} /></h3>
                }

                // Standard Paragraph
                return (
                    <p key={i} className="text-sm leading-relaxed text-slate-200">
                        <InlineText text={line} />
                    </p>
                );
            })}
        </div>
    );
};

const SummaryStat: React.FC<{ label: string; value: string | number; subLabel?: string }> = ({ label, value, subLabel }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center group cursor-default">
        <span className="text-2xl lg:text-3xl font-bold text-slate-200 group-hover:text-white transition-colors">{value}</span>
        <span className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wide mt-1 group-hover:text-slate-400">{label}</span>
        {subLabel && <span className="text-[10px] text-slate-600 mt-0.5">{subLabel}</span>}
    </div>
);

// Navigation Widget for "Battle Records" section
const BattleRecordWidget: React.FC<{ 
    title: string; 
    status: string; 
    icon: React.ReactNode; 
    link: string;
    bgClass: string; 
    accentColor: string;
}> = ({ title, status, icon, link, bgClass, accentColor }) => (
    <Link to={link} className="block relative group overflow-hidden rounded-xl border border-white/5 bg-[#131720] hover:border-white/10 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 z-10"></div>
        <div className={`absolute top-0 right-0 p-20 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${bgClass}`}></div>
        
        <div className="relative z-20 p-5 flex items-center justify-between">
            <div>
                <h3 className="text-slate-200 font-bold text-lg mb-1 group-hover:text-white transition-colors">{title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{status}</span>
                </div>
            </div>
            <div className={`p-3 rounded-full bg-[#1c212e] border border-white/5 text-slate-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                {icon}
            </div>
        </div>
        {/* Progress Bar Aesthetic */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1c212e]">
            <div className={`h-full w-2/3 ${accentColor} opacity-50`}></div>
        </div>
    </Link>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [theater, setTheater] = useState<RoleCombatData | null>(null);
  const [onslaught, setOnslaught] = useState<HardChallengeData | null>(null);
  
  // New state to track if we are actively gathering background data for the AI
  const [isAiLoadingContext, setIsAiLoadingContext] = useState(false);

  // Consuming Chat Context
  const { 
    messages, 
    addMessage, 
    setMessages, 
    loadingAi, 
    setLoadingAi, 
    isPuterAuthenticated, 
    setIsPuterAuthenticated,
    chatUid,
    setChatUid,
    clearChat
  } = useChat();

  const [input, setInput] = useState('');
  // chatInitialized logic is now inferred from chatUid matching data.uid AND context loading being done
  const chatInitialized = chatUid === data?.uid && !isAiLoadingContext;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Master Data Fetcher for Dashboard + AI
  useEffect(() => {
     const fetchAllData = async () => {
        if (!data) return;

        // If we already have the chat ready for this user, just fetch display data quietly
        // If not, we block chat until ready
        const needsAiInit = chatUid !== data.uid;
        if (needsAiInit) {
            setIsAiLoadingContext(true);
            resetChatHistory();
            clearChat();
        }

        try {
            // Fetch everything in parallel
            const [tData, oData, aData] = await Promise.all([
                fetchRoleCombat(data).catch(e => { console.warn("Theater fetch fail", e); return []; }),
                fetchHardChallenges(data).catch(e => { console.warn("Onslaught fetch fail", e); return []; }),
                fetchSpiralAbyss(data).catch(e => { console.warn("Abyss fetch fail", e); return null; })
            ]);

            // Update Dashboard State
            if (tData.length > 0) setTheater(tData[0]);
            if (oData.length > 0) setOnslaught(oData[0]);

            // Initialize AI with FULL Context if needed
            if (needsAiInit) {
                await initializeChat(data, aData, tData, oData);
                addMessage({ role: 'model', text: "Paimon has finished reading your travel diary! I know about your **Abyss** runs and **Theater** stats now! What should we discuss?" });
                setChatUid(data.uid);
                setIsAiLoadingContext(false);
            }
        } catch (e) {
            console.error("Error fetching dashboard extra data", e);
            if (needsAiInit) {
                 addMessage({ role: 'model', text: "Paimon had trouble reading some pages of your diary... but I'm still here!" });
                 setChatUid(data.uid); // Allow chatting anyway even if partial fail
                 setIsAiLoadingContext(false);
            }
        }
     };
     
     // Trigger the fetch
     fetchAllData();
  }, [data, chatUid]); // Depend on chatUid so switching accounts triggers this

  useEffect(() => {
      // Check Puter auth on mount if not already done
      const checkPuterAuth = () => {
          const puter = (window as any).puter;
          if (puter?.auth?.isSignedIn()) {
              setIsPuterAuthenticated(true);
          }
      };
      if (!isPuterAuthenticated) {
          checkPuterAuth();
      }
  }, []);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePuterLogin = async () => {
      const puter = (window as any).puter;
      if (!puter) return;
      try {
          await puter.auth.signIn();
          setIsPuterAuthenticated(true);
          // Just trigger a re-render/re-check effectively
          setChatUid(null); // Force re-init
      } catch (e) {
          console.error("Login failed", e);
      }
  };
  
  const handleSwitchAccount = async () => {
      const puter = (window as any).puter;
      if (!puter) return;
      try {
          // Sign out first to force account selection on next sign in
          await puter.auth.signOut();
          setIsPuterAuthenticated(false);
          // Trigger sign in again
          await puter.auth.signIn();
          setIsPuterAuthenticated(true);
          
          setChatUid(null); // Force re-init sequence
      } catch (e) {
          console.error("Switch account failed", e);
      }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !chatInitialized || loadingAi || !isPuterAuthenticated) return;

      const userMsg = input.trim();
      addMessage({ role: 'user', text: userMsg });
      setInput('');
      setLoadingAi(true);

      try {
          const response = await sendMessageToPaimon(userMsg);
          addMessage({ role: 'model', text: response });
      } catch (err) {
          addMessage({ role: 'model', text: "Sorry, Paimon got confused." });
      } finally {
          setLoadingAi(false);
      }
  };

  const handleDownloadData = () => {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `genshin_data_${data.uid}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  // Calculations for Summary Panel
  const theaterLabel = theater?.has_data ? `Act ${theater.stat.max_round_id}` : 'No Data';
  const onslaughtLabel = onslaught?.mp?.has_data ? `Score ${onslaught.mp.best.difficulty}` : 'Not Started';

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. Top Summary Panel (High Density) */}
      <div className="bg-[#131720] rounded-xl border border-white/5 p-1 relative overflow-hidden shadow-xl">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-900 via-[#4e6c8e] to-indigo-900 opacity-50"></div>
           
           <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#181d29]">
               <div className="flex items-center gap-2">
                   <div className="w-1 h-4 bg-[#d3bc8e] rounded-full"></div>
                   <h2 className="text-slate-200 font-bold text-sm uppercase tracking-widest">Summary</h2>
                   <HelpCircle size={14} className="text-slate-600 cursor-help hover:text-slate-400" />
               </div>
               <div className="flex items-center gap-3">
                   <div className="text-[10px] text-slate-500 font-mono">
                       UID: {data.uid}
                   </div>
                   <button 
                     onClick={handleDownloadData}
                     className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-[10px] text-slate-400 hover:text-white transition-colors"
                     title="Save data to file"
                   >
                     <Download size={12} />
                     <span>JSON</span>
                   </button>
               </div>
           </div>

           <div className="p-6 md:p-8">
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
                    <SummaryStat label="Days Active" value={data.stats.active_days} />
                    <SummaryStat label="Achievements" value={data.stats.achievements} />
                    <SummaryStat label="Characters" value={data.stats.characters_obtained} />
                    <SummaryStat label="Spiral Abyss" value={data.stats.spiral_abyss} />
                    <div className="hidden lg:block"></div> {/* Spacer for symmetry if needed */}

                    <SummaryStat label="Imaginarium Theater" value={theaterLabel} />
                    <SummaryStat label="Stygian Onslaught" value={onslaughtLabel} />
                    <SummaryStat label="Oculi Collected" value={data.stats.oculi_collected} />
                    <SummaryStat label="Chests Opened" value={data.stats.chests_opened} />
                    <div className="hidden lg:block"></div>
               </div>
               
               {/* Divider with counts */}
               <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.anemoculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Anemoculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.geoculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Geoculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.electroculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Electroculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.dendroculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Dendroculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.hydroculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Hydroculi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-bold">{data.stats.oculi_breakdown.pyroculi}</span>
                        <span className="text-[10px] text-slate-600 uppercase">Pyroculi</span>
                    </div>
               </div>
           </div>
      </div>

      {/* 2. Events & Battle Records */}
      <div className="space-y-3">
          <div className="flex items-center gap-2 pl-1">
               <div className="w-1.5 h-1.5 bg-[#d3bc8e] rotate-45"></div>
               <h2 className="text-slate-300 font-bold text-sm uppercase tracking-wide">Battle Records Review</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <BattleRecordWidget 
                   title="Spiral Abyss" 
                   status="Abyssal Moon Spire" 
                   icon={<Swords size={20} />} 
                   link="/abyss"
                   bgClass="bg-indigo-600"
                   accentColor="bg-indigo-500"
               />
               <BattleRecordWidget 
                   title="Imaginarium Theater" 
                   status={theater?.schedule.schedule_id ? "Season Active" : "Season Ended"} 
                   icon={<Drama size={20} />} 
                   link="/theater"
                   bgClass="bg-purple-600"
                   accentColor="bg-purple-500"
               />
               <BattleRecordWidget 
                   title="Stygian Onslaught" 
                   status={onslaught?.schedule?.is_valid ? "Event Active" : "Event Ended"} 
                   icon={<Zap size={20} />} 
                   link="/onslaught"
                   bgClass="bg-red-600"
                   accentColor="bg-red-500"
               />
          </div>
      </div>

      {/* 3. Paimon Chat Interface */}
      <div className="bg-[#131720] rounded-xl border border-white/5 overflow-hidden flex flex-col h-[500px] relative shadow-lg">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#181d29]">
               <div className="flex items-center gap-2">
                   <Sparkles size={16} className="text-purple-400" />
                   <h2 className="text-slate-200 font-bold text-sm uppercase tracking-wide">Chat with Paimon</h2>
               </div>
               <div className="flex items-center gap-3">
                   {isPuterAuthenticated ? (
                       <>
                           <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-800/50">
                               <Lock size={8} /> Secure
                           </span>
                           <button 
                               onClick={handleSwitchAccount}
                               className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/5 transition-colors"
                               title="Switch Google Account"
                           >
                               <LogOut size={8} /> Switch
                           </button>
                       </>
                   ) : null}
                   <div className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">Powered by Puter</div>
               </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 relative">
               {!isPuterAuthenticated && (
                   <div className="absolute inset-0 z-20 bg-[#131720]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-purple-500/20">
                            <Bot size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Connect Paimon's Brain</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs">
                            Log in with your Google or Puter account to enable AI analysis of your Genshin data.
                        </p>
                        <button 
                            onClick={handlePuterLogin}
                            className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-200 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
                        >
                            <LogIn size={18} />
                            Sign in to Enable AI
                        </button>
                   </div>
               )}

               {messages.map((msg, idx) => (
                   <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' || msg.role === 'assistant' ? (
                           <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0 mt-1 shadow-sm">
                               <img 
                                    src="https://fastcdn.hoyoverse.com/content/v1/5b0d8726e6d34e2c8e312891316b9318_1573641249.png" 
                                    alt="Paimon" 
                                    className="w-full h-full object-cover scale-110" 
                                    referrerPolicy="no-referrer"
                                />
                           </div>
                       ) : null}
                       <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                           msg.role === 'user' 
                           ? 'bg-[#4e6c8e] text-white rounded-tr-none' 
                           : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
                       }`}>
                           {msg.role === 'user' ? (
                               <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                           ) : (
                               <FormattedMessage text={msg.text} />
                           )}
                       </div>
                       {msg.role === 'user' && (
                           <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 overflow-hidden shrink-0 mt-1 shadow-sm">
                               {data.profileIcon ? (
                                   <img src={data.profileIcon} alt="Traveler" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                               ) : (
                                   <div className="w-full h-full flex items-center justify-center">
                                       <User size={16} className="text-slate-400" />
                                   </div>
                               )}
                           </div>
                       )}
                   </div>
               ))}
               
               {/* Context Loading State */}
               {isAiLoadingContext && (
                   <div className="flex gap-3 items-center opacity-75">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                             <Bot size={16} className="text-slate-500" />
                        </div>
                        <div className="text-xs text-slate-400 italic flex items-center gap-2">
                             <Loader2 size={12} className="animate-spin" />
                             Paimon is reading your adventure diary (gathering battle records)...
                        </div>
                   </div>
               )}

               {loadingAi && (
                   <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-slate-500" />
                        </div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 border border-white/5">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                   </div>
               )}
               <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-[#181d29] border-t border-white/5">
               <form onSubmit={handleSendMessage} className="flex gap-2">
                   <input 
                       type="text" 
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       placeholder={!chatInitialized ? "Paimon is getting ready..." : "Ask Paimon about your characters..."}
                       className="flex-1 bg-[#0c0f16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#4e6c8e] transition-all disabled:opacity-50"
                       disabled={loadingAi || !chatInitialized || !isPuterAuthenticated}
                   />
                   <button 
                       type="submit" 
                       disabled={loadingAi || !chatInitialized || !input.trim() || !isPuterAuthenticated}
                       className="bg-[#4e6c8e] hover:bg-[#3d5a7a] text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                   >
                       <Send size={18} />
                   </button>
               </form>
          </div>
      </div>

    </div>
  );
};

export default Dashboard;
