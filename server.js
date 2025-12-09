const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage of messages
let messages = []; // { id, role: "user" | "assistant", content, createdAt }

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend working with OpenAI + fallback");
});

// Get full chat history
app.get("/api/messages", (req, res) => {
  res.json({ messages });
});

// Handle new user message
app.post("/api/messages", async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  const now = Date.now();

  const userMessage = {
    id: now,
    role: "user",
    content,
    createdAt: new Date().toISOString(),
  };
  messages.push(userMessage);

  let aiText;

  try {
    // 🔹 Try REAL AI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a friendly helpful assistant." },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    aiText =
      completion.choices?.[0]?.message?.content ||
      "I could not generate a response.";
  } catch (err) {
    // 🔹 If ANYTHING goes wrong with OpenAI, log it & use fallback text
    console.error("OpenAI error:", err.response?.data || err.message || err);

    aiText = `Fallback reply (AI error). I still received your message: "${content}"`;
  }

  const aiMessage = {
    id: now + 1,
    role: "assistant",
    content: aiText,
    createdAt: new Date().toISOString(),
  };
  messages.push(aiMessage);

  // ✅ Always send 200 OK with messages (no 500 here)
  res.json({ messages });
});

app.listen(PORT, () => {
  console.log(`🚀 Server with real AI + fallback running on port ${PORT}`);
});
