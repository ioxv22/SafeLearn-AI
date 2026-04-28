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
         اطرح أسئلة توجيهية لتشجيع الطالب على التفكير.`
      : `أنت المعلم الذكي SafeLearn AI. ساعد الطالب خطوة بخطوة بطريقة تعليمية وأخلاقية.`;

    const fullPrompt = `${systemInstruction}\nالسياق: ${history.slice(-3).map((h: any) => h.content).join(" | ")}\nالسؤال: ${message}`;

    // New API from User (sii3.top)
    const formData = new FormData();
    formData.append("key", "568A10DBF87C957AEE886658");
    formData.append("prompt", fullPrompt);

    const response = await fetch("https://sii3.top/api/v2/chat", {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    let resultText = "";

    try {
      const data = JSON.parse(text);
      // Try common response fields
      resultText = data.result || data.reply || data.response || data.text || text;
    } catch (e) {
      // If not JSON, use the raw text
      resultText = text;
    }

    // Clean any branding from the external API
    const cleanedText = resultText
      .replace(/WormGPT/gi, "SafeLearn AI")
      .replace(/Sii3/gi, "SafeLearn AI");

    return NextResponse.json({ text: cleanedText });
  } catch (error: any) {
    console.error("Custom API Error:", error);
    return NextResponse.json({ error: "فشل الاتصال بالمعلم الذكي: " + error.message }, { status: 500 });
  }
}
