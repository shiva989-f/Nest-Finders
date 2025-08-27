import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import Seller from "./pages/seller/Seller";
import PropertyListingForm from "./Components/seller/PropertyListingForm";
import PropertiesTab from "./Components/admin/PropertiesTab";
import UsersTab from "./Components/admin/UsersTab";
import ListedPropertiesTab from "./Components/seller/ListedPropertiesTab";
import PropertyEditingForm from "./Components/seller/PropertyEditingForm";
import Buyer from "./pages/buyer/Buyer";
import PropertyDetail from "./pages/buyer/PropertyDetail";

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

// Only Admin Route
const IsUserNotSeller = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "seller") {
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
        <Route path="/" element={<Navigate to={"/properties"} />} />

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

        {/* Admin page parent route */}
        <Route
          path="/admin"
          element={
            <IsUserNotAdmin>
              <Admin />
            </IsUserNotAdmin>
          }
        >
          {/* Children routes for component */}
          <Route index element={<Navigate to="users" replace />} />
          {/* Default page */}
          <Route path="users" element={<UsersTab />} />
          <Route path="properties" element={<PropertiesTab />} />
        </Route>

        {/* Parent seller page route */}
        <Route
          path="/seller"
          element={
            <IsUserNotSeller>
              <Seller />
            </IsUserNotSeller>
          }
        >
          {/* Children routes */}
          <Route index element={<Navigate to="add-property" replace />} />
          {/* add-property as a default component */}
          <Route path="add-property" element={<PropertyListingForm />} />
          <Route path="list-properties" element={<ListedPropertiesTab />} />
          <Route path="edit-property/:id" element={<PropertyEditingForm />} />
        </Route>

        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <Buyer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/property/:propertyId"
          element={
            <ProtectedRoute>
              <PropertyDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
