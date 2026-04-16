import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";
import Achievements from "./Achievements";

import logo from "../assets/logo.png";
import dashboardBg from "../assets/dashboard-bg.jpg";
import tasksBg from "../assets/tasks-bg.jpg";
import achievementBg from "../assets/achievement-bg.jpg";
import analyticsBg from "../assets/analytics-bg.jpg";

import AIChat from "../components/AIChat";
import FeedbackWidget from "../components/FeedbackWidget";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [githubUsername, setGithubUsername] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // 🔥 BACKGROUND SWITCH
  const getBackground = () => {
    switch (activeTab) {
      case "tasks":
        return tasksBg;
      case "achievements":
        return achievementBg;
      case "analytics":
        return analyticsBg;
      default:
        return dashboardBg;
    }
  };

  // 🔥 FETCH DATA
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
      setGithubUsername(res.data.user.githubUsername || "");
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔥 SAVE GITHUB
  const saveGithub = async () => {
    try {
      await API.put("/user/github", { githubUsername });
      alert("GitHub Connected ✅");
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div
      className={darkMode ? "dashboard dark" : "dashboard"}
      style={{
        backgroundImage: `url(${getBackground()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* 🔥 NAVBAR */}
      <div className="navbar">

  {/* LOGO */}
  <img src={logo} alt="logo" className="logo" />

  {/* TABS */}
  <div className="tabs">
    <span
      className={activeTab === "dashboard" ? "active" : ""}
      onClick={() => setActiveTab("dashboard")}
    >
      Dashboard
    </span>

    <span
      className={activeTab === "tasks" ? "active" : ""}
      onClick={() => setActiveTab("tasks")}
    >
      Tasks
    </span>

    <span
      className={activeTab === "achievements" ? "active" : ""}
      onClick={() => setActiveTab("achievements")}
    >
      Achievements
    </span>

    <span
      className={activeTab === "analytics" ? "active" : ""}
      onClick={() => setActiveTab("analytics")}
    >
      Analytics
    </span>
  </div>

   {/* RIGHT SIDE */}
   <div className="nav-right">
    <div
      className="profile"
      onClick={() => navigate("/profile")}
     >
      👤 {data.user.name}
     </div>
     <button
      className="theme-btn"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "☀️" : "🌙"}
     </button>

      {/* LOGOUT */}
     <button
       className="logout-btn"
       onClick={handleLogout}
     >
        Logout
     </button>

    </div>

   </div>

      {/* 🔥 CONTENT */}
      <div className="content">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h2>Welcome, {data.user.name} 👋</h2>

            <div className="cards">

              {/* PRODUCTIVITY */}
              <div className="card glass-card">
                <h3>📊My Productivity</h3>

                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${data.productivityScore || 0}%` }}
                  />
                </div>

                <p className="progress-text">
                  {data.productivityScore || 0}%
                </p>
              </div>

              {/* TASK */}
              <div className="card glass-card">
                <h3>📝My Tasks</h3>

                <div className="dual-bar">
                  <div
                    className="completed-bar"
                    style={{
                      width: data.tasks?.total
                        ? (data.tasks.completed / data.tasks.total) * 100 + "%"
                        : "0%"
                    }}
                  />

                  <div
                    className="pending-bar"
                    style={{
                      width: data.tasks?.total
                        ? (data.tasks.pending / data.tasks.total) * 100 + "%"
                        : "0%"
                    }}
                  />
                </div>

                <p>
                  {data.tasks?.completed || 0} Done / {data.tasks?.pending || 0} Pending
                </p>
              </div>

              {/* GITHUB */}
              <div className="card glass-card">
                <h3>🔥 GitHub</h3>

                {data.github?.username ? (
                  <>
                    <img src={data.github.avatar} alt="" />
                    <p>{data.github.username}</p>
                    <p>{data.github.totalCommits} commits</p>

                    <a href={`https://github.com/${data.github.username}`} target="_blank" rel="noreferrer">
                      View Profile 🔗
                    </a>
                  </>
                ) : (
                  <p>Not Connected ❌</p>
                )}
              </div>

            </div>

            {/* GITHUB INPUT */}
            <div style={{ marginTop: "20px" }}>
              <div className="github-input">
              <input
              placeholder="Enter GitHub username"
              value={githubUsername}
               onChange={(e) => setGithubUsername(e.target.value)}
            />

  <button className="github-save-btn" onClick={saveGithub}>
    🔗 Save
  </button>
</div>
            </div>

            {/* HEATMAP */}
            <div className="heatmap">
              <h3>🔥 Last 7 Days Activity</h3>

              <div className="heatmap-labels">
                {data.weeklyStats?.map((day, i) => {
                  const d = new Date(day.date);
                  return (
                    <span key={i}>
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  );
                })}
              </div>

              <div className="heatmap-grid">
                {data.weeklyStats?.map((day, index) => (
                  <div
                    key={index}
                    className="heatmap-box"
                    style={{
                      background:
                        day.tasks === 0
                          ? "#e5e7eb"
                          : day.tasks < 2
                          ? "#86efac"
                          : day.tasks < 4
                          ? "#22c55e"
                          : "#166534"
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* TASKS */}
        {activeTab === "tasks" && <TasksSection />}

        {/* ACHIEVEMENTS */}
        {activeTab === "achievements" && <Achievements />}

        {/* 🔥 ANALYTICS FINAL */}
        {activeTab === "analytics" && (
          <div className="analytics-container">

            <h2>📈 Analytics Overview</h2>

            <div className="chart-wrapper">

              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data.weeklyStats}>

                  <CartesianGrid stroke="rgba(255,255,255,0.1)" />

                  <XAxis dataKey="date" stroke="#e5e7eb" />
                  <YAxis stroke="#e5e7eb" />

                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#facc15"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                </LineChart>
              </ResponsiveContainer>

            </div>

          </div>
        )}

      </div>

      {/* AI */}
      <AIChat />

    </div>
  );
}

/* TASK SECTION */
function TasksSection() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return alert("Enter task");
    await API.post("/tasks", { title, priority });
    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      completed: !task.completed
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="tasks-container">
      <h2>📝 Task Tracker</h2>

      <div className="task-input">
        <input
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-item" key={task._id}>
            <span
              onClick={() => toggleTask(task)}
              className={task.completed ? "done" : ""}
            >
              {task.title}
            </span>

            <div>
              <button onClick={() => toggleTask(task)}>
                {task.completed ? "Undo" : "Done"}
              </button>

              <button onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        <FeedbackWidget />
      </div>
    </div>
  );
}

export default Dashboard;