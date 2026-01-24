
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Swords, Map, Menu, X, Ghost, LogOut, Medal, Drama, Zap, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Summary', icon: <LayoutDashboard size={18} /> },
    { path: '/characters', label: 'My Characters', icon: <Users size={18} /> },
    { path: '/abyss', label: 'Spiral Abyss', icon: <Swords size={18} /> },
    { path: '/theater', label: 'Imaginarium Theater', icon: <Drama size={18} /> },
    { path: '/onslaught', label: 'Stygian Onslaught', icon: <Zap size={18} /> },
    { path: '/exploration', label: 'World Exploration', icon: <Map size={18} /> },
    { path: '/achievements', label: 'Achievements', icon: <Medal size={18} /> },
  ];

  const profileImage = user?.profileIcon || `https://picsum.photos/seed/${user?.uid || 'default'}/50/50`;

  return (
    <div className="min-h-screen font-sans bg-[#0c0f16] text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Graphic - Subtle nebulas */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <img 
            src="https://act-webstatic.hoyoverse.com/hk4e/e20200928calculate/item_icon/692f7e36/4a36aa29881a6b082dbd4560e53605d5.png" 
            className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] opacity-[0.03] rotate-180 mix-blend-screen"
            referrerPolicy="no-referrer"
         />
         <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-indigo-900/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-50 px-4 py-3 flex items-center justify-between
           bg-[#131720]/90 backdrop-blur-md border-b border-white/5">
        <div className="font-bold text-lg flex items-center gap-2 text-slate-200">
           <Ghost className="text-[#d3bc8e]" size={20} />
           <span>Traveller's Diary</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
             {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex relative z-10 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static lg:block
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            bg-[#131720] border-r border-white/5 shadow-2xl lg:shadow-none
            flex flex-col
        `}>
            {/* User Profile Snippet Top */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d3bc8e] to-[#8c7b5b] p-[2px]">
                        <img 
                            src={profileImage} 
                            alt="User" 
                            className="w-full h-full rounded-full object-cover bg-[#0c0f16]" 
                            referrerPolicy="no-referrer"
                        />
                     </div>
                     <div className="min-w-0">
                         <div className="font-bold text-slate-200 truncate">{user?.nickname || 'Traveler'}</div>
                         <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            {user?.server} • Lv.{user?.level}
                         </div>
                     </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                <nav className="space-y-1">
                    {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
                        ${isActive 
                            ? 'bg-gradient-to-r from-[#d3bc8e]/20 to-transparent text-[#d3bc8e] border-l-2 border-[#d3bc8e]' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-l-2 border-transparent'}
                        `}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-white/5 space-y-2">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                    <Settings size={16} />
                    <span>Settings</span>
                </button>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-16 lg:pt-0 min-w-0 overflow-hidden relative bg-[#0c0f16]">
            <div className="h-full overflow-y-auto p-4 lg:p-8 scroll-smooth">
                <div className="max-w-[1200px] mx-auto">
                    {children}
                </div>
            </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
