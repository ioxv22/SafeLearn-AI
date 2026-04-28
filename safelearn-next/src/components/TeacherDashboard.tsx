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
    const q = query(collection(db, 'classrooms'), where('teacherId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
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
      <AnimatePresence mode="wait">
        {!selectedClass ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-br from-white to-indigo-50/30 p-8 rounded-3xl shadow-sm border border-indigo-100/50">
              <div className="mb-4 md:mb-0">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">إدارة الفصول الذكية</h2>
                <p className="text-slate-500 mt-2 font-medium">أنشئ غرف تعلم آمنة وراقب تطور طلابك لحظة بلحظة.</p>
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <input 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="اسم الفصل الجديد..." 
                  className="flex-1 md:w-64 px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
                <button 
                  onClick={handleCreateClass}
                  disabled={isCreating || !newClassName.trim()}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  <Plus size={20} />
                  <span>بدء فصل جديد</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((cls, i) => (
                <motion.div 
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white p-7 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <Brain size={24} />
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-2">
                      <Key size={14} />
                      كود: {cls.code}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{cls.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                    <Users size={16} />
                    <span>{cls.studentCount || 0} طلاب منضمين حالياً</span>
                  </div>

                  <button 
                    onClick={() => setSelectedClass(cls)}
                    className="w-full py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>مراقبة الأداء</span>
                    <ArrowRight size={18} className="rotate-180" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setSelectedClass(null)}
                className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
              >
                <ArrowRight size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedClass.name}</h2>
                <p className="text-slate-500 font-medium">مراقبة حية لأداء الطلاب وتفاعلهم مع الذكاء الاصطناعي</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mockStudents.map((student, i) => (
                <motion.div 
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{student.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          student.status === 'تنبيه غش' ? 'bg-red-50 text-red-500' : 
                          student.status === 'متفوق' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                        }`}>
                          {student.status}
                        </span>
                      </div>
                    </div>
                    {student.status === 'تنبيه غش' && <ShieldAlert className="text-red-500 animate-pulse" size={20} />}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-400">معدل الفهم المستقل</span>
                        <span className="text-indigo-600">{student.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${student.progress}%` }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-400">الاعتماد على التلميحات</span>
                        <span className={student.reliance > 60 ? 'text-orange-500' : 'text-slate-600'}>{student.reliance}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${student.reliance}%` }}
                          className={`h-full rounded-full ${student.reliance > 60 ? 'bg-orange-500' : 'bg-slate-300'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                    <TrendingUp size={16} />
                    عرض سجل المحادثة
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
