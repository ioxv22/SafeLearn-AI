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
  const { currentUser, safeMode, examMode } = useStore();
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
      content: `مرحباً بك يا ${studentName}! 👋 أنا معلمك الذكي في فصل ${clsData.name}. ${examMode ? 'نحن الآن في وضع الاختبار، لذا سأقوم بمراقبة إجاباتك فقط.' : 'يسعدني جداً مساعدتك في فهم أي مسألة تواجهك.'}`,
      timestamp: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSkip = () => {
    const personalName = studentName.trim() || (currentUser?.displayName === 'طالب تجريبي' ? 'طالب' : (currentUser?.displayName || 'طالب'));
    setStudentName(personalName);
    setActiveClass({ id: 'personal', name: 'التعلم المستقل' });
    setMessages([{ 
      role: 'assistant', 
      content: `أهلاً بك يا ${personalName}! كيف يمكنني إرشادك الآن؟`,
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
    <div className="flex flex-col h-[700px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" dir="rtl" suppressHydrationWarning>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-none mb-1">{activeClass.name}</h3>
            {safeMode && (
              <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={10} /> وضع الأمان نشط
              </p>
            )}
          </div>
        </div>
        <button 
          onClick={() => setActiveClass(null)} 
          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 px-6 py-6 overflow-y-auto bg-white space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-100'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <div className={`mt-2 text-[8px] opacity-50 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <Clock size={8} />
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center border border-slate-100">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-100">
        {messages.length < 6 && !isTyping && (
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { label: 'أعطني تلميحاً', icon: Lightbulb },
              { label: 'اشرح الخطوة الأولى', icon: Info },
              { label: 'أنا عالق هنا', icon: HelpCircle },
            ].map((suggest, i) => (
              <button 
                key={i}
                onClick={() => handleSendMessage(suggest.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-500 rounded-lg text-xs font-bold hover:text-indigo-600 border border-slate-100 transition-all shadow-sm"
              >
                <suggest.icon size={12} />
                {suggest.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب سؤالك هنا..." 
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm font-medium shadow-sm"
            disabled={isTyping}
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center"
          >
            <Send size={20} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
