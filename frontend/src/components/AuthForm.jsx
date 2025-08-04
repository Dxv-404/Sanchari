import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css"; // We'll use this for all the glassmorphism and transitions

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password || (isSignup && !form.password2)) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    if (isSignup) {
      if (form.password !== form.password2) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      // Registration (assuming you have /api/register/)
      try {
        await axios.post("http://127.0.0.1:8000/api/register/", {
          username: form.username,
          password: form.password,
        });
        setIsSignup(false);
        setForm({ username: "", password: "", password2: "" });
        setError("Signup successful! Please login.");
      } catch (err) {
        setError(
          err.response?.data?.username?.[0] ||
          err.response?.data?.detail ||
          "Signup failed."
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Login (assuming you have /api/token/)
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/token/", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Optionally check for admin user to redirect
        // If you want to actually check user role from backend, you'll want to fetch profile!
        if (form.username.toLowerCase() === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } catch (err) {
        setError("Invalid credentials. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }

  function toggleMode() {
    setIsSignup((v) => !v);
    setError("");
    setForm({ username: "", password: "", password2: "" });
  }

  return (
    <div className="auth-bg" style={{
      backgroundImage: `url('/bg-main.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div className={`auth-container ${isSignup ? "slide-signup" : ""}`}>
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="auth-title">{isSignup ? "Sign Up" : "Login"}</h2>
          <div className="auth-field">
            <input
              name="username"
              autoComplete="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <span className="icon">
              <svg width="18" height="18" fill="none"><circle cx="9" cy="6" r="4" stroke="#aaa" strokeWidth="2"/><path d="M2 16c0-3.314 2.686-6 6-6h2c3.314 0 6 2.686 6 6" stroke="#aaa" strokeWidth="2"/></svg>
            </span>
          </div>
          <div className="auth-field">
            <input
              name="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <span className="icon">
              <svg width="18" height="18" fill="none"><rect x="3" y="8" width="12" height="7" rx="2" stroke="#aaa" strokeWidth="2"/><path d="M6 8V6a3 3 0 1 1 6 0v2" stroke="#aaa" strokeWidth="2"/></svg>
            </span>
          </div>
          {isSignup && (
            <div className="auth-field">
              <input
                name="password2"
                autoComplete="new-password"
                type="password"
                placeholder="Confirm Password"
                value={form.password2}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <span className="icon">
                <svg width="18" height="18" fill="none"><rect x="3" y="8" width="12" height="7" rx="2" stroke="#aaa" strokeWidth="2"/><path d="M6 8V6a3 3 0 1 1 6 0v2" stroke="#aaa" strokeWidth="2"/></svg>
              </span>
            </div>
          )}
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (isSignup ? "Signing up..." : "Logging in...") : (isSignup ? "Sign Up" : "Login")}
          </button>
          <div className="auth-footer">
            {isSignup ? (
              <>
                <span>Already have an account?</span>
                <button type="button" onClick={toggleMode} className="auth-link">Login</button>
              </>
            ) : (
              <>
                <span>Don't have an account?</span>
                <button type="button" onClick={toggleMode} className="auth-link">Register</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
