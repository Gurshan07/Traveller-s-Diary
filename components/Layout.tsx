
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Swords, Map, Menu, X, Ghost, LogOut, Medal, Drama, Zap, Settings, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { fetchRoleCombat, fetchHardChallenges, fetchSpiralAbyss } from '../services/api';
import { initializeChat, resetChatHistory } from '../services/ai';
import PaimonSidekick from './PaimonSidekick';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { chatUid, setChatUid, addMessage, clearChat } = useChat();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine current context for AI based on path
  const getContext = () => {
      const path = location.pathname;
      if (path.includes('characters')) return 'Characters';
      if (path.includes('abyss')) return 'Abyss';
      if (path.includes('exploration')) return 'Exploration';
      if (path.includes('theater')) return 'Theater';
      return 'Dashboard';
  };

  // Global AI Initialization Logic
  useEffect(() => {
     const initAI = async () => {
         // Only init if we have a user and haven't initialized for this UID yet
         if (user && chatUid !== user.uid) {
             console.log("Layout: Initializing AI for user", user.uid);
             resetChatHistory();
             clearChat();
             
             try {
                // Fetch context data in background
                const [tData, oData, aData] = await Promise.all([
                    fetchRoleCombat(user).catch(() => []),
                    fetchHardChallenges(user).catch(() => []),
                    fetchSpiralAbyss(user).catch(() => null)
                ]);

                await initializeChat(user, aData, tData, oData);
                
                // Greeting
                addMessage({ 
                    role: 'model', 
                    text: `**Paimon is ready!**\nI've analyzed your adventure diary. We have data on:\n- ${user.characters?.length || 0} Characters\n- Abyss Floor ${aData?.max_floor || user.abyss.floor}\n\nWhere should we start, Traveler?` 
                });
                
                setChatUid(user.uid);
             } catch (e) {
                 console.error("AI Init Failed", e);
                 // Allow chat anyway, just with less context
                 setChatUid(user.uid); 
             }
         }
     };

     initAI();
  }, [user, chatUid]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Summary', icon: <LayoutDashboard size={20} /> },
    { path: '/characters', label: 'Roster', icon: <Users size={20} /> },
    { path: '/abyss', label: 'Abyss', icon: <Swords size={20} /> },
    { path: '/theater', label: 'Theater', icon: <Drama size={20} /> },
    { path: '/onslaught', label: 'Onslaught', icon: <Zap size={20} /> },
    { path: '/exploration', label: 'World', icon: <Map size={20} /> },
    { path: '/achievements', label: 'Trophies', icon: <Medal size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#080a0f] text-slate-200 overflow-hidden font-sans selection:bg-[#d3bc8e]/30 selection:text-white relative">
      
      {/* Background Graphic - Global Nebula */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-indigo-950/20 rounded-full blur-[150px] animate-pulse-glow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-950/20 rounded-full blur-[150px] animate-float"></div>
      </div>

      {/* --- LEFT NAVIGATION RAIL --- */}
      <aside className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0c0f16]/90 backdrop-blur-xl border-r border-white/5 transition-all duration-300
          ${isMobileMenuOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0 group hover:w-64'}
      `}>
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-center border-b border-white/5 shrink-0 overflow-hidden relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d3bc8e] to-[#8c7b5b] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(211,188,142,0.3)]">
                  <Ghost className="text-[#0c0f16]" size={20} />
              </div>
              <span className="absolute left-20 whitespace-nowrap font-serif font-bold text-[#d3bc8e] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Traveller's Diary
              </span>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-none">
              {navItems.map((item) => (
                  <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                          relative flex items-center h-12 px-3 rounded-xl transition-all duration-200 group/item
                          ${isActive 
                              ? 'bg-[#d3bc8e]/10 text-[#d3bc8e] shadow-[0_0_10px_rgba(211,188,142,0.1)]' 
                              : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}
                      `}
                  >
                      <div className="shrink-0">{item.icon}</div>
                      <span className="ml-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
                          {item.label}
                      </span>
                      {({ isActive }: any) => isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#d3bc8e] rounded-r-full"></div>
                      )}
                  </NavLink>
              ))}
          </nav>

          <div className="p-4 border-t border-white/5 shrink-0">
               <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full border border-white/10 shrink-0 bg-[#131720]">
                        <img 
                            src={user?.profileIcon || 'https://github.com/shadcn.png'} 
                            alt="User" 
                            className="w-full h-full rounded-full object-cover" 
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap min-w-0">
                         <span className="text-sm font-bold text-slate-200 truncate">{user?.nickname}</span>
                         <span className="text-[10px] text-slate-500 uppercase font-bold">{user?.server} • Lv.{user?.level}</span>
                    </div>
               </div>
               <button 
                  onClick={handleLogout}
                  className="mt-4 flex items-center justify-center w-full h-10 rounded-lg border border-red-900/30 text-red-500 hover:bg-red-950/30 hover:border-red-800 transition-all opacity-0 group-hover:opacity-100 duration-200"
               >
                  <LogOut size={16} />
                  <span className="ml-2 text-xs font-bold uppercase">Logout</span>
               </button>
          </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden fixed top-0 w-full z-40 bg-[#0c0f16]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 h-16">
           <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-[#d3bc8e] rounded-full flex items-center justify-center">
                   <Ghost className="text-[#0c0f16]" size={16} />
               </div>
               <span className="font-serif font-bold text-slate-200">Traveller's Diary</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
               {isMobileMenuOpen ? <X /> : <Menu />}
           </button>
      </div>

      {/* --- MAIN CONTENT CANVAS --- */}
      <main className="flex-1 relative z-10 flex flex-col min-w-0 h-full pt-16 lg:pt-0 lg:pl-20 transition-all">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-8 scroll-smooth">
               <div className="max-w-7xl mx-auto pb-20">
                    {children}
               </div>
          </div>
      </main>

      {/* --- PAIMON FLOATING SIDEKICK --- */}
      {user && <PaimonSidekick userData={user} context={getContext()} />}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
