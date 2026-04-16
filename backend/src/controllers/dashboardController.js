const Task = require("../models/Task");
const User = require("../models/User");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    const tasks = await Task.find({ user: userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const productivityScore =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 🔥 WEEKLY STATS FIXED
    const weeklyStats = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const count = tasks.filter(task => {
        return (
          new Date(task.createdAt).toDateString() === d.toDateString()
        );
      }).length;

      weeklyStats.push({
        date: d.toISOString().split("T")[0],
        tasks: count
      });
    }

    console.log("WEEKLY STATS:", weeklyStats); // 🔥 debug

    res.json({
      user,
      productivityScore,
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks
      },
      github: {
        username: user.githubUsername,
        avatar: "",
        totalCommits: 0
      },
      weeklyStats // ✅ IMPORTANT
    });

  } catch (err) {
    console.log("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardData };