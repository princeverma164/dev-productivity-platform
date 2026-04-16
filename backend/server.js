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
const corsOptions = {
  origin: "https://dev-productivity-platform.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 
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