import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiKey, FiShield, FiUser } from "react-icons/fi";
import InputField from "./InputField";
import { loginOrg, loginTeacher, loginStudent } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = ({ onToggleForm, onClose, showToast, switchMode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    orgCode: "",
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (role === "organization" && !formData.orgCode.trim()) {
      newErrors.orgCode = "Organization code is required";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("error", "Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (role === "organization") {
        response = await loginOrg({
          orgCode: formData.orgCode,
          email: formData.email,
          password: formData.password,
        });
      } else if (role === "teacher") {
        response = await loginTeacher({
          email: formData.email,
          password: formData.password,
        });
      } else if (role === "student") {
        response = await loginStudent({
          email: formData.email,
          password: formData.password,
        });
      }
      console.log(response, "login response");

      if (response.status === 200) {
        if (response.data.user.role === "organization")
          navigate("/organization/dashboard");
        if (response.data.user.role === "teacher")
          navigate("/teacher/dashboard");
        if (response.data.user.role === "student")
          navigate("/student/dashboard");

        onClose();
      } else {
        showToast("error", response.data.message || "Login failed");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials";
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
        ${
          role === id
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

      {role === "organization" && (
        <InputField
          label="Organization Code"
          name="orgCode"
          placeholder="Ex: STR-K7H8"
          value={formData.orgCode}
          onChange={handleChange}
          error={errors.orgCode}
        />
      )}

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

      <div className="flex items-center justify-end text-[11px]">
        {/* <label className="flex items-center gap-2 text-gray-400">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="rounded border-gray-500"
          />
          Remember me
        </label> */}

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
        disabled={loading}
        className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg shadow-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
      >
        <FiLock className="w-4 h-4" />
        {loading ? "Logging in..." : "Log In"}
      </button>

      <div className="flex items-center gap-2 text-[11px] text-gray-500">
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

      <p className="text-center text-[11px] text-gray-400 mt-2">
        Don't have an account?
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
