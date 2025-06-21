import React, { useState } from "react";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

// for message using react toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuthStore } from "../store/authStore";
import Loader from "../components/Loader";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, firstName, lastName);
      navigate("/verifyEmail");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 pt-20 pb-10 ">
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <img
              src="../assets/logo_png.png"
              alt="RippleHub Logo"
              className="mx-auto w-16 mb-2"
            />

            <h2 className="text-2xl font-semibold">Create Your Account</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSignUp}>
            <div className="flex gap-6">
              <input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 px-4 py-2 bg-[#F4F1F8]  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#288683]"
              />
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 px-4 py-2 bg-[#F4F1F8]  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#288683]"
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#F4F1F8]  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#288683]"
            />

            {/* Password with show/hide */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#F4F1F8]  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#288683] pr-10"
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <PasswordStrengthChecker password={password} />

            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSignUp}
              className="w-full bg-[#288683] text-white py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={20} />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#288683] hover:underline">
              Log in
            </a>
          </div>
        </div>
      </div>

      {/* Footer Terms */}
      <div className="text-[11px] text-center text-gray-400 mt-10">
        <p>By signing up, you acknowledge that you have read and understood,</p>
        <p>
          and agree to RippleHub{" "}
          <a href="#" className="text-[#288683] underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#288683] underline">
            Privacy Policy
          </a>
          .
        </p>
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

export default SignUpPage;