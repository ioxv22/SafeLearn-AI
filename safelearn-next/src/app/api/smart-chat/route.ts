import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history, safeMode, examMode } = await req.json();

    if (examMode) {
      return NextResponse.json({ text: "عذراً، في وضع الاختبار (Exam Mode) يتم تعطيل المساعد الذكي. يرجى الاعتماد على نفسك في الإجابة." });
    }

    const systemInstruction = safeMode 
      ? `أنت المعلم الذكي SafeLearn AI في وضع الأمان (Safe Mode). 
         القاعدة الصارمة: لا تعطي إجابات نهائية أبداً. قدم تلميحات فقط.
         ابدأ دائماً بـ "لنحلها خطوة بخطوة معاً". 
         اطرح أسئلة توجيهية لتشجيع الطالب على التفكير. 
         السياق السابق للمحادثة: ${history.slice(-4).map((h: any) => h.content).join(" | ")}`
      : `أنت المعلم الذكي SafeLearn AI. ساعد الطالب خطوة بخطوة. 
         السياق السابق: ${history.slice(-4).map((h: any) => h.content).join(" | ")}`;

    const fullPrompt = `${systemInstruction}\nرسالة الطالب الحالية: ${message}`;

    // Using the New KILWA-CHAT API
    const response = await fetch(
      `http://de3.bot-hosting.net:21007/kilwa-chat?text=${encodeURIComponent(fullPrompt)}`,
      { method: "GET" }
    );

    const data = await response.json();
    
    if (data.status !== "success") {
      console.error("KILWA API Error:", data);
      throw new Error("فشل في الحصول على رد من السيرفر");
    }

    // Replace any mention of the developer with the site name
    const aiText = data.reply || "عذراً، لم أتمكن من معالجة طلبك.";
    const cleanedText = aiText.replace(/K_I_L_W_A10/g, "SafeLearn AI").replace(/KILWA/g, "SafeLearn AI");

    return NextResponse.json({ text: cleanedText });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "فشل الاتصال بالمعلم الذكي: " + error.message }, { status: 500 });
  }
}
