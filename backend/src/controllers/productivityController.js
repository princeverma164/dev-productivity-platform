const Task = require("../models/Task");
const User = require("../models/User");
const axios = require("axios");

const getProductivityScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // 🔹 Today's date
    const today = new Date().toISOString().split("T")[0];

    // 🔹 Tasks completed today
    const tasks = await Task.find({
      user: req.user.id,
      completed: true,
      updatedAt: {
        $gte: new Date(today)
      }
    });

    const taskPoints = tasks.length * 10;

    // 🔹 GitHub contribution (reuse logic)
    let githubPoints = 0;

    if (user.githubUsername) {
      const query = `
      query {
        user(login: "${user.githubUsername}") {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
      `;

      const response = await axios.post(
        "https://api.github.com/graphql",
        { query },
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
          }
        }
      );

      const weeks =
        response.data.data.user.contributionsCollection.contributionCalendar.weeks;

      let todayContribution = 0;

      weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          if (day.date === today) {
            todayContribution = day.contributionCount;
          }
        });
      });

      githubPoints = todayContribution * 15;
    }

    const totalScore = taskPoints + githubPoints;

    res.json({
      taskPoints,
      githubPoints,
      totalScore
    });

  } catch (error) {
    res.status(500).json({
      message: "Error calculating productivity score"
    });
  }
};

module.exports = { getProductivityScore };