import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"; // same loader as signup
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 pt-20 pb-10 font-roboto">
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <img
              src="/assets/logo_png.png"
              alt="RippleHub Logo"
              className="mx-auto w-16 mb-2"
            />
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               className="w-full px-4 py-2 pl-12 bg-[#F4F1F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#288683]"
  
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0
                 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>

            {/* Password input with toggle */}
           <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pl-12 pr-12 bg-[#F4F1F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#288683]"
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" 
                  />
                </svg>
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
            </div>
            <div className="text-right text-sm text-gray-600">
              <a
                href="/forgotPassword"
                className="text-[#288683] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#288683] text-white py-2 rounded-md hover:bg-opacity-90 transition"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={20} />
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#288683] hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </div>
  );
};

export default LogInPage;