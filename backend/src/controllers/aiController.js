const axios = require("axios");

const getAIInsights = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      }
    );

    const reply =
      response.data.candidates[0].content.parts[0].text;

    res.json({ insight: reply });

  } catch (err) {
    console.log("AI ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "AI failed" });
  }
};

module.exports = { getAIInsights };