import { useState } from "react";
import API from "../services/api";

function FeedbackForm() {
  const [form, setForm] = useState({
    message: "",
    rating: 5,
    image: null,
  });

  const submit = async () => {
    const data = new FormData();
    data.append("message", form.message);
    data.append("rating", form.rating);
    /* data.append("image", form.image); */

    await API.post("/feedback", data);

    alert("Feedback added successfully");
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Give your valuable feedback</h2>

      <textarea
        placeholder="Your feedback"
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <input
        type="file"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
      />

      <select
        onChange={(e) => setForm({ ...form, rating: e.target.value })}
      >
        <option>5</option>
        <option>4</option>
        <option>3</option>
      </select>

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default FeedbackForm;