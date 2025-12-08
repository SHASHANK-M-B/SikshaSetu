import React, { useState } from "react";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";

const InputField = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  isTextArea = false,
  error,
  showTogglePassword = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" && showPassword ? "text" : type || "text";

  const commonClasses =
    "w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white border-gray-300 text-black placeholder-gray-500 transition text-sm";

  const errorClasses = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";

  return (
    <div className="space-y-1 text-left">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-black block"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {isTextArea ? (
          <textarea
            id={name}
            name={name}
            rows={4}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${commonClasses} ${errorClasses} resize-none`}
          />
        ) : (
          <input
            id={name}
            type={inputType}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${commonClasses} ${errorClasses}`}
          />
        )}

        {type === "password" && showTogglePassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute inset-y-0 right-3 flex items-center text-black hover:text-gray-700 text-xs"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-600 flex items-center gap-1">
          <FiAlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
