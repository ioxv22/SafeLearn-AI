'use client';

import { useStore } from '../store';
import { 
  LayoutDashboard, MessageSquare, ShieldCheck, 
  GraduationCap, Settings, History, Flame, 
  Trophy, LogOut, ChevronRight, BrainCircuit,
  ToggleLeft, ToggleRight, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const { 
    currentUser, safeMode, setSafeMode, 
    examMode, setExamMode, progress, setCurrentUser 
  } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <aside className="w-80 h-full bg-slate-900 text-slate-300 flex flex-col relative overflow-hidden border-l border-white/5" dir="rtl">
      {/* Subtle Gradient background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>

      {/* Brand & New Chat */}
      <div className="p-6 space-y-6 relative z-10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <BrainCircuit size={24} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">SafeLearn AI</h1>
        </div>

        <button 
          onClick={() => setActiveTab('chat')}
          className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <MessageSquare size={18} />
          </div>
          <span>محادثة جديدة</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-6 space-y-8 custom-scrollbar relative z-10">
        <div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 px-2">الرئيسية</p>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
                activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>{currentUser?.role === 'teacher' ? 'لوحة التحكم' : 'إحصائياتي'}</span>
            </button>
          </nav>
        </div>

        <div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 px-2">سجل المحادثات</p>
          <div className="space-y-1">
            {['شرح مسألة فيثاغورس', 'مراجعة قوانين الحركة', 'أسئلة عن التمثيل الغذائي'].map((item, i) => (
              <button key={i} className="w-full text-right p-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-all truncate">
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 px-2">الإعدادات الذكية</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${safeMode ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                  <ShieldCheck size={16} />
                </div>
                <span className={`text-xs font-bold ${safeMode ? 'text-emerald-400' : 'text-slate-500'}`}>Safe Mode</span>
              </div>
              <button onClick={() => setSafeMode(!safeMode)}>
                {safeMode ? <ToggleRight className="text-emerald-500" size={28} /> : <ToggleLeft className="text-slate-600" size={28} />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 group hover:border-red-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${examMode ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                  <GraduationCap size={16} />
                </div>
                <span className={`text-xs font-bold ${examMode ? 'text-red-400' : 'text-slate-500'}`}>Exam Mode</span>
              </div>
              <button onClick={() => setExamMode(!examMode)}>
                {examMode ? <ToggleRight className="text-red-500" size={28} /> : <ToggleLeft className="text-slate-600" size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Profile */}
      <div className="p-6 bg-black/20 backdrop-blur-md border-t border-white/5 relative z-10">
         <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
            {currentUser?.displayName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-white truncate">{currentUser?.displayName}</h2>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[65%]"></div>
              </div>
              <span className="text-[8px] font-black text-indigo-400 whitespace-nowrap">LVL 4</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
