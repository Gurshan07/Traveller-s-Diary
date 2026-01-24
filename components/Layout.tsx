
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Swords, Map, Menu, X, Ghost, Moon, Sun, LogOut, Medal, Drama } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || 
               (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Summary', icon: <LayoutDashboard size={20} /> },
    { path: '/characters', label: 'Characters', icon: <Users size={20} /> },
    { path: '/abyss', label: 'Spiral Abyss', icon: <Swords size={20} /> },
    { path: '/theater', label: 'Theater', icon: <Drama size={20} /> },
    { path: '/exploration', label: 'Exploration', icon: <Map size={20} /> },
    { path: '/achievements', label: 'Achievements', icon: <Medal size={20} /> },
  ];

  const profileImage = user?.profileIcon || `https://picsum.photos/seed/${user?.uid || 'default'}/50/50`;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-hidden
      ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}
    `}>
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-colors duration-1000
           ${isDarkMode ? 'bg-indigo-900/40' : 'bg-blue-300/40'}`}></div>
        <div className={`absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-colors duration-1000 delay-1000
           ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-300/40'}`}></div>
         <div className={`absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-colors duration-1000 delay-2000
           ${isDarkMode ? 'bg-teal-900/40' : 'bg-teal-300/40'}`}></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-50 px-4 py-3 shadow-sm flex items-center justify-between
           bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/20 dark:border-white/5">
        <div className="font-bold text-lg flex items-center gap-2">
           <Ghost className="text-[#4e6c8e] dark:text-[#7aa2cc]" />
           <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-200 dark:to-slate-400">
             Traveller's Diary
           </span>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
             {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      <div className="flex relative z-10 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static lg:block
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-r border-white/40 dark:border-white/5 shadow-xl lg:shadow-none
            flex flex-col
        `}>
            <div className="p-6 hidden lg:flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4e6c8e] to-[#2c3e50] flex items-center justify-center text-white shadow-lg">
                <Ghost size={18} />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-400">
                    Traveller's Diary
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Menu
                </div>
                <nav className="space-y-1 px-2">
                    {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                        ${isActive 
                            ? 'bg-[#4e6c8e]/10 dark:bg-[#4e6c8e]/30 text-[#4e6c8e] dark:text-[#9bbddf] font-medium shadow-sm backdrop-blur-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'}
                        `}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3">
                <div className="flex justify-between items-center px-1">
                     <span className="text-xs font-medium text-slate-400">Appearance</span>
                     <button 
                        onClick={toggleTheme}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#4e6c8e] transition-colors"
                     >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                     </button>
                </div>
                
                {user && (
                  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/40 dark:border-white/5 shadow-sm">
                      <img 
                        src={profileImage} 
                        alt="User" 
                        className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600 object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.nickname}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{user.server} • AR {user.level}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Logout"
                      >
                        <LogOut size={16} />
                      </button>
                  </div>
                )}
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-16 lg:pt-0 min-w-0 overflow-hidden relative">
            <div className="h-full overflow-y-auto p-4 lg:p-8 scroll-smooth">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
