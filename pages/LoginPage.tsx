
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Ghost, Key, Lock, ExternalLink, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [ltuid, setLtuid] = useState('');
  const [ltoken, setLtoken] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ ltuid, ltoken });
      navigate('/');
    } catch (err) {
      // Error is handled in context and displayed via state
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
       {/* Background Ambience */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
       </div>

       <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-gradient-to-br from-[#4e6c8e] to-[#2c3e50] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
                <Ghost size={32} className="text-white" />
             </div>
             <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Traveller's Diary</h1>
             <p className="text-slate-500 dark:text-slate-400">Sync your HoYoLab data securely</p>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-white/10 transition-all duration-500">
              
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 {error && (
                   <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-300 text-sm">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <p>{error}</p>
                   </div>
                 )}

                 <div className="space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                          HoYoLab ID (ltuid_v2)
                       </label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <Key size={18} className="text-slate-400 group-focus-within:text-[#4e6c8e] transition-colors" />
                          </div>
                          <input 
                            type="text" 
                            value={ltuid}
                            onChange={(e) => setLtuid(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4e6c8e] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="e.g. 123456789"
                            required
                          />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                          Auth Token (ltoken_v2)
                       </label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <Lock size={18} className="text-slate-400 group-focus-within:text-[#4e6c8e] transition-colors" />
                          </div>
                          <input 
                            type="password" 
                            value={ltoken}
                            onChange={(e) => setLtoken(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4e6c8e] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="Paste your token here"
                            required
                          />
                       </div>
                    </div>
                 </div>

                 <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#4e6c8e] hover:bg-[#3d5a7a] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Connecting to Proxy...
                      </>
                    ) : (
                      <>
                        Connect Account
                        <CheckCircle2 size={20} />
                      </>
                    )}
                 </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                     <AlertCircle size={14} className="text-[#4e6c8e]" />
                     How to get cookies?
                  </h3>
                  <ol className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-decimal list-inside bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                     <li>Log in to <a href="https://www.hoyolab.com" target="_blank" rel="noopener noreferrer" className="text-[#4e6c8e] hover:underline inline-flex items-center gap-0.5">HoYoLab <ExternalLink size={10} /></a></li>
                     <li>Open Developer Tools (F12) &gt; Console</li>
                     <li>Open <span className="font-semibold text-slate-700 dark:text-slate-300">Application</span> &gt; Storage &gt; Cookies</li>
                     <li>Copy <code className="font-mono text-[#4e6c8e]">ltuid_v2</code> and <code className="font-mono text-[#4e6c8e]">ltoken_v2</code></li>
                  </ol>
              </div>
          </div>
       </div>
    </div>
  );
};

export default LoginPage;
