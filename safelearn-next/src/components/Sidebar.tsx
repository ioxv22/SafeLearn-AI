'use client';

import { useStore } from '../store';
import { 
  LayoutDashboard, MessageSquare, ShieldCheck, 
  GraduationCap, LogOut, ChevronRight, BrainCircuit,
  ToggleLeft, ToggleRight, Flame, Trophy, Sparkles, School
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
    <aside className="w-80 h-full bg-slate-950 text-slate-300 flex flex-col relative overflow-hidden border-l border-slate-900" dir="rtl" suppressHydrationWarning>
      {/* Dynamic Glow background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>

      {/* Brand */}
      <div className="p-8 space-y-6 relative z-10">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none mb-1">SafeLearn AI</h1>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Smarter Learning</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-6 space-y-8 custom-scrollbar relative z-10">
        <div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 px-4">القائمة الرئيسية</p>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} className={activeTab === 'dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                <span>{currentUser?.role === 'teacher' ? 'لوحة التحكم' : 'إحصائياتي'}</span>
              </div>
              <ChevronRight size={14} className={activeTab === 'dashboard' ? 'rotate-180' : ''} />
            </button>

            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${
                activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className={activeTab === 'chat' ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                <span>المعلم الذكي</span>
              </div>
              <ChevronRight size={14} className={activeTab === 'chat' ? 'rotate-180' : ''} />
            </button>

            <button 
              onClick={() => window.open('https://www.youtube.com/@moeuaeofficial', '_blank')}
              className="w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group text-slate-400 hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <School size={18} className="text-slate-500 group-hover:text-red-400" />
                <span>دروس الوزارة</span>
              </div>
              <ChevronRight size={14} />
            </button>
          </nav>
        </div>

        <div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 px-4">إعدادات الذكاء الاصطناعي</p>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${safeMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${safeMode ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  <ShieldCheck size={16} />
                </div>
                <p className={`text-xs font-black ${safeMode ? 'text-emerald-400' : 'text-slate-500'}`}>Safe Mode</p>
              </div>
              <button onClick={() => setSafeMode(!safeMode)}>
                {safeMode ? <ToggleRight className="text-emerald-500" size={32} /> : <ToggleLeft className="text-slate-700" size={32} />}
              </button>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${examMode ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${examMode ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  <GraduationCap size={16} />
                </div>
                <p className={`text-xs font-black ${examMode ? 'text-red-400' : 'text-slate-500'}`}>Exam Mode</p>
              </div>
              <button onClick={() => setExamMode(!examMode)}>
                {examMode ? <ToggleRight className="text-red-500" size={32} /> : <ToggleLeft className="text-slate-700" size={32} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="p-8 bg-slate-950/80 backdrop-blur-md border-t border-slate-900 relative z-10">
        <div className="bg-gradient-to-br from-slate-900 to-black p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
              <Trophy size={16} />
            </div>
            <span className="text-xs font-black text-white tracking-wide">الإنجازات التعليمية</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-black text-indigo-400">{progress.solved}</p>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">مسائل محلولة</p>
            </div>
            <div className="text-left">
              <div className="flex items-center justify-end gap-1 mb-0.5">
                <Flame size={14} className="text-orange-500" />
                <p className="text-2xl font-black text-orange-500">{progress.streak}</p>
              </div>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">استمرارية</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-black text-indigo-400">
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-[10px] font-black text-white truncate max-w-[100px]">{currentUser?.displayName}</p>
                  <p className="text-[8px] font-bold text-slate-500">LEVEL 12</p>
                </div>
             </div>
             <button 
                onClick={handleLogout}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center"
              >
                <LogOut size={16} />
              </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
