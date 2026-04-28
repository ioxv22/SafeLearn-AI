'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { 
  Bot, Send, Clock, Lightbulb, Info, 
  HelpCircle, LogOut, ShieldCheck, User, Sparkles, Video
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
          content: 'مرحباً بك! أنا معلمك الذكي SafeLearn AI. كيف يمكنني مساعدتك في فهم درس اليوم؟ لا تتردد في طرح أي سؤال، وسأرشدك للحل خطوة بخطوة. ✨',
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
      <div className="flex flex-col items-center justify-center h-full text-center space-y-10 animate-in fade-in zoom-in duration-700" suppressHydrationWarning>
        <div className="relative group">
          <div className="w-32 h-32 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center text-indigo-400 border border-indigo-500/20 animate-float shadow-2xl shadow-indigo-500/10">
            <Sparkles size={64} />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl animate-pulse">
            <Bot size={24} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tight">جاهز للبدء؟ 🚀</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto text-lg">اختر المادة التي ترغب في البدء في تعلمها الآن</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
          {[
            { id: 1, name: 'الرياضيات المتقدمة', icon: '📐', desc: 'تفاضل وتكامل وهندسة' },
            { id: 2, name: 'العلوم العامة', icon: '🧪', desc: 'كيمياء وفيزياء وأحياء' },
            { id: 3, name: 'اللغة الإنجليزية', icon: '📚', desc: 'قواعد وكتابة ومحادثة' },
            { id: 4, name: 'البرمجة والذكاء الاصطناعي', icon: '💻', desc: 'بناء المستقبل الرقمي' },
          ].map((cls) => (
            <button
              key={cls.id}
              onClick={() => setActiveClass(cls)}
              className="p-8 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-[2rem] hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group text-right flex flex-col gap-2 shadow-2xl hover:shadow-indigo-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all"></div>
              <span className="text-5xl group-hover:scale-110 transition-transform mb-2 w-fit relative z-10">{cls.icon}</span>
              <span className="text-xl font-black text-white relative z-10">{cls.name}</span>
              <span className="text-xs font-bold text-slate-500 relative z-10">{cls.desc}</span>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-400 opacity-0 group-hover:opacity-100 transition-all">
                ابدأ الجلسة الآن <ChevronLeft size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[750px] bg-slate-950/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-slate-800/50 overflow-hidden relative" dir="rtl" suppressHydrationWarning>
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-30%] left-[-30%] w-[80%] h-[80%] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-30%] right-[-30%] w-[80%] h-[80%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <div className="px-10 py-8 border-b border-slate-800/50 flex justify-between items-center bg-slate-950/40 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-500">
              <Bot size={32} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-full shadow-lg"></div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h3 className="text-2xl font-black text-white tracking-tight">{activeClass.name}</h3>
              {safeMode && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20 flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                  <ShieldCheck size={12} /> SAFE AI MODE
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              المعلم الذكي نشط الآن ويسمعك
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const topic = prompt('ما الموضوع الذي تريد البحث عن فيديو شرح له؟');
              if (topic) window.open(`https://www.youtube.com/results?search_query=شرح+${encodeURIComponent(topic)}`, '_blank');
            }}
            className="px-5 py-3 bg-red-600/10 text-red-400 rounded-2xl border border-red-500/20 hover:bg-red-600/20 transition-all flex items-center gap-3 text-xs font-black group"
          >
            <Video size={18} className="group-hover:scale-110 transition-transform" />
            فيديو شرح
          </button>
          <button 
            onClick={() => setActiveClass(null)} 
            className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center shadow-xl"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 px-10 py-10 overflow-y-auto space-y-10 custom-scrollbar relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-7 py-6 rounded-[2.5rem] shadow-2xl leading-relaxed text-base font-medium transition-all ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-tr from-indigo-600 to-violet-700 text-white rounded-tr-none shadow-indigo-500/20' 
                      : 'bg-slate-900/60 backdrop-blur-xl border border-slate-800 text-slate-100 rounded-tl-none border-white/5'
                  }`}>
                    {msg.content.split('\n').map((line: string, index: number) => (
                      <p key={index} className={line.trim().startsWith('*') ? 'mt-3 font-bold text-indigo-300' : 'mb-2'}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <Clock size={10} />
                    {msg.timestamp}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl ${
                  msg.role === 'user' ? 'bg-slate-900 text-slate-500 border border-slate-800' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start items-center gap-5"
            >
               <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 px-7 py-5 rounded-[1.8rem] rounded-tl-none flex gap-2 items-center shadow-2xl">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                <Bot size={24} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Footer & Input */}
      <div className="p-10 bg-slate-950/60 backdrop-blur-3xl border-t border-slate-800 relative z-20">
        {messages.length < 6 && !isTyping && (
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {[
              { label: 'أعطني تلميحاً ذكياً', icon: Lightbulb, color: 'hover:text-amber-400 hover:bg-amber-400/10' },
              { label: 'اشرح بأسلوب أبسط', icon: Info, color: 'hover:text-blue-400 hover:bg-blue-400/10' },
              { label: 'ساعدني في التفكير', icon: HelpCircle, color: 'hover:text-red-400 hover:bg-red-400/10' },
            ].map((suggest, i) => (
              <motion.button 
                key={i}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(suggest.label)}
                className={`flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 text-slate-400 rounded-3xl text-sm font-black transition-all shadow-2xl relative overflow-hidden group ${suggest.color}`}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <suggest.icon size={18} />
                {suggest.label}
              </motion.button>
            ))}
          </div>
        )}

        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600/20 to-violet-600/20 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب سؤالك التعليمي هنا..." 
            className="w-full pr-10 pl-24 py-7 bg-slate-900/80 border-2 border-slate-800 rounded-[2.5rem] outline-none focus:bg-slate-900 focus:border-indigo-600/40 focus:ring-[15px] focus:ring-indigo-600/5 transition-all text-white font-bold shadow-2xl shadow-black/50 text-xl placeholder:text-slate-700 relative z-10"
            disabled={isTyping}
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white w-16 h-16 rounded-[1.8rem] flex items-center justify-center hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-40 transition-all active:scale-90 relative z-20 group"
          >
            <Send size={28} className="rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span>Smarter. Safer. Better. - SafeLearn AI</span>
        </div>
      </div>
    </div>
  );
}

function ChevronLeft(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
}
