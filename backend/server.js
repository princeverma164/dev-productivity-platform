const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productivityRoutes = require("./src/routes/productivityRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const achievementRoutes = require("./src/routes/achievementRoutes");

dotenv.config();
connectDB();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "https://dev-productivity-platform.vercel.app",
  credentials: true,
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://dev-productivity-platform.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

const uploadsPath = path.resolve(__dirname, "uploads");
console.log("UPLOADS PATH:", uploadsPath);

app.use("/uploads", express.static("uploads"));

// ROUTES 
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/productivity", productivityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/feedback", require("./src/routes/feedbackRoutes"));

//  TEST 
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/test", (req, res) => {
  res.send("Test route working");
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});