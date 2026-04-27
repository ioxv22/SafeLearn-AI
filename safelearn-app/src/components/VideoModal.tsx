import React, { useState } from 'react';
import { useStore } from '../store';
import { Video, X, Loader2, PlayCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoModal = () => {
  const { isVideoModalOpen, setVideoModalOpen } = useStore();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isFastMode, setIsFastMode] = useState(true);

  if (!isVideoModalOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError('');
    setVideoUrl(null);

    // Prepare fastest possible model settings for quick demos
    const payload = {
      prompt: `Educational animation explaining: ${prompt}`,
      model: isFastMode ? "Seedance 1.0 Lite" : "Seedance 1.5 Pro",
      duration: isFastMode ? 5 : 8,
      resolution: isFastMode ? "480p" : "720p",
      aspect_ratio: "16:9"
    };

    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success && data.data?.video_url) {
        setVideoUrl(data.data.video_url);
      } else {
        throw new Error("فشل التوليد");
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الاتصال بالخادم. يرجى إعادة المحاولة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-sidebar border border-border rounded-3xl shadow-2xl overflow-hidden relative"
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
              <div className="bg-purple-500/20 p-3 rounded-xl text-purple-500">
                <Video size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">صانع الشروحات المرئية</h2>
                <p className="text-sm text-foreground/60">مدعوم بتقنية Seedance AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsFastMode(!isFastMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                isFastMode 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                  : 'bg-background border-border text-foreground/50 hover:bg-border/50'
              }`}
            >
              <Zap size={16} />
              {isFastMode ? 'الوضع السريع مفعل (Lite)' : 'وضع الجودة العالية (Pro)'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: كيف تنقسم الخلية الحية؟ اشرحها بصرياً..."
                className="w-full bg-background border border-border rounded-xl py-4 pr-4 pl-32 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button 
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="absolute left-2 top-2 bottom-2 px-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                توليد
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {/* Video Player Area */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-border/50 relative flex items-center justify-center">
              {isLoading ? (
                <div className="text-center text-white/70 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-sm font-medium animate-pulse">
                    {isFastMode ? "جاري بناء فيديو سريع (5 ثوانٍ)..." : "جاري بناء فيديو عالي الجودة (قد يستغرق وقتاً طويلاً)..."}
                  </p>
                </div>
              ) : videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-white/30">
                  <Video size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">سيظهر الفيديو التعليمي هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
