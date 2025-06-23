import React from "react";

const PasswordStrengthChecker = ({ password }) => {
  const checkLength = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const getStrengthLevel = () => {
    const checks = [checkLength, hasUpper, hasLower, hasNumber, hasSpecial];
    return checks.filter(Boolean).length;
  };

  const level = getStrengthLevel();

  const getBarColor = (index) => {
    if (level === 5) {
      // Very Strong — All green
      return "bg-[#288683]";
    } else if (index < level) {
      // Other levels — per index color
      if (index < 1) return "bg-red-500";
      if (index === 1) return "bg-yellow-400";
      if (index === 2) return "bg-yellow-400";
      if (index >= 3) return "bg-[#288683]";
    } else {
      return "bg-gray-200";
    }
  };

  return (
    <div className="text-sm">
      <div className="flex justify-between mb-1">
        <span className="font-medium">Password strength</span>
        <span
          className={
            level <= 2
              ? "text-red-500"
              : level === 3
              ? "text-yellow-500"
              : level === 4
              ? "text-green-500"
              : "text-green-600"
          }
        >
          {level === 0
            ? "Very Weak"
            : level <= 2
            ? "Weak"
            : level === 3
            ? "Moderate"
            : level === 4
            ? "Strong"
            : "Very Strong"}
        </span>
      </div>

      {/* Split Bar (5 parts) */}
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${getBarColor(
              i
            )}`}
          ></div>
        ))}
      </div>

      {/* Requirements */}
      <ul className="text-xs text-gray-700 space-y-1 pl-1">
        <li>
          <span
            className={`font-bold ${
              checkLength ? "text-[#288683]" : "text-red-500"
            }`}
          >
            {checkLength ? "✔" : "✘"}
          </span>{" "}
          At least 6 characters
        </li>
        <li>
          <span
            className={`font-bold ${
              hasUpper ? "text-[#288683]" : "text-red-500"
            }`}
          >
            {hasUpper ? "✔" : "✘"}
          </span>{" "}
          Contains uppercase letter
        </li>
        <li>
          <span
            className={`font-bold ${
              hasLower ? "text-[#288683]" : "text-red-500"
            }`}
          >
            {hasLower ? "✔" : "✘"}
          </span>{" "}
          Contains lowercase letter
        </li>
        <li>
          <span
            className={`font-bold ${
              hasNumber ? "text-[#288683]" : "text-red-500"
            }`}
          >
            {hasNumber ? "✔" : "✘"}
          </span>{" "}
          Contains a number
        </li>
        <li>
          <span
            className={`font-bold ${
              hasSpecial ? "text-[#288683]" : "text-red-500"
            }`}
          >
            {hasSpecial ? "✔" : "✘"}
          </span>{" "}
          Contains special character
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrengthChecker;