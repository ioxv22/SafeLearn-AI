import React from 'react';
import { useStore } from '../store';
import { BrainCircuit, MessageSquare, LayoutDashboard, Shield, ShieldAlert, Flame, Target, LogOut, Video } from 'lucide-react';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const { currentUser, logout, viewMode, setViewMode, safeMode, toggleSafeMode, examMode, toggleExamMode, userLevel, stats, setVideoModalOpen } = useStore();

  return (
    <aside className="w-72 bg-sidebar border-r border-border flex flex-col h-full transition-colors relative">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/30">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h1 className="font-bold text-xl leading-tight">SafeLearn AI</h1>
          <p className="text-xs text-primary font-medium">{currentUser?.role === 'teacher' ? 'إدارة المعلمين' : 'منصة الطالب'}</p>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <button 
          onClick={() => setViewMode('chat')}
          className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium", viewMode === 'chat' ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-border/50 text-foreground/80")}
        >
          <MessageSquare size={18} />
          <span>المعلم الذكي</span>
        </button>
        
        {currentUser?.role === 'student' && (
          <button 
            onClick={() => setVideoModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-transparent hover:border-purple-500/30"
          >
            <Video size={18} />
            <span>صانع الشروحات (فيديو)</span>
          </button>
        )}
        
        {currentUser?.role === 'teacher' && (
          <button 
            onClick={() => setViewMode('dashboard')}
            className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium", viewMode === 'dashboard' ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-border/50 text-foreground/80")}
          >
            <LayoutDashboard size={18} />
            <span>لوحة تحكم لجنة التحكيم</span>
          </button>
        )}
      </nav>

      <div className="p-4 space-y-4 mt-auto">
        {currentUser?.role === 'student' && (
          <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold flex items-center gap-2"><Target size={16} className="text-blue-500" /> تقدمي</span>
              <span className="text-xs font-bold text-blue-500">{stats.questionsSolved}/{stats.questionsAttempted}</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(stats.questionsSolved/stats.questionsAttempted)*100}%`}}></div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-orange-500">
              <Flame size={14} /> {stats.streak} أيام متتالية!
            </div>
          </div>
        )}

        <div className="space-y-2">
          <button 
            onClick={toggleSafeMode}
            disabled={examMode}
            className={cn("w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all", safeMode && !examMode ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-background border-border text-foreground/60 opacity-50")}
          >
            <div className="flex items-center gap-2 font-medium text-sm">
              <Shield size={16} />
              <span>الوضع الآمن</span>
            </div>
            <div className={cn("w-8 h-4 rounded-full transition-colors relative", safeMode && !examMode ? "bg-emerald-500" : "bg-gray-300 dark:bg-slate-700")}>
              <div className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform", safeMode && !examMode ? "translate-x-4" : "translate-x-1")} />
            </div>
          </button>

          <button 
            onClick={toggleExamMode}
            className={cn("w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all", examMode ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 shadow-sm" : "bg-background border-border text-foreground/60")}
          >
            <div className="flex items-center gap-2 font-medium text-sm">
              <ShieldAlert size={16} />
              <span>وضع الاختبار</span>
            </div>
            <div className={cn("w-8 h-4 rounded-full transition-colors relative", examMode ? "bg-red-500" : "bg-gray-300 dark:bg-slate-700")}>
              <div className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform", examMode ? "translate-x-4" : "translate-x-1")} />
            </div>
          </button>
        </div>

        <div className="bg-background rounded-xl p-3 border border-border flex items-center gap-3 mt-4 relative group cursor-pointer hover:bg-border/30 transition-colors" onClick={logout}>
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm", currentUser?.role === 'teacher' ? 'bg-amber-500' : 'bg-indigo-500')}>
            {currentUser?.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold truncate">{currentUser?.name}</h4>
            <div className="flex items-center gap-1 text-xs text-foreground/60">
              <span className="capitalize">{currentUser?.role === 'teacher' ? 'مدير النظام' : `مستوى ${userLevel}`}</span>
            </div>
          </div>
          <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500">
            <LogOut size={16} />
          </div>
        </div>
      </div>
    </aside>
  );
};
