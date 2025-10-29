import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Getting fresh from the farm...");

  const loadingMessages = [
    "Getting fresh from the farm...",
    "Collecting the finest dairy products...",
    // "Preparing your order...",
    // "Quality checking our products...",
    // "Almost ready..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 10);

    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center w-80">
        <img
          src={logo}
          alt="Logo"
          className="w-52 h-40 mb-8"
        />
        <p className="mb-6 text-gray-700 dark:text-gray-200 text-lg font-medium text-center">
          {loadingText}
        </p>
        
        {/* Progress Bar */}
        {/* <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div> */}
        
        {/* <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
          {progress}%
        </p> */}
      </div>
    </div>
  );
};

export default LoadingScreen;