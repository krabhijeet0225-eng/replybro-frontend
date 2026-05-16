const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// SECURITY
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Static frontend

app.use(express.static("assets-folder"));

// Demo user
const USERS = {
  admin: "1234",
};

// HOME
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (USERS[username] && USERS[username] === password) {
    return res.json({
      success: true,
      message: "Login successful",
      token: "demo-token-" + Date.now(),
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

// GENERATE
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt required",
    });
  }

  try {
    const reply =
      "AI Reply: " +
      prompt +
      " (this will be replaced with Gemini response)";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});G
