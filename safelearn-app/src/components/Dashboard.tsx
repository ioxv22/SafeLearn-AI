import React, { useState } from 'react';
import { 
  Users, AlertTriangle, TrendingUp, CheckCircle, 
  BrainCircuit, ShieldCheck, FileKey, ShieldAlert, 
  Activity, Plus, GraduationCap, Search, Filter,
  MoreVertical, Eye, MessageSquare, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

export const Dashboard = () => {
  const { cheatAttempts } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'students'>('overview');
  const [classes, setClasses] = useState([
    { id: '1', name: 'الرياضيات - الصف 12', students: 24, status: 'نشط', progress: 85 },
    { id: '2', name: 'الفيزياء - المتقدم', students: 18, status: 'نشط', progress: 72 },
    { id: '3', name: 'اللغة العربية', students: 31, status: 'مكتمل', progress: 100 },
  ]);

  const handleCreateClass = () => {
    const name = prompt('أدخل اسم الفصل الدراسي الجديد:');
    if (name) {
      setClasses([...classes, { id: Date.now().toString(), name, students: 0, status: 'نشط', progress: 0 }]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8 custom-scrollbar" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header Hero */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-l from-indigo-600 via-indigo-700 to-primary text-white p-10 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">System Administrator</span>
                <span className="flex items-center gap-2 text-emerald-400 text-[10px] font-black"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> نظام المراقبة نشط</span>
              </div>
              <h1 className="text-4xl font-black mb-4 flex items-center gap-4">
                <ShieldCheck size={40} className="text-emerald-300 drop-shadow-lg" />
                لوحة تحكم لجنة التحكيم الموقرة
              </h1>
              <p className="text-white/80 text-lg max-w-3xl leading-relaxed font-medium">
                مرحباً بكم في <span className="text-white font-black">SafeLearn AI</span>. نضع بين أيديكم أقوى أدوات الرقابة التعليمية المدعومة بالذكاء الاصطناعي لضمان بيئة تعلم عادلة وأخلاقية بنسبة 100%.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 flex flex-col items-center text-center shadow-2xl">
              <Activity size={32} className="text-indigo-300 mb-2 animate-pulse" />
              <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em] mb-1">دقة الحماية</p>
              <p className="text-3xl font-black text-emerald-300">99.9%</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-sidebar/50 backdrop-blur-md border border-border rounded-2xl w-fit">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: <TrendingUp size={16}/> },
            { id: 'classes', label: 'إدارة الفصول', icon: <GraduationCap size={16}/> },
            { id: 'students', label: 'مراقبة الطلاب', icon: <Users size={16}/> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/50 hover:bg-border/50'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {cheatAttempts >= 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border-2 border-red-500/30 p-8 rounded-[2rem] flex items-center gap-6 shadow-2xl shadow-red-500/10 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
                  <div className="p-5 bg-red-500 rounded-3xl text-white shadow-xl shadow-red-500/40 animate-bounce">
                    <ShieldAlert size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-red-500 flex items-center gap-2">
                      خرق أمني مكتشف حالياً
                      <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
                    </h2>
                    <p className="text-foreground/90 text-lg mt-1 font-bold">تم رصد (الطالب التجريبي) يحاول استخراج إجابات نموذجية بشكل مباشر.</p>
                    <p className="font-black text-sm mt-2 px-4 py-1.5 bg-red-500/20 rounded-full w-fit">المحاولات المحظورة: {cheatAttempts} / 3</p>
                  </div>
                  <button className="mr-auto px-6 py-3 bg-red-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all active:scale-95">تجميد الجلسة</button>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: "إجمالي الطلاب", val: "1,240", icon: <Users size={22}/>, color: "text-blue-500", bg: "bg-blue-500/10", desc: "+12 اليوم" },
                  { title: "محاولات الغش", val: (342 + cheatAttempts).toString(), icon: <AlertTriangle size={22}/>, color: "text-red-500", bg: "bg-red-500/10", desc: "تم الحظر بنجاح" },
                  { title: "معدل الفهم", val: "78%", icon: <BrainCircuit size={22}/>, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "تحسن بنسبة 5%" },
                  { title: "الواجبات", val: "8,921", icon: <CheckCircle size={22}/>, color: "text-indigo-500", bg: "bg-indigo-500/10", desc: "مكتملة بالكامل" },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}} className="bg-sidebar border border-border p-8 rounded-[2rem] flex flex-col justify-between shadow-xl hover:border-primary/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                      <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">{stat.desc}</span>
                    </div>
                    <div>
                      <h3 className="text-foreground/50 font-black text-xs uppercase tracking-widest mb-1">{stat.title}</h3>
                      <p className="text-4xl font-black">{stat.val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 bg-sidebar border border-border p-10 rounded-[2.5rem] shadow-xl">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="font-black text-2xl flex items-center gap-3"><TrendingUp size={24} className="text-primary"/> كفاءة الحماية التعليمية</h3>
                      <p className="text-sm text-foreground/50 mt-1">مؤشرات الحظر والتحفيز الذاتي للطلاب</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold hover:bg-border/50 transition-all">الأسبوعي</button>
                      <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 transition-all">الشهري</button>
                    </div>
                  </div>
                  
                  <div className="h-80 flex items-end justify-between gap-6 px-4">
                    {[35, 65, 45, 85, 55, 95, 75].map((val, i) => (
                      <div key={i} className="relative flex-1 flex flex-col items-center group h-full">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl h-full flex flex-col justify-end overflow-hidden relative">
                           <motion.div 
                              initial={{ height: 0 }} 
                              animate={{ height: `${val}%` }} 
                              transition={{ duration: 1, delay: i*0.1 }}
                              className="w-full bg-gradient-to-t from-primary to-indigo-400 rounded-t-xl group-hover:brightness-110 transition-all cursor-pointer relative"
                           >
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                               {val}%
                             </div>
                           </motion.div>
                        </div>
                        <span className="text-[10px] font-black text-foreground/40 mt-4 uppercase tracking-widest">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-sidebar border border-border p-10 rounded-[2.5rem] shadow-xl flex flex-col">
                  <h3 className="font-black text-2xl mb-8 flex items-center gap-3"><Activity size={24} className="text-orange-500"/> النشاط الحي</h3>
                  <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                    {[
                      { user: 'سلطان القاسمي', action: 'محاولة طلب حل مباشر لمسألة تفاضل', type: 'danger' },
                      { user: 'مريم خلفان', action: 'أكملت جلسة تعلم "الخلية" بنجاح مبهر', type: 'success' },
                      { user: 'زايد بن حمد', action: 'يستخدم الذكاء الاصطناعي لفهم الجاذبية', type: 'info' },
                      { user: 'هند محمد', action: 'تحذير: طلب تلميحات متكررة للوصول للحل', type: 'warning' },
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className={`w-3 h-10 rounded-full flex-shrink-0 transition-all ${log.type === 'danger' ? 'bg-red-500' : log.type === 'success' ? 'bg-emerald-500' : log.type === 'info' ? 'bg-indigo-500' : 'bg-orange-500'} group-hover:scale-x-150`}></div>
                        <div>
                          <p className="text-xs font-black text-foreground/40 mb-1">منذ لحظات</p>
                          <p className="font-black text-sm">{log.user}</p>
                          <p className="text-xs text-foreground/70 mt-1 leading-relaxed">{log.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'classes' && (
            <motion.div 
              key="classes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-sidebar border border-border p-8 rounded-[2rem] shadow-lg">
                <div>
                  <h3 className="text-2xl font-black text-white">إدارة الفصول الدراسية</h3>
                  <p className="text-sm text-slate-500 mt-1">أنشئ فصولك ووزع الطلاب وراقب تقدمهم الأكاديمي</p>
                </div>
                <button 
                  onClick={handleCreateClass}
                  className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 transition-all active:scale-95"
                >
                  <Plus size={20} />
                  إنشاء فصل جديد
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <motion.div 
                    key={cls.id} 
                    whileHover={{ y: -8 }}
                    className="bg-sidebar border border-border p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500/20">
                      <motion.div initial={{width: 0}} animate={{width: `${cls.progress}%`}} className="h-full bg-indigo-500"></motion.div>
                    </div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                        <GraduationCap size={28} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${cls.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {cls.status}
                      </span>
                    </div>
                    <h4 className="text-xl font-black mb-2">{cls.name}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mb-6">
                      <Users size={16} />
                      {cls.students} طالب مسجل
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">متوسط الإنجاز</p>
                        <p className="text-xl font-black text-indigo-400">{cls.progress}%</p>
                      </div>
                      <button className="p-3 bg-background border border-border rounded-xl text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm">
                        <Eye size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div 
              key="students"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-sidebar border border-border rounded-[2.5rem] shadow-xl overflow-hidden"
            >
              <div className="p-10 border-b border-border bg-sidebar/50 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black text-white">قائمة الطلاب الحية</h3>
                  <p className="text-sm text-slate-500 mt-1">متابعة تفصيلية لسلوك الطلاب وتفاعلهم مع المعلم الذكي</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-72">
                     <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                     <input type="text" placeholder="بحث عن طالب..." className="w-full pr-12 pl-4 py-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-all" />
                   </div>
                   <button className="p-3 bg-background border border-border rounded-xl text-slate-500 hover:text-primary transition-all"><Filter size={20}/></button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-background/50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-border">
                      <th className="px-10 py-6">اسم الطالب</th>
                      <th className="px-10 py-6">الحالة</th>
                      <th className="px-10 py-6">المستوى الدراسي</th>
                      <th className="px-10 py-6">محاولات الغش</th>
                      <th className="px-10 py-6">آخر نشاط</th>
                      <th className="px-10 py-6">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[
                      { name: 'الطالب التجريبي', status: 'أونلاين', level: 'متوسط', cheats: cheatAttempts, last: 'منذ ثواني', color: 'bg-emerald-500' },
                      { name: 'ياسين محمد', status: 'أوفلاين', level: 'متقدم', cheats: 0, last: 'منذ 2 ساعة', color: 'bg-slate-500' },
                      { name: 'ليلى أحمد', status: 'أونلاين', level: 'ضعيف', cheats: 1, last: 'منذ 15 دقيقة', color: 'bg-emerald-500' },
                      { name: 'خالد سعيد', status: 'أونلاين', level: 'متوسط', cheats: 4, last: 'منذ 1 دقيقة', color: 'bg-emerald-500' },
                    ].map((st, i) => (
                      <tr key={i} className="hover:bg-background/30 transition-all group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${st.cheats > 2 ? 'bg-red-500 shadow-red-500/20' : 'bg-primary shadow-primary/20'}`}>
                              {st.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-sm">{st.name}</p>
                              <p className="text-[10px] text-slate-500">ID: 202600{i+1}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${st.color} animate-pulse`}></span>
                             <span className="text-xs font-bold">{st.status}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-xs font-black text-slate-400">{st.level}</span>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`text-sm font-black ${st.cheats > 2 ? 'text-red-500' : st.cheats > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>{st.cheats}</span>
                        </td>
                        <td className="px-10 py-6 text-xs text-slate-500 font-bold">{st.last}</td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 bg-background border border-border rounded-lg text-slate-500 hover:text-indigo-500 hover:border-indigo-500 transition-all shadow-sm" title="سجل المحادثة"><MessageSquare size={18}/></button>
                            <button className="p-2.5 bg-background border border-border rounded-lg text-slate-500 hover:text-orange-500 hover:border-orange-500 transition-all shadow-sm" title="سجل النتائج"><History size={18}/></button>
                            <button className="p-2.5 bg-background border border-border rounded-lg text-slate-500 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"><MoreVertical size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
