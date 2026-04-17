import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import "./Landing.css";

import bg from "../assets/landing-bg.png";
import features from "../assets/features.png";
import testimonials from "../assets/testimonials.png";
import { getAssetUrl } from "../services/api";

function Landing() {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await API.get("/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Feedback fetch error:", err);
    }
  };

  return (
    <div>
      <div
        className="landing"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <button
          className="get-started-btn"
          onClick={() => navigate("/auth")}
        >
          Get Started
        </button>
      </div>
      <div className="landing-image-section">
        <img src={features} alt="features" />
      </div>
      <div className="landing-image-section">
        <img src={testimonials} alt="testimonials" />
      </div>
      <div className="feedback-section">
        <h2>Our Clients Love Ladder</h2>
        <h3> See how Ladder has helped users elevate their personal Growth and reach New Heights !</h3>

        <div className="feedback-container">
          {feedbacks.length === 0 ? (
            <p style={{ textAlign: "center" }}>No feedback yet</p>
          ) : (
            feedbacks.map((fb) => (
              <div className="feedback-card" key={fb._id}>

                <img
                  src={
                    fb.image
                     ? getAssetUrl(fb.image)
                     : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                  alt=""
                />

                <h4>{fb.name}</h4>

                <p>{fb.message}</p>

                <div className="stars">
                  {"⭐".repeat(fb.rating)}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Landing;