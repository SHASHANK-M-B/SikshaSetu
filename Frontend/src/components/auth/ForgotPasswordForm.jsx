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
                className="w-full p-3 border border-emerald-500 hover:bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition"
            >
                Send Reset Link
            </button>

            <button
                type="button"
                onClick={() => switchMode("login")}
                className="w-full p-3 border border-gray-300 rounded-lg text-xs text-black hover:bg-gray-100 transition"
            >
                Back to Login
            </button>
        </form>
    );
};

export default ForgotPasswordForm;
