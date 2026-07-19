import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Skeleton from "./components/ui/Skeleton";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const ScanLabel = lazy(() => import("./pages/ScanLabel"));
const MyAllergies = lazy(() => import("./pages/MyAllergies"));
const ScanHistory = lazy(() => import("./pages/ScanHistory"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

function AppFallback() {
  return (
    <div className="min-h-screen bg-surface-50 p-6 dark:bg-slate-950">
      <Skeleton className="mx-auto h-96 max-w-5xl" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<AppFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/scan" element={<ScanLabel />} />
                <Route path="/allergies" element={<MyAllergies />} />
                <Route path="/history" element={<ScanHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Navigate to="/profile" replace />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
