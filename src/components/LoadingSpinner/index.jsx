import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center">
      <div
        className="animate-spin rounded-full mt-20 h-16 w-16 border-4 border-t-[#4B7DBF] border-r-[#5155A6] border-b-[#93C5FD] border-l-[#2563EB]"
        style={{ borderColor: "#4B7DBF #5155A6 #93C5FD #2563EB" }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
