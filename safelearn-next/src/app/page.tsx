'use client';

import { useStore } from '@/store';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { BrainCircuit, GraduationCap, School, LogOut, Sparkles, LayoutDashboard, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { StudentChat } from '@/components/StudentChat';

export default function Home() {
  const { currentUser, isLoading, setCurrentUser } = useStore();

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
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] p-4 overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black mb-6 border border-indigo-100">
              <Sparkles size={14} />
              <span>مستقبل التعليم الذكي</span>
            </div>
            <h1 className="text-6xl font-black text-slate-800 mb-6 leading-tight">
              تعلم بذكاء، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-purple-600">بأمان تام.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 font-medium leading-relaxed max-w-lg">
              SafeLearn AI هو رفيقك الدراسي الذكي الذي لا يعطيك الإجابات، بل يعلمك كيف تصل إليها. منصة متكاملة للمعلمين والطلاب مدعومة بأحدث تقنيات الذكاء الاصطناعي.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:border-indigo-500 hover:bg-indigo-50/50 transition-all shadow-xl shadow-slate-200/50 group"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                <span>تسجيل الدخول عبر Google</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-500/10 border border-slate-100 relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 animate-float">
              <BrainCircuit size={40} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-2 mt-4">ابدأ التجربة الآن</h2>
            <p className="text-slate-400 mb-10 font-bold">اختر نوع الحساب الذي تريد استكشافه</p>
            
            <div className="grid grid-cols-1 gap-6">
              <button 
                onClick={() => handleDemoLogin('student')}
                className="group relative flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-indigo-500 hover:bg-white transition-all text-right overflow-hidden"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">أنا طالب</h3>
                  <p className="text-slate-400 text-sm font-bold">أريد مساعداً ذكياً يوجهني في دراستي.</p>
                </div>
                <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-10 group-hover:left-4 transition-all">
                  <ArrowRight size={80} className="rotate-180" />
                </div>
              </button>

              <button 
                onClick={() => handleDemoLogin('teacher')}
                className="group relative flex items-center gap-6 p-6 bg-emerald-50/50 rounded-[2rem] border-2 border-transparent hover:border-emerald-500 hover:bg-white transition-all text-right overflow-hidden"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <School size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">أنا معلم</h3>
                  <p className="text-slate-400 text-sm font-bold">أريد إنشاء فصول ومراقبة تطور طلابي.</p>
                </div>
                <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-10 group-hover:left-4 transition-all">
                  <ArrowRight size={80} className="rotate-180" />
                </div>
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-slate-300 text-[10px] font-black tracking-widest uppercase">SafeLearn AI - Innovation in Education</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BrainCircuit size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">SafeLearn AI</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <div className="text-right">
                <p className="text-xs font-black text-slate-800 leading-none">{currentUser.displayName}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {currentUser.role === 'teacher' ? 'قائد تعليمي' : 'متعلم ذكي'}
                </p>
              </div>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {currentUser.displayName?.charAt(0)}
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout} 
              className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all border border-red-100/50"
              title="تسجيل الخروج"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600">
              {currentUser.role === 'teacher' ? <LayoutDashboard size={24} /> : <MessageCircle size={24} />}
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              {currentUser.role === 'teacher' ? 'لوحة التحكم' : 'مساعد التعلم'}
            </h2>
          </div>
        </div>
        
        <div className="w-full">
          {currentUser.role === 'teacher' ? <TeacherDashboard /> : <StudentChat />}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-center text-slate-400">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">SafeLearn AI &copy; 2026 • ابتكار تعليمي آمن</p>
      </footer>
    </div>
  );
}
