import React from 'react';
import { Users, AlertTriangle, TrendingUp, CheckCircle, BrainCircuit, ShieldCheck, FileKey, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export const Dashboard = () => {
  const { cheatAttempts } = useStore();

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-l from-indigo-600 to-primary text-white p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <ShieldCheck size={32} className="text-emerald-300" />
                أهلاً بكم لجنة التحكيم الكريمة
              </h1>
              <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
                هذه لوحة التحكم الخاصة بنظام SafeLearn AI. كمسؤول، يمكنك مراقبة أداء الطلاب، اكتشاف محاولات الغش، ورؤية الإحصائيات الحية للنظام.
              </p>
            </div>
            <div className="hidden md:flex bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 items-center gap-3">
              <FileKey size={24} className="text-emerald-300" />
              <div>
                <p className="text-xs text-white/70">صلاحية الدخول</p>
                <p className="font-bold">حساب المشرف (Admin)</p>
              </div>
            </div>
          </div>
        </motion.div>

        {cheatAttempts >= 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-4 bg-red-500 rounded-full text-white animate-pulse">
              <ShieldAlert size={30} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-500">تنبيه أمني مباشر (Live Alert)</h2>
              <p className="text-foreground/80">الطالب (الطالب التجريبي) يحاول حالياً اختراق نظام الحماية للحصول على إجابات مباشرة.</p>
              <p className="font-bold text-sm mt-1 text-red-400">عدد المحاولات المسجلة: {cheatAttempts} محاولات في هذه الجلسة.</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "إجمالي الطلاب", val: "1,240", icon: <Users size={20}/>, color: "text-blue-500", bg: "bg-blue-500/10" },
            { title: "محاولات الغش المحظورة", val: (342 + cheatAttempts).toString(), icon: <AlertTriangle size={20}/>, color: "text-red-500", bg: "bg-red-500/10" },
            { title: "معدل الفهم المستقل", val: "78%", icon: <BrainCircuit size={20}/>, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { title: "الواجبات المكتملة", val: "8,921", icon: <CheckCircle size={20}/>, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}} className="bg-sidebar border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-foreground/70 font-medium text-sm">{stat.title}</h3>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>{stat.icon}</div>
              </div>
              <p className="text-3xl font-bold">{stat.val}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          
          {/* Main Chart: AI Safety Effectiveness */}
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.4}} className="lg:col-span-2 bg-sidebar border border-border p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2"><TrendingUp size={22} className="text-primary"/> أداء نظام الحماية (آخر 7 أيام)</h3>
                <p className="text-sm text-foreground/50 mt-1">مقارنة بين الاستفسارات التعليمية السليمة ومحاولات الغش</p>
              </div>
              <select className="bg-background border border-border text-sm font-medium rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-border/30 transition-colors">
                <option>هذا الأسبوع</option>
                <option>هذا الشهر</option>
              </select>
            </div>
            
            <div className="h-72 flex items-end justify-between gap-4 px-2">
              {[
                { day: 'السبت', safe: 40, blocked: 10 },
                { day: 'الأحد', safe: 60, blocked: 15 },
                { day: 'الاثنين', safe: 55, blocked: 25 },
                { day: 'الثلاثاء', safe: 80, blocked: 12 },
                { day: 'الأربعاء', safe: 95, blocked: 8 },
                { day: 'الخميس', safe: 110, blocked: 20 },
                { day: 'اليوم', safe: 45, blocked: 34 + cheatAttempts },
              ].map((data, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-3 group h-full">
                  <div className="w-full h-full flex flex-col justify-end gap-1.5 relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-14 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-2 px-3 rounded-lg shadow-xl whitespace-nowrap transition-all duration-300 z-10 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                      <div className="font-bold mb-1 border-b border-background/20 pb-1 text-center">{data.day}</div>
                      سليم: <span className="text-emerald-400 font-bold">{data.safe}</span> | حظر: <span className="text-red-400 font-bold">{data.blocked}</span>
                    </div>
                    {/* Blocked bar */}
                    <div className="w-full bg-red-500/80 rounded-t-md transition-all duration-500 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] cursor-pointer" style={{ height: `${(data.blocked / 150) * 100}%` }}></div>
                    {/* Safe bar */}
                    <div className="w-full bg-primary/80 rounded-t-md transition-all duration-500 hover:bg-primary hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer" style={{ height: `${(data.safe / 150) * 100}%` }}></div>
                  </div>
                  <span className="text-sm text-foreground/60 font-semibold">{data.day}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-medium"><span className="w-4 h-4 rounded-full bg-primary shadow-sm shadow-primary/40"></span> استفسارات سليمة ومفيدة</div>
              <div className="flex items-center gap-2 text-sm font-medium"><span className="w-4 h-4 rounded-full bg-red-500 shadow-sm shadow-red-500/40"></span> محاولات غش (تم حظرها)</div>
            </div>
          </motion.div>

          {/* Live Activity Log */}
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.5}} className="bg-sidebar border border-border p-6 rounded-3xl shadow-sm flex flex-col">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Activity size={22} className="text-orange-500"/> سجل النشاط المباشر</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {[
                { time: 'الآن', user: 'أحمد محمود', action: 'طلب شرح تفصيلي عن "قانون نيوتن الثالث" بالذكاء الاصطناعي', type: 'safe' },
                { time: 'قبل 2 دقيقة', user: 'سارة خالد', action: 'محاولة نسخ كود بايثون وحل الواجب مباشرة', type: 'danger' },
                { time: 'قبل 15 دقيقة', user: 'عمر علي', action: 'أكمل اختبار الرياضيات المصغر بنسبة 95%', type: 'success' },
                { time: 'قبل 22 دقيقة', user: 'فاطمة محمد', action: 'طلبت الحل المباشر لمعادلة تفاضلية (تم التوجيه للحل الذاتي)', type: 'warning' },
                { time: 'قبل 1 ساعة', user: 'يوسف أحمد', action: 'توليد فيديو تعليمي تفاعلي عن انقسام الخلية', type: 'info' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 relative group">
                  {i !== 4 && <div className="absolute top-6 bottom-[-24px] right-2.5 w-[2px] bg-border group-hover:bg-foreground/20 transition-colors"></div>}
                  <div className={`w-5 h-5 mt-1 rounded-full flex-shrink-0 z-10 border-[3px] border-sidebar shadow-sm ${log.type === 'safe' ? 'bg-blue-500' : log.type === 'danger' ? 'bg-red-500' : log.type === 'success' ? 'bg-emerald-500' : log.type === 'info' ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{log.user}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-border text-foreground/60">{log.time}</span>
                    </div>
                    <p className="text-sm text-foreground/80 mt-1.5 leading-snug">{log.action}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-border rounded-xl text-sm font-bold text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-all duration-300">
              عرض السجل الكامل
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
