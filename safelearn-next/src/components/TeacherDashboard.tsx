'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useStore } from '../store';
import { Users, Plus, Key, ArrowRight, TrendingUp, Brain, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TeacherDashboard() {
  const { currentUser } = useStore();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClass, setSelectedClass] = useState<any>(null);

  // Mock students for demonstration
  const [mockStudents] = useState([
    { id: 1, name: 'أحمد محمود', progress: 85, reliance: 20, status: 'متفوق' },
    { id: 2, name: 'سارة خالد', progress: 45, reliance: 75, status: 'تنبيه غش' },
    { id: 3, name: 'عمر علي', progress: 60, reliance: 40, status: 'مستقر' },
  ]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'classrooms'), where('teacherId', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const classes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClassrooms(classes);
    });
    return () => unsub();
  }, [currentUser]);

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !currentUser) return;
    setIsCreating(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    await addDoc(collection(db, 'classrooms'), {
      name: newClassName,
      code: code,
      teacherId: currentUser.uid,
      createdAt: new Date().toISOString(),
      studentCount: 0
    });
    setNewClassName('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">الفصول الدراسية</h2>
          <p className="text-slate-500 text-sm">أنشئ غرف دردشة مخصصة لطلابك لمراقبة أدائهم.</p>
        </div>
        <div className="flex gap-2">
          <input 
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="اسم الفصل (مثال: فيزياء 101)" 
            className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
          />
          <button 
            onClick={handleCreateClass}
            disabled={isCreating || !newClassName.trim()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus size={18} />
            إنشاء فصل
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map(cls => (
          <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-slate-800">{cls.name}</h3>
              <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-2">
                <Key size={14} />
                كود: {cls.code}
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-auto">
              <Users size={16} />
              {cls.studentCount || 0} طلاب منضمين
            </div>
            <button className="w-full mt-2 py-2 border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
              مراقبة الفصل
            </button>
          </div>
        ))}
        {classrooms.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            لا توجد فصول دراسية بعد. قم بإنشاء فصل جديد ليحصل الطلاب على كود الدخول!
          </div>
        )}
      </div>
    </div>
  );
}
