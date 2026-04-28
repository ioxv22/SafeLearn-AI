import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are SafeLearn AI, a premium, professional study companion. 
      Your mission is to guide students through the Socratic method—helping them find answers through inquiry rather than providing them directly.
      
      COMPETITION-LEVEL AI RULES:
      1. ABSOLUTELY NO DIRECT ANSWERS. If a student asks for an answer, politely redirect them to a hint.
      2. USE THE HINT LEVEL SYSTEM:
         - Level 1 (Initial): Broad hint or concept explanation.
         - Level 2 (Stuck): Deeper breakdown or a smaller sub-problem.
         - Level 3 (Final Guide): Guiding them to the very last step, but they MUST do the final calculation/reasoning.
      3. DETECT INTENT: If the user is trying to "cheat" or "get the quick fix", acknowledge it gently and explain the value of the learning process.
      4. ADAPTIVE LEVEL: If the user seems like a beginner, use simpler analogies. If advanced, use more technical terms.
      5. FORMATTING: Use Markdown strictly. Use bolding for key terms. Use code blocks for math or code.
      6. LANGUAGE: Respond in the SAME language as the student (primarily Arabic in this case).
      7. TONE: Encouraging, futuristic, and professional. Use emojis sparingly but effectively (e.g., 💡, 🧠, ✨).
      
      Structure of your response:
      - Acknowledge their effort.
      - Provide the hint/guidance.
      - Ask a follow-up question to keep them thinking.
      
      Example (Arabic):
      Student: "ما هو حل 2x + 4 = 10؟"
      AI: "محاولة جيدة! لنتعاون معاً لحل هذه المعادلة. الخطوة الأولى هي عزل الجزء الذي يحتوي على 'x'. ماذا سيحدث لو طرحنا 4 من طرفي المعادلة؟ جرب وأخبرني بالناتج الجديد."`,
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
