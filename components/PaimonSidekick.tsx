
import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { sendMessageToPaimon } from '../services/ai';
import { Send, Bot, Sparkles, X, MessageSquare, Lightbulb, Zap, ShieldAlert, GripHorizontal } from 'lucide-react';
import { UserData } from '../types';

interface PaimonSidekickProps {
    userData: UserData;
    context: string; 
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

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
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
    const [isOpen, setIsOpen] = useState(false);
    
    // Draggable State
    const [pos, setPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    // Window Position (relative to bubble or separate, let's keep it tied to the same pos state for simplicity or use a separate one if we want independent movement)
    // For "Draggable Button" request, usually the widget moves.
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages, loadingAi, isOpen]);

    // Initialize position on mount to avoid off-screen issues
    useEffect(() => {
        setPos({ x: Math.max(20, window.innerWidth - 100), y: Math.max(20, window.innerHeight - 200) });
    }, []);

    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        });
        e.stopPropagation();
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // Basic bounds checking
            const boundedX = Math.min(Math.max(0, newX), window.innerWidth - 60);
            const boundedY = Math.min(Math.max(0, newY), window.innerHeight - 60);

            setPos({ x: boundedX, y: boundedY });
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
    }, [isDragging, dragOffset]);

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
                    { label: 'Who to build?', icon: <Sparkles size={10} />, text: "Who should I build next based on my roster?" },
                    { label: 'Team Ideas', icon: <ShieldAlert size={10} />, text: "Suggest a team for the current Spiral Abyss." },
                ];
            case 'Abyss':
                return [
                    { label: 'Abyss Tips', icon: <Zap size={10} />, text: "Analyze my Abyss performance. Why am I struggling?" },
                ];
            default: // Dashboard
                return [
                    { label: 'Daily Goals', icon: <Lightbulb size={10} />, text: "What should I focus on today?" },
                ];
        }
    };

    if (!chatUid) return null;

    // Calculate window position so it opens relative to the bubble but stays on screen
    const windowStyle: React.CSSProperties = {
        position: 'fixed',
        left: Math.min(pos.x - 300, window.innerWidth - 340) < 0 ? 20 : Math.min(pos.x - 300, window.innerWidth - 340), 
        top: Math.min(pos.y - 400, window.innerHeight - 520) < 0 ? 20 : Math.min(pos.y - 400, window.innerHeight - 520),
        zIndex: 100,
    };
    
    // If dragging the window header, we need separate logic or reuse the pos state if we want the bubble to follow the window
    // For simplicity, dragging the window header moves the "anchor point" (pos)
    
    return (
        <>
            {/* Draggable Bubble Button */}
            <div 
                style={{ left: pos.x, top: pos.y, position: 'fixed', zIndex: 101, touchAction: 'none' }}
                className={`group cursor-pointer transition-transform ${isDragging ? 'scale-105' : 'hover:scale-110'} ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onMouseDown={handleMouseDown}
                onClick={(e) => { if(!isDragging) setIsOpen(true); }}
            >
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-[#d3bc8e] bg-[#1c212e] overflow-hidden shadow-[0_0_20px_rgba(211,188,142,0.4)] relative z-10">
                        <img 
                            src="https://fastcdn.hoyoverse.com/content/v1/5b0d8726e6d34e2c8e312891316b9318_1573641249.png" 
                            alt="Paimon" 
                            className="w-full h-full object-cover scale-110" 
                            referrerPolicy="no-referrer"
                            draggable={false}
                        />
                    </div>
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-full border border-[#d3bc8e] animate-ping opacity-20"></div>
                </div>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div 
                    style={windowStyle}
                    className="w-[320px] md:w-[350px] flex flex-col bg-[#0c0f16]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-fade-in"
                >
                    {/* Draggable Header */}
                    <div 
                        className="h-14 bg-gradient-to-r from-[#1c212e] to-[#131720] border-b border-white/5 flex items-center justify-between px-4 cursor-move"
                        onMouseDown={handleMouseDown}
                    >
                         <div className="flex items-center gap-3 select-none pointer-events-none">
                             <div className="w-8 h-8 rounded-full border border-[#d3bc8e]/30 bg-[#1c212e] overflow-hidden">
                                 <img 
                                    src="https://fastcdn.hoyoverse.com/content/v1/5b0d8726e6d34e2c8e312891316b9318_1573641249.png" 
                                    alt="Paimon" 
                                    className="w-full h-full object-cover scale-110" 
                                />
                             </div>
                             <span className="font-serif font-bold text-[#d3bc8e]">Paimon</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <GripHorizontal size={16} className="text-slate-600" />
                             <button 
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                             >
                                <X size={14} />
                             </button>
                         </div>
                    </div>

                    {/* Messages */}
                    <div 
                        ref={scrollContainerRef}
                        className="h-[350px] overflow-y-auto p-4 space-y-3 scrollbar-thin bg-[#0c0f16]/50"
                    >
                         {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                <Sparkles className="text-[#d3bc8e] mb-2" />
                                <p className="text-sm text-slate-400">"Paimon is listening!"</p>
                            </div>
                         )}

                         {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role !== 'user' && (
                                    <Bot size={16} className="text-[#d3bc8e] mt-2 shrink-0" />
                                )}
                                <div className={`max-w-[85%] rounded-2xl p-2.5 text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-[#d3bc8e] text-[#0c0f16] font-medium rounded-tr-none' 
                                    : 'bg-[#1c212e] border border-white/10 text-slate-300 rounded-tl-none'
                                }`}>
                                    {msg.role === 'user' ? msg.text : <FormattedText text={msg.text} />}
                                </div>
                            </div>
                         ))}

                         {loadingAi && (
                             <div className="flex gap-2">
                                 <Bot size={16} className="text-[#d3bc8e] mt-2 shrink-0" />
                                 <div className="bg-[#1c212e] border border-white/10 rounded-2xl rounded-tl-none p-2.5">
                                     <div className="flex gap-1">
                                         <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                         <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                         <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                     </div>
                                 </div>
                             </div>
                         )}
                         <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-[#131720] border-t border-white/5">
                        <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
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
                                placeholder="Message Paimon..."
                                disabled={loadingAi}
                                className="w-full bg-[#0c0f16] border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#d3bc8e]/50"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || loadingAi}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#d3bc8e] disabled:opacity-50"
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
