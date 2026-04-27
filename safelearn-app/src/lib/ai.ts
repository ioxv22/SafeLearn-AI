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
    systemPrompt = `أنت مصحح امتحانات. الطالب يقول: "${text}". قيم إجابته بصحيح أو خطأ فقط وبشكل مباشر مع شرح قصير. لا تعط تلميحات لأسئلة أخرى.`;
  } else if (text.includes("قم بتوليد امتحان")) {
    systemPrompt = `أنت معلم مادة. طلب منك الطالب امتحان. اكتب 3 أسئلة فقط في المادة المطلوبة واطرحها عليه مرقمة بدون إجابات. طلب الطالب: ${text}`;
  } else {
    systemPrompt = `أنت معلم ذكي أخلاقي. المبدأ: لا تعط الإجابة المباشرة أبداً، بل اطرح سؤالاً توجيهياً لمساعدة الطالب. إذا طلب الحل المباشر ارفض بأدب.
السياق السابق:
${recentMessages}
رسالة الطالب: ${text}`;
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
