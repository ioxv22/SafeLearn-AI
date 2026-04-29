'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useStore } from '../store';
import { 
  Users, Plus, Key, ArrowRight, TrendingUp, Brain, 
  ShieldAlert, CheckCircle2, Search, Filter, 
  BarChart3, Activity, PieChart, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const mockData = [
  { name: 'الأحد', sessions: 12, hints: 45 },
  { name: 'الاثنين', sessions: 18, hints: 52 },
  { name: 'الثلاثاء', sessions: 15, hints: 48 },
  { name: 'الأربعاء', sessions: 25, hints: 70 },
  { name: 'الخميس', sessions: 22, hints: 65 },
];

export function TeacherDashboard() {
  const { currentUser } = useStore();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [mockStudents] = useState([
    { id: 1, name: 'أحمد محمود', progress: 85, reliance: 20, attempts: 12, lastActive: 'منذ دقيقتين', status: 'متفوق' },
    { id: 2, name: 'سارة خالد', progress: 45, reliance: 88, attempts: 24, lastActive: 'الآن', status: 'تنبيه' },
    { id: 3, name: 'عمر علي', progress: 62, reliance: 40, attempts: 15, lastActive: 'منذ ساعة', status: 'مستقر' },
    { id: 4, name: 'ليلى حسن', progress: 78, reliance: 35, attempts: 18, lastActive: 'منذ ٣ ساعات', status: 'متفوق' },
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
    const code = Math.floor(100000 + Math.random() * 900000).toString();
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
    <div className="space-y-6" dir="rtl" suppressHydrationWarning>
      <AnimatePresence mode="wait">
        {!selectedClass ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            {/* Dark Header */}
            <div className="relative overflow-hidden bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <h2 className="text-4xl font-black text-white mb-3">إدارة الفصول الذكية 🏫</h2>
                  <p className="text-slate-400 font-medium text-lg">راقب أداء طلابك وتفاعلهم مع <span className="text-indigo-400 font-black">الذكاء الاصطناعي</span> في الوقت الفعلي.</p>
                </div>
                <div className="flex gap-4 bg-slate-950/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
                  <input 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="اسم الفصل الجديد..." 
                    className="bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-xl outline-none focus:border-indigo-500 transition-all w-64 font-bold"
                  />
                  <button 
                    onClick={handleCreateClass}
                    disabled={isCreating || !newClassName.trim()}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20"
                  >
                    إنشاء فصل
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {classrooms.map((cls, i) => (
                <div key={cls.id} className="relative group overflow-hidden bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-800/50 shadow-2xl hover:border-indigo-500/50 transition-all duration-500 flex flex-col min-h-[280px]">
                  {/* Decorative Gradient Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                         {i % 2 === 0 ? <Brain size={28} /> : <Activity size={28} />}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          i % 2 === 0 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {i % 2 === 0 ? 'قيد المراجعة' : 'نشط الآن'}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                          <Key size={12} />
                          {cls.code}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors">{cls.name}</h3>
                    <p className="text-slate-400 font-bold text-sm mb-10">
                      {cls.studentCount || 0} طالب | متوسط النزاهة: <span className={i % 2 === 0 ? 'text-purple-400' : 'text-emerald-400'}>%{88 + (i * 6)}</span>
                    </p>

                    <div className="flex gap-4 mt-auto">
                      <button 
                        onClick={() => setSelectedClass(cls)}
                        className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        عرض الطلاب
                      </button>
                      <button 
                        onClick={() => alert(`إعدادات فصل: ${cls.name}`)}
                        className="bg-slate-800/50 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all border border-slate-700 active:scale-95"
                      >
                        الإعدادات
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {classrooms.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800">
                  <School size={48} className="mx-auto text-slate-700 mb-4" />
                  <h3 className="text-xl font-bold text-slate-500">لا توجد فصول دراسية بعد</h3>
                  <p className="text-slate-600">ابدأ بإنشاء فصلك الأول من الأعلى.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-6 mb-8">
              <button 
                onClick={() => setSelectedClass(null)}
                className="p-4 bg-slate-900 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-400 transition-all border border-slate-800 shadow-xl"
              >
                <ArrowRight size={24} />
              </button>
              <div>
                <h2 className="text-3xl font-black text-white">{selectedClass.name}</h2>
                <p className="text-slate-500 font-bold">تحليل أداء الطلاب وتفاعلهم مع الذكاء الاصطناعي</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                   <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                      <Activity size={20} />
                   </div>
                   نشاط الطلاب الأخير
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData}>
                       <defs>
                          <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                      <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={4} fill="url(#colorSessions)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-6">ملخص الفصل</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold opacity-80">متوسط التقدم</span>
                      <span className="text-4xl font-black">72%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-white h-full rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold opacity-80">إجمالي التلميحات</span>
                      <span className="text-4xl font-black">248</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-black text-white">قائمة الطلاب المتقدمين</h3>
                <div className="flex gap-2">
                  <div className="bg-slate-800 p-2 rounded-lg text-slate-400"><Search size={18} /></div>
                  <div className="bg-slate-800 p-2 rounded-lg text-slate-400"><Filter size={18} /></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800/50">
                      <th className="px-8 py-5">الطالب</th>
                      <th className="px-8 py-5">مستوى التقدم</th>
                      <th className="px-8 py-5">الاعتماد على AI</th>
                      <th className="px-8 py-5">الحالة الراهنة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {mockStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 font-black">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-white group-hover:text-indigo-400 transition-colors">{student.name}</p>
                              <p className="text-[10px] text-slate-500 font-bold">{student.lastActive}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${student.progress}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-slate-300">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${student.reliance > 70 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                            {student.reliance}% اعتماد
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${student.status === 'تنبيه' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                            <span className={`text-xs font-black ${student.status === 'تنبيه' ? 'text-red-400' : 'text-emerald-400'}`}>
                              {student.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
