import React, { useState } from "react";
import axios from "axios";
import "./LoginSignup.css";

function Toast({ message, type, onClose }) {
  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">
        {type === "success" ? (
          <svg width="22" height="22" viewBox="0 0 24 24" stroke="#45ad6d" strokeWidth="2" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#45ad6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" stroke="#e36b6b" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#e36b6b" />
            <path d="M15 9l-6 6M9 9l6 6" stroke="#e36b6b" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
}

export default function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    if (!form.username || !form.password || (isSignup && (!form.password2 || !form.email))) {
      showToast("Please fill all fields.", "error");
      return;
    }
    setLoading(true);

    if (isSignup) {
      if (form.password !== form.password2) {
        showToast("Passwords do not match.", "error");
        setLoading(false);
        return;
      }
      // Signup: /api/register/
      try {
        await axios.post("http://127.0.0.1:8000/api/register/", {
          username: form.username,
          email: form.email,
          password: form.password
        });
        showToast("Signup successful! Please login.", "success");
        setIsSignup(false);
        setForm({ username: "", email: "", password: "", password2: "" });
      } catch (err) {
        const data = err.response?.data;
        let errMsg = "Signup failed.";
        if (data?.username) errMsg = data.username[0];
        else if (data?.email) errMsg = data.email[0];
        else if (data?.password) errMsg = data.password[0];
        else if (data?.detail) errMsg = data.detail;
        showToast(errMsg, "error");
      } finally {
        setLoading(false);
      }
    } else {
      // Login: /api/token/
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/token/", {
          username: form.username,
          password: form.password
        });
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);

        // After login, fetch user details
        const userRes = await axios.get("http://127.0.0.1:8000/api/user/me/", {
          headers: { Authorization: `Bearer ${res.data.access}` }
        });
        const user = userRes.data;

        if (user.is_staff || user.is_superuser) {
          showToast("Admin login successful!", "success");
          setTimeout(() => (window.location.href = "/dashboard"), 1400);
        } else {
          showToast("Login successful!", "success");
          setTimeout(() => (window.location.href = "/onboarding"), 1100);
        }
      } catch (err) {
        showToast("Login failed. Invalid credentials.", "error");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="split-auth-root">
      <div className="split-auth-left">
        <div className="welcome-header">
          <span>WELCOME BACK</span>
        </div>
        <div className="form-wrap">
          <div className="form-switcher">
            <button
              className={!isSignup ? "active" : ""}
              onClick={() => setIsSignup(false)}
              type="button"
              disabled={!isSignup}
            >
              Login
            </button>
            <button
              className={isSignup ? "active" : ""}
              onClick={() => setIsSignup(true)}
              type="button"
              disabled={isSignup}
            >
              Sign Up
            </button>
          </div>
          <form className={`login-signup-form ${isSignup ? "slide" : ""}`} onSubmit={handleSubmit} autoComplete="off">
            <label>
              <span>Username</span>
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </label>
            {isSignup && (
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>
            )}
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </label>
            {isSignup && (
              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  name="password2"
                  autoComplete="new-password"
                  value={form.password2}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>
            )}
            <div className="form-extras">
              <span className="forgot-pw">Forgot password?</span>
            </div>
            <button className="form-main-btn" type="submit" disabled={loading}>
              {loading ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
        </div>
      </div>
      <div className="split-auth-right">
        <video
          className="auth-bg-video"
          src="/bg-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
