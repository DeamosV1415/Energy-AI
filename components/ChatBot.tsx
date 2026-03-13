import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { queryN8N } from '../services/n8nService';

/**
 * Lightweight markdown renderer for n8n responses.
 * Handles: ### headers, **bold**, numbered lists, and line breaks.
 */
const renderMarkdown = (text: string): React.ReactNode[] => {
  // Normalize line endings and split into lines
  const lines = text.replace(/\\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ol key={`list-${listKey++}`} className="list-decimal list-inside space-y-2 my-3 text-slate-700">
          {listItems}
        </ol>
      );
      listItems = [];
    }
  };

  const renderInline = (line: string): React.ReactNode[] => {
    // Process **bold** markers
    const parts: React.ReactNode[] = [];
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-slate-900">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [line];
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Skip empty lines but flush lists
    if (!trimmed) {
      flushList();
      return;
    }

    // ### Heading
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h-${i}`} className="text-sm font-bold text-blue-700 mt-4 mb-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full inline-block"></span>
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    // ## Heading
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h2-${i}`} className="text-base font-bold text-slate-800 mt-4 mb-2">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Numbered list: "1. ", "2. ", etc.
    const listMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (listMatch) {
      listItems.push(
        <li key={`li-${i}`} className="text-sm leading-relaxed pl-1 py-1 border-l-2 border-blue-200 ml-2 px-3 bg-blue-50/40 rounded-r-lg">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full mr-2 -ml-1">{listMatch[1]}</span>
          {renderInline(listMatch[2])}
        </li>
      );
      return;
    }

    // Bullet list: "- " or "* "
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      listItems.push(
        <li key={`li-${i}`} className="text-sm leading-relaxed pl-1 py-1 border-l-2 border-emerald-200 ml-2 px-3 bg-emerald-50/30 rounded-r-lg flex items-start gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span>
          <span>{renderInline(bulletMatch[1])}</span>
        </li>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-slate-700 my-1">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
};

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
    <div className="bg-gradient-to-br from-[#0f172a]/[0.03] via-blue-100/60 to-indigo-100/40 rounded-3xl shadow-xl shadow-blue-500/5 border border-white/60 flex flex-col h-[480px] transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="p-5 border-b border-white/40 flex items-center justify-between relative z-10 bg-white/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-[15px]">AI Assistant Command Center</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Intelligent Building Support</p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="px-3 py-1.5 bg-white/80 border border-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm hover:shadow-md transition-all cursor-default">
            Context: Site Wide
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 scroll-smooth relative z-10 chat-scrollbar"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex gap-3 message-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-110 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-slate-500/20' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-tr-sm' 
                : 'bg-white/90 backdrop-blur-sm border border-blue-100/60 text-slate-800 rounded-tl-sm'
            }`}>
              {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 message-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-blue-100/60 p-4 rounded-2xl rounded-tl-sm text-sm text-blue-600 font-medium italic flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
              Analyzing building data...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/40 bg-white/30 backdrop-blur-md rounded-b-3xl relative z-10">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query anomalies, energy trends, or optimize performance..."
            className="w-full bg-white/90 backdrop-blur-sm border border-blue-200/60 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 shadow-sm hover:shadow-md focus:shadow-lg"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/25 active:scale-90 hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;