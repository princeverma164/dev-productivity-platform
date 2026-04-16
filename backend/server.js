const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://dev-productivity-platform.vercel.app",
].filter(Boolean);

const isAllowedOrigin = (origin = "") => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  return /\.vercel\.app$/i.test(new URL(origin).hostname);
};

// ================= MIDDLEWARE =================
app.use(cors({
  origin(origin, callback) {
    try {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    } catch (error) {
      return callback(new Error("Invalid origin"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
}));

app.use(express.json());

const uploadsPath = path.resolve(__dirname, "uploads");
console.log("UPLOADS PATH:", uploadsPath);

app.use("/uploads", express.static(uploadsPath));

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
app.get("/api/test", (req, res) => {
  res.json({
    message: "working",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});