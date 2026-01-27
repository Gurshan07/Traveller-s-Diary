
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Swords, Map, Menu, X, Ghost, LogOut, Medal, Drama, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { fetchRoleCombat, fetchHardChallenges, fetchSpiralAbyss } from '../services/api';
import { initializeChat, resetChatHistory } from '../services/ai';
import PaimonSidekick from './PaimonSidekick';

// Define local asset path manually to avoid ESM import errors
const paimonAvatar = '/assets/paimon.png';

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
    { path: '/characters', label: 'Characters', icon: <Users size={20} /> },
    { path: '/abyss', label: 'Abyss', icon: <Swords size={20} /> },
    { path: '/theater', label: 'Theater', icon: <Drama size={20} /> },
    { path: '/onslaught', label: 'Onslaught', icon: <Zap size={20} /> },
    { path: '/exploration', label: 'World', icon: <Map size={20} /> },
    { path: '/achievements', label: 'Trophies', icon: <Medal size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#080a0f] text-slate-200 overflow-hidden font-sans selection:bg-[#d3bc8e]/30 selection:text-white relative">
      
      {/* Background Graphic - Global Nebula */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse-glow mix-blend-screen"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/30 rounded-full blur-[120px] animate-float mix-blend-screen"></div>
      </div>

      {/* --- LEFT NAVIGATION RAIL --- */}
      <aside className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0c0f16] border-r border-white/10 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          shadow-2xl overflow-hidden
          ${isMobileMenuOpen ? 'w-64 translate-x-0' : 'w-20 lg:translate-x-0 -translate-x-full lg:w-20 hover:lg:w-64 group'}
      `}>
          {/* Logo Area */}
          <div className="h-20 flex items-center px-5 border-b border-white/10 shrink-0 relative w-full overflow-hidden">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d3bc8e] to-[#f3a65b] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,200,100,0.5)] z-20">
                  <Ghost className="text-[#0c0f16]" size={20} />
              </div>
              
              {/* Text Container - Absolute to prevent layout shift of icon, but controlled visibility */}
              <div className="absolute left-20 top-0 h-full flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="font-serif font-bold text-[#d3bc8e] text-lg tracking-tight">
                      Traveller's Diary
                  </span>
              </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-none w-full">
              {navItems.map((item) => (
                  <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                          relative flex items-center h-12 px-3.5 rounded-xl transition-all duration-200 group/item w-full overflow-hidden
                          ${isActive 
                              ? 'bg-[#d3bc8e]/20 text-[#ffe175] shadow-[0_0_15px_rgba(211,188,142,0.2)] border border-[#d3bc8e]/20' 
                              : 'text-slate-400 hover:bg-white/10 hover:text-white'}
                      `}
                  >
                      {({ isActive }: any) => (
                          <>
                              <div className="shrink-0 flex items-center justify-center w-6">{item.icon}</div>
                              
                              {/* Label - Absolute to prevent width pushing, fades in on hover */}
                              <div className="absolute left-14 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium tracking-wide">
                                  {item.label}
                              </div>
                              
                              {isActive && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ffe175] rounded-r-full shadow-[0_0_10px_#ffe175]"></div>
                              )}
                          </>
                      )}
                  </NavLink>
              ))}
          </nav>

          {/* User Footer */}
          <div className="p-4 border-t border-white/10 shrink-0 w-full overflow-hidden bg-[#080a0f]">
               <div className="flex items-center gap-4 overflow-hidden h-10">
                    <div className="w-10 h-10 rounded-full border border-white/20 shrink-0 bg-[#131720] shadow-lg relative z-10">
                        <img 
                            src={user?.profileIcon || paimonAvatar} 
                            alt="User" 
                            className="w-full h-full rounded-full object-cover" 
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    
                    {/* User Info - Fades in */}
                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                         <span className="text-sm font-bold text-white truncate max-w-[140px]">{user?.nickname}</span>
                         <span className="text-[10px] text-slate-400 uppercase font-bold">{user?.server}</span>
                    </div>
               </div>
               
               <button 
                  onClick={handleLogout}
                  className="mt-4 flex items-center justify-center w-full h-10 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all opacity-0 group-hover:opacity-100 duration-200 overflow-hidden"
               >
                  <LogOut size={16} className="shrink-0" />
                  <span className="ml-2 text-xs font-bold uppercase whitespace-nowrap">Logout</span>
               </button>
          </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden fixed top-0 w-full z-40 bg-[#0c0f16]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 h-16 shadow-lg">
           <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-[#d3bc8e] rounded-full flex items-center justify-center">
                   <Ghost className="text-[#0c0f16]" size={16} />
               </div>
               <span className="font-serif font-bold text-slate-100">Traveller's Diary</span>
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
