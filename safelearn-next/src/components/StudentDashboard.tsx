'use client';

import { useStore } from '../store';
import { 
  Trophy, Star, Target, Zap, Clock, 
  CheckCircle2, AlertCircle, TrendingUp, Brain,
  ChevronRight, Sparkles, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const progressData = [
  { name: 'السبت', score: 65 },
  { name: 'الأحد', score: 78 },
  { name: 'الاثنين', score: 72 },
  { name: 'الثلاثاء', score: 85 },
  { name: 'الأربعاء', score: 82 },
  { name: 'الخميس', score: 95 },
  { name: 'الجمعة', score: 88 },
];

export function StudentDashboard() {
  const { progress, currentUser } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl" suppressHydrationWarning>
      {/* Welcome Hero */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-full border border-indigo-500/20">STUDENT PROFILE</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
            <h2 className="text-4xl font-black text-white mb-3">مرحباً، {currentUser?.displayName || 'طالبنا المتميز'} ✨</h2>
            <p className="text-slate-400 font-medium text-lg">أنت الآن في صدارة <span className="text-indigo-400 font-black">أفضل 5%</span> من طلاب دفعتك. استمر في التميز!</p>
          </div>
          <div className="flex gap-8 bg-slate-950/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md">
            <div className="text-center">
              <p className="text-4xl font-black text-white mb-1">{progress.solved}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">إنجاز كلي</p>
            </div>
            <div className="w-[1px] h-12 bg-slate-800 self-center"></div>
            <div className="text-center">
              <p className="text-4xl font-black text-emerald-400 mb-1">98%</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">معدل الذكاء</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                <TrendingUp size={20} />
              </div>
              مؤشر الذكاء الدراسي
            </h3>
            <select className="bg-slate-800 border-none text-xs font-bold text-slate-300 rounded-xl px-4 py-2 outline-none">
              <option>آخر 7 أيام</option>
              <option>آخر شهر</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats & Streak */}
        <div className="space-y-8">
          <div className="relative group overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-orange-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">STREAK SCORE</p>
                <div className="flex items-end gap-2">
                  <p className="text-5xl font-black">{progress.streak}</p>
                  <p className="text-lg font-bold mb-1">أيام متتالية</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase">احمِ شعلتك!</span>
                <Zap size={32} className="text-white/40" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">المهمات اليومية</h3>
            <div className="space-y-5">
              {[
                { label: 'حل 5 تمارين رياضيات مهارية', done: true },
                { label: 'ساعة كاملة بدون استخدام تلميح', done: true },
                { label: 'مشاهدة فيديو شرح الوزارة الجديد', done: false },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${task.done ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600 border border-slate-700'}`}>
                    {task.done ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>}
                  </div>
                  <span className={`text-xs font-bold transition-all ${task.done ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3 relative z-10">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Trophy size={24} />
          </div>
          خزانة الأوسمة الملكية
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 relative z-10">
          {[
            { label: 'المفكر الصغير', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'نجم الأسبوع', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { label: 'القناص', icon: Target, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'المثابر', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'العبقري', icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'المستكشف', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          ].map((badge, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, scale: 1.05 }}
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className={`w-20 h-20 ${badge.bg} ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl transition-all border border-white/5`}>
                <badge.icon size={36} />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
