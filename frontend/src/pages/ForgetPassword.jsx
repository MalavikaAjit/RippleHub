import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Email:", email);

    try {
      await forgotPassword(email);
      setIsSubmitted(true); // only after success
    } catch (error) {
      console.log("Error sending reset email:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to send reset email"
      );
      // Don't set isSubmitted — stay on the form
    }
  };

  const isValidEmail = email.trim() !== "" && email.includes("@");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 font-roboto">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center space-y-8">
        <img
          src="/assets/logo_png.png"
          alt="RippleHub Logo"
          className="mx-auto w-16 mb-2"
        />

        {!isSubmitted && (
          <div>
            <h2 className="text-2xl font-semibold text-[#288683]">
              Forgot Password
            </h2>
            <p
              className="text-sm text-gray-600 mt-1"
              style={{ padding: "5px" }}
            >
              Enter your email address to receive a password reset link.
            </p>
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-base bg-[#F4F1F8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#288683]"
            />

            <button
              type="submit"
              disabled={!isValidEmail || isLoading}
              className={`w-full py-2 rounded-md text-white transition ${
                isValidEmail
                  ? "bg-[#288683] hover:bg-opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <img src="/assets/mail.png" alt="RippleHub Logo" />
            <p className="text-gray-700 text-base">
              If an account exists for{" "}
              <span className="font-medium">{email}</span>, you will receive a
              password reset link shortly.
            </p>

            <Link
              to="/login"
              className="mt-4 inline-flex items-center text-[#288683] hover:underline text-sm"
            >
              Back to Login
            </Link>
          </div>
        )}

        {!isSubmitted && (
          <div className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-[#288683] hover:underline">
              Back to Login
            </Link>
          </div>
        )}
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

export default ForgotPasswordPage;
