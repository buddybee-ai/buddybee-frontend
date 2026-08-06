import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import MainLayout      from "./context/layouts/MainLayout";
import DashboardLayout from "./context/layouts/DashboardLayout";

import Home     from "./pages/Home";
import Features from "./pages/Features";
import Schools  from "./pages/Schools";
import About    from "./pages/About";
import Contact  from "./pages/Contact";
import Demo     from "./pages/Demo";
import Login    from "./pages/Login";
import Signup   from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import ChatPage from "./pages/ChatPage";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

import StudentDashboard   from "./pages/dashboards/StudentDashboard";
import ParentComingSoon   from "./pages/dashboards/ParentComingSoon";
import CounselorDashboard from "./pages/dashboards/CounselorDashboard";
import AdminDashboard     from "./pages/dashboards/AdminDashboard";

// Redirects /dashboard → /dashboard/{role}
// Parent role redirects to coming-soon instead of a functional dashboard
function DashboardIndex() {
  const { role } = useAuth();
  const map = { student: "student", parent: "parent", counselor: "counselor", admin: "admin" };
  return <Navigate to={`/dashboard/${map[role] || "student"}`} replace />;
}

export default function App() {
  return (
    <Routes>

      {/* Public */}
      <Route element={<MainLayout />}>
        <Route path="/"         element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
        <Route path="/features" element={<Features />} />
        <Route path="/schools"  element={<Schools />}  />
        <Route path="/about"    element={<About />}    />
        <Route path="/contact"  element={<Contact />}  />
        <Route path="/demo"     element={<Demo />}     />
      </Route>

      {/* Auth */}
      <Route path="/login"  element={<PublicOnlyRoute><Login /></PublicOnlyRoute>}  />
      <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* /dashboard → auto-redirect to role dashboard */}
        <Route index element={<DashboardIndex />} />

        <Route path="student" element={
          <ProtectedRoute roleRequired="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="parent" element={
          <ParentComingSoon />
        } />
        <Route path="counselor" element={
          <ProtectedRoute roleRequired="counselor"><CounselorDashboard /></ProtectedRoute>
        } />
        <Route path="admin" element={
          <ProtectedRoute roleRequired="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="chat" element={
          <ProtectedRoute roleRequired="student"><ChatPage /></ProtectedRoute>
        } />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
