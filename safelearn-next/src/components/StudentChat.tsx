'use client';

import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { useStore } from '../store';
import { KeyRound, ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function StudentChat() {
  const { currentUser } = useStore();
  const [classCode, setClassCode] = useState('');
  const [activeClass, setActiveClass] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!classCode.trim()) return;
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
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="مثال: 123456"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest font-bold border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors"
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button 
              onClick={handleJoin}
              disabled={isJoining || classCode.length < 6}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              دخول الفصل <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden" dir="rtl">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{activeClass.name}</h3>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              الوضع الآمن مفعل (تلميحات فقط)
            </p>
          </div>
        </div>
        <button onClick={() => setActiveClass(null)} className="text-sm text-slate-500 hover:text-slate-800 font-bold">
          مغادرة
        </button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center text-slate-400">
        <p className="font-bold mb-2">أهلاً بك في {activeClass.name} 👋</p>
        <p className="text-sm text-center max-w-sm">
          أنا المساعد الذكي، يمكنني مساعدتك في فهم أي درس أو حل أي مسألة عن طريق تقديم إرشادات وتلميحات خطوة بخطوة.
        </p>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="اسأل سؤالك هنا... (مثال: كيف أحل معادلة من الدرجة الثانية؟)" 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500 transition-colors"
          />
          <button className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
