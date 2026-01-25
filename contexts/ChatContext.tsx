
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
    role: 'user' | 'model' | 'assistant';
    text: string;
}

interface ChatContextType {
    messages: ChatMessage[];
    addMessage: (msg: ChatMessage) => void;
    setMessages: (msgs: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
    loadingAi: boolean;
    setLoadingAi: (loading: boolean) => void;
    isPuterAuthenticated: boolean;
    setIsPuterAuthenticated: (auth: boolean) => void;
    chatUid: string | null;
    setChatUid: (uid: string | null) => void;
    clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingAi, setLoadingAi] = useState(false);
    const [isPuterAuthenticated, setIsPuterAuthenticated] = useState(false);
    const [chatUid, setChatUid] = useState<string | null>(null);

    const addMessage = (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
    };

    const clearChat = () => {
        setMessages([]);
        setChatUid(null);
    };

    return (
        <ChatContext.Provider value={{
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
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};
