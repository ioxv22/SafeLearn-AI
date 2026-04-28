'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { 
  Bot, Send, Clock, Lightbulb, Info, 
  HelpCircle, LogOut, ShieldCheck, User, Sparkles, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function StudentChat() {
  const { activeClass, setActiveClass, safeMode, examMode } = useStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: 'مرحباً بك! أنا معلمك الذكي SafeLearn AI. كيف يمكنني مساعدتك في فهم درس اليوم؟ لا تتردد في طرح أي سؤال، وسأرشدك للحل خطوة بخطوة.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/smart-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          safeMode,
          examMode
        })
      });

      const data = await response.json();
      
      const aiMessage = { 
        role: 'assistant', 
        content: data.text || data.error || 'عذراً، حدث خطأ في النظام.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!activeClass) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-400 border border-indigo-500/20 animate-float">
            <Sparkles size={48} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
            <Bot size={16} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">مرحباً بك في المعلم الذكي</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">اختر المادة التي ترغب في البدء في تعلمها الآن وسأرشدك خطوة بخطوة</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {[
            { id: 1, name: 'الرياضيات المتقدمة', icon: '📐', color: 'indigo' },
            { id: 2, name: 'العلوم العامة', icon: '🧪', color: 'emerald' },
            { id: 3, name: 'اللغة الإنجليزية', icon: '📚', color: 'amber' },
            { id: 4, name: 'البرمجة والذكاء الاصطناعي', icon: '💻', color: 'purple' },
          ].map((cls) => (
            <button
              key={cls.id}
              onClick={() => setActiveClass(cls)}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group text-right flex flex-col gap-3 shadow-xl hover:shadow-indigo-500/10"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform w-fit">{cls.icon}</span>
              <span className="text-lg font-black text-white">{cls.name}</span>
              <span className="text-xs font-bold text-slate-500">ابدأ التعلم الآن ←</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[750px] bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden relative" dir="rtl" suppressHydrationWarning>
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <Bot size={30} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-black text-white tracking-tight">{activeClass.name}</h3>
              {safeMode && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20 flex items-center gap-1 shadow-sm shadow-emerald-500/10">
                  <ShieldCheck size={10} /> SAFE MODE
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              المعلم الذكي متصل الآن
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const topic = prompt('ما الموضوع الذي تريد البحث عن فيديو شرح له؟');
              if (topic) window.open(`https://www.youtube.com/results?search_query=شرح+${encodeURIComponent(topic)}`, '_blank');
            }}
            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-600/30 transition-all flex items-center gap-2 text-xs font-black"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            فيديو شرح
          </button>
          <button 
            onClick={() => setActiveClass(null)} 
            className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center border border-slate-700/50"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 px-8 py-10 overflow-y-auto space-y-10 custom-scrollbar relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-6 rounded-[2rem] shadow-2xl leading-relaxed text-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20' 
                      : 'bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-200 rounded-tl-none shadow-black/20'
                  }`}>
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <Clock size={10} />
                    {msg.timestamp}
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start items-center gap-4"
            >
               <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 px-6 py-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5 items-center shadow-2xl shadow-black/20">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                <Bot size={20} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Footer & Input */}
      <div className="p-8 bg-slate-900/60 backdrop-blur-2xl border-t border-slate-800 relative z-20">
        {messages.length < 6 && !isTyping && (
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {[
              { label: 'أعطني تلميحاً', icon: Lightbulb, color: 'hover:text-amber-400 hover:bg-amber-400/10' },
              { label: 'اشرح الخطوة الأولى', icon: Info, color: 'hover:text-blue-400 hover:bg-blue-400/10' },
              { label: 'أنا عالق هنا', icon: HelpCircle, color: 'hover:text-red-400 hover:bg-red-400/10' },
            ].map((suggest, i) => (
              <motion.button 
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(suggest.label)}
                className={`flex items-center gap-2 px-5 py-3 bg-slate-800 border border-slate-700 text-slate-400 rounded-2xl text-xs font-black transition-all shadow-lg ${suggest.color}`}
              >
                <suggest.icon size={14} />
                {suggest.label}
              </motion.button>
            ))}
          </div>
        )}

        <div className="relative group max-w-4xl mx-auto">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب سؤالك هنا... المعلم الذكي سيساعدك في التفكير" 
            className="w-full pr-8 pl-20 py-6 bg-slate-800/50 border-2 border-slate-700/50 rounded-[2rem] outline-none focus:bg-slate-800 focus:border-indigo-500/30 focus:ring-8 focus:ring-indigo-500/5 transition-all text-white font-bold shadow-2xl shadow-black/40 text-lg placeholder:text-slate-600"
            disabled={isTyping}
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-indigo-500/30 disabled:opacity-40 transition-all active:scale-95"
          >
            <Send size={24} className="rotate-180" />
          </button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black tracking-widest uppercase opacity-80">
          <Sparkles size={12} className="text-indigo-400 animate-pulse" />
          <span>تم التطوير بواسطة نظام الذكاء الاصطناعي الآمن - SafeLearn AI</span>
        </div>
      </div>
    </div>
  );
}

