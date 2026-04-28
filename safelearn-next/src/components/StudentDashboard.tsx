'use client';

import { useStore } from '../store';
import { 
  Trophy, Star, Target, Zap, Clock, 
  CheckCircle2, AlertCircle, TrendingUp, Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const progressData = [
  { name: 'السبت', solved: 2 },
  { name: 'الأحد', solved: 5 },
  { name: 'الاثنين', solved: 3 },
  { name: 'الثلاثاء', solved: 8 },
  { name: 'الأربعاء', solved: 6 },
  { name: 'الخميس', solved: 10 },
  { name: 'الجمعة', solved: 4 },
];

export function StudentDashboard() {
  const { progress } = useStore();

  return (
    <div className="space-y-6" dir="rtl" suppressHydrationWarning>
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">مرحباً بك في رحلة التميز! ✨</h2>
          <p className="text-slate-500">أنت الآن في المستوى <span className="text-indigo-600 font-bold">المتوسط</span>. استمر في الحل لتحصل على شارة "المحترف".</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-indigo-600">{progress.solved}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">مسألة محلولة</p>
          </div>
          <div className="w-[1px] h-10 bg-slate-100"></div>
          <div className="text-center">
            <p className="text-2xl font-black text-emerald-500">92%</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">دقة الإجابة</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-500" />
            تحليل تقدمك الأسبوعي
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="solved" stroke="#6366f1" fill="#e0e7ff" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats & Streak */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-2xl text-white shadow-lg shadow-orange-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold opacity-80">سلسلة الانتصارات</p>
              <p className="text-3xl font-black">{progress.streak} أيام</p>
            </div>
            <Zap size={48} className="opacity-40" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">أهدافك الحالية</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-sm font-bold text-slate-700">حل 10 مسائل رياضية</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-sm font-bold text-slate-700">استخدام تلميح واحد فقط</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-200"></div>
                <span className="text-sm font-bold text-slate-400">إكمال اختبار العلوم</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">إنجازاتك (الأوسمة)</h3>
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'المفكر الصغير', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'نجم الأسبوع', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { label: 'القناص', icon: Target, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'المثابر', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group">
              <div className={`w-16 h-16 ${badge.bg} ${badge.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <badge.icon size={32} />
              </div>
              <span className="text-xs font-bold text-slate-600">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
