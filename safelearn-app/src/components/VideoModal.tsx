import React, { useState } from 'react';
import { useStore } from '../store';
import { Video, X, PlayCircle, PlaySquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VideoModal = () => {
  const { isVideoModalOpen, setVideoModalOpen } = useStore();
  const [prompt, setPrompt] = useState('');
  const [videoQuery, setVideoQuery] = useState<string | null>(null);

  if (!isVideoModalOpen) return null;

  const handleSearch = () => {
    if (!prompt.trim()) return;
    // Embed a YouTube search playlist based on the prompt
    setVideoQuery(encodeURIComponent(prompt + " شرح تعليمي"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-sidebar border border-border rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <button 
          onClick={() => setVideoModalOpen(false)}
          className="absolute top-4 right-4 p-2 bg-background rounded-full text-foreground/60 hover:text-foreground transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/20 p-3 rounded-xl text-red-500">
                <PlaySquare size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">المكتبة المرئية الذكية</h2>
                <p className="text-sm text-foreground/60">جلب أفضل الشروحات التعليمية فورياً بدون انتظار</p>
              </div>
            </div>
            <div className="hidden md:flex bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg text-sm font-bold items-center gap-2 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              سريع ومستقر 100%
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ما الذي تريد أن تفهمه؟ (مثال: الدورة الدموية، الانقسام الخلوي، قوانين نيوتن)..."
                className="w-full bg-background border border-border rounded-xl py-4 pr-4 pl-32 outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button 
                onClick={handleSearch}
                disabled={!prompt.trim()}
                className="absolute left-2 top-2 bottom-2 px-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <PlayCircle size={18} />
                بحث وعرض
              </button>
            </div>

            {/* Video Player Area */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-border/50 relative flex items-center justify-center shadow-inner">
              {videoQuery ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed?listType=search&list=${videoQuery}`}
                  title="YouTube Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-center text-white/30">
                  <Video size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">سيتم جلب أفضل فيديو تعليمي وعرضه هنا مباشرة</p>
                  <p className="text-xs opacity-60 mt-1">لا حاجة للانتظار لتوليد الذكاء الاصطناعي</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
