import { useEffect, useState } from "react";
import API, { getAssetUrl } from "../services/api";
import "./Achievements.css";

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  // ================= FETCH =================
  const fetchAchievements = async () => {
    try {
      const res = await API.get("/achievements");
      setAchievements(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!title.trim()) return alert("Title required");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      console.log("FORM DATA:", title, description, image);

      if (editId) {
        await API.put(`/achievements/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Updated ✅");
      } else {
        await API.post("/achievements", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Added ✅");
      }

      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);
      setEditId(null);

      fetchAchievements();
    } catch (err) {
      console.error("SUBMIT ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Error uploading");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/achievements/${id}`);
      fetchAchievements();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (a) => {
    setEditId(a._id);
    setTitle(a.title);
    setDescription(a.description);
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="container">
      <h2>🏆 Achievements</h2>

      <div className="form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);

            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

        {preview && <img src={preview} alt="preview" className="preview" />}

        <button onClick={handleSubmit}>
          {editId ? "Update Achievement" : "Add Achievement"}
        </button>
      </div>

      <div className="grid">
        {achievements.map((a) => (
          <div key={a._id} className="card">
            {a.image && (
              <img
                src={getAssetUrl((a.image || "").replace(/\\/g, "/"))}
                alt="achievement"
              />
            )}

            <h4>{a.title}</h4>
            <p>{a.description}</p>

            <div className="btn-group">
              <button className="edit-btn" onClick={() => handleEdit(a)}>
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(a._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
