const Notification = require("../models/Notification");

const DAY_MS = 1000 * 60 * 60 * 24;

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isSameDay = (a, b) => normalizeDate(a).getTime() === normalizeDate(b).getTime();

const getPriorityWeight = (priority = "medium") => {
  if (priority === "high") return 3;
  if (priority === "low") return 1;
  return 2;
};

const getMostProductiveWindow = (tasks) => {
  const buckets = {
    morning: 0,
    afternoon: 0,
    evening: 0,
  };

  tasks.forEach((task) => {
    const hour = new Date(task.createdAt).getHours();
    if (hour < 12) buckets.morning += 1;
    else if (hour < 18) buckets.afternoon += 1;
    else buckets.evening += 1;
  });

  return Object.entries(buckets).sort((a, b) => b[1] - a[1])[0][0];
};

const buildCoachSummary = (tasks) => {
  const today = normalizeDate(new Date());
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(
    (task) => task.deadline && !task.completed && normalizeDate(task.deadline) < today
  );
  const dueToday = tasks.filter(
    (task) => task.deadline && !task.completed && isSameDay(task.deadline, today)
  );

  const productivityScore =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const weightedPending = tasks
    .filter((task) => !task.completed)
    .reduce((sum, task) => sum + getPriorityWeight(task.priority), 0);

  const bestWindow = getMostProductiveWindow(tasks);

  const weeklyReport = {
    productivityScore,
    completedTasks,
    pendingTasks,
    overdueTasks: overdueTasks.length,
    dueToday: dueToday.length,
    bestWindow,
    summary:
      productivityScore >= 75
        ? `You are ${productivityScore}% productive this week. Keep your ${bestWindow} momentum going.`
        : `You are ${productivityScore}% productive this week. A focused ${bestWindow} block can lift your output.`,
  };

  const suggestions = [];

  if (overdueTasks.length > 0) {
    suggestions.push(
      `You have ${overdueTasks.length} missed deadline${overdueTasks.length > 1 ? "s" : ""}. Clear the oldest high-priority task first.`
    );
  }

  if (dueToday.length > 0) {
    suggestions.push(
      `${dueToday.length} task${dueToday.length > 1 ? "s are" : " is"} due today. Reserve a short execution block before evening.`
    );
  }

  if (weightedPending >= 9) {
    suggestions.push("Your pending workload is heavy. Focus on morning deep work and avoid adding low-priority tasks today.");
  }

  if (productivityScore < 50) {
    suggestions.push("Aim to finish one important task early in the day to rebuild momentum.");
  }

  if (suggestions.length === 0) {
    suggestions.push(`Focus your ${bestWindow} hours on the highest-value task and protect that time from distractions.`);
  }

  return {
    weeklyReport,
    overdueTasks,
    dueToday,
    suggestions,
  };
};

const syncNotifications = async ({ userId, tasks, streak }) => {
  const { weeklyReport, overdueTasks, dueToday } = buildCoachSummary(tasks);
  const today = normalizeDate(new Date()).toISOString().split("T")[0];
  const notifications = [];

  overdueTasks.forEach((task) => {
    notifications.push({
      user: userId,
      task: task._id,
      type: "deadline_missed",
      title: "Missed deadline",
      message: `"${task.title}" missed its deadline. Review it today.`,
      metaKey: `missed:${task._id}`,
    });
  });

  dueToday.forEach((task) => {
    notifications.push({
      user: userId,
      task: task._id,
      type: "reminder",
      title: "Task due today",
      message: `"${task.title}" is due today. Try to finish it before evening.`,
      metaKey: `due-today:${task._id}:${today}`,
    });
  });

  if (streak > 0) {
    const completedToday = tasks.some(
      (task) => task.completed && isSameDay(task.createdAt, new Date())
    );

    if (!completedToday) {
      notifications.push({
        user: userId,
        type: "streak_alert",
        title: "Streak at risk",
        message: `Your ${streak}-day streak is active. Complete one task today to keep it alive.`,
        metaKey: `streak-risk:${today}`,
      });
    }
  }

  notifications.push({
    user: userId,
    type: "weekly_report",
    title: "Weekly report ready",
    message: weeklyReport.summary,
    metaKey: `weekly-report:${today}`,
  });

  await Promise.all(
    notifications.map((notification) =>
      Notification.findOneAndUpdate(
        { user: userId, metaKey: notification.metaKey },
        { $setOnInsert: notification },
        { upsert: true, new: true }
      )
    )
  );

  return Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(8);
};

module.exports = {
  buildCoachSummary,
  syncNotifications,
};
