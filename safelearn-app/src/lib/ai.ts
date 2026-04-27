import { useStore } from '../store';

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  const { safeMode, examMode, userLevel } = useStore.getState();
  
  const text = userMessage.trim();
  if (!text) return "عفواً، لم أتمكن من قراءة رسالتك.";

  if (examMode) {
    return "أنت الآن في وضع الاختبار. لا يمكنني تقديم تلميحات. يرجى الاعتماد على نفسك وإدخال إجابتك النهائية للتقييم.";
  }

  let systemPrompt = `أنت SafeLearn AI، معلم ذكي أخلاقي مصمم لمساعدة الطلاب. 
قاعدة صارمة جداً: لا تعطِ الإجابة النهائية أو الحل المباشر أبداً للعمليات الحسابية أو الأسئلة المباشرة.
عليك مساعدة الطالب خطوة بخطوة من خلال طرح أسئلة توجيهية تجعله يفكر بنفسه.
مستوى الطالب الحالي: ${userLevel === 'weak' ? 'ضعيف (يحتاج أمثلة مبسطة جداً)' : userLevel === 'medium' ? 'متوسط (يحتاج توجيه للخطوة القادمة)' : 'متقدم (يحتاج تلميحات ذكية فقط)'}.
إذا طلب الطالب حلاً جاهزاً، اعتذر بأدب واطلب منه التفكير في الخطوة الأولى.

سؤال الطالب: ${text}`;

  try {
    // Use Vite proxy to avoid CORS
    const apiUrl = `/api/chat?text=${encodeURIComponent(systemPrompt)}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('API Error');
    }
    
    const data = await response.json();
    return data.reply || "عذراً، المعلم يواجه صعوبة في التفكير حالياً. حاول مرة أخرى.";
  } catch (error) {
    console.error("AI Error:", error);
    if (text.includes('حل') || text.includes('اعطني')) {
      return "لا أستطيع إعطاء الحل المباشر. دعنا نفكر معاً، ما هي أول خطوة تراها مناسبة؟";
    }
    return "يبدو أن هناك مشكلة في الاتصال بالذكاء الاصطناعي (CORS أو السيرفر متوقف). يرجى المحاولة مرة أخرى.";
  }
};
