import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { queryN8N } from '../services/n8nService';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm EnerVision. I can analyze anomalies, log maintenance, or optimize policies. How can I help?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await queryN8N(input);
    
    const aiMessage: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 rounded-3xl shadow-lg shadow-blue-500/10 border border-blue-200 flex flex-col h-[450px] transition-all duration-300">
      <div className="p-6 border-b border-blue-200/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">AI Assistant Command Center</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Intelligent Building Support</p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="px-3 py-1 bg-white/90 border border-blue-200 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
            Context: Site Wide
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-blue-600 text-white'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-white rounded-tr-none' 
                : 'bg-white border border-blue-100 text-slate-800 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white/80 border border-blue-100 p-4 rounded-2xl text-sm text-blue-700 font-medium italic backdrop-blur-sm">
              Analyzing building data...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-blue-200/50 bg-blue-50/50 backdrop-blur-md rounded-b-3xl">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query anomalies, energy trends, or optimize performance..."
            className="w-full bg-white border border-blue-200 rounded-2xl py-3 pl-4 pr-12 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400 shadow-sm"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;