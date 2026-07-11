import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { AccessToken, RoomConfiguration, RoomAgentDispatch } from "livekit-server-sdk";
import { randomUUID } from "crypto";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Matches the agent_name registered by speaking-agent/agent.py's @server.rtc_session(...)
const LIVEKIT_AGENT_NAME = "ielts-examiner";

app.get("/api/livekit-token", async (req, res) => {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;

  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return res.status(500).json({
      error: "Server is missing LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET.",
    });
  }

  const identity = typeof req.query.identity === "string" ? req.query.identity.trim() : "";
  if (!identity) {
    return res.status(400).json({ error: "A candidate name is required." });
  }

  const roomName = `ielts-${identity.toLowerCase().replace(/\s+/g, "-")}-${randomUUID().slice(0, 6)}`;

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    name: identity,
  });
  at.addGrant({ roomJoin: true, room: roomName });
  at.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: LIVEKIT_AGENT_NAME })],
  });

  const token = await at.toJwt();

  res.json({ token, url: LIVEKIT_URL, room: roomName });
});

app.post("/api/generate", async (req, res) => {
  const { prompt, temperature, image } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is not set in environment variables." });
  }

  try {
    const content: any[] = [{ type: "text", text: prompt }];
    
    if (image) {
      content.push({
        type: "image_url",
        image_url: {
          url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`
        }
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "IELTS Writing Master",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert IELTS examiner and trainer, specialized in both Writing and Reading modules. If an image is provided, analyze it accurately for IELTS Task 1 requirements." },
          { role: "user", content: content }
        ],
        temperature: temperature,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    res.status(500).json({ error: "Failed to fetch from OpenRouter" });
  }
});

app.post("/api/chatbot", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const systemInstruction = `You are "IELTS Master AI", a highly specialized, friendly, and expert IELTS AI assistant. Your mission is to assist users ONLY with:
1. IELTS exam preparation (Reading, Writing, Listening, Speaking sections), strategies, band descriptors, and actionable advice on how to study and achieve high bands (e.g., Band 7, 8, 9).
2. Using this website ("IELTS MASTER") and explaining its tools and features.
3. English language learning and helper tasks (e.g., translating text, correcting grammar, proofreading, explaining spelling or punctuation, and teaching advanced vocabulary).

Context about this website ("IELTS MASTER") created by Sowrov & Esrat:
- **Writing Module**: Practice Academic Writing Task 1 (visual description) and Task 2 (essay writing). Enter questions, upload images (which are analyzed by the AI), and generate real IELTS examiner-style answers graded at multiple band scores (6.5, 7.5, 8+) with detailed feedback, patterns, and vocabulary guides.
- **Reading Module**: Interactive practice tests with reading passages, multiple choice questions, fill in the blanks, and True/False/Not Given questions. Includes instant explanations and correct answers to help students learn.
- **Listening Module**: Clean, modern interface to practice IELTS Listening with audio transcripts and exercises.
- **Speaking Module**: Real-time voice-to-voice mock interview with an interactive AI Examiner powered by LiveKit. Speak directly with the examiner "ielts-examiner" to practice and receive feedback.
- **Dashboard**: Track overall progress, band scores per section, grammar analysis, recent scores, and overall preparation stats.

Your guidelines:
- If a user asks a non-IELTS or non-English question that is completely unrelated to the exam, the language, or this website, politely redirect them back to IELTS topics.
- You can speak in English or Bengali (or translate between them) based on what the user uses. Many of our users speak Bengali as this platform is crafted by Sowrov & Esrat.
- Provide structured, scannable answers with bullet points, clear headings, and bold key terms.
- Be encouraging, professional, and act like a world-class IELTS tutor.
- Do not mention technical files, databases, or API details. Keep it user-focused.`;

  // Try Gemini API first
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const contents = [
        ...history.map((item: any) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini API Error in Chatbot:", error);
      // Fall through to OpenRouter if Gemini fails and OpenRouter is available
    }
  }

  // Fallback to OpenRouter (e.g. gpt-4o-mini)
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    try {
      const messages = [
        { role: "system", content: systemInstruction },
        ...history.map((item: any) => ({
          role: item.role === "user" ? "user" : "assistant",
          content: item.text,
        })),
        { role: "user", content: message },
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "IELTS Master AI Chatbot",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return res.json({ text: data.choices[0].message.content });
      }
    } catch (error) {
      console.error("OpenRouter Fallback Error in Chatbot:", error);
    }
  }

  return res.status(500).json({ error: "No API keys available or generation failed." });
});

// For production static serving on Vercel
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

export default app;
