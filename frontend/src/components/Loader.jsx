// components/Loader.jsx
const Loader = ({ size = 24, className = "" }) => {
  return (
    <div
      className={`border-4 border-t-4 border-gray-200 rounded-full border-t-[#288683] ${className}`}
      style={{
        width: size,
        height: size,
        borderTopColor: "#288683",
        animation: "spin 1s linear infinite",
      }}
    />
  );
};

export default Loader;