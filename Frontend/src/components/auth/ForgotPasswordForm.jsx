import React, { useState } from "react";
import InputField from "./InputField";

const ForgotPasswordForm = ({ switchMode, showToast }) => {
    const [data, setData] = useState({ orgCode: "", email: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) =>
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!data.orgCode.trim())
            newErrors.orgCode = "Organization code is required.";
        if (!data.email.trim()) newErrors.email = "Email is required.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showToast("error", "Please fill all required fields.");
            return;
        }

        showToast(
            "success",
            "If this account exists, a reset link has been sent to the email."
        );
        switchMode("login");
    };

    return (
        <form onSubmit={submit} className="space-y-4 mt-4 text-xs md:text-sm">
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
                className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-xs font-semibold"
            >
                Send Reset Link
            </button>

            <button
                type="button"
                onClick={() => switchMode("login")}
                className="w-full p-3 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-800/60"
            >
                Back to Login
            </button>
        </form>
    );
};

export default ForgotPasswordForm;
