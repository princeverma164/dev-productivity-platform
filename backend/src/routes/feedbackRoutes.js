const express = require("express");
const router = express.Router();

const { addFeedback, getFeedbacks } = require("../controllers/feedbackController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, upload.single("image"), addFeedback);
router.get("/", getFeedbacks);

module.exports = router;