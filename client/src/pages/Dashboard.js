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
  ResponsiveContainer,
} from "recharts";

const formatDate = (value) => {
  if (!value) return "No deadline";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getTaskStatus = (task) => {
  if (!task.deadline) return "No deadline";
  if (task.completed) return "Completed";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(task.deadline);
  deadline.setHours(0, 0, 0, 0);

  if (deadline < today) return "Overdue";
  if (deadline.getTime() === today.getTime()) return "Due today";
  return "Upcoming";
};

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const saveGithub = async () => {
    try {
      await API.put("/user/github", { githubUsername });
      alert("GitHub connected successfully");
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      fetchDashboard();
    } catch (error) {
      console.error("Notification update error:", error);
    }
  };

  if (!data) return <h2 className="dashboard-loading">Loading...</h2>;

  return (
    <div
      className={darkMode ? "dashboard dark" : "dashboard"}
      style={{
        backgroundImage: `url(${getBackground()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="navbar">
        <img src={logo} alt="logo" className="logo" />

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

        <div className="nav-right">
          <div className="profile" onClick={() => navigate("/profile")}>
            {data.user.name}
          </div>
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light" : "Dark"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="content">
        {activeTab === "dashboard" && (
          <>
            <h2>Welcome, {data.user.name}</h2>

            <div className="cards">
              <div className="card glass-card">
                <h3>My Productivity</h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${data.productivityScore || 0}%` }}
                  />
                </div>
                <p className="progress-text">{data.productivityScore || 0}%</p>
              </div>

              <div className="card glass-card">
                <h3>Task Summary</h3>
                <div className="dual-bar">
                  <div
                    className="completed-bar"
                    style={{
                      width: data.tasks?.total
                        ? `${(data.tasks.completed / data.tasks.total) * 100}%`
                        : "0%",
                    }}
                  />
                  <div
                    className="pending-bar"
                    style={{
                      width: data.tasks?.total
                        ? `${(data.tasks.pending / data.tasks.total) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <p>
                  {data.tasks?.completed || 0} done / {data.tasks?.pending || 0} pending
                </p>
              </div>

              <div className="card glass-card">
                <h3>Current Streak</h3>
                <p className="stat-value">{data.streak || 0} day streak</p>
                <p>Complete one task daily to keep momentum alive.</p>
              </div>

              <div className="card glass-card report-card">
                <h3>Weekly Report</h3>
                <p className="stat-value">
                  {data.coach?.weeklyReport?.productivityScore || 0}% productive
                </p>
                <p>{data.coach?.weeklyReport?.summary}</p>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <div className="github-input">
                <input
                  placeholder="Enter GitHub username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                />
                <button className="github-save-btn" onClick={saveGithub}>
                  Save GitHub
                </button>
              </div>
            </div>

            <div className="insights-grid">
              <div className="insight-panel">
                <h3>AI Coach Suggestions</h3>
                <ul className="coach-list">
                  {(data.coach?.suggestions || []).map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="insight-panel">
                <h3>Missed Deadlines</h3>
                {data.coach?.missedDeadlines?.length ? (
                  <div className="deadline-list">
                    {data.coach.missedDeadlines.map((task) => (
                      <div key={task.id} className="deadline-item">
                        <strong>{task.title}</strong>
                        <span>{formatDate(task.deadline)}</span>
                        <span className="deadline-priority">{task.priority}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No missed deadlines. Keep it up.</p>
                )}
              </div>

              <div className="insight-panel">
                <h3>Notifications</h3>
                {data.notifications?.length ? (
                  <div className="notification-list">
                    {data.notifications.map((notification) => (
                      <button
                        key={notification._id}
                        className={`notification-item ${notification.read ? "read" : ""}`}
                        onClick={() => markNotificationRead(notification._id)}
                      >
                        <strong>{notification.title}</strong>
                        <span>{notification.message}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No notifications yet.</p>
                )}
              </div>
            </div>

            <div className="heatmap">
              <h3>Last 7 Days Activity</h3>
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
                          : "#166534",
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "tasks" && <TasksSection />}
        {activeTab === "achievements" && <Achievements />}

        {activeTab === "analytics" && (
          <div className="analytics-container">
            <h2>Analytics Overview</h2>
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
                      color: "#fff",
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

      <AIChat />
    </div>
  );
}

function TasksSection() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return alert("Enter task");

    await API.post("/tasks", {
      title,
      priority,
      deadline: deadline || undefined,
    });

    setTitle("");
    setPriority("medium");
    setDeadline("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      completed: !task.completed,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="tasks-container">
      <h2>Task Tracker</h2>

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

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-item" key={task._id}>
            <div className="task-copy">
              <span
                onClick={() => toggleTask(task)}
                className={task.completed ? "done" : ""}
              >
                {task.title}
              </span>
              <small className={`task-status ${getTaskStatus(task).toLowerCase().replace(/\s+/g, "-")}`}>
                {getTaskStatus(task)} | {formatDate(task.deadline)} | {task.priority}
              </small>
            </div>

            <div>
              <button onClick={() => toggleTask(task)}>
                {task.completed ? "Undo" : "Done"}
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))}
        <FeedbackWidget />
      </div>
    </div>
  );
}

export default Dashboard;
