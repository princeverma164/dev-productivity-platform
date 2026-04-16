const Achievement = require("../models/Achievement");

// ================= CREATE =================
const createAchievement = async (req, res) => {
  try {
    console.log("FILE:", req.file); 

    const { title, description } = req.body;

    const achievement = await Achievement.create({
      user: req.user.id,
      title,
      description,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json(achievement);

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: "Error creating achievement" });
  }
};

// ================= GET =================
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(achievements);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching achievements" });
  }
};

// ================= DELETE =================
const deleteAchievement = async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting" });
  }
};

// ================= UPDATE =================
const updateAchievement = async (req, res) => {
  try {
    const { title, description } = req.body;

    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Not found" });
    }

    achievement.title = title || achievement.title;
    achievement.description = description || achievement.description;

    if (req.file) {
      achievement.image = req.file.path; 
    }

    const updated = await achievement.save();

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating" });
  }
};

module.exports = {
  createAchievement,
  getAchievements,
  deleteAchievement,
  updateAchievement // ✅ ADD THIS
};