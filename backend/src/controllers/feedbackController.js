const Feedback = require("../models/Feedback");
const User = require("../models/User");

const addFeedback = async (req, res) => {
  try {
    const { message, rating } = req.body;
    const user = await User.findById(req.user?.id).select("name");

    const fb = await Feedback.create({
      name: user?.name || "User",
      message: message || "No message",
      rating: rating ? Number(rating) : 5,
      image: req.file?.path || "",
    });

    res.json(fb);
  } catch (err) {
    console.log("FEEDBACK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
};

module.exports = { addFeedback, getFeedbacks };