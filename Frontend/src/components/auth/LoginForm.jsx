import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiKey } from "react-icons/fi";
import InputField from "./InputField";
import { dummyUsers } from "./dummyUsers";

const LoginForm = ({ onToggleForm, onClose, showToast, switchMode }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: "organization",     // NEW FIELD
        orgCode: "",
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
        if (!formData.role) newErrors.role = "Select a role";
        if (!formData.orgCode.trim()) newErrors.orgCode = "Organization code is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        if (!formData.password.trim()) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validate()) {
            showToast("error", "Please fill all required fields.");
            return;
        }

        // Check in dummyUsers
        const user = dummyUsers.find(
            (u) =>
                u.role === formData.role &&             // MATCH ROLE
                u.orgCode === formData.orgCode &&
                u.email === formData.email &&
                u.password === formData.password
        );

        if (!user) {
            showToast("error", "Invalid credentials or role mismatch.");
            return;
        }

        showToast("success", `Logged in as ${user.role.toUpperCase()}`);

        // Redirect by role
        if (user.role === "organization") navigate("/organization/dashboard");
        else if (user.role === "teacher") navigate("/teacher/dashboard");
        else if (user.role === "student") navigate("/student/dashboard");

        onClose();
    };

    return (
        <form onSubmit={submit} className="space-y-4 mt-4 text-xs md:text-sm">

            {/* ROLE DROPDOWN */}
            <div>
                <label className="text-gray-300 text-xs font-medium">Select Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-600"
                >
                    <option value="organization">Organization</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                </select>
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
            </div>

            <InputField
                label="Organization Code"
                name="orgCode"
                placeholder="Ex: ORG123"
                value={formData.orgCode}
                onChange={handleChange}
                error={errors.orgCode}
            />

            <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />

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

            <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
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

            <button
                type="submit"
                className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
                <FiLock className="w-4 h-4" />
                Log In
            </button>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-300">
                <span className="h-px bg-gray-700 flex-1" />
                <span>or</span>
                <span className="h-px bg-gray-700 flex-1" />
            </div>

            <button
                type="button"
                onClick={() => switchMode("otp")}
                className="w-full p-3 border border-cyan-500/60 hover:bg-cyan-500/10 text-cyan-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
            >
                <FiKey className="w-4 h-4" />
                Login with One-Time OTP
            </button>

            <p className="text-center text-[11px] text-gray-500 dark:text-gray-300 mt-2">
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
