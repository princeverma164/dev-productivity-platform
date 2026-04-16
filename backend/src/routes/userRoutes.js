const express = require("express");
const router = express.Router();
const { getAIInsights } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

console.log("🔥 USER ROUTES LOADED");
const {
  registerUser,
  loginUser,
  updateGithubUsername,
  updateProfile 
} = require("../controllers/userController");

const { getGithubStreak } = require("../controllers/githubController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/github", authMiddleware, updateGithubUsername);
router.put("/profile", authMiddleware, upload.single("image"), updateProfile);
router.post("/ai-insights", authMiddleware, getAIInsights);
router.get("/github/streak", authMiddleware, getGithubStreak);

module.exports = router;