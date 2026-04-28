import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history, safeMode, examMode } = await req.json();

    if (examMode) {
      return NextResponse.json({ text: "عذراً، في وضع الاختبار (Exam Mode) يتم تعطيل المساعد الذكي. يرجى الاعتماد على نفسك في الإجابة." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const systemInstruction = safeMode 
      ? `You are SafeLearn AI in SAFE MODE. 
         STRICT RULE: Only provide hints. NEVER give final answers. 
         Use the Socratic method: ask questions back to the student. 
         Start with "Let's solve it step by step together".
         Break everything into tiny steps. 
         If they ask for the answer, say "I cannot give the final answer, but I can help you reach it."`
      : `You are SafeLearn AI, an ethical tutor. 
         Guide the student step-by-step. 
         Do not give direct answers if they seem to be cheating.
         Always encourage reasoning.`;

    // Format history for Gemini API
    const contents = [
      {
        role: "user",
        parts: [{ text: systemInstruction + "\nRespond in Arabic." }]
      },
      ...history.slice(-10).map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }]
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API Error Detail:", data.error);
      throw new Error(data.error.message);
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من معالجة طلبك.";

    return NextResponse.json({ text: aiText });
  } catch (error: any) {
    console.error("Gemini Fetch Error:", error);
    return NextResponse.json({ error: "فشل الاتصال بالمعلم الذكي: " + error.message }, { status: 500 });
  }
}
