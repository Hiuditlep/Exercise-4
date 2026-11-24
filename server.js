// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); // Cho phép gọi cross-origin từ Live Server (port 5501)
app.use(express.json());

const db = {
  general: [
    {
      id: "m1",
      author: "Albert Einstein",
      text: "SPA architecture looking clean!",
      time: "10:00",
    },
  ],
  "react-architecture": [
    {
      id: "m2",
      author: "Tran Vinh Khiem",
      text: "Remember to abort stale fetch requests.",
      time: "10:05",
    },
  ],
  "pubg-telemetry": [
    {
      id: "m3",
      author: "Cerberus Esports",
      text: "Erangel circle closing in 30s.",
      time: "10:12",
    },
  ],
};

app.get("/api/channels/:channelId/messages", (req, res) => {
  const { channelId } = req.params;
  res.json(db[channelId] || []);
});

app.post("/api/channels/:channelId/messages", (req, res) => {
  const { channelId } = req.params;
  const { author, text } = req.body || {};

  // Strict POST Payload Validation (Exercise 1.7.1)
  if (typeof author !== "string" || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid payload types." });
  }
  const cleanText = text.trim();
  if (cleanText.length === 0 || cleanText.length > 300) {
    return res
      .status(400)
      .json({ error: "Message must be between 1 and 300 characters." });
  }

  if (!db[channelId]) db[channelId] = [];
  const newMsg = {
    id: `m-${Date.now()}`,
    author: author.trim() || "Anonymous",
    text: cleanText,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  db[channelId].push(newMsg);
  res.status(201).json(newMsg);
});

app.listen(3001, () => {
  console.log("Express API running on http://localhost:3001");
});
