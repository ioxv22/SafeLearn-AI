import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { generateAIResponse } from '../lib/ai';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Chat = () => {
  const { messages, addMessage, examMode } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
    
    const aiResponse = await generateAIResponse(userText);
    
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
      {/* Exam Mode Banner */}
      {examMode && (
        <div className="bg-red-500 text-white py-2 px-4 text-center text-sm font-bold shadow-md z-10 flex items-center justify-center gap-2">
          <span className="animate-pulse">🔴</span> وضع الاختبار مفعل - لا توجد مساعدات أو تلميحات
        </div>
      )}

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
                {/* Avatar */}
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm", msg.role === 'user' ? "bg-primary text-white" : "bg-emerald-500 text-white")}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                {/* Bubble */}
                <div className={cn(
                  "px-6 py-4 rounded-2xl max-w-[85%] leading-relaxed text-[15px] shadow-sm", 
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-sm" 
                    : "bg-sidebar border border-border text-foreground rounded-tl-sm"
                )}>
                  {msg.content}
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
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={examMode ? "اكتب إجابتك النهائية هنا..." : "اسأل المعلم، لا تطلب الإجابة مباشرة..."}
            className="w-full bg-sidebar border border-border rounded-full py-4 pr-6 pl-16 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[15px]"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute left-2 w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send size={20} className="-ml-1" />
          </button>
        </div>
        <p className="text-center text-xs text-foreground/40 mt-3 font-medium">
          SafeLearn AI - مدعوم بنظام حماية التعلم ومنع الغش
        </p>
      </div>
    </div>
  );
};
