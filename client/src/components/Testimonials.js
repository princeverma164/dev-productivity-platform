import { useEffect, useState } from "react";
import API, { getAssetUrl } from "../services/api";
import "./Testimonials.css";

function Testimonials() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/feedback");
    setData(res.data);
  };

  return (
    <div className="testimonial-section">
      <h2>Our Clients Love Ladder</h2>

      <div className="testimonial-cards">
        {data.map((item, i) => (
          <div className="testimonial-card" key={i}>
            <img
              src={
                item.image
                  ? getAssetUrl(item.image)
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt=""
            />

            <h3>{item.name}</h3>
            <p>{item.message}</p>

            <div className="stars">
              {"★".repeat(item.rating)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
