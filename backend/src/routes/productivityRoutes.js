const express = require("express");
const router = express.Router();
const { getProductivityScore } = require("../controllers/productivityController");
const auth = require("../middleware/authMiddleware");

router.get("/score", auth, getProductivityScore);

module.exports = router;