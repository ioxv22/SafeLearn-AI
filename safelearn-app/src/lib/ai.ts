import { useStore } from '../store';

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  const { safeMode, examMode, userLevel, incrementCheatAttempts, messages } = useStore.getState();
  const text = userMessage.trim();
  
  if (!text) return "عفواً، لم أتمكن من قراءة رسالتك.";

  const cheatKeywords = ['حل', 'اعطني', 'اجابة', 'الجواب', 'كامل', 'solve', 'answer', 'تعبت'];
  const isCheating = cheatKeywords.some(kw => text.toLowerCase().includes(kw));
  
  if (isCheating && safeMode && !examMode) {
    incrementCheatAttempts();
  }

  // Get recent context
  const recentMessages = messages.slice(-4).map(m => `${m.role === 'user' ? 'الطالب' : 'المعلم'}: ${m.content}`).join('\n');

  let systemPrompt = "";

  if (examMode) {
    systemPrompt = `أنت نظام تقييم امتحانات (Exam Mode Validator).
السياق السابق:
${recentMessages}

الطالب قدم الآن إجابة أو عبارة: "${text}"
مهمتك:
1. إذا كانت إجابة لسؤال سابق، قيمها.
2. إذا كانت عبارة مستقلة (مثل 4=2+2)، قم بتقييم صحتها كعبارة مستقلة تماماً وتجاهل الأسئلة السابقة.
التقييم يكون: صحيح أو خاطئ مع شرح مبسط جداً. ممنوع إعطاء تلميحات لأسئلة أخرى.`;
  } else {
    systemPrompt = `أنت SafeLearn AI، معلم ذكي أخلاقي مصمم لمساعدة الطلاب. 
قاعدة صارمة جداً: لا تعطِ الإجابة النهائية المباشرة. ساعد الطالب خطوة بخطوة بطرح أسئلة توجيهية.
مستوى الطالب الحالي: ${userLevel === 'weak' ? 'ضعيف (يحتاج أمثلة مبسطة)' : userLevel === 'medium' ? 'متوسط' : 'متقدم (يحتاج تلميحات ذكية فقط)'}.
إذا طلب الطالب حلاً جاهزاً أو حاول استخراج الإجابة، اعتذر بأدب واطلب منه التفكير.
إذا طلب الطالب "شرح فيديو"، أخبره أن بإمكانه استخدام "صانع الشروحات" من القائمة الجانبية لتوليد فيديو تعليمي.

السياق السابق:
${recentMessages}

رسالة الطالب الحالية: ${text}`;
  }

  try {
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
      return "تم استلام إجابتك وتقييمها. تأكد من صحة العمليات الحسابية.";
    }
    if (isCheating) {
      return "لا أستطيع إعطاء الحل المباشر. دعنا نفكر معاً، ما هي أول خطوة تراها مناسبة؟";
    }
    return "يبدو أن هناك مشكلة في الاتصال بالذكاء الاصطناعي (CORS أو السيرفر متوقف). يرجى المحاولة مرة أخرى.";
  }
};
