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
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" dir="rtl">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{activeClass.name}</h3>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              الوضع الآمن مفعل (تلميحات فقط)
            </p>
          </div>
        </div>
        <button onClick={() => setActiveClass(null)} className="text-sm text-slate-500 hover:text-slate-800 font-bold">
          مغادرة
        </button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl shadow-sm ${
              msg.role === 'user' ? 'bg-white border border-slate-100 text-slate-800' : 'bg-indigo-600 text-white'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl text-xs font-bold animate-pulse">
              جاري التفكير...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اسأل سؤالك هنا..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500 transition-colors"
            disabled={isTyping}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
