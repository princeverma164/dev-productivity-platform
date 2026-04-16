import { useState } from "react";
import "./FeedbackWidget.css";
import API from "../services/api";

function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");

  const submitFeedback = async () => {
    if (!message.trim()) {
      alert("Write something first ❌");
      return;
    }

    try {
      await API.post("/feedback", {
        message,
        rating: rating || 5,
      });

      alert("Feedback sent ✅");
      setMessage("");
      setRating("");
      setOpen(false);
    } catch (err) {
      alert("Failed ❌");
    }
  };

  return (
    <div className="feedback-wrapper">

      {/* FLOAT BUTTON */}
      <div className="feedback-float" onClick={() => setOpen(!open)}>
        💬
      </div>
       <div className="feedback-label">
       Give Feedback
      </div>

      {/* POPUP */}
      {open && (
        <div className="feedback-box">

          <div className="feedback-header">
            Feedback 💬
          </div>

          <textarea
            placeholder="Share your thoughts..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />

          <button onClick={submitFeedback}>
            Send
          </button>

        </div>
      )}
    </div>
  );
}

export default FeedbackWidget;