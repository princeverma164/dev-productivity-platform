import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/auth" />}
        />

        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/auth" />}
        />

      </Routes>
    </Router>
  );
}

export default App;