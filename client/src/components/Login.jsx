import { useState } from "react";
import { BACKEND_URL } from "../config.js";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${BACKEND_URL}/api/users/login`, form, {
        withCredentials: true,
      });
      window.location.href = "/";
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Network error. Please try again.");
      } else {
        setError("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[color:var(--cream)] p-4">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-4xl flex overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[color:var(--orange)] to-[color:var(--peach)] p-12 flex-col justify-center items-center text-white">
          <span className="text-6xl mb-6">📔</span>
          <h1 className="text-4xl font-bold mb-3">Welcome Back!</h1>
          <p className="text-lg text-center mb-8">
            Log in to continue your journaling journey and capture your
            thoughts.
          </p>
          <p className="text-sm">Your personal space for reflection.</p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[color:var(--primary)] mb-8 text-center">
            <span role="img" aria-label="key" className="mr-2">
              🔑
            </span>{" "}
            Login
          </h2>

          {error && (
            <div className="mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg p-3 text-left flex items-center">
              <span role="img" aria-label="warning" className="mr-2 text-lg">
                ⚠️
              </span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)] outline-none transition-shadow shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)] outline-none transition-shadow shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[color:var(--primary)] hover:bg-opacity-85 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2"
            >
              <span role="img" aria-label="login arrow" className="mr-2">
                ➡️
              </span>
              Login
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Don{"'"}t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-[color:var(--orange)] hover:text-[color:var(--peach)] hover:underline"
            >
              Sign up here ✨
            </a>
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            Forgot your password?{" "}
            <a
              href="mailto:superteenm@gmail.com"
              className="font-medium text-[color:var(--primary)] hover:text-opacity-80 hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
