import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiKey, FiShield, FiUser } from "react-icons/fi";
import InputField from "./InputField";
import {
  requestOrgOtp,
  verifyOrgOtp,
  requestTeacherOtp,
  verifyTeacherOtp,
  requestStudentOtp,
  verifyStudentOtp,
} from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

const OTPLoginForm = ({ switchMode, showToast }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [data, setData] = useState({ orgCode: "", email: "", otp: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const sendOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!role) newErrors.role = "Please select your role";
    if (role === "organization" && !data.orgCode.trim()) {
      newErrors.orgCode = "Organization code is required";
    }
    if (!data.email.trim()) newErrors.email = "Email is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("error", "Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (role === "organization") {
        response = await requestOrgOtp({
          orgCode: data.orgCode,
          email: data.email,
        });
      } else if (role === "teacher") {
        response = await requestTeacherOtp({ email: data.email });
      } else if (role === "student") {
        response = await requestStudentOtp({ email: data.email });
      }

      if (response.status === 200) {
        showToast("success", "OTP sent to your email");
        setStep(2);
      } else {
        showToast("error", response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!data.otp.trim()) {
      showToast("error", "Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (role === "organization") {
        response = await verifyOrgOtp({
          orgCode: data.orgCode,
          email: data.email,
          otp: data.otp,
        });
      } else if (role === "teacher") {
        response = await verifyTeacherOtp({ email: data.email, otp: data.otp });
      } else if (role === "student") {
        response = await verifyStudentOtp({ email: data.email, otp: data.otp });
      }

      if (response.status === 200) {
        const userData = {
          role,
          email: data.email,
          ...response.data.user,
        };

        login(userData);
        showToast("success", `Logged in as ${role.toUpperCase()}`);

        if (role === "organization") navigate("/organization/dashboard");
        if (role === "teacher") navigate("/teacher/dashboard");
        if (role === "student") navigate("/student/dashboard");

        switchMode("login");
      } else {
        showToast("error", response.data.message || "Invalid OTP");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid OTP. Try again.";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const RoleCard = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setRole(id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs border transition
        ${role === id
          ? "bg-emerald-100 border-emerald-400 text-black"
          : "bg-white border-gray-300 text-black hover:bg-gray-100"
        }`}
    >
      {id === "organization" && <FiShield />}
      {id === "teacher" && <FiUser />}
      {id === "student" && <FiUser />}
      {label}
    </button>
  );

  return (
    <div className="mt-4 text-xs md:text-sm">
      {step === 1 && (
        <form onSubmit={sendOtp} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] text-black font-semibold">
              Choose Your Role
            </label>
            <div className="flex gap-2 flex-wrap">
              <RoleCard id="organization" label="Organization" />
              <RoleCard id="teacher" label="Teacher" />
              <RoleCard id="student" label="Student" />
            </div>
            {errors.role && (
              <span className="text-[10px] text-red-600">{errors.role}</span>
            )}
          </div>

          {role === "organization" && (
            <InputField
              label="Organization Code"
              name="orgCode"
              placeholder="Ex: STR-K7H8"
              value={data.orgCode}
              onChange={handleChange}
              error={errors.orgCode}
            />
          )}

          <InputField
            label="Registered Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={handleChange}
            error={errors.email}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <FiKey className="w-4 h-4" />
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <button
            type="button"
            onClick={() => switchMode("login")}
            className="w-full p-3 border border-gray-300 rounded-lg text-xs text-black hover:bg-gray-100 transition"
          >
            Back to Login
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp} className="space-y-4">
          <InputField
            label="Enter OTP"
            name="otp"
            placeholder="6-digit code"
            value={data.otp}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg text-xs font-semibold transition"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full p-3 border border-gray-300 rounded-lg text-xs text-black hover:bg-gray-100 transition"
          >
            Resend / Change Email
          </button>
        </form>
      )}
    </div>
  );
};

export default OTPLoginForm;
