import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
  console.log("🔥 BUTTON CLICKED");

  try {
    console.log("🚀 Calling API");

    const res = await API.post("/auth/register", {
      name,
      email,
      password,
    });

    console.log("✅ RESPONSE:", res.data);

    alert("Registration Successful");
    navigate("/");
  } catch (error) {
    console.log("❌ ERROR:", error);
    alert(error.response?.data?.message || "Registration failed");
  }
};

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;