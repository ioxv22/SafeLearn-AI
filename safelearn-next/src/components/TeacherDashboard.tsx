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
    <div className="space-y-8" dir="rtl" suppressHydrationWarning>
      <AnimatePresence mode="wait">
        {!selectedClass ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-white text-center md:text-right">
                  <h2 className="text-4xl font-extrabold tracking-tight mb-3">لوحة القائد التعليمي</h2>
                  <p className="text-indigo-100 text-lg font-medium opacity-90 max-w-md">
                    مرحباً بك مجدداً. راقب طلابك، حلل بياناتهم، وكن موجهاً ذكياً لمسيرتهم التعليمية.
                  </p>
                </div>
                <div className="flex bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                  <input 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="اسم الفصل الجديد..." 
                    className="bg-transparent border-none text-white placeholder:text-indigo-200 px-6 py-3 outline-none w-64 font-bold"
                  />
                  <button 
                    onClick={handleCreateClass}
                    disabled={isCreating || !newClassName.trim()}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 active:scale-95 transition-all shadow-xl"
                  >
                    بدء فصل
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'إجمالي الفصول', val: classrooms.length, icon: School, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'الطلاب النشطين', val: 42, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'معدل الذكاء', val: '84%', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'تنبيهات التدخل', val: 3, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-bold">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-800">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Class Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classrooms.map((cls, i) => (
                <motion.div 
                  key={cls.id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <BarChart3 size={28} />
                    </div>
                    <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black tracking-widest text-slate-500 border border-slate-100">
                      CODE: {cls.code}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{cls.name}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8">تم الإنشاء في {new Date(cls.createdAt).toLocaleDateString('ar-AE')}</p>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      {[1,2,3].map(j => (
                        <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-500">+{cls.studentCount || 0} طالباً</span>
                  </div>

                  <button 
                    onClick={() => setSelectedClass(cls)}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>مراقبة الأداء</span>
                    <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedClass(null)}
                  className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                >
                  <ArrowRight size={28} />
                </button>
                <div>
                  <h2 className="text-3xl font-black text-slate-800">{selectedClass.name}</h2>
                  <p className="text-slate-500 font-bold flex items-center gap-2">
                    <Activity size={16} className="text-emerald-500" />
                    تحليل ذكي للأداء التعليمي
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    placeholder="ابحث عن طالب..."
                    className="w-full md:w-64 pr-12 pl-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Analytics Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-800">إحصائيات تفاعل الطلاب</h3>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      عدد الجلسات
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData}>
                      <defs>
                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                      />
                      <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSessions)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Class Summary Card */}
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-6">ملخص الفصل</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="opacity-70 font-bold">متوسط الفهم</span>
                      <span className="text-2xl font-black">72%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-70 font-bold">الطلاب المتميزين</span>
                      <span className="text-2xl font-black">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-70 font-bold">إجمالي التلميحات</span>
                      <span className="text-2xl font-black">248</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold opacity-80 leading-relaxed text-center">
                    تم تحليل البيانات بواسطة SafeLearn AI لتقديم أفضل التوصيات التعليمية.
                  </p>
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">قائمة الطلاب</h3>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Filter size={20} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-xs font-black tracking-widest uppercase">
                      <th className="px-8 py-4">الطالب</th>
                      <th className="px-8 py-4">التقدم</th>
                      <th className="px-8 py-4">الاعتماد على AI</th>
                      <th className="px-8 py-4">المحاولات</th>
                      <th className="px-8 py-4">الحالة</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mockStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{student.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">نشط {student.lastActive}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="w-32">
                            <div className="flex justify-between text-[10px] font-bold mb-1.5">
                              <span className="text-indigo-600">{student.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${student.progress}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-xs font-black px-3 py-1 rounded-lg ${
                            student.reliance > 70 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {student.reliance}%
                          </span>
                        </td>
                        <td className="px-8 py-6 font-bold text-slate-600">{student.attempts}</td>
                        <td className="px-8 py-6">
                          {student.status === 'تنبيه' ? (
                            <span className="flex items-center gap-2 text-red-500 text-xs font-black">
                              <ShieldAlert size={14} /> تنبيه تدخل
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-emerald-500 text-xs font-black">
                              <CheckCircle2 size={14} /> مستقر
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-left">
                          <button className="p-2 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                            <MoreHorizontal size={20} />
                          </button>
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
