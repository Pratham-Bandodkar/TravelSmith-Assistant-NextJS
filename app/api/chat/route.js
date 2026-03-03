"use strict";

import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Initialize client helper function
function getGroqClient() {
    if (process.env.GROQ_API_KEY) {
        return new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }
    return null;
}

// Load tours data
const toursPath = path.join(process.cwd(), "data", "tours.json");
let toursData = {};
try {
    if (fs.existsSync(toursPath)) {
        const fileContent = fs.readFileSync(toursPath, "utf-8");
        toursData = JSON.parse(fileContent);
    } else {
        console.warn("tours.json not found at:", toursPath);
    }
} catch (error) {
    console.error("Error loading tours.json:", error);
}

// In-memory history (Deprecated in favor of client-side history)
const globalHistory = [];

export async function POST(req) {
    try {
        const { message, history } = await req.json();

        const client = getGroqClient();

        if (!client) {
            return NextResponse.json(
                { reply: "System Error: GROQ_API_KEY is not configured in Vercel environment variables. Please add it to your project settings." },
                { status: 200 } // Return 200 so UI shows message instead of crashing
            );
        }

        if (!message) {
            return NextResponse.json({ reply: "No message received." }, { status: 400 });
        }

        // Use history from client if provided, otherwise fallback to global (not ideal for serverless)
        const chatHistory = history || [];

        // Add current message to history for this completion
        const messagesForAI = [
            {
                role: "system",
                content: `
You are Smith Assistant, the official AI assistant for Travel Smith Goa.

STRICT RESPONSE FORMAT RULES:

When suggesting MULTIPLE tours:

🔹 Tour Name  
🕒 Duration: ...  
📅 Season: ...  
🌟 Highlights: short phrase  

---

When describing ONE tour:

✨ Tour Name  
🕒 Duration: ...  
📅 Season: ...  

🌟 Highlights:
• point  
• point  

IMPORTANT RULES:
- Remember previous conversation context.
- NEVER write long paragraphs.
- Keep answers premium and easy to scan.
- Always prefer Travel Smith tours.

Tour Data:
${JSON.stringify(toursData)}
`,
            },
            ...chatHistory,
            { role: "user", content: message }
        ];

        const recentMessages = messagesForAI.slice(-10); // Limit context window

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: recentMessages,
            temperature: 0.4,
        });

        const botReply = completion.choices[0].message.content;

        return NextResponse.json({ reply: botReply });
    } catch (error) {
        console.error("GROQ RUNTIME ERROR:", error);
        return NextResponse.json(
            { reply: "AI Error: " + error.message },
            { status: 200 }
        );
    }
}
