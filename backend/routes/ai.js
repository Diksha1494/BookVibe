const express = require("express");
const axios = require("axios");
require("dotenv").config();
const Recommendation = require("../models/Recommendation");

const router = express.Router();

router.post("/recommend", async (req, res) => {
  const { userHistory } = req.body;

  const prompt = `Suggest 5 books for a user who liked: ${userHistory}. Include title and author.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful book recommendation assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    const recommendations = response.data.choices[0].message.content.trim();

    // Save to DB
    const saved = new Recommendation({
      history: userHistory,
      result: recommendations,
    });

    await saved.save();

    res.json({ recommendations });

  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get AI recommendations" });
  }
});

module.exports = router;
