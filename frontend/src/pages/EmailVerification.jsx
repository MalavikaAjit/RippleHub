import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// for message using react toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

import { useAuthStore } from "../store/authStore";

const EmailVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]); // keep track of input references
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail, checkAuth } = useAuthStore();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;

    const pasteCode = paste.slice(0, 6).split("");
    setOtp(pasteCode);

    inputRefs.current[5].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    try {
      await verifyEmail(code);
      await checkAuth(); // Check authentication after verification
      toast.success("Email verified successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

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
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600 mt-1" style={{ padding: "5px" }}>
            Enter the 6-digit code sent to your email address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-lg text-center bg-[#F4F1F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#288683]"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete || isLoading}
            className={`w-full py-2 rounded-full text-white transition ${
              isComplete
                ? "bg-[#288683] hover:bg-opacity-90"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={20} />
            ) : (
              "Verify Email"
            )}
          </button>
        </form>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000} // 3 seconds
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

export default EmailVerification;
