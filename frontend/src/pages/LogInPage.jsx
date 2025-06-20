import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LogInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
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

          <form className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 bg-[#F4F1F8]  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#288683]"
            />

            {/* Password input with toggle */}
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

            <div className="text-right text-sm text-gray-600">
              {" "}
              <a
                href="/forgotPassword"
                className="text-[#288683] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#288683] text-white py-2 rounded-md hover:bg-opacity-90 transition"
            >
              Log in
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
    </div>
  );
};

export default LogInPage;