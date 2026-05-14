const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ---------------- SECURITY ----------------
app.use(helmet());
app.use(cors());
app.use(express.json());

// limit requests (anti abuse)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Serve static files
app.use(express.static("public"));

// ---------------- SIMPLE AUTH (demo SaaS) ----------------
const USERS = {
  admin: "1234",
};

// ---------------- HOME ----------------
app.get("/", (req, res) => {
  res.send("🚀 SaaS Running Securely");
});

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (USERS[username] && USERS[username] === password) {
    return res.json({
      success: true,
      message: "Login successful",
      token: "demo-token-" + Date.now(),
    });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ---------------- AI GENERATE (Mock / Gemini ready) ----------------
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    // 👉 Yaha tu Gemini API connect karega later
    // Example placeholder response:
    const reply =
      "AI Reply: " +
      prompt +
      " (this will be replaced with Gemini response)";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
