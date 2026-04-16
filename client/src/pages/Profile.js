import { useEffect, useState } from "react";
import API, { getAssetUrl } from "../services/api";
import "./Profile.css";
import bg from "../assets/profile-bg.jpg";
import FeedbackWidget from "../components/FeedbackWidget"; // ✅ ADD

function Profile() {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [bio, setBio] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const fetchProfile = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);

      setName(res.data.user.name);
      setGithubUsername(res.data.user.githubUsername || "");
      setBio(res.data.user.bio || "");
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // UPDATE PROFILE 
  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("githubUsername", githubUsername);
      formData.append("bio", bio);

      if (profileImage) {
        formData.append("image", profileImage);
      }

      await API.put("/user/profile", formData);

      alert("Profile Updated ✅");
      setEditMode(false);
      setProfileImage(null);
      fetchProfile();

    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div
      className="profile-page"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* LEFT */}
      <div className="profile-card">
        <img
          src={
            data.user.image
              ? getAssetUrl(data.user.image)
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="profile"
        />

        <h2>{data.user.name}</h2>
        <p>{data.user.email}</p>

        <p className="bio">
          {data.user.bio || "No bio added"}
        </p>

        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* RIGHT */}
      <div className="profile-details">

        {/* STATS */}
        <div className="stats">
          <div className="stat-box">
            <h3>📊 Productivity</h3>
            <p>{data.productivityScore}%</p>
             </div>

          <div className="stat-box">
            <h3>✅ Completed</h3>
            <p>{data.tasks.completed}</p>
          </div>

          <div className="stat-box">
            <h3>📌 Pending</h3>
            <p>{data.tasks.pending}</p>
          </div>
        </div>

        {/* GITHUB */}
        <div className="github-card">
          <h3>GitHub</h3>

          {data.github.username ? (
            <>
              <p>{data.github.username}</p>
              <a
                href={`https://github.com/${data.github.username}`}
                target="_blank"
                rel="noreferrer"
              >
                View Profile 🔗
              </a>
            </>
          ) : (
            <p>Not Connected ❌</p>
          )}
        </div>

        {/* EDIT FORM */}
        {editMode && (
          <div className="edit-form">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <input
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="GitHub Username"
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your bio..."
            />

            <input
              type="file"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />

            <button onClick={updateProfile}>
              Save Changes
            </button>
          </div>
        )}
      </div>
      <FeedbackWidget />
    </div>
  );
}

export default Profile;