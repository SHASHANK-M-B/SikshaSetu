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
  const scrollRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev || "auto");
  }, []);

  useEffect(() => {
    const closeKey = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", closeKey);
    return () => window.removeEventListener("keydown", closeKey);
  }, [onClose]);

  useEffect(() => {
    if (mode === "register" && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [role, mode]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type, message: "" }), 3500);
  };

  const onBackdropClick = (e) => {
    if (!modalRef.current) return;
    if (!modalRef.current.contains(e.target)) onClose();
  };

  const renderForm = () => {
    if (mode === "login")
      return (
        <LoginForm
          onToggleForm={setMode}
          onClose={onClose}
          showToast={showToast}
          switchMode={setMode}
        />
      );

    if (mode === "forgot")
      return <ForgotPasswordForm showToast={showToast} switchMode={setMode} />;

    if (mode === "otp")
      return <OTPLoginForm showToast={showToast} switchMode={setMode} />;

    if (mode === "register")
      return (
        <div
          ref={scrollRef}
          className="max-h-[85vh] overflow-y-auto customScroll pr-2"
        >
          <div className="space-y-2 mb-3 text-left">
            <p className="text-[11px] font-semibold text-black">
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
            <OrganizationForm
              showToast={showToast}
              onRegisterSuccess={setMode}
            />
          )}
          {role === "teacher" && (
            <TeacherForm showToast={showToast} onRegisterSuccess={setMode} />
          )}
          {role === "student" && (
            <StudentForm showToast={showToast} onRegisterSuccess={setMode} />
          )}
        </div>
      );
  };

  const headerTitle = {
    login: "Welcome Back",
    register: "Create Your Account",
    forgot: "Reset Password",
    otp: "Login via OTP",
  }[mode];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onMouseDown={onBackdropClick}
      >
        <AnimatePresence>
          <motion.div
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-4xl bg-gradient-to-br from-[#f5f7f6] via-[#faf9f6] to-white border border-black/10 rounded-2xl relative shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-300 text-black transition"
            >
              <FiX className="text-xl" />
            </button>

            <div className="px-5 sm:px-7 py-6">
              <div className="flex gap-4 text-xs mb-4">
                <button
                  onClick={() => setMode("login")}
                  className={`pb-2 font-semibold border-b-2 ${mode === "login"
                    ? "border-emerald-500 text-black"
                    : "border-transparent text-black"
                    }`}
                >
                  Login
                </button>

                <button
                  onClick={() => setMode("register")}
                  className={`pb-2 font-semibold border-b-2 ${mode === "register"
                    ? "border-emerald-500 text-black"
                    : "border-transparent text-black"
                    }`}
                >
                  Register
                </button>
              </div>

              <h2 className="text-xl font-extrabold text-black mb-2">
                {headerTitle}
              </h2>

              {renderForm()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Toast type={toast.type} message={toast.message} />
    </>
  );
};

export default AuthModal;
