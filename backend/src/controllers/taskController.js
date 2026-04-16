const Task = require("../models/Task");


// ================= CREATE TASK =================

const createTask = async (req, res) => {
  console.log("🔥 API HIT");
  console.log("BODY:", req.body);
  console.log("USER:", req.user);
  try {
    console.log("REQ USER:", req.user); // 👈 debug

    const { title, description, deadline, priority } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not found in token" });
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      priority: priority || "medium",
      completed: false,
      user: req.user.id   
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    console.log("CREATE TASK ERROR:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// ================= GET TASKS =================
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json(tasks);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE TASK (TOGGLE COMPLETE) =================
const updateTask = async (req, res) => {
  try {
    const { completed } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ FIXED: completed field use
    if (completed !== undefined) {
      task.completed = completed;
    }

    const updatedTask = await task.save();

    res.json({
      message: "Task updated",
      task: updatedTask
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= DELETE TASK =================
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= PRODUCTIVITY =================
const getProductivity = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    const productivityScore =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.json({
      totalTasks,
      completedTasks,
      productivityScore: Math.round(productivityScore)
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= INSIGHTS =================
const getInsights = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    const productivity =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    let message = "";

    if (productivity === 100) {
      message = "Excellent work! 🚀";
    } else if (productivity >= 70) {
      message = "Good job 👍";
    } else if (productivity >= 40) {
      message = "Keep improving 💪";
    } else {
      message = "Stay consistent ⚡";
    }

    res.json({
      totalTasks,
      completedTasks,
      productivity: Math.round(productivity),
      insight: message
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= WEEKLY STATS =================
const getWeeklyStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    const stats = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const count = tasks.filter((task) => {
        return (
          task.completed &&
          new Date(task.createdAt).toDateString() === d.toDateString()
        );
      }).length;

      return {
        date: d.toISOString().split("T")[0],
        tasks: count,
      };
    }).reverse();

    res.json(stats);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= STREAK =================
const getStreak = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      completed: true
    }).sort({ createdAt: -1 });

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < tasks.length; i++) {
      const taskDate = new Date(tasks[i].createdAt);

      const diffDays = Math.floor(
        (currentDate - taskDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    res.json({ streak });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getProductivity,
  getInsights,
  getWeeklyStats,
  getStreak,
};