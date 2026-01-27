
import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { sendMessageToPaimon } from '../services/ai';
import { Send, Bot, Sparkles, X, ChevronRight, MessageSquare, Lightbulb, Zap, ShieldAlert } from 'lucide-react';
import { UserData } from '../types';

interface PaimonSidekickProps {
    userData: UserData;
    context: string; // Current page context (e.g., "Abyss", "Dashboard")
}

const QuickChip: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d3bc8e]/50 rounded-full text-[10px] text-slate-300 hover:text-[#d3bc8e] transition-all whitespace-nowrap"
    >
        {icon}
        <span>{label}</span>
    </button>
);

// Helper for formatted text (simplified version of the one in Dashboard)
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    // Basic bolding and headers
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <span className="text-sm leading-relaxed text-slate-200">
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <span key={i} className="font-bold text-[#d3bc8e]">{part.slice(2, -2)}</span>;
                }
                return part;
            })}
        </span>
    );
};

const PaimonSidekick: React.FC<PaimonSidekickProps> = ({ userData, context }) => {
    const { 
        messages, 
        addMessage, 
        loadingAi, 
        setLoadingAi, 
        isPuterAuthenticated, 
        chatUid 
    } = useChat();
    
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(true); // Default open on desktop
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages, loadingAi]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || loadingAi) return;
        
        addMessage({ role: 'user', text: text });
        setInput('');
        setLoadingAi(true);
        
        try {
            // Context prefix hidden from user
            const contextPrompt = `[Current Page: ${context}] ${text}`;
            const response = await sendMessageToPaimon(contextPrompt);
            addMessage({ role: 'model', text: response });
        } catch (e) {
            addMessage({ role: 'model', text: "Paimon is hungry and lost the connection..." });
        } finally {
            setLoadingAi(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    };

    // Determine chips based on context
    const getChips = () => {
        switch(context) {
            case 'Characters':
                return [
                    { label: 'Who to build?', icon: <Sparkles size={10} />, text: "Who should I build next based on my roster?" },
                    { label: 'Strongest Team?', icon: <ShieldAlert size={10} />, text: "What's my strongest possible team composition?" },
                ];
            case 'Abyss':
                return [
                    { label: 'Abyss Tips', icon: <Zap size={10} />, text: "Analyze my Abyss performance. Why am I struggling?" },
                    { label: 'Meta Check', icon: <Sparkles size={10} />, text: "Which characters are best for the current Abyss cycle?" },
                ];
            case 'Exploration':
                return [
                    { label: 'Missed Chests?', icon: <MessageSquare size={10} />, text: "Which region has the most chests I haven't found yet?" },
                ];
            default: // Dashboard
                return [
                    { label: 'Daily Goals', icon: <Lightbulb size={10} />, text: "What should I focus on today?" },
                    { label: 'Account Review', icon: <Bot size={10} />, text: "Give me a brutal review of my account progress." },
                ];
        }
    };

    if (!chatUid) return null; // Don't show if not initialized

    return (
        <div className={`
            flex flex-col h-full bg-[#0c0f16]/95 backdrop-blur-xl border-l border-white/5 
            transition-all duration-300 ease-in-out relative z-40
            ${isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full lg:w-12 lg:translate-x-0'}
        `}>
            {/* Toggle Handle (Desktop) */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-[#131720] border border-white/10 rounded-l-lg items-center justify-center text-[#d3bc8e] hover:bg-[#1c212e] transition-colors z-50"
            >
                {isOpen ? <ChevronRight size={14} /> : <Bot size={16} />}
            </button>

            {/* Collapsed State Icon */}
            {!isOpen && (
                <div className="hidden lg:flex flex-col items-center pt-6 gap-4 h-full border-l border-white/5">
                    <div className="w-8 h-8 rounded-full bg-[#1c212e] border border-white/10 flex items-center justify-center">
                        <Bot size={16} className="text-[#d3bc8e]" />
                    </div>
                    <div className="writing-vertical text-xs text-slate-500 font-serif tracking-widest uppercase">Paimon AI</div>
                </div>
            )}

            {/* Main Panel Content */}
            <div className={`flex flex-col h-full overflow-hidden ${!isOpen ? 'hidden' : 'flex'}`}>
                
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#131720] to-transparent">
                    <div className="flex items-center gap-3">
                         <div className="relative">
                             <div className="w-10 h-10 rounded-full border border-[#d3bc8e]/30 bg-[#1c212e] overflow-hidden shadow-[0_0_10px_rgba(211,188,142,0.2)]">
                                 <img 
                                    src="https://fastcdn.hoyoverse.com/content/v1/5b0d8726e6d34e2c8e312891316b9318_1573641249.png" 
                                    alt="Paimon" 
                                    className="w-full h-full object-cover scale-110" 
                                    referrerPolicy="no-referrer"
                                />
                             </div>
                             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0c0f16]"></div>
                         </div>
                         <div>
                             <h3 className="font-serif text-[#d3bc8e] font-bold text-sm">Paimon</h3>
                             <p className="text-[10px] text-slate-400 uppercase tracking-wider">Companion AI</p>
                         </div>
                    </div>
                    {/* Mobile Close */}
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
                >
                    {/* Empty State */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4 opacity-50">
                            <Sparkles className="text-[#d3bc8e] mb-2 animate-pulse" size={24} />
                            <p className="text-sm text-slate-300 font-serif">"Paimon is ready to help!"</p>
                            <p className="text-xs text-slate-500">Ask about builds, abyss, or progress.</p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role !== 'user' && (
                                <div className="w-6 h-6 rounded-full bg-[#1c212e] border border-white/10 shrink-0 flex items-center justify-center mt-1">
                                    <Bot size={12} className="text-[#d3bc8e]" />
                                </div>
                            )}
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                                msg.role === 'user' 
                                ? 'bg-[#d3bc8e]/10 border border-[#d3bc8e]/20 text-slate-100 rounded-tr-none' 
                                : 'bg-[#131720] border border-white/5 text-slate-300 rounded-tl-none'
                            }`}>
                                {msg.role === 'user' ? msg.text : <FormattedText text={msg.text} />}
                            </div>
                        </div>
                    ))}
                    
                    {loadingAi && (
                        <div className="flex gap-2 justify-start">
                             <div className="w-6 h-6 rounded-full bg-[#1c212e] border border-white/10 shrink-0 flex items-center justify-center mt-1">
                                <Bot size={12} className="text-[#d3bc8e]" />
                            </div>
                            <div className="bg-[#131720] border border-white/5 rounded-2xl rounded-tl-none p-3 flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#131720]/50 border-t border-white/5 backdrop-blur-md">
                    {/* Quick Chips */}
                    <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                        {getChips().map((chip, idx) => (
                            <QuickChip 
                                key={idx} 
                                label={chip.label} 
                                icon={chip.icon} 
                                onClick={() => handleSendMessage(chip.text)} 
                            />
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={!isPuterAuthenticated ? "Login required..." : "Ask Paimon..."}
                            disabled={!isPuterAuthenticated || loadingAi}
                            className="w-full bg-[#0c0f16] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#d3bc8e]/50 focus:ring-1 focus:ring-[#d3bc8e]/20 placeholder:text-slate-600 transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || loadingAi}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#d3bc8e] disabled:opacity-50 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    {!isPuterAuthenticated && (
                        <div className="mt-2 text-[10px] text-center text-slate-500">
                            Puter.js login required for AI features.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaimonSidekick;
