import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = ({ message = "Welcome to ShikshaSetu" }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-50/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Main Spinner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="h-20 w-20 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600/30"
        />

        {/* Inner Pulsing Orbit */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute top-5 h-10 w-10 rounded-full bg-indigo-600/20 blur-sm"
        />

        {/* Branding & Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Shiksha<span className="text-indigo-600">Setu</span>
          </span>
          <p className="text-sm font-medium animate-pulse text-gray-500">
            {message}...
          </p>
        </motion.div>

        {/* Decorative Particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400"
            style={{
              top: "40%",
              left: "50%",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
