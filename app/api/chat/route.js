"use strict";

import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Initialize client lazily or safely
let client = null;
try {
    if (process.env.GROQ_API_KEY) {
        client = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }
} catch (e) {
    console.error("Groq initialization error:", e);
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

// In-memory history (Reset on cold start)
const conversationHistory = [];

export async function POST(req) {
    try {
        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { reply: "System Error: GROQ_API_KEY is not configured in Vercel environment variables." },
                { status: 200 } // Return 200 so UI shows message instead of crashing
            );
        }

        if (!client) {
            return NextResponse.json(
                { reply: "System Error: Failed to initialize AI client." },
                { status: 200 }
            );
        }

        const { message } = await req.json();
        if (!message) {
            return NextResponse.json({ reply: "No message received." }, { status: 400 });
        }

        conversationHistory.push({
            role: "user",
            content: message,
        });

        const recentHistory = conversationHistory.slice(-6);

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
You are Smith Assistant, the official AI assistant for Travel Smith Goa.

STRICT RESPONSE FORMAT RULES:
... (Rest of system prompt)
Tour Data:
${JSON.stringify(toursData)}
`,
                },
                ...recentHistory,
            ],
            temperature: 0.4,
        });

        const botReply = completion.choices[0].message.content;

        conversationHistory.push({
            role: "assistant",
            content: botReply,
        });

        return NextResponse.json({ reply: botReply });
    } catch (error) {
        console.error("GROQ RUNTIME ERROR:", error);
        return NextResponse.json(
            { reply: "AI Error: " + error.message },
            { status: 200 }
        );
    }
}
