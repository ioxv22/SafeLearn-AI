'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { BrainCircuit, GraduationCap, School, LogOut, Sparkles, LayoutDashboard, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { StudentChat } from '@/components/StudentChat';
import { StudentDashboard } from '@/components/StudentDashboard';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const { currentUser, isLoading, setCurrentUser } = useStore();
  const [activeTab, setActiveTab] = useState('chat');

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      alert('فشل تسجيل الدخول. تأكد من إعدادات فايربيس.');
    }
  };

  const handleDemoLogin = (role: 'student' | 'teacher') => {
    setCurrentUser({
      uid: 'demo-' + role,
      email: role === 'teacher' ? 'teacher@moe.ae' : 'student@demo.com',
      displayName: role === 'student' ? 'طالب تجريبي' : 'معلم تجريبي',
      photoURL: null,
      role: role
    });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
          <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={24} />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <BrainCircuit size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">SafeLearn AI</h1>
          <p className="text-slate-500 mb-8 font-medium">المنصة التعليمية الآمنة والذكية</p>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm mb-4"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            تسجيل الدخول باستخدام Google
          </button>
          
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">أو استخدام حسابات العرض التجريبي</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => handleDemoLogin('student')}
              className="flex-1 flex flex-col items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-4 rounded-xl font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
            >
              <GraduationCap size={24} />
              دخول كطالب
            </button>
            <button 
              onClick={() => handleDemoLogin('teacher')}
              className="flex-1 flex flex-col items-center justify-center gap-2 bg-emerald-50 text-emerald-600 py-4 rounded-xl font-bold hover:bg-emerald-100 transition-colors border border-emerald-100"
            >
              <School size={24} />
              دخول كمعلم
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden" suppressHydrationWarning>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header for Content Area */}
        <header className="h-20 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex items-center px-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              {activeTab === 'dashboard' ? <LayoutDashboard size={20} /> : <MessageCircle size={20} />}
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'dashboard' ? 'لوحة المراقبة والأداء' : 'المعلم الذكي - Safe AI'}
            </h2>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto h-full">
            {activeTab === 'dashboard' ? (
              currentUser.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
            ) : <StudentChat />}
          </div>
        </div>

        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      </main>
    </div>
  );
}
