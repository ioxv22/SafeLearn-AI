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
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">إدارة الفصول</h2>
                <p className="text-slate-500 text-sm">أنشئ غرف دردشة مخصصة لطلابك لمراقبة أدائهم.</p>
              </div>
              <div className="flex gap-2">
                <input 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="اسم الفصل الجديد..." 
                  className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={handleCreateClass}
                  disabled={isCreating || !newClassName.trim()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  إنشاء فصل
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((cls, i) => (
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
                  <button 
                    onClick={() => setSelectedClass(cls)}
                    className="w-full mt-2 py-2 border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    مراقبة الفصل
                  </button>
                </div>
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
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={() => setSelectedClass(null)}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100"
              >
                <ArrowRight size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedClass.name}</h2>
                <p className="text-slate-500 text-sm">تحليل أداء الطلاب وتفاعلهم مع الذكاء الاصطناعي</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">نشاط الطلاب الأخير</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="sessions" stroke="#6366f1" fill="#e0e7ff" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-4">ملخص الفصل</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">متوسط التقدم</span>
                      <span className="text-xl font-bold">72%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">إجمالي التلميحات</span>
                      <span className="text-xl font-bold">248</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-slate-800">قائمة الطلاب</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                      <th className="px-6 py-3">الطالب</th>
                      <th className="px-6 py-3">التقدم</th>
                      <th className="px-6 py-3">الاعتماد على AI</th>
                      <th className="px-6 py-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mockStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{student.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-slate-100 h-1.5 rounded-full">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${student.progress}%` }}></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${student.reliance > 70 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
                            {student.reliance}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${student.status === 'تنبيه' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {student.status}
                          </span>
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
