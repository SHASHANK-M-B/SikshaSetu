import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiKey, FiShield, FiUser } from "react-icons/fi";
import InputField from "./InputField";
import { dummyUsers } from "./dummyUsers";

const LoginForm = ({ onToggleForm, onClose, showToast, switchMode }) => {
    const navigate = useNavigate();

    const [role, setRole] = useState(""); // new
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!role) newErrors.role = "Please select your role";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validate()) {
            showToast("error", "Please fill all required fields.");
            return;
        }

        // authenticates using role + email + password
        const user = dummyUsers.find(
            (u) =>
                u.email === formData.email &&
                u.password === formData.password &&
                u.role === role
        );

        if (!user) {
            showToast("error", "Invalid credentials for selected role.");
            return;
        }

        showToast("success", `Logged in as ${role.toUpperCase()}`);

        if (role === "organization") navigate("/organization/dashboard");
        if (role === "teacher") navigate("/teacher/dashboard");
        if (role === "student") navigate("/student/dashboard");

        onClose();
    };

    // UI COMPONENT
    const RoleCard = ({ id, label }) => (
        <button
            type="button"
            onClick={() => setRole(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs border transition
                ${role === id
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                    : "bg-black/30 border-gray-700 text-gray-400 hover:bg-black/50"
                }`}
        >
            {id === "organization" && <FiShield />}
            {id === "teacher" && <FiUser />}
            {id === "student" && <FiUser />}
            {label}
        </button>
    );

    return (
        <form onSubmit={submit} className="space-y-4 mt-4 text-xs md:text-sm">

            {/* 🔥 ROLE SELECT */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] text-gray-300 font-semibold">
                    Choose Your Role
                </label>
                <div className="flex gap-2 flex-wrap">
                    <RoleCard id="organization" label="Organization" />
                    <RoleCard id="teacher" label="Teacher" />
                    <RoleCard id="student" label="Student" />
                </div>
                {errors.role && (
                    <span className="text-[10px] text-red-400">{errors.role}</span>
                )}
            </div>

            {/* Email */}
            <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />

            {/* Password */}
            <InputField
                label="Password"
                type="password"
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                showTogglePassword
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 text-gray-400">
                    <input
                        type="checkbox"
                        name="remember"
                        checked={formData.remember}
                        onChange={handleChange}
                        className="rounded border-gray-500"
                    />
                    Remember me
                </label>

                <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                    onClick={() => switchMode("forgot")}
                >
                    Forgot password?
                </button>
            </div>

            {/* Login */}
            <button
                type="submit"
                className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
                <FiLock className="w-4 h-4" />
                Log In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <span className="h-px bg-gray-700 flex-1" />
                <span>or</span>
                <span className="h-px bg-gray-700 flex-1" />
            </div>

            {/* OTP */}
            <button
                type="button"
                onClick={() => switchMode("otp")}
                className="w-full p-3 border border-cyan-500/60 hover:bg-cyan-500/10 text-cyan-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
            >
                <FiKey className="w-4 h-4" />
                Login with One-Time OTP
            </button>

            {/* Register CTA */}
            <p className="text-center text-[11px] text-gray-400 mt-2">
                Don’t have an account?
                <button
                    type="button"
                    onClick={() => onToggleForm("register")}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold ml-1"
                >
                    Register
                </button>
            </p>
        </form>
    );
};

export default LoginForm;
