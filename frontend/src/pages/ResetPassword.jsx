import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to reset password"
      );
    }
  };

  const isFormValid =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 font-roboto">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center space-y-8">
        <img
          src="/assets/logo_png.png"
          alt="RippleHub Logo"
          className="mx-auto w-16 mb-2"
        />

        <div>
          <h2 className="text-2xl font-semibold text-[#288683]">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600 mt-1" style={{ padding: "5px" }}>
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-base bg-[#F4F1F8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#288683]"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 text-base bg-[#F4F1F8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#288683]"
          />

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-2 rounded-md text-white transition ${
              isFormValid
                ? "bg-[#288683] hover:bg-opacity-90"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? <Loader size={20} /> : "Reset Password"}
          </button>
        </form>

        <div className="text-sm text-gray-600">
          Back to{" "}
          <Link to="/login" className="text-[#288683] hover:underline">
            Login
          </Link>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ResetPasswordPage;