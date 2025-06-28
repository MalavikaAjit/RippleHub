import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Loader from "./components/Loader";
import DashboardLayout from "./layouts/DashboardLayout";

import DashboardPage from "./pages/DashboardPage";
import NotificationPage from "./pages/DashboardPages/NotificationPage";
import MessagePage from "./pages/DashboardPages/MessagePage";
import SettingPage from "./pages/DashboardPages/SettingPage";
import UploadPage from "./pages/DashboardPages/UploadPage";
import FindPage from "./pages/DashboardPages/FindPage";
import ProfilePage from "./pages/DashboardPages/ProfilePage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user.isVerified) return <Navigate to="/verifyEmail" replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={40} />
      </div>
    );

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Route>

      <Route
        path="/signup"
        element={
          <RedirectAuthenticatedUser>
            <SignUpPage />
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectAuthenticatedUser>
            <LogInPage />
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/verifyEmail"
        element={
          <RedirectAuthenticatedUser>
            <EmailVerification />
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/forgotPassword"
        element={
          <RedirectAuthenticatedUser>
            <ForgotPassword />
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>
        }
      />
    </Routes>
  );
}

export default App;
