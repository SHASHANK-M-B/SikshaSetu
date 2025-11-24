import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiKey } from "react-icons/fi";
import InputField from "./InputField";

const OTPLoginForm = ({ switchMode, showToast }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({ orgCode: "", email: "", otp: "" });
    const [errors, setErrors] = useState({});
    const [generatedOTP, setGeneratedOTP] = useState(null);

    const handleChange = (e) =>
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const sendOtp = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!data.orgCode.trim())
            newErrors.orgCode = "Organization code is required.";
        if (!data.email.trim())
            newErrors.email = "Email is required.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showToast("error", "Please fill all required fields.");
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOTP(otp);

        console.log("Mock OTP (demo):", otp);
        showToast("success", "OTP sent. (Check console for demo OTP)");
        setStep(2);
    };

    const verifyOtp = (e) => {
        e.preventDefault();
        if (!data.otp.trim()) {
            showToast("error", "Please enter the OTP.");
            return;
        }

        if (data.otp !== generatedOTP) {
            showToast("error", "Invalid OTP. Try again.");
            return;
        }

        showToast("success", "OTP Verified! Logged in as STUDENT (demo).");
        navigate("/student/dashboard");
        switchMode("login");
    };

    return (
        <div className="mt-4 text-xs md:text-sm">
            {step === 1 && (
                <form onSubmit={sendOtp} className="space-y-4">
                    <InputField
                        label="Organization Code"
                        name="orgCode"
                        placeholder="Ex: ORG123"
                        value={data.orgCode}
                        onChange={handleChange}
                        error={errors.orgCode}
                    />

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
                        className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center justify-center gap-2"
                    >
                        <FiKey className="w-4 h-4" />
                        Send OTP
                    </button>

                    <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="w-full p-3 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-800/60"
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
                        className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-xs font-semibold"
                    >
                        Verify & Login
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full p-3 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-800/60"
                    >
                        Resend / Change Email
                    </button>
                </form>
            )}
        </div>
    );
};

export default OTPLoginForm;
