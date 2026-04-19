const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    console.log("NOTIFICATION FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification updated", notification });
  } catch (error) {
    console.log("NOTIFICATION UPDATE ERROR:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
};
