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

/** =====================
 *  🧩 OLD (kept for compatibility; no longer used in the new flow)
 *  ===================== */
export async function postTempOnboarding(formData) {
  return api.post("/onboarding/temp/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function finalizeUser(session_id) {
  return api.post("/onboarding/verify-otp/", { session_id });
}

/** =====================
 *  ✅ NEW FLOW (no OTP)
 *  ===================== */
export async function completeOnboarding(formData) {
  return api.post("/onboarding/complete/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function getMe() {
  return api.get("/user/me/");
}
export const fetchVehicles = (params) => api.get("/vehicles/", { params });
export const fetchVehicleMeta = () => api.get("/vehicles/meta/");

// Wishlist
export const fetchWishlist = () => api.get("/wishlist/");
export const addToWishlist = (vehicle_id) => api.post("/wishlist/", { vehicle_id });
export const removeFromWishlist = (wishlist_id) => api.delete(`/wishlist/${wishlist_id}/`);

export default api;
