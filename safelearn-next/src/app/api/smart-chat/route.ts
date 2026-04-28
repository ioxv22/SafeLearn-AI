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
      : `You are SafeLearn AI, a premium ethical tutor. 
         Guide the student step-by-step. 
         Always encourage reasoning and deep understanding.`;

    // Direct Gemini API call (Advanced Version)
    const contents = [
      {
        role: "user",
        parts: [{ text: systemInstruction + "\nRespond in Arabic." }]
      },
      ...history.slice(-8).map((h: any) => ({
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
      throw new Error(data.error.message);
    }

    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من معالجة طلبك.";
    
    // Clean any unwanted metadata
    aiText = aiText.replace(/K_I_L_W_A10/g, "SafeLearn AI").replace(/KILWA/g, "SafeLearn AI");

    return NextResponse.json({ text: aiText });
  } catch (error: any) {
    console.error("Gemini Direct Error:", error);
    return NextResponse.json({ error: "فشل الاتصال بالمعلم الذكي" }, { status: 500 });
  }
}
