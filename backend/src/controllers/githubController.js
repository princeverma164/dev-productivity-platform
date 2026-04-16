const axios = require("axios");
const User = require("../models/User");

const getGithubStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.githubUsername) {
      return res.status(400).json({
        message: "GitHub username not set"
      });
    }

    // 🔥 GitHub API call
    const response = await axios.get(
      `https://api.github.com/users/${user.githubUsername}/events`
    );

    const events = response.data;

    // 🔥 Step 1: Sirf commit events (PushEvent)
    const commitDates = events
      .filter(event => event.type === "PushEvent")
      .map(event => new Date(event.created_at).toDateString());

    // 🔥 Step 2: Unique dates
    const uniqueDates = [...new Set(commitDates)];

    // 🔥 Step 3: Sort latest first
    uniqueDates.sort((a, b) => new Date(b) - new Date(a));

    // 🔥 Step 4: Streak calculate
    let streak = 0;
    let today = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const eventDate = new Date(uniqueDates[i]);

      const diffDays = Math.floor(
        (today - eventDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    // 🔥 Final response
    res.json({
      githubStreak: streak,
      activeDays: uniqueDates.length
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error fetching GitHub data"
    });
  }
};

module.exports = { getGithubStreak };