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
const feedbackRoutes = require("./src/routes/feedbackRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

dotenv.config();
connectDB();

const app = express();

// ================= CORS CONFIG =================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://dev-productivity-platform.vercel.app",
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  try {
    const { hostname } = new URL(origin);

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }

    if (allowedOrigins.includes(origin)) {
      return true;
    }

    if (hostname.endsWith(".vercel.app")) {
      return true;
    }
  } catch (err) {
    return false;
  }

  return false;
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= STATIC =================
const uploadsPath = path.resolve(__dirname, "uploads");
console.log("UPLOADS PATH:", uploadsPath);

app.use("/uploads", express.static(uploadsPath));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/productivity", productivityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);

// ================= TEST ROUTES =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API working",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
