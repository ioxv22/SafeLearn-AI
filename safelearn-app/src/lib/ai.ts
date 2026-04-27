import { useStore } from '../store';

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  const { safeMode, examMode, userLevel, incrementCheatAttempts } = useStore.getState();
  const text = userMessage.trim();
  
  if (!text) return "عفواً، لم أتمكن من قراءة رسالتك.";

  // Detect Cheat Attempts
  const cheatKeywords = ['حل', 'اعطني', 'اجابة', 'الجواب', 'كامل', 'solve', 'answer', 'تعبت'];
  const isCheating = cheatKeywords.some(kw => text.toLowerCase().includes(kw));
  
  if (isCheating && safeMode && !examMode) {
    incrementCheatAttempts();
  }

  // Define System Prompt based on Mode
  let systemPrompt = "";

  if (examMode) {
    systemPrompt = `أنت نظام تقييم امتحانات (Exam Mode Validator). الطالب قدم إجابة.
مهمتك: فقط تقييم ما إذا كانت إجابته صحيحة أم خاطئة بشكل احترافي، وإعطاؤه درجته، مع شرح بسيط للخطأ إن وجد.
ممنوع إعطاء تلميحات، التقييم يكون نهائياً.
رسالة الطالب (الإجابة): ${text}`;
  } else {
    systemPrompt = `أنت SafeLearn AI، معلم ذكي أخلاقي مصمم لمساعدة الطلاب. 
قاعدة صارمة جداً: لا تعطِ الإجابة النهائية أو الحل المباشر أبداً.
عليك مساعدة الطالب خطوة بخطوة من خلال طرح أسئلة توجيهية تجعله يفكر بنفسه.
مستوى الطالب الحالي: ${userLevel === 'weak' ? 'ضعيف (يحتاج أمثلة مبسطة جداً)' : userLevel === 'medium' ? 'متوسط (يحتاج توجيه للخطوة القادمة)' : 'متقدم (يحتاج تلميحات ذكية فقط)'}.
إذا طلب الطالب حلاً جاهزاً، اعتذر بأدب واطلب منه التفكير في الخطوة الأولى.
إذا كان وضع الأمان مفعل (${safeMode})، يجب أن تكون صارماً أكثر في عدم كشف الحل.

سؤال أو رد الطالب: ${text}`;
  }

  try {
    // API Call
    const apiUrl = `/api/chat?text=${encodeURIComponent(systemPrompt)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('API Error');
    }
    
    const data = await response.json();
    return data.reply || "عذراً، المعلم يواجه صعوبة في التفكير حالياً.";
  } catch (error) {
    console.error("AI Error:", error);
    if (examMode) {
      return "تم استلام إجابتك. جاري تقييمها في النظام.";
    }
    if (isCheating) {
      return "لا أستطيع إعطاء الحل المباشر. دعنا نفكر معاً، ما هي أول خطوة تراها مناسبة؟";
    }
    return "يبدو أن هناك مشكلة في الاتصال بالذكاء الاصطناعي (CORS أو السيرفر متوقف). يرجى المحاولة مرة أخرى.";
  }
};
