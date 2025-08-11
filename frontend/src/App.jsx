import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import VehicleDetails from "./pages/admin/VehicleDetails";
import VehicleQuickView from "./pages/admin/VehicleQuickView";

import OnboardingStep1 from "./pages/users/OnboardingStep1";
import OnboardingStep2 from "./pages/users/OnboardingStep2";

import UserLanding from "./pages/users/landing/UserLanding";
import { getMe } from "./services/api";

/* 🔽 NEW: user detail pages */
import UserVehicleDetail from "./pages/users/landing/UserVehicleDetail";   // create this


/* =========================
   Auth & Onboarding Gates
   ========================= */

// Basic auth gate
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

// Onboarding gate (keeps UI unchanged while checking)
function OnboardingGate({ children }) {
  const [state, setState] = useState({ loading: true, onboarded: false });
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getMe();
        if (!alive) return;
        setState({ loading: false, onboarded: !!res.data?.onboarded });
      } catch {
        if (!alive) return;
        setState({ loading: false, onboarded: false });
      }
    })();
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  if (state.loading) return null;

  const isOnboardingPath =
    location.pathname === "/onboarding" || location.pathname === "/onboarding/step2";

  // Not onboarded → force to onboarding
  if (!state.onboarded && !isOnboardingPath) {
    return <Navigate to="/onboarding" replace />;
  }

  // Already onboarded but trying to visit onboarding → send to /user
  if (state.onboarded && isOnboardingPath) {
    return <Navigate to="/user" replace />;
  }

  return children;
}

/* =========================
          App
   ========================= */

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
              <OnboardingGate>
                <Dashboard />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AddProduct />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehicle/:id/details"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <VehicleDetails />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehicle/:id/preview"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <VehicleQuickView />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        {/* User Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <OnboardingStep1 />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/step2"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <OnboardingStep2 />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        {/* User landing */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <UserLanding />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        {/* 🔽 NEW: user vehicle detail + flows (matches UserLanding navigate(`/user/vehicle/${id}`)) */}
        <Route
          path="/user/vehicle/:id"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <UserVehicleDetail />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
