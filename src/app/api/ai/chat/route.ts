import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                maxOutputTokens: 1000,
            },
            systemInstruction: {
                role: "system",
                parts: [{ text: "You are Folio AI, a strategic investment and real estate portfolio assistant. You help users with financial planning, property analysis, and investment strategies. Keep your answers concise, professional, and data-driven." }],
            },
        });

        // Convert messages to Gemini format
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
    }
}
