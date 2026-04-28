'use client';

import { useStore } from '../store';
import { 
  LayoutDashboard, MessageSquare, ShieldCheck, 
  GraduationCap, LogOut, ChevronRight, BrainCircuit,
  ToggleLeft, ToggleRight, Flame, Trophy
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const { 
    currentUser, safeMode, setSafeMode, 
    examMode, setExamMode, progress, setCurrentUser 
  } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <aside className="w-80 h-full bg-white border-l border-slate-100 flex flex-col p-6 overflow-y-auto" dir="rtl">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <BrainCircuit size={24} />
        </div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight">SafeLearn AI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 mb-10">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} />
            <span>{currentUser?.role === 'teacher' ? 'لوحة التحكم' : 'إحصائياتي'}</span>
          </div>
          <ChevronRight size={16} className={activeTab === 'dashboard' ? 'rotate-180' : ''} />
        </button>

        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <MessageSquare size={18} />
            <span>المعلم الذكي</span>
          </div>
          <ChevronRight size={16} className={activeTab === 'chat' ? 'rotate-180' : ''} />
        </button>
      </nav>

      {/* System Toggles */}
      <div className="space-y-4 mb-10">
        <p className="text-[10px] text-slate-400 font-bold px-4 uppercase tracking-[0.2em] mb-2">أنظمة الذكاء الاصطناعي</p>
        
        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={16} />
            </div>
            <p className="text-xs font-black text-emerald-700">Safe Mode</p>
          </div>
          <button onClick={() => setSafeMode(!safeMode)}>
            {safeMode ? <ToggleRight className="text-emerald-500" size={32} /> : <ToggleLeft className="text-slate-300" size={32} />}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={16} />
            </div>
            <p className="text-xs font-black text-red-700">Exam Mode</p>
          </div>
          <button onClick={() => setExamMode(!examMode)}>
            {examMode ? <ToggleRight className="text-red-500" size={32} /> : <ToggleLeft className="text-slate-300" size={32} />}
          </button>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="mt-auto pt-6 border-t border-slate-50">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={18} className="text-yellow-500" />
            <span className="text-xs font-bold text-slate-700">تقدمك اليوم</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-black text-indigo-600">{progress.solved}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase">محلول</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-black text-orange-500">{progress.streak}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase">استمرارية</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 mt-6 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
