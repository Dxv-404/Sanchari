import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Request interceptor for attaching Authorization header
api.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (accessToken) {
    try {
      // Decode JWT payload to check expiry
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);

      // If expired, try refreshing
      if (payload.exp < now && refreshToken) {
        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: refreshToken,
        });
        accessToken = res.data.access;
        localStorage.setItem("access_token", accessToken);
      }
    } catch (err) {
      console.error("🔒 Token refresh failed:", err);
      localStorage.clear();
      window.location.href = "/";
      throw err;
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ✅ Upload onboarding form + files to Redis
export async function postTempOnboarding(formData) {
  return api.post("/onboarding/temp/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// ✅ Call this *after Firebase OTP is verified* to create the user
export async function finalizeUser(session_id) {
  return api.post("/onboarding/verify-otp/", { session_id });
}

export default api;
