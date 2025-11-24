import React, { useState, useEffect, useRef } from "react";
import { FiX, FiShield, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import OTPLoginForm from "./OTPLoginForm";
import OrganizationForm from "./OrganizationForm";
import StudentForm from "./StudentForm";
import TeacherForm from "./TeacherForm";
import RoleCard from "./RoleCard";
import Toast from "./Toast";

const AuthModal = ({ initialFormType = "login", onClose }) => {
    const [mode, setMode] = useState(initialFormType);
    const [role, setRole] = useState("student");
    const [toast, setToast] = useState({ type: "success", message: "" });

    const modalRef = useRef(null);

    /* Close on ESC */
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

    const switchMode = (newMode) => setMode(newMode);

    const onBackdropClick = (e) => {
        if (!modalRef.current) return;
        if (!modalRef.current.contains(e.target)) onClose && onClose();
    };

    /* Render Form */
    const renderForm = () => {
        if (mode === "login")
            return (
                <LoginForm
                    onToggleForm={setMode}
                    onClose={onClose}
                    showToast={showToast}
                    switchMode={switchMode}
                />
            );

        if (mode === "forgot")
            return <ForgotPasswordForm switchMode={switchMode} showToast={showToast} />;

        if (mode === "otp")
            return <OTPLoginForm switchMode={switchMode} showToast={showToast} />;

        if (mode === "register")
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
                                icon={FiCheckCircle}
                                active={role === "teacher"}
                                onClick={setRole}
                            />
                            <RoleCard
                                id="student"
                                label="Student"
                                description="Learner enrolled in any course"
                                icon={FiCheckCircle}
                                active={role === "student"}
                                onClick={setRole}
                            />
                        </div>
                    </div>

                    {role === "organization" && (
                        <OrganizationForm onRegisterSuccess={setMode} showToast={showToast} />
                    )}
                    {role === "teacher" && (
                        <TeacherForm onRegisterSuccess={setMode} showToast={showToast} />
                    )}
                    {role === "student" && (
                        <StudentForm onRegisterSuccess={setMode} showToast={showToast} />
                    )}
                </>
            );

        return null;
    };

    /* Modal Title */
    const headerTitle =
        mode === "login"
            ? "Welcome Back"
            : mode === "register"
                ? "Create Your Account"
                : mode === "forgot"
                    ? "Reset Password"
                    : "Login via OTP";

    /* Modal Subtitle */
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
                        className="bg-[#050816]/95 border border-cyan-500/20 w-full max-w-4xl mx-auto rounded-2xl overflow-hidden relative"
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => onClose && onClose()}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 border border-gray-700 text-gray-300 hover:text-white transition z-10"
                        >
                            <FiX className="text-xl" />
                        </button>

                        {/* MAIN SPLIT */}
                        <div className="flex flex-col md:flex-row">
                            {/* FORM SIDE */}
                            <div className="w-full px-5 sm:px-7 py-6 bg-[#020617]/95">
                                {/* TABS */}
                                <div className="flex items-center gap-4 mb-4 text-xs md:text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className={`pb-2 border-b-2 font-semibold ${mode === "login"
                                                ? "border-cyan-400 text-cyan-300"
                                                : "border-transparent text-gray-400"
                                            }`}
                                    >
                                        Login
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMode("register")}
                                        className={`pb-2 border-b-2 font-semibold ${mode === "register"
                                                ? "border-cyan-400 text-cyan-300"
                                                : "border-transparent text-gray-400"
                                            }`}
                                    >
                                        Register
                                    </button>
                                </div>

                                {/* TITLE + SUBTITLE */}
                                <div className="space-y-1 mb-4 text-left">
                                    <h2 className="text-xl md:text-2xl font-extrabold text-white">
                                        {headerTitle}
                                    </h2>
                                    <p className="text-[11px] md:text-xs text-gray-400">
                                        {headerSubtitle}
                                    </p>
                                </div>

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
