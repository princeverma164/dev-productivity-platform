const express = require("express");
const router = express.Router();

const {
  createAchievement,
  getAchievements,
  deleteAchievement,
  updateAchievement
} = require("../controllers/achievementController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
router.post("/", authMiddleware, upload.single("image"), createAchievement);

router.get("/", authMiddleware, getAchievements);
router.delete("/:id", authMiddleware, deleteAchievement);
router.put("/:id", authMiddleware, upload.single("image"), updateAchievement);

module.exports = router;