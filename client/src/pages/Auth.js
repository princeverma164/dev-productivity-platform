import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import bg from "../assets/auth-bg.jpg";

function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        await API.post("/auth/register", { name, email, password });
        alert("Account Created ✅");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth">

      <img src={bg} alt="bg" className="auth-bg" />

      <div className="auth-container">

        <div className="auth-card">
          <h1>{isLogin ? "Welcome Back" : "Welcome"}</h1>
          <p>{isLogin ? "Login to your account" : "Create Account"}</p>

          {!isLogin && (
            <div className="input-group">
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input-group">
            <input
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="main-btn" onClick={handleSubmit}>
            {isLogin ? "Log in" : "Sign up"}
          </button>
          <div className="toggle-text">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Sign up" : " Log in"}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Auth;