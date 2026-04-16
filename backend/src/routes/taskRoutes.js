const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getProductivity,
  getInsights,
  getWeeklyStats,
  getStreak
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const debugMiddleware = (req, res, next) => {
  console.log("🔥 ROUTE HIT:", req.method, req.originalUrl);
  next();
};

router.post(
  "/",
  debugMiddleware,
  authMiddleware,
  createTask
);

router.get(
  "/productivity",
  debugMiddleware,
  authMiddleware,
  getProductivity
);


router.get(
  "/insights",
  debugMiddleware,
  authMiddleware,
  getInsights
);

router.get(
  "/weekly-stats",
  debugMiddleware,
  authMiddleware,
  getWeeklyStats
);

router.get(
  "/streak",
  debugMiddleware,
  authMiddleware,
  getStreak
);

router.get(
  "/",
  debugMiddleware,
  authMiddleware,
  getTasks
);

router.put(
  "/:id",
  debugMiddleware,
  authMiddleware,
  updateTask
);

router.delete(
  "/:id",
  debugMiddleware,
  authMiddleware,
  deleteTask
);


module.exports = router;