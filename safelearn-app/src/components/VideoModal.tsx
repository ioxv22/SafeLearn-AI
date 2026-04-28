import React, { useState } from 'react';
import { useStore } from '../store';
import { Video, X, PlayCircle, PlaySquare, AlertCircle, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoModal = () => {
  const { isVideoModalOpen, setVideoModalOpen } = useStore();
  const [prompt, setPrompt] = useState('');
  const [generatedMediaUrl, setGeneratedMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isVideoModalOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedMediaUrl(null);
    setErrorMsg('');
    
    try {
      const response = await fetch(`/api/youtube?q=${encodeURIComponent(prompt)}`);
      const data = await response.json();
      if (data.success && data.videoId) {
        setGeneratedMediaUrl(`https://www.youtube.com/embed/${data.videoId}?autoplay=1&rel=0`);
      } else {
        // Fallback to demo video if API fails
        setGeneratedMediaUrl(`https://www.youtube.com/embed/NybHckSEQBI?autoplay=1&rel=0`);
      }
    } catch (e) {
      setGeneratedMediaUrl(`https://www.youtube.com/embed/NybHckSEQBI?autoplay=1&rel=0`);
    }
    setIsLoading(false);
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
              <div className="bg-red-500/20 p-3 rounded-xl text-red-500 shadow-lg shadow-red-500/10">
                <PlaySquare size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  المكتبة المرئية الذكية
                  <Sparkles size={18} className="text-amber-500 animate-pulse" />
                </h2>
                <p className="text-sm text-foreground/60">
                  ابحث عن أي موضوع تعليمي وسأجلب لك أفضل شرح مرئي فوراً
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="ابحث عن موضوع (مثال: الدورة الدموية، قوانين نيوتن، الذرة)..."
                className="w-full bg-background border border-border rounded-xl py-4 pr-12 pl-32 outline-none focus:ring-2 focus:ring-red-500/50 text-sm transition-all"
              />
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className="absolute left-2 top-2 bottom-2 px-6 disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
              >
                {isLoading ? <Sparkles size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                {isLoading ? 'جاري البحث...' : 'بدء العرض'}
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle size={18} />
                {errorMsg}
              </div>
            )}

            {/* Video Player Area */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-border/50 relative flex items-center justify-center shadow-inner group">
              {isLoading ? (
                <div className="text-center text-white/70 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                  <div className="space-y-1">
                    <p className="text-lg font-bold animate-pulse">جاري جلب أفضل الشروحات...</p>
                    <p className="text-xs opacity-60">نحلل آلاف الفيديوهات لنختار لك الأكثر دقة</p>
                  </div>
                </div>
              ) : generatedMediaUrl ? (
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
                  <iframe 
                    src={generatedMediaUrl} 
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="text-center text-white/20">
                  <Video size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-bold">جاهز للعرض التعليمي</p>
                  <p className="text-sm opacity-50">اكتب موضوع الدرس أعلاه للبدء</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
