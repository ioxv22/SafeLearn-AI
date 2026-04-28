'use client';

import { useStore } from '@/store';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { BrainCircuit, GraduationCap, School } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <BrainCircuit size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">SafeLearn AI</h1>
          <p className="text-slate-500 mb-8 font-medium">المنصة التعليمية الآمنة والذكية</p>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm mb-4"
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

  // If logged in, show their dashboard based on role
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <div className="p-8 w-full max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-indigo-100" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {currentUser.displayName?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{currentUser.displayName}</h2>
              <p className="text-sm text-slate-500 font-medium">
                {currentUser.role === 'teacher' ? 'حساب المعلم' : 'حساب الطالب'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors">
            تسجيل الخروج
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm flex-1 p-6">
          {currentUser.role === 'teacher' ? <TeacherDashboard /> : <StudentChat />}
        </div>
      </div>
    </div>
  );
}
