import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Journal from "./components/Journal.jsx";
import CalendarPage from "./components/CalendarPage.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Main from "./components/Main.jsx";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "./config.js";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/users/profile`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user status:", err);
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-xl text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              currentUser ? <CalendarPage /> : <Navigate to="/home" replace />
            }
          />
          <Route
            path="/home"
            element={currentUser ? <Navigate to="/" replace /> : <Main />}
          />
          <Route
            path="/journal"
            element={currentUser ? <Journal /> : <Navigate to="/" replace />}
          />
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/calendar" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              currentUser ? <Navigate to="/calendar" replace /> : <Register />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
