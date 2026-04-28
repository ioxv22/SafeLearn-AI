import { GoogleGenerativeAI } from "@google/generative-ai";
// Re-evaluation comment
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history, safeMode, examMode } = await req.json();

    if (examMode) {
      return NextResponse.json({ text: "عذراً، في وضع الاختبار (Exam Mode) يتم تعطيل المساعد الذكي. يرجى الاعتماد على نفسك في الإجابة." });
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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction + "\nRespond in the student's language (Arabic)."
    });

    const chat = model.startChat({
      history: history.slice(-6).map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "فشل الاتصال بالمعلم الذكي" }, { status: 500 });
  }
}
