// src/components/AuthModal.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiX,
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiShield,
    FiBookOpen,
    FiPhone,
    FiArrowRight,
    FiKey,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------- Dummy Users for Login ------------------------- */
const dummyUsers = [
    {
        role: "organization",
        orgCode: "ORG123",
        email: "admin@org.com",
        password: "Admin@123",
    },
    {
        role: "teacher",
        orgCode: "ORG123",
        email: "teacher@org.com",
        password: "Teacher@123",
    },
    {
        role: "student",
        orgCode: "ORG123",
        email: "student@org.com",
        password: "Student@123",
    },
];

/* ------------------------------ Toast UI ------------------------------ */
const Toast = ({ type = "success", message, onClose }) => {
    if (!message) return null;
    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60]">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm ${type === "success"
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

/* ---------------------- Reusable Input Field ---------------------- */
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
        "w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-800/80 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition text-sm";

    const errorClasses = error
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "";

    return (
        <div className="space-y-1 text-left">
            {label && (
                <label
                    htmlFor={name}
                    className="text-xs font-medium text-gray-700 dark:text-gray-300 block"
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
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200 text-xs"
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                )}
            </div>

            {error && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {error}
                </p>
            )}
        </div>
    );
};

/* ----------------------------- Login Form ----------------------------- */
const LoginForm = ({
    onToggleForm,
    onClose,
    showToast,
    switchMode,
}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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

        const user = dummyUsers.find(
            (u) =>
                u.orgCode === formData.orgCode &&
                u.email === formData.email &&
                u.password === formData.password
        );

        if (!user) {
            showToast(
                "error",
                "Invalid Organization Code / Email / Password. Try demo credentials."
            );
            return;
        }

        showToast("success", `Logged in as ${user.role.toUpperCase()}`);

        if (user.role === "organization") {
            navigate("/organization/dashboard");
        } else if (user.role === "teacher") {
            navigate("/teacher/dashboard");
        } else if (user.role === "student") {
            navigate("/student/dashboard");
        }

        onClose();
    };

    return (
        <form onSubmit={submit} className="space-y-4 mt-4 text-xs md:text-sm">
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

/* ------------------------- Organization Form ------------------------- */
const OrganizationForm = ({ onRegisterSuccess, showToast }) => {
    const [step, setStep] = useState(1);
    const [logoPreview, setLogoPreview] = useState(null);
    const [formData, setFormData] = useState({
        orgName: "",
        orgCode: "",
        address: "",
        ownerName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLogoPreview(url);
        }
    };

    const validateStep = () => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.orgName.trim())
                newErrors.orgName = "Organization name is required.";
            if (!formData.orgCode.trim())
                newErrors.orgCode = "Organization code is required.";
            if (!formData.address.trim())
                newErrors.address = "Address is required.";
        } else if (step === 2) {
            if (!formData.ownerName.trim())
                newErrors.ownerName = "Owner name is required.";
            if (!formData.email.trim()) newErrors.email = "Email is required.";
            if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
            if (!formData.password.trim())
                newErrors.password = "Password is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!validateStep()) return;
        setStep(2);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        showToast(
            "success",
            `Organization "${formData.orgName}" registered (code: ${formData.orgCode}).`
        );
        onRegisterSuccess("login");
    };

    return (
        <form onSubmit={submit} className="space-y-4 mt-4 text-xs md:text-sm">
            <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-medium text-cyan-300">Step {step} of 2</span>
                <span className="text-gray-500">
                    {step === 1 ? "Basic Organization Details" : "Admin & Login Setup"}
                </span>
            </div>

            {step === 1 && (
                <>
                    <InputField
                        label="Organization Name"
                        name="orgName"
                        placeholder="Ex: ABC University"
                        value={formData.orgName}
                        onChange={handleChange}
                        error={errors.orgName}
                    />
                    <InputField
                        label="Set Organization Code"
                        name="orgCode"
                        placeholder="Ex: ABC123"
                        value={formData.orgCode}
                        onChange={handleChange}
                        error={errors.orgCode}
                    />
                    <InputField
                        label="Address"
                        name="address"
                        placeholder="Full address"
                        value={formData.address}
                        onChange={handleChange}
                        isTextArea
                        error={errors.address}
                    />
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                            Organization Logo (optional)
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="text-[11px] text-gray-300"
                            />
                            {logoPreview && (
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="w-10 h-10 rounded-full border border-gray-600 object-cover"
                                />
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={nextStep}
                        className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center justify-center gap-2 mt-2"
                    >
                        Next
                        <FiArrowRight className="w-4 h-4" />
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <InputField
                        label="Admin / Owner Name"
                        name="ownerName"
                        placeholder="Full Name"
                        value={formData.ownerName}
                        onChange={handleChange}
                        error={errors.ownerName}
                    />
                    <InputField
                        label="Admin Email"
                        type="email"
                        name="email"
                        placeholder="Admin email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <InputField
                        label="Phone"
                        type="tel"
                        name="phone"
                        placeholder="Contact number"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />
                    <InputField
                        label="Create Password"
                        type="password"
                        name="password"
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        showTogglePassword
                    />

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 p-3 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-800/60"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg text-xs font-semibold"
                        >
                            Register Organization
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

/* --------------------------- Student Form --------------------------- */
const StudentForm = ({ onRegisterSuccess, showToast }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        studentName: "",
        orgCode: "",
        course: "",
        yearSem: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const validateStep = () => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.studentName.trim())
                newErrors.studentName = "Student name is required.";
            if (!formData.orgCode.trim())
                newErrors.orgCode = "Organization code is required.";
            if (!formData.course.trim())
                newErrors.course = "Course is required.";
            if (!formData.yearSem.trim())
                newErrors.yearSem = "Year / Semester is required.";
        } else if (step === 2) {
            if (!formData.email.trim()) newErrors.email = "Email is required.";
            if (!formData.password.trim())
                newErrors.password = "Password is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!validateStep()) return;
        setStep(2);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        showToast("success", `Student "${formData.studentName}" registered.`);
        onRegisterSuccess("login");
    };

    return (
        <form onSubmit={submit} className="space-y-4 mt-4 text-xs md:text-sm">
            <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-medium text-cyan-300">Step {step} of 2</span>
                <span className="text-gray-500">
                    {step === 1 ? "Academic Details" : "Login Setup"}
                </span>
            </div>

            {step === 1 && (
                <>
                    <InputField
                        label="Student Name"
                        name="studentName"
                        placeholder="Full Name"
                        value={formData.studentName}
                        onChange={handleChange}
                        error={errors.studentName}
                    />
                    <InputField
                        label="Organization Code"
                        name="orgCode"
                        placeholder="Org code"
                        value={formData.orgCode}
                        onChange={handleChange}
                        error={errors.orgCode}
                    />
                    <InputField
                        label="Course"
                        name="course"
                        placeholder="Ex: BCA, CSE"
                        value={formData.course}
                        onChange={handleChange}
                        error={errors.course}
                    />
                    <InputField
                        label="Year / Semester"
                        name="yearSem"
                        placeholder="Ex: 2nd Year"
                        value={formData.yearSem}
                        onChange={handleChange}
                        error={errors.yearSem}
                    />

                    <button
                        type="button"
                        onClick={nextStep}
                        className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center justify-center gap-2 mt-2"
                    >
                        Next
                        <FiArrowRight className="w-4 h-4" />
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        showTogglePassword
                    />

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 p-3 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-800/60"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg text-xs font-semibold"
                        >
                            Register Student
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

/* --------------------------- Teacher Form --------------------------- */
const TeacherForm = ({ onRegisterSuccess, showToast }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        teacherName: "",
        orgCode: "",
        subject: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const validateStep = () => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.teacherName.trim())
                newErrors.teacherName = "Teacher name is required.";
            if (!formData.orgCode.trim())
                newErrors.orgCode = "Organization code is required.";
            if (!formData.subject.trim())
                newErrors.subject = "Subject is required.";
        } else if (step === 2) {
            if (!formData.email.trim()) newErrors.email = "Email is required.";
            if (!formData.password.trim())
                newErrors.password = "Password is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!validateStep()) return;
        setStep(2);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        showToast("success", `Teacher "${formData.teacherName}" registered.`);
        onRegisterSuccess("login");
    };

    return (
        <form onSubmit={submit} className="space-y-4 mt-4 text-xs md:text-sm">
            <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-medium text-cyan-300">Step {step} of 2</span>
                <span className="text-gray-500">
                    {step === 1 ? "Basic Details" : "Login Setup"}
                </span>
            </div>

            {step === 1 && (
                <>
                    <InputField
                        label="Teacher Name"
                        name="teacherName"
                        placeholder="Full Name"
                        value={formData.teacherName}
                        onChange={handleChange}
                        error={errors.teacherName}
                    />
                    <InputField
                        label="Organization Code"
                        name="orgCode"
                        placeholder="Org code"
                        value={formData.orgCode}
                        onChange={handleChange}
                        error={errors.orgCode}
                    />
                    <InputField
                        label="Subject"
                        name="subject"
                        placeholder="Ex: Maths, English"
                        value={formData.subject}
                        onChange={handleChange}
                        error={errors.subject}
                    />

                    <button
                        type="button"
                        onClick={nextStep}
                        className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center justify-center gap-2 mt-2"
                    >
                        Next
                        <FiArrowRight className="w-4 h-4" />
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Official email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        showTogglePassword
                    />

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 p-3 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-800/60"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg text-xs font-semibold"
                        >
                            Register Teacher
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

/* ------------------------ Forgot Password Form ------------------------ */
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

/* -------------------------- OTP Login Form -------------------------- */
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
        if (!data.email.trim()) newErrors.email = "Email is required.";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showToast("error", "Please fill all required fields.");
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOTP(otp);

        console.log("Mock OTP (for demo):", otp);
        showToast(
            "success",
            "OTP sent (demo only). Check console for the generated OTP."
        );
        setStep(2);
    };

    const verifyOtp = (e) => {
        e.preventDefault();
        if (!data.otp.trim()) {
            showToast("error", "Please enter the OTP.");
            return;
        }
        if (data.otp !== generatedOTP) {
            showToast("error", "Invalid OTP. Please try again.");
            return;
        }
        showToast("success", "OTP verified. Logged in as STUDENT (demo).");
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

/* -------------------------- Role Card Selector -------------------------- */
const RoleCard = ({ id, label, description, icon: Icon, active, onClick }) => {
    return (
        <button
            type="button"
            onClick={() => onClick(id)}
            className={`flex-1 min-w-[90px] px-3 py-3 rounded-xl border text-left text-xs md:text-sm transition-all flex flex-col gap-1 ${active
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-100 shadow-lg shadow-cyan-500/30"
                    : "border-gray-700 bg-gray-900/50 text-gray-300 hover:border-cyan-500/60 hover:bg-gray-900"
                }`}
        >
            <div className="flex items-center gap-2">
                <span
                    className={`p-1.5 rounded-md ${active ? "bg-cyan-500 text-gray-900" : "bg-gray-800 text-cyan-300"
                        }`}
                >
                    <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="font-semibold">{label}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">{description}</p>
        </button>
    );
};

/* ------------------------------ MAIN MODAL ------------------------------ */
const AuthModal = ({ initialFormType = "login", onClose }) => {
    const [mode, setMode] = useState(initialFormType); // login | register | forgot | otp
    const [role, setRole] = useState("student");
    const [toast, setToast] = useState({ type: "success", message: "" });
    const modalRef = useRef(null);

    /* Close on Esc */
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose && onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => {
            setToast((t) => (t.message ? { ...t, message: "" } : t));
        }, 3500);
    };

    const onBackdropClick = (e) => {
        if (!modalRef.current) return;
        if (!modalRef.current.contains(e.target)) {
            onClose && onClose();
        }
    };

    const switchMode = (newMode) => setMode(newMode);

    const renderForm = () => {
        if (mode === "login") {
            return (
                <LoginForm
                    onToggleForm={setMode}
                    onClose={onClose}
                    showToast={showToast}
                    switchMode={switchMode}
                />
            );
        }
        if (mode === "forgot") {
            return <ForgotPasswordForm switchMode={switchMode} showToast={showToast} />;
        }
        if (mode === "otp") {
            return <OTPLoginForm switchMode={switchMode} showToast={showToast} />;
        }
        if (mode === "register") {
            return (
                <>
                    <div className="space-y-2 mb-3 text-left">
                        <p className="text-[11px] font-semibold text-gray-300">
                            Select your role
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <RoleCard
                                id="organization"
                                label="Organization"
                                description="Institute admin / owner"
                                icon={FiShield}
                                active={role === "organization"}
                                onClick={setRole}
                            />
                            <RoleCard
                                id="teacher"
                                label="Teacher"
                                description="Faculty / teaching staff"
                                icon={FiBookOpen}
                                active={role === "teacher"}
                                onClick={setRole}
                            />
                            <RoleCard
                                id="student"
                                label="Student"
                                description="Learner enrolled in any course"
                                icon={FiUser}
                                active={role === "student"}
                                onClick={setRole}
                            />
                        </div>
                    </div>

                    {role === "organization" && (
                        <OrganizationForm
                            onRegisterSuccess={setMode}
                            showToast={showToast}
                        />
                    )}
                    {role === "student" && (
                        <StudentForm onRegisterSuccess={setMode} showToast={showToast} />
                    )}
                    {role === "teacher" && (
                        <TeacherForm onRegisterSuccess={setMode} showToast={showToast} />
                    )}
                </>
            );
        }
        return null;
    };

    const headerTitle =
        mode === "login"
            ? "Welcome Back"
            : mode === "register"
                ? "Create Your Account"
                : mode === "forgot"
                    ? "Reset Password"
                    : "Login via OTP";

    const headerSubtitle =
        mode === "login"
            ? "Use the demo credentials or your campus account to continue."
            : mode === "register"
                ? "Tell us who you are and we’ll personalize your experience."
                : mode === "forgot"
                    ? "Enter your registered details to receive a reset link."
                    : "Quick access using a one-time passcode.";

    return (
        <>
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onMouseDown={onBackdropClick}
            >
                <AnimatePresence>
                    <motion.div
                        ref={modalRef}
                        onMouseDown={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="bg-[#050816]/95 border border-cyan-500/20 w-full max-w-4xl mx-auto rounded-2xl shadow-[0_0_60px_rgba(34,211,238,0.35)] overflow-hidden relative"
                    >
                        {/* Top gradient line */}
                        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400" />

                        {/* Close Button */}
                        <button
                            onClick={() => onClose && onClose()}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 border border-gray-700 text-gray-300 hover:text-white transition z-10"
                            aria-label="Close modal"
                        >
                            <FiX className="text-xl" />
                        </button>

                        {/* Split Layout */}
                        <div className="flex flex-col md:flex-row">
                            {/* Left Info Side */}
                            <div className="hidden md:flex md:w-5/12 relative overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#020617] to-[#020617] px-7 py-8 flex-col justify-between">
                                <div className="absolute -top-16 -left-16 w-40 h-40 bg-cyan-500/15 blur-3xl rounded-full" />
                                <div className="absolute bottom-0 right-0 w-52 h-52 bg-indigo-500/20 blur-3xl rounded-full" />

                                <div className="relative space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-cyan-500/30 text-[10px] uppercase tracking-[0.22em] text-cyan-200">
                                        <FiShield className="w-3 h-3" />
                                        RuralRemoteClass
                                    </div>

                                    <h2 className="text-2xl font-extrabold text-white leading-snug">
                                        One login for
                                        <br />
                                        every campus role.
                                    </h2>

                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        Built for rural & remote institutions where connectivity
                                        fluctuates, but learning can’t stop. Students, teachers and
                                        admins share a single, secure access layer.
                                    </p>

                                    <ul className="text-[11px] text-gray-300 space-y-2 mt-4">
                                        <li className="flex gap-2 items-center">
                                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[9px]">
                                                <FiCheckCircle />
                                            </span>
                                            Offline-first learning packets
                                        </li>
                                        <li className="flex gap-2 items-center">
                                            <span className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[9px]">
                                                <FiCheckCircle />
                                            </span>
                                            Role-based dashboards & analytics
                                        </li>
                                        <li className="flex gap-2 items-center">
                                            <span className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-[9px]">
                                                <FiCheckCircle />
                                            </span>
                                            Institute-friendly deployment & support
                                        </li>
                                    </ul>
                                </div>

                                <div className="relative mt-6 text-[10px] text-gray-400">
                                    <p className="font-semibold text-cyan-300 mb-1">
                                        Demo Access
                                    </p>
                                    <p>
                                        Use the demo credentials shared with you, or ask your
                                        campus admin for your login details.
                                    </p>
                                </div>
                            </div>

                            {/* Right Form Side */}
                            <div className="w-full md:w-7/12 px-5 sm:px-7 py-6 bg-[#020617]/95">
                                {/* Tabs: Login / Register */}
                                <div className="flex items-center gap-4 mb-4 text-xs md:text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className={`pb-2 border-b-2 transition text-xs font-semibold ${mode === "login"
                                                ? "border-cyan-400 text-cyan-300"
                                                : "border-transparent text-gray-400 hover:text-gray-200"
                                            }`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMode("register")}
                                        className={`pb-2 border-b-2 transition text-xs font-semibold ${mode === "register"
                                                ? "border-cyan-400 text-cyan-300"
                                                : "border-transparent text-gray-400 hover:text-gray-200"
                                            }`}
                                    >
                                        Register
                                    </button>
                                </div>

                                {/* Header */}
                                <div className="space-y-1 mb-4 text-left">
                                    <h2 className="text-xl md:text-2xl font-extrabold text-white">
                                        {headerTitle}
                                    </h2>
                                    <p className="text-[11px] md:text-xs text-gray-400">
                                        {headerSubtitle}
                                    </p>
                                </div>

                                {/* Actual Forms */}
                                {renderForm()}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((t) => ({ ...t, message: "" }))}
            />
        </>
    );
};

export default AuthModal;
