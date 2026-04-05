import React from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Toast = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60]">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm
          ${type === "success"
            ? "bg-white border-emerald-400 text-black"
            : "bg-white border-red-400 text-black"
          }`}
      >
        {type === "success" ? (
          <FiCheckCircle className="w-4 h-4 text-emerald-600" />
        ) : (
          <FiAlertCircle className="w-4 h-4 text-red-600" />
        )}

        <span className="font-medium">{message}</span>

        <button
          onClick={onClose}
          className="ml-1 text-xs text-black opacity-70 hover:opacity-100 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Toast;
