import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config.js";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/users/profile`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch((err) => {
        console.error("Failed to fetch user status:", err);
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setCurrentUser(null);
        navigate("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  };

  const handleCalendarClick = () => navigate("/");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <span className="text-2xl">📔</span>
          <span className="text-xl sm:text-2xl font-semibold text-[#03A6A1]">
            Journee
          </span>
        </a>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="text-sm text-gray-500">Checking status...</div>
          ) : currentUser ? (
            <>
              <span className="text-sm sm:text-base font-medium text-gray-700">
                👋 Hi, {currentUser.username || "User"}
              </span>
              <button
                onClick={handleCalendarClick}
                className="flex items-center gap-2 bg-[#03A6A1]/10 text-[#03A6A1] font-semibold px-4 py-1.5 rounded-full hover:bg-[#03A6A1]/20 text-sm shadow transition"
              >
                📅 Calendar
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#FFEEEE] text-[#E63946] font-semibold px-4 py-1.5 rounded-full hover:bg-[#ffd6d6] text-sm shadow transition"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#03A6A1] hover:text-[#ff4f0f] transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#03A6A1] hover:bg-[#028985] text-white font-semibold px-4 py-2 rounded-full text-sm shadow transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
