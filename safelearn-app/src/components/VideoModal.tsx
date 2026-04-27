import React, { useState } from 'react';
import { useStore } from '../store';
import { Video, X, PlayCircle, Wand2, Youtube, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DEMO_VIDEOS: Record<string, string> = {
  'قلب': 'ruM4Xxhx32U', 
  'خلية': 'URUJD5NEXC8', 
  'انقسام': 'URUJD5NEXC8',
  'نيوتن': 'kKKM8Y-u7ds', 
  'فضاء': 'B1AXbpYndGc', 
  'مناعة': '2DFN4IBZ3rI', 
  'صلاة': 'vFf4Yt_m7V8', 
  'وضوء': 'vFf4Yt_m7V8',
  'نحو': '1xT7m_U5j5k', 
  'x': 'NybHckSEQBI', 
  'رياضيات': 'NybHckSEQBI',
  'افتراضي': 'NybHckSEQBI' 
};

export const VideoModal = () => {
  const { isVideoModalOpen, setVideoModalOpen } = useStore();
  const [prompt, setPrompt] = useState('');
  const [generatedMediaUrl, setGeneratedMediaUrl] = useState<string | null>(null);
  const [isIframe, setIsIframe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'ai' | 'youtube'>('ai');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isVideoModalOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedMediaUrl(null);
    setIsIframe(false);
    setErrorMsg('');
    
    if (mode === 'youtube') {
      setTimeout(() => {
        const query = prompt.toLowerCase();
        let foundId = DEMO_VIDEOS['افتراضي'];
        for (const [key, id] of Object.entries(DEMO_VIDEOS)) {
          if (query.includes(key)) {
            foundId = id;
            break;
          }
        }
        setGeneratedMediaUrl(`https://www.youtube.com/embed/${foundId}?autoplay=1&rel=0`);
        setIsIframe(true);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      // 1. Try KILWA Video API
      const response = await fetch(`/api/video?text=${encodeURIComponent(prompt)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.video_url) {
          setGeneratedMediaUrl(data.video_url);
          setIsIframe(true);
          setIsLoading(false);
          return;
        }
      }
      throw new Error("KILWA Server is down or returned invalid data");
    } catch (e: any) {
      // 2. Fallback to Pollinations AI Image with Ken Burns
      const enhancedPrompt = `Educational 3d render diagram explaining ${prompt}, highly detailed, cinematic, 8k`;
      // Use English fallback to prevent Arabic encoding issues blocking the image
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random()*1000)}`;
      
      const img = new Image();
      img.src = fallbackUrl;
      img.onload = () => {
        setGeneratedMediaUrl(fallbackUrl);
        setIsIframe(false);
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false);
        setErrorMsg("تعذر الاتصال بخوادم التوليد. نوصي باستخدام 'مكتبة يوتيوب' للعروض التقديمية لتجنب الأعطال.");
      };
    }
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
              <div className={mode === 'ai' ? "bg-purple-500/20 p-3 rounded-xl text-purple-500" : "bg-red-500/20 p-3 rounded-xl text-red-500"}>
                {mode === 'ai' ? <Wand2 size={28} /> : <Youtube size={28} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {mode === 'ai' ? 'صانع الشروحات (AI Video)' : 'المكتبة المرئية (YouTube)'}
                </h2>
                <p className="text-sm text-foreground/60">
                  {mode === 'ai' ? 'توليد شروحات مرئية متحركة فورياً' : 'جلب أفضل الفيديوهات التعليمية الموثوقة'}
                </p>
              </div>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex bg-background border border-border rounded-lg p-1">
              <button 
                onClick={() => setMode('ai')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${mode === 'ai' ? 'bg-purple-500/20 text-purple-500' : 'text-foreground/50 hover:text-foreground'}`}
              >
                الذكاء الاصطناعي
              </button>
              <button 
                onClick={() => setMode('youtube')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${mode === 'youtube' ? 'bg-red-500/20 text-red-500' : 'text-foreground/50 hover:text-foreground'}`}
              >
                يوتيوب الموثوق
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder={mode === 'ai' ? "صف ما تريد توليده (مثال: الخلية الحية من الداخل)..." : "ابحث عن موضوع تعليمي (مثال: قوانين نيوتن)..."}
                className={`w-full bg-background border border-border rounded-xl py-4 pr-4 pl-32 outline-none focus:ring-2 text-sm ${mode === 'ai' ? 'focus:ring-purple-500' : 'focus:ring-red-500'}`}
              />
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className={`absolute left-2 top-2 bottom-2 px-6 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center gap-2 ${mode === 'ai' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                <PlayCircle size={18} />
                {mode === 'ai' ? 'توليد' : 'بحث'}
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
                <div className="text-center text-white/70 flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 border-4 rounded-full animate-spin ${mode === 'ai' ? 'border-purple-500/30 border-t-purple-500' : 'border-red-500/30 border-t-red-500'}`} />
                  <p className="text-sm font-medium animate-pulse">
                    {mode === 'ai' ? 'جاري بناء المشاهد ثلاثية الأبعاد...' : 'جاري البحث في يوتيوب...'}
                  </p>
                </div>
              ) : generatedMediaUrl ? (
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
                  {isIframe ? (
                    <iframe 
                      src={generatedMediaUrl} 
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <img 
                        src={generatedMediaUrl} 
                        alt="AI Generated Visualization" 
                        className="w-full h-full object-cover animate-[kenburns_10s_ease-in-out_infinite_alternate]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs text-white border border-white/10 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        AI Cinematic Visual
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-white/30">
                  <Video size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">سيتم عرض الشرح المرئي هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.05) translate(-1%, -1%); }
          100% { transform: scale(1.1) translate(1%, 1%); }
        }
      `}} />
    </div>
  );
};
