const axios = require("axios");

const getGithubStats = async (username) => {
  try {
    const userRes = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const eventsRes = await axios.get(
      `https://api.github.com/users/${username}/events`
    );

    let commits = 0;

    eventsRes.data.forEach((event) => {
      if (
        event.type === "PushEvent" &&
        event.payload &&
        event.payload.commits
      ) {
        commits += event.payload.commits.length;
      }
    });

    return {
      totalCommits: commits,
      streak: Math.floor(commits / 2),

      avatar: userRes.data.avatar_url,
      profileUrl: userRes.data.html_url,
      username: userRes.data.login
    };

  } catch (err) {
    console.log("GitHub Error:", err.message);

    return {
      totalCommits: 0,
      streak: 0,
      avatar: "",
      profileUrl: "",
      username: ""
    };
  }
};

module.exports = { getGithubStats };