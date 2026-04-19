const Task = require("../models/Task");
const User = require("../models/User");
const { buildCoachSummary, syncNotifications } = require("../services/coachService");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    const tasks = await Task.find({ user: userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const productivityScore =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const weeklyStats = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const count = tasks.filter(
        (task) => new Date(task.createdAt).toDateString() === d.toDateString()
      ).length;

      weeklyStats.push({
        date: d.toISOString().split("T")[0],
        tasks: count,
      });
    }

    const completedByDate = tasks
      .filter((task) => task.completed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let streak = 0;

    for (let i = 0; i < completedByDate.length; i++) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const taskDate = new Date(completedByDate[i].createdAt);
      taskDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak += 1;
      } else if (diffDays > streak) {
        break;
      }
    }

    const coachData = buildCoachSummary(tasks);
    const notifications = await syncNotifications({ userId, tasks, streak });

    res.json({
      user,
      productivityScore,
      streak,
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
      },
      github: {
        username: user.githubUsername,
        avatar: "",
        totalCommits: 0,
      },
      weeklyStats,
      coach: {
        weeklyReport: coachData.weeklyReport,
        suggestions: coachData.suggestions,
        missedDeadlines: coachData.overdueTasks.map((task) => ({
          id: task._id,
          title: task.title,
          deadline: task.deadline,
          priority: task.priority,
        })),
      },
      notifications,
    });
  } catch (err) {
    console.log("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardData };
