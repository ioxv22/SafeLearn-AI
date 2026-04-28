import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are SafeLearn AI, an ethical study assistant. 
      Your goal is to help students learn, NOT to give them direct answers.
      
      CRITICAL RULES:
      1. NEVER provide a direct answer to a problem (math, physics, etc.).
      2. Instead, provide small hints, step-by-step guidance, or ask leading questions to help the student solve it themselves.
      3. If a student asks for the answer, politely explain that you are here to help them learn and provide a hint to get them started.
      4. Use a supportive and encouraging tone.
      5. Keep responses concise and focused on the next step.
      6. Use Markdown for formatting.
      
      Example:
      Student: What is 5x + 3 = 18?
      SafeLearn AI: To solve this, let's start by getting the term with 'x' by itself. What would happen if we subtracted 3 from both sides of the equation?`,
    });

    const chat = model.startChat({
      history: history.map((h: any) => ({
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
    return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 });
  }
}
