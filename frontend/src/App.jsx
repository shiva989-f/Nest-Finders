import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import { ToastContainer } from "react-toastify";
import OTP from "./pages/auth/OTP";
import Login from "./pages/auth/Login";
import { useAuthStore } from "./Store/authStore";
import { useEffect } from "react";
import LoadingSpinner from "./pages/auth/LoadingSpinner";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Admin from "./pages/admin/Admin";
import PageNotFound from "./pages/PageNotFound";

// Protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user.isVerified) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Redirect authenticated user to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    // Redirect to home page and replace with current page if user is authenticated and verified
    return <Navigate to="/" replace />;
  }
  return children;
};

// Only Admin Route
const IsUserNotAdmin = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="font-nunito">
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />

        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <OTP />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassword />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/reset-password/:resetToken"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/admin"
          element={
            <IsUserNotAdmin>
              <Admin />
            </IsUserNotAdmin>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
