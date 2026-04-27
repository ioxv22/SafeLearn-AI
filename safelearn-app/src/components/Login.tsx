import React, { useState } from 'react';
import { useStore } from '../store';
import { BrainCircuit, Mail, Lock, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network latency for realism
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === 'admin@safelearn.com' && password === '1234') {
      login({ name: 'لجنة التحكيم (إدارة)', role: 'teacher', email });
    } else if (email === 'student@safelearn.com' && password === '1234') {
      login({ name: 'الطالب التجريبي', role: 'student', email });
    } else {
      setError('بيانات الدخول غير صحيحة. جرب: admin@safelearn.com أو student@safelearn.com والرقم 1234');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full justify-center items-center bg-background relative overflow-hidden" dir="rtl">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-sidebar/80 backdrop-blur-2xl border border-border p-10 rounded-3xl shadow-2xl z-10"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary/30 text-white">
            <BrainCircuit size={40} />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">SafeLearn AI</h1>
          <p className="text-foreground/60">منصة التعليم الذكي الأخلاقية</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm text-center border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground/80 ml-1">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@safelearn.com"
                className="w-full bg-background border border-border rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground/80 ml-1">كلمة المرور</label>
            <div className="relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="1234"
                className="w-full bg-background border border-border rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 mt-2"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                <span>تسجيل الدخول للمنصة</span>
                <ArrowLeft size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-foreground/50 bg-foreground/5 py-2 px-4 rounded-lg">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>المنصة متوافقة مع سياسات الذكاء الاصطناعي الآمن (Zero-Cheating)</span>
        </div>

        <div className="mt-6 text-center text-xs text-foreground/50 border-t border-border pt-4">
          <p className="font-bold mb-1">حسابات تجريبية للمسابقة:</p>
          <p>طالب: student@safelearn.com | 1234</p>
          <p>معلم/لجنة التحكيم: admin@safelearn.com | 1234</p>
        </div>
      </motion.div>
    </div>
  );
};
