'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { useStore } from '../store';
import { 
  KeyRound, ArrowRight, MessageSquare, Send, 
  Sparkles, User, Bot, LogOut, ChevronLeft, 
  Clock, Info, Lightbulb, HelpCircle, RefreshCcw, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function StudentChat() {
  const { currentUser } = useStore();
  const [classCode, setClassCode] = useState('');
  const [studentName, setStudentName] = useState(currentUser?.displayName === 'طالب تجريبي' ? '' : (currentUser?.displayName || ''));
  const [activeClass, setActiveClass] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  
  // Chat state
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleJoin = async () => {
    if (!classCode.trim() || !studentName.trim()) {
      setError('يرجى إدخال اسمك وكود الفصل بشكل صحيح.');
      return;
    }
    setIsJoining(true);
    setError('');

    const q = query(collection(db, 'classrooms'), where('code', '==', classCode));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setError('كود الفصل غير صحيح، يرجى التأكد والمحاولة مرة أخرى.');
      setIsJoining(false);
      return;
    }

    const clsDoc = snapshot.docs[0];
    const clsData = { id: clsDoc.id, ...clsDoc.data() };
    
    setActiveClass(clsData);
    setIsJoining(false);
    setMessages([{ 
      role: 'assistant', 
      content: `مرحباً بك يا ${studentName}! 👋 أنا معلمك الذكي في فصل ${clsData.name}. يسعدني جداً مساعدتك في فهم أي مسألة تواجهك. تذكر، أنا هنا لأدلك على الطريق وليس لأعطيك الحل النهائي. بمَ تريد أن نبدأ؟`,
      timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSkip = () => {
    const personalName = studentName.trim() || (currentUser?.displayName === 'طالب تجريبي' ? 'طالب' : (currentUser?.displayName || 'طالب'));
    setStudentName(personalName);
    setActiveClass({ id: 'personal', name: 'التعلم المستقل' });
    setMessages([{ 
      role: 'assistant', 
      content: `أهلاً بك يا ${personalName}! في وضع التعلم المستقل، يمكنك سؤالي عن أي شيء وسأقوم بتفكيك المسألة معك خطوة بخطوة. كيف يمكنني إرشادك الآن؟`,
      timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim() || isTyping) return;

    const userMessage = { 
      role: 'user', 
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.text,
          timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Chat Error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'عذراً، حدث خطأ أثناء الاتصال بالمعلم الذكي. حاول مرة أخرى.',
        timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!activeClass) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-100 max-w-xl w-full text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200 animate-float">
            <KeyRound size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">ابدأ رحلة التعلم</h2>
          <p className="text-slate-400 mb-10 text-lg font-medium leading-relaxed">أدخل كود الفصل الذي أعطاك إياه معلمك، أو ابدأ التعلم بشكل مستقل مع مساعدنا الذكي.</p>
          
          <div className="space-y-6">
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="ما هو اسمك؟"
                className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-lg font-bold text-slate-700"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="كود الفصل (6 أرقام)"
                className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-2xl tracking-[0.5em] font-black text-indigo-600 placeholder:tracking-normal placeholder:text-lg"
                maxLength={6}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm font-black animate-pulse">{error}</p>}
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleJoin}
                disabled={isJoining || classCode.length < 6 || !studentName.trim()}
                className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 disabled:opacity-40 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <span>دخول الفصل</span>
                <ArrowRight size={24} className="rotate-180" />
              </button>
              <button 
                onClick={handleSkip}
                className="w-full py-4 text-slate-400 font-bold hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
              >
                تخطي والدخول في وضع التعلم المستقل
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 overflow-hidden" dir="rtl" suppressHydrationWarning>
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Bot size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 leading-none mb-2">{activeClass.name}</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <Sparkles size={10} /> الوضع الآمن
              </span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span className="text-[10px] font-bold text-slate-400">نشط الآن</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveClass(null)} 
            className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 px-8 py-8 overflow-y-auto bg-slate-50/30 space-y-8 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} items-end gap-4`}
            >
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                  <User size={20} />
                </div>
              )}
              
              <div className="flex flex-col gap-2 max-w-[80%]">
                <div className={`p-5 rounded-[2rem] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-white border border-slate-100 text-slate-800 rounded-br-none' 
                    : 'bg-indigo-600 text-white rounded-bl-none shadow-indigo-100'
                }`}>
                  <p className="text-base leading-relaxed font-medium">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-2 text-[10px] font-bold text-slate-300 ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <Clock size={10} />
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                  <Bot size={20} />
                </div>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex justify-end items-center gap-4"
            >
              <div className="bg-indigo-50 px-6 py-4 rounded-[1.5rem] rounded-bl-none flex gap-1.5 items-center">
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Bot size={20} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Footer & Input */}
      <div className="p-8 bg-white border-t border-slate-50">
        {messages.length < 5 && !isTyping && (
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {[
              { label: 'أعطني تلميحاً', icon: Lightbulb },
              { label: 'اشرح الخطوة الأولى', icon: Info },
              { label: 'أنا عالق هنا', icon: HelpCircle },
              { label: 'مثال مشابه', icon: RefreshCcw },
            ].map((suggest, i) => (
              <button 
                key={i}
                onClick={() => handleSendMessage(suggest.label)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-xs font-black hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition-all"
              >
                <suggest.icon size={12} />
                {suggest.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative group">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب سؤالك هنا... سأساعدك في الفهم خطوة بخطوة" 
            className="w-full pr-6 pl-20 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 font-bold"
            disabled={isTyping}
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <Send size={24} className="rotate-180" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-300 text-[10px] font-black tracking-widest uppercase">
          <ShieldAlert size={12} />
          <span>نظام الذكاء الاصطناعي الآمن - SafeLearn AI</span>
        </div>
      </div>
    </div>
  );
}
