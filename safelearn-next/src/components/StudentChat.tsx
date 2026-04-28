'use client';

import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { useStore } from '../store';
import { KeyRound, ArrowRight, MessageSquare, Send, Sparkles, User, Bot, LogOut } from 'lucide-react';
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
    
    // Optionally update student count if this student hasn't joined before
    // (A real app would use a subcollection to track unique joins)
    
    setActiveClass(clsData);
    setIsJoining(false);
    setMessages([{ 
      role: 'assistant', 
      content: `أهلاً بك يا ${studentName}! أنا مساعدك الذكي في فصل ${clsData.name}. كيف يمكنني مساعدتك اليوم؟` 
    }]);
  };

  const handleSkip = () => {
    const personalName = studentName.trim() || (currentUser?.displayName === 'طالب تجريبي' ? 'طالب' : (currentUser?.displayName || 'طالب'));
    setStudentName(personalName);
    setActiveClass({ id: 'personal', name: 'التعلم المستقل (شخصي)' });
    setMessages([{ 
      role: 'assistant', 
      content: `أهلاً بك يا ${personalName}! أنا مساعدك الشخصي للتعلم المستقل. اسألني أي شيء وسأساعدك بفهمه خطوة بخطوة.` 
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Chat Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ أثناء الاتصال بالمعلم الذكي. حاول مرة أخرى.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!activeClass) {
    return (
      <div className="flex flex-col items-center justify-center py-20" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">الانضمام إلى فصل</h2>
          <p className="text-slate-500 mb-8 text-sm">أدخل الكود المكون من 6 أرقام الذي أعطاك إياه المعلم للبدء في طرح أسئلتك على المساعد الذكي.</p>
          
          <div className="space-y-4">
            <input 
              type="text" 
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="اسمك الكامل (مثال: أحمد محمد)"
              className="w-full px-4 py-3 text-center text-lg font-bold border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors bg-slate-50"
            />
            <input 
              type="text" 
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="مثال: 123456"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest font-bold border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors"
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button 
              onClick={handleJoin}
              disabled={isJoining || classCode.length < 6 || !studentName.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              دخول الفصل <ArrowRight size={18} />
            </button>
            <button 
              onClick={handleSkip}
              className="w-full flex items-center justify-center py-2 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              تخطي (تعلم مستقل بدون فصل)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] md:h-[700px] bg-white rounded-[2rem] shadow-2xl shadow-indigo-500/10 border border-slate-100 overflow-hidden" dir="rtl">
      {/* Chat Header */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <Sparkles size={20} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{activeClass.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                الوضع الآمن مفعل
              </p>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <p className="text-[10px] text-slate-400 font-medium">بواسطة Gemini AI</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setActiveClass(null)} 
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="مغادرة الفصل"
        >
          <LogOut size={20} />
        </button>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-[#FBFBFF] space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} gap-3`}
            >
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
              
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white border border-slate-100 text-slate-700 rounded-tr-none' 
                  : 'bg-indigo-600 text-white rounded-tl-none shadow-indigo-200'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-1">
                  <Bot size={16} />
                </div>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex justify-end gap-3"
            >
              <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Bot size={16} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 pl-3 rounded-2xl focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500 transition-all">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اسأل سؤالك هنا... (مثال: اشرح لي قانون نيوتن)" 
            className="flex-1 bg-transparent border-none px-3 py-2 outline-none text-slate-700 placeholder:text-slate-400"
            disabled={isTyping}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
          >
            <Send size={18} className="rotate-180" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
          المعلم الذكي يساعدك على الفهم، تذكر دائماً أنه لن يعطيك الإجابة مباشرة!
        </p>
      </div>
    </div>
  );
}
