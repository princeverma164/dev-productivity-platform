import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("🔥 LOGIN FUNCTION CALLED");

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      console.log("📡 Sending request...");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ RESPONSE:", res.data);

      // save token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful 🚀");

      navigate("/dashboard");

    } catch (error) {
      console.log("❌ LOGIN ERROR:", error);

      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <button
        onClick={() => {
          console.log("🟢 BUTTON CLICKED");
          handleLogin();
        }}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;