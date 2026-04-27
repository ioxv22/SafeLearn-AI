import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { generateAIResponse } from '../lib/ai';
import { Send, Bot, User, Loader2, Mic, AlertOctagon, Image as ImageIcon, BookOpen, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECTS = ['رياضيات', 'علوم', 'لغة عربية', 'تربية إسلامية', 'عام'];

export const Chat = () => {
  const { messages, addMessage, examMode, cheatAttempts, currentSubject, setCurrentSubject, currentUser } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, cheatAttempts, currentSubject]);

  // Voice Input Logic (Web Speech API)
  const handleMicClick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("متصفحك لا يدعم التعرف على الصوت.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // Image Upload Logic (Simulated for API)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target?.result as string;
      
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: input.trim() ? input : 'أرجو مساعدتي في فهم ما في هذه الصورة.',
        timestamp: new Date(),
        image: base64Image
      });

      setInput('');
      setIsTyping(true);
      const aiResponse = await generateAIResponse(`[تم إرسال صورة في مادة ${currentSubject}] ` + (input.trim() || 'اشرح ما في الصورة خطوة بخطوة'));
      setIsTyping(false);
      
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    setInput('');
    
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date()
    });

    setIsTyping(true);
    const aiResponse = await generateAIResponse(`[المادة: ${currentSubject}] ${userText}`);
    setIsTyping(false);
    
    addMessage({
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: aiResponse,
      timestamp: new Date()
    });
  };

  const handleGenerateExam = async () => {
    setIsTyping(true);
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: `أنا مستعد، قم بتوليد امتحان قصير وممتع من 3 أسئلة في مادة ${currentSubject} لتقييم مستواي.`,
      timestamp: new Date()
    });
    
    const aiResponse = await generateAIResponse(`أنا مستعد، قم بتوليد امتحان قصير وممتع من 3 أسئلة في مادة ${currentSubject} لتقييم مستواي. اطرح الأسئلة الآن ورقمها.`);
    setIsTyping(false);
    
    addMessage({
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: aiResponse,
      timestamp: new Date()
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden" dir="rtl">
      
      {/* Subject Selector & Exam Generator Bar */}
      <div className="bg-sidebar border-b border-border py-3 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <BookOpen size={18} className="text-primary ml-2" />
          {SUBJECTS.map((subj) => (
            <button
              key={subj}
              onClick={() => setCurrentSubject(subj)}
              className={cn("whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-all border", currentSubject === subj ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-background border-border text-foreground/60 hover:border-primary/50")}
            >
              {subj}
            </button>
          ))}
        </div>
        {currentUser?.role === 'student' && (
          <button 
            onClick={handleGenerateExam}
            disabled={isTyping}
            className="flex items-center gap-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-1.5 rounded-full text-sm font-bold transition-all border border-indigo-500/30 whitespace-nowrap"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">توليد امتحان</span>
          </button>
        )}
      </div>

      {examMode && (
        <div className="bg-red-500 text-white py-2 px-4 text-center text-sm font-bold shadow-md z-10 flex items-center justify-center gap-2">
          <span className="animate-pulse">🔴</span> وضع الاختبار مفعل - يتم الآن تقييم إجاباتك ولن يتم مساعدتك
        </div>
      )}

      <AnimatePresence>
        {cheatAttempts >= 3 && !examMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-orange-500 text-white py-3 px-4 text-center text-sm font-bold shadow-md z-10 flex flex-col items-center justify-center gap-1"
          >
            <div className="flex items-center gap-2">
              <AlertOctagon size={18} className="animate-bounce" /> 
              <span>تنبيه نظام مكافحة الغش</span>
            </div>
            <p className="font-medium text-xs">لقد حاولت طلب الإجابة المباشرة عدة مرات. تم تسجيل محاولاتك في لوحة المعلم.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-4 w-full", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm", msg.role === 'user' ? "bg-primary text-white" : "bg-emerald-500 text-white")}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={cn(
                  "px-6 py-4 rounded-2xl max-w-[85%] leading-relaxed text-[15px] shadow-sm whitespace-pre-wrap flex flex-col gap-3", 
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-sm" 
                    : "bg-sidebar border border-border text-foreground rounded-tl-sm"
                )}>
                  {msg.image && (
                    <img src={msg.image} alt="User Upload" className="max-w-xs rounded-xl shadow-md border border-white/20" />
                  )}
                  <span>{msg.content}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex gap-4 w-full flex-row"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="px-6 py-4 rounded-2xl bg-sidebar border border-border text-foreground rounded-tl-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-emerald-500" />
                <span className="text-sm text-foreground/60">المعلم يفكر...</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border w-full z-10">
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={examMode ? "أدخل إجابتك النهائية للتقييم..." : isListening ? "جاري الاستماع..." : "اسأل المعلم أو أرسل صورة للسؤال..."}
              className="w-full bg-sidebar border border-border rounded-full py-4 pr-6 pl-32 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[15px]"
            />
            
            <div className="absolute left-2 flex items-center gap-1">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-transparent hover:bg-border text-foreground/50 hover:text-foreground"
                title="إرفاق صورة"
              >
                <ImageIcon size={18} />
              </button>
              
              <button 
                onClick={handleMicClick}
                className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", isListening ? "bg-red-500 text-white animate-pulse" : "bg-transparent hover:bg-border text-foreground/50 hover:text-foreground")}
              >
                <Mic size={18} />
              </button>
              
              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !fileInputRef.current?.value) || isTyping}
                className="w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md ml-1"
              >
                <Send size={18} className="-ml-1" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-foreground/40 mt-3 font-medium">
          SafeLearn AI - دمج الذكاء الاصطناعي مع الأخلاقيات التعليمية
        </p>
      </div>
    </div>
  );
};
