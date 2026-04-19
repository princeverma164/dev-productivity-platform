const axios = require("axios");
const Task = require("../models/Task");
const { buildCoachSummary } = require("../services/coachService");

const getAIInsights = async (req, res) => {
  try {
    const { message } = req.body;
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(30);
    const coachData = buildCoachSummary(tasks);

    const prompt = `
You are an AI productivity coach for a task management app.
Reply in a concise, practical, motivating tone.

User message: ${message}

Current weekly report:
- Productivity Score: ${coachData.weeklyReport.productivityScore}%
- Completed Tasks: ${coachData.weeklyReport.completedTasks}
- Pending Tasks: ${coachData.weeklyReport.pendingTasks}
- Overdue Tasks: ${coachData.weeklyReport.overdueTasks}
- Due Today: ${coachData.weeklyReport.dueToday}
- Best Work Window: ${coachData.weeklyReport.bestWindow}

Coach suggestions already generated:
${coachData.suggestions.map((item, index) => `${index + 1}. ${item}`).join("\n")}

Give:
1. One short insight
2. One practical next action
3. One motivational closing line
    `.trim();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;

    res.json({
      insight: reply,
      weeklyReport: coachData.weeklyReport,
      suggestions: coachData.suggestions,
    });
  } catch (err) {
    console.log("AI ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "AI failed" });
  }
};

module.exports = { getAIInsights };
