import React from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Toast = ({ type , message, onClose }) => {
    console.log(type,"toast type")
  if (!message) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60]">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm ${
          type === "success"
            ? "bg-emerald-900/90 border-emerald-500 text-emerald-50"
            : "bg-red-900/90 border-red-500 text-red-50"
        }`}
      >
        {type === "success" ? (
          <FiCheckCircle className="w-4 h-4" />
        ) : (
          <FiAlertCircle className="w-4 h-4" />
        )}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-1 text-xs opacity-70 hover:opacity-100"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Toast;
