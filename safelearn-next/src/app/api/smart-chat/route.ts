import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history, safeMode, examMode } = await req.json();

    if (examMode) {
      return NextResponse.json({ text: "عذراً، في وضع الاختبار (Exam Mode) يتم تعطيل المساعد الذكي. يرجى الاعتماد على نفسك في الإجابة." });
    }

    // Persona & Formatting Instructions
    const systemInstruction = `
      Identity: You are "SafeLearn AI", a premium, friendly, and ethical AI tutor for UAE students.
      Style: Professional, clean, and encouraging. Use bullet points and clear steps.
      Language: Respond primarily in Arabic (United Arab Emirates dialect/Modern Standard) or English if the student asks in English.
      
      ${safeMode ? 
        `SAFE MODE RULES:
         1. NEVER give the final answer directly.
         2. Always guide the student with Socratic questions.
         3. Start with "Let's solve this together step-by-step 🚀".
         4. Break the problem into small, manageable parts.` : 
        `TUTOR MODE: Help the student understand the concepts clearly with examples.`
      }
      
      Constraint: NEVER mention any other AI models (like WormGPT, ChatGPT, etc.). You are only SafeLearn AI.
    `;

    const fullPrompt = `${systemInstruction}\n\nChat History:\n${history.slice(-4).map((h: any) => `${h.role}: ${h.content}`).join("\n")}\n\nStudent Message: ${message}\n\nResponse (Clean & Organized):`;

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
      resultText = data.result || data.reply || data.response || data.text || text;
    } catch (e) {
      resultText = text;
    }

    // Advanced Noise Filtering
    let cleanedText = resultText
      .replace(/WormGPT/gi, "SafeLearn AI")
      .replace(/Sii3/gi, "SafeLearn AI")
      .replace(/\[\s*SIGNAL\s*NOISE\s*DETECTED\s*\]/gi, "")
      .replace(/---\s*AI\s*RESPONSE\s*---/gi, "")
      .trim();

    return NextResponse.json({ text: cleanedText });
  } catch (error: any) {
    console.error("Custom API Error:", error);
    return NextResponse.json({ error: "عذراً، المعلم الذكي يحتاج لحظة للتفكير. يرجى المحاولة مرة أخرى." }, { status: 500 });
  }
}
