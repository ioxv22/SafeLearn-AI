import React, { useState } from 'react';
import { useStore } from '../store';
import { Video, X, PlayCircle, PlaySquare, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoModal = () => {
  const { isVideoModalOpen, setVideoModalOpen } = useStore();
  const [prompt, setPrompt] = useState('');
  const [generatedMediaUrl, setGeneratedMediaUrl] = useState<string | null>(null);
  const [isIframe, setIsIframe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isVideoModalOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedMediaUrl(null);
    setIsIframe(false);
    
    try {
      // Call the new KILWA Video API via our Vite proxy
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
      throw new Error("KILWA API failed or returned 404");
    } catch (e) {
      // Fallback: Super stable AI Cinematic Image with CSS Motion
      const enhancedPrompt = `Educational 3d render, highly detailed diagram explaining ${prompt}, cinematic lighting, 8k resolution`;
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&nologo=true`;
      
      const img = new Image();
      img.src = fallbackUrl;
      img.onload = () => {
        setGeneratedMediaUrl(fallbackUrl);
        setIsIframe(false);
        setIsLoading(false);
      };
      img.onerror = () => {
        setGeneratedMediaUrl(`https://image.pollinations.ai/prompt/Educational%20diagram%20${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true`);
        setIsIframe(false);
        setIsLoading(false);
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
              <div className="bg-purple-500/20 p-3 rounded-xl text-purple-500">
                <Wand2 size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">صانع الشروحات (KILWA Video)</h2>
                <p className="text-sm text-foreground/60">توليد شروحات مرئية متحركة فورياً عبر الذكاء الاصطناعي</p>
              </div>
            </div>
            <div className="hidden md:flex bg-purple-500/10 text-purple-500 px-3 py-1.5 rounded-lg text-sm font-bold items-center gap-2 border border-purple-500/20">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              مدعوم بـ Seedance 1.5 Pro
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="صف ما تريد توليده (مثال: الخلية الحية من الداخل، أو شكل الحمض النووي)..."
                className="w-full bg-background border border-border rounded-xl py-4 pr-4 pl-32 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className="absolute left-2 top-2 bottom-2 px-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <PlayCircle size={18} />
                توليد الآن
              </button>
            </div>

            {/* Video Player Area */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-border/50 relative flex items-center justify-center shadow-inner group">
              {isLoading ? (
                <div className="text-center text-white/70 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-sm font-medium animate-pulse">جاري بناء المشاهد والتواصل مع KILWA API...</p>
                  <p className="text-xs text-white/40">يرجى الانتظار، قد يستغرق التوليد بضع ثوانٍ</p>
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
                      {/* CSS Ken Burns Effect to simulate Video Motion as Fallback */}
                      <img 
                        src={generatedMediaUrl} 
                        alt="AI Generated Educational Visualization" 
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
                  <p className="text-sm font-medium">سيتم عرض الشرح المرئي المولد هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Style for the Ken Burns Video Effect */}
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
