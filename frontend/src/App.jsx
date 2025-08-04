import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import VehicleDetails from "./pages/admin/VehicleDetails";
import VehicleQuickView from "./pages/admin/VehicleQuickView";
import OnboardingStep1 from "./pages/users/OnboardingStep1";
import OnboardingStep2 from "./pages/users/OnboardingStep2";
import OTPVerification from "./pages/users/OTPVerification";
// ✅ Protected Route Logic
function ProtectedRoute({ children }) {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/" />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login / Signup */}
        <Route path="/" element={<LoginSignup />} />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehicle/:id/details"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehicle/:id/preview"
          element={
            <ProtectedRoute>
              <VehicleQuickView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingStep1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/step2"
          element={
            <ProtectedRoute>
              <OnboardingStep2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/otp"
          element={
            <ProtectedRoute>
              <OTPVerification />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
