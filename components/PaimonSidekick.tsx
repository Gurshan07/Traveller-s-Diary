
import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { sendMessageToPaimon } from '../services/ai';
import { Send, Bot, Sparkles, X, GripHorizontal, Lightbulb } from 'lucide-react';
import { UserData } from '../types';

interface PaimonSidekickProps {
    userData: UserData;
    context: string; 
}

// Reliable Paimon Source (GitHub Raw)
const PAIMON_IMG = "https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/static/images/paimon.png";

const QuickChip: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/30 hover:border-indigo-300 rounded-full text-[10px] text-indigo-100 hover:text-white transition-all whitespace-nowrap backdrop-blur-md shadow-lg shadow-indigo-500/20"
    >
        {icon}
        <span>{label}</span>
    </button>
);

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <span className="text-sm leading-relaxed text-slate-100">
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <span key={i} className="font-bold text-[#ffe175] drop-shadow-sm">{part.slice(2, -2)}</span>;
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
        chatUid 
    } = useChat();
    
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    // Draggable State
    const [pos, setPos] = useState({ x: window.innerWidth - 90, y: window.innerHeight - 120 });
    const [isDragging, setIsDragging] = useState(false);
    
    // Refs for drag calculation
    const dragOffset = useRef({ x: 0, y: 0 });
    const isDragGesture = useRef(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages, loadingAi, isOpen]);

    // Initialize position
    useEffect(() => {
        setPos({ x: Math.max(20, window.innerWidth - 90), y: Math.max(20, window.innerHeight - 120) });
    }, []);

    // Drag Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Left click only
        
        setIsDragging(true);
        isDragGesture.current = false;
        
        // Calculate offset from the top-left of the element
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        e.stopPropagation();
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            isDragGesture.current = true; // We moved, so it's a drag
            
            let newX = e.clientX - dragOffset.current.x;
            let newY = e.clientY - dragOffset.current.y;
            
            // Bounds check
            newX = Math.min(Math.max(0, newX), window.innerWidth - 60);
            newY = Math.min(Math.max(0, newY), window.innerHeight - 60);

            setPos({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleClick = (e: React.MouseEvent) => {
        // Only toggle if it wasn't a drag
        if (!isDragGesture.current) {
            setIsOpen(!isOpen);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || loadingAi) return;
        
        addMessage({ role: 'user', text: text });
        setInput('');
        setLoadingAi(true);
        
        try {
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

    const getChips = () => {
        switch(context) {
            case 'Characters':
                return [
                    { label: 'Build Guide', icon: <Sparkles size={10} />, text: "Who should I build next based on my roster?" },
                ];
            default: // Dashboard
                return [
                    { label: 'What to do?', icon: <Lightbulb size={10} />, text: "What should I focus on today?" },
                ];
        }
    };

    if (!chatUid) return null;

    // Window position
    const windowStyle: React.CSSProperties = {
        position: 'fixed',
        left: Math.min(pos.x - 300, window.innerWidth - 350) < 0 ? 20 : Math.min(pos.x - 300, window.innerWidth - 350), 
        top: Math.min(pos.y - 400, window.innerHeight - 520) < 0 ? 20 : Math.min(pos.y - 400, window.innerHeight - 520),
        zIndex: 100,
    };
    
    return (
        <>
            {/* Draggable Bubble Button */}
            <div 
                style={{ 
                    left: pos.x, 
                    top: pos.y, 
                    position: 'fixed', 
                    zIndex: 101, 
                    touchAction: 'none',
                    // Disable transition during drag for instant response
                    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                }}
                className={`group cursor-pointer ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
            >
                <div className={`relative transition-transform ${isDragging ? 'scale-95' : 'group-hover:scale-110'}`}>
                    <div className="w-16 h-16 rounded-full border-2 border-[#ffe175] bg-[#1c212e] overflow-hidden shadow-[0_0_20px_rgba(255,225,117,0.6)] relative z-10 group-hover:shadow-[0_0_30px_rgba(255,225,117,0.9)] transition-shadow">
                        <img 
                            src={PAIMON_IMG}
                            alt="Paimon" 
                            className="w-full h-full object-cover scale-110" 
                            referrerPolicy="no-referrer"
                            draggable={false}
                        />
                    </div>
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-full border border-[#ffe175] animate-ping opacity-30"></div>
                </div>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div 
                    style={windowStyle}
                    className="w-[340px] flex flex-col bg-[#0c0f16]/95 backdrop-blur-2xl border border-[#ffe175]/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in ring-1 ring-[#ffe175]/10"
                >
                    {/* Header - Now also draggable to move the window if needed (requires separate logic, but for now serves as close bar) */}
                    <div className="h-14 bg-gradient-to-r from-[#1c212e] to-[#0c0f16] border-b border-white/10 flex items-center justify-between px-4 select-none">
                         <div className="flex items-center gap-3">
                             <div className="w-9 h-9 rounded-full border border-[#ffe175]/50 bg-[#1c212e] overflow-hidden shadow-lg">
                                 <img 
                                    src={PAIMON_IMG}
                                    alt="Paimon" 
                                    className="w-full h-full object-cover scale-110" 
                                />
                             </div>
                             <div>
                                 <span className="font-serif font-bold text-[#ffe175] block leading-none drop-shadow-md">Paimon</span>
                                 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Emergency Food</span>
                             </div>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="cursor-move p-1 text-slate-600" onMouseDown={handleMouseDown} title="Drag to move">
                                <GripHorizontal size={16} />
                             </div>
                             <button 
                                onClick={() => setIsOpen(false)}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5 hover:border-white/20"
                             >
                                <X size={16} />
                             </button>
                         </div>
                    </div>

                    {/* Messages */}
                    <div 
                        ref={scrollContainerRef}
                        className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gradient-to-b from-[#0c0f16]/80 to-[#131720]/80"
                    >
                         {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                                <Sparkles className="text-[#ffe175] mb-3 animate-bounce" size={32} />
                                <p className="text-sm text-slate-200 font-bold">"Paimon is listening!"</p>
                                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Ask Paimon about your artifacts, abyss teams, or where to find chests!</p>
                            </div>
                         )}

                         {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role !== 'user' && (
                                    <Bot size={24} className="text-[#ffe175] mt-1 shrink-0 drop-shadow-[0_0_10px_rgba(255,225,117,0.5)]" />
                                )}
                                <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-md ${
                                    msg.role === 'user' 
                                    ? 'bg-gradient-to-br from-[#ffe175] to-[#c2aa7c] text-[#0c0f16] font-bold rounded-tr-none' 
                                    : 'bg-[#1e2330] border border-white/10 text-slate-200 rounded-tl-none'
                                }`}>
                                    {msg.role === 'user' ? msg.text : <FormattedText text={msg.text} />}
                                </div>
                            </div>
                         ))}

                         {loadingAi && (
                             <div className="flex gap-3">
                                 <Bot size={24} className="text-[#ffe175] mt-1 shrink-0" />
                                 <div className="bg-[#1e2330] border border-white/10 rounded-2xl rounded-tl-none p-4 shadow-sm">
                                     <div className="flex gap-1.5">
                                         <div className="w-2 h-2 bg-[#ffe175] rounded-full animate-bounce"></div>
                                         <div className="w-2 h-2 bg-[#ffe175] rounded-full animate-bounce delay-100"></div>
                                         <div className="w-2 h-2 bg-[#ffe175] rounded-full animate-bounce delay-200"></div>
                                     </div>
                                 </div>
                             </div>
                         )}
                         <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-[#131720] border-t border-white/10 backdrop-blur-md">
                        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                            {getChips().map((chip, idx) => (
                                <QuickChip 
                                    key={idx} 
                                    label={chip.label} 
                                    icon={chip.icon} 
                                    onClick={() => handleSendMessage(chip.text)} 
                                />
                            ))}
                        </div>
                        <form onSubmit={handleSubmit} className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Message Paimon..."
                                disabled={loadingAi}
                                className="w-full bg-[#080a0f] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#ffe175]/50 focus:ring-1 focus:ring-[#ffe175]/20 transition-all placeholder:text-slate-600 shadow-inner"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || loadingAi}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#ffe175] disabled:opacity-50 transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PaimonSidekick;
