import React from 'react';
import { Users, AlertTriangle, TrendingUp, CheckCircle, BrainCircuit, ShieldCheck, FileKey } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export const Dashboard = () => {
  const { currentUser } = useStore();

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Welcome Banner for Judges */}
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

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "إجمالي الطلاب", val: "1,240", icon: <Users size={20}/>, color: "text-blue-500", bg: "bg-blue-500/10" },
            { title: "محاولات الغش المحظورة", val: "342", icon: <AlertTriangle size={20}/>, color: "text-red-500", bg: "bg-red-500/10" },
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

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-sidebar border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertTriangle className="text-orange-500"/> تقرير الطلاب الأكثر اعتماداً على التلميحات</h3>
            <div className="space-y-4">
              {[
                { name: "خالد سعيد", grade: "الصف العاشر", hints: 45, status: "تحذير" },
                { name: "نورة محمد", grade: "الصف التاسع", hints: 38, status: "متابعة" },
                { name: "سالم عبدلله", grade: "الصف الحادي عشر", hints: 31, status: "متابعة" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl">
                  <div>
                    <p className="font-bold text-sm">{s.name}</p>
                    <p className="text-xs text-foreground/50">{s.grade}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="block text-lg font-bold text-orange-500">{s.hints}</span>
                      <span className="text-[10px] text-foreground/50 uppercase">تلميح</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sidebar border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-primary"/> المواضيع الأكثر صعوبة</h3>
            <div className="space-y-4">
              {[
                { topic: "المعادلات التربيعية (رياضيات)", failRate: "42%" },
                { topic: "قوانين نيوتن (فيزياء)", failRate: "38%" },
                { topic: "تفاعلات الأكسدة (كيمياء)", failRate: "25%" },
                { topic: "قواعد النحو - المبتدأ والخبر", failRate: "18%" },
              ].map((t, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{t.topic}</span>
                    <span className="text-red-500 font-bold">{t.failRate}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: t.failRate}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
