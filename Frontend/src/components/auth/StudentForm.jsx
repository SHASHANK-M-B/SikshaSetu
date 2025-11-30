import React, { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import InputField from "./InputField";
import { API_ENDPOINTS } from "../../config/api";

const StudentForm = ({ onRegisterSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    org: "",
    subject: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Institution dropdown (NO "Others")
  const organizations = [
    "Presidency University",
    "Jain University",
    "Rural Polytechnic College",
  ];

  // Local fallback subjects (used if backend fetch fails)
  const FALLBACK_SUBJECTS = ["AI", "VLSI", "Renewable Energy"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if org changes, clear selected subject
    if (name === "org") {
      setFormData((prev) => ({ ...prev, org: value, subject: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // fetch available subjects for selected org
  useEffect(() => {
    if (!formData.org) {
      setAvailableSubjects([]);
      return;
    }

    let cancelled = false;
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const res = await fetch(
          `/api/org/${encodeURIComponent(formData.org)}/subjects`
        );
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (!cancelled) {
          if (Array.isArray(data.subjects) && data.subjects.length > 0) {
            setAvailableSubjects(data.subjects);
          } else {
            setAvailableSubjects(FALLBACK_SUBJECTS);
          }
        }
      } catch (err) {
        // fallback if backend not ready / network error
        if (!cancelled) setAvailableSubjects(FALLBACK_SUBJECTS);
      } finally {
        if (!cancelled) setLoadingSubjects(false);
      }
    };

    fetchSubjects();

    return () => {
      cancelled = true;
    };
  }, [formData.org]);

  const validate = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = "Student name is required.";
    if (!formData.org.trim()) newErrors.org = "Select institution.";
    // subject must be chosen once org is selected (subject dropdown is shown only after org)
    if (formData.org && !formData.subject.trim()) newErrors.subject = "Please select a subject.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

      const res = await fetch(API_ENDPOINTS.STUDENT_REGISTER, {
        method: "POST",
        body: fd,
      });
      const responseData = await res.json();

      // Store response in variable
      const apiResponse = responseData;

      if (!res.ok || !responseData.success) {
        showToast("error", responseData.message || "Registration failed");
        return;
      }

      showToast("success", responseData.message || `Student "${formData.studentName}" registered successfully!`);
      onRegisterSuccess && onRegisterSuccess("login");
    } catch (error) {
      console.error("Registration error:", error);
      showToast("error", "Server error. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-3 text-xs md:text-sm">
      {/* Student Name */}
      <InputField
        label="Student Name"
        name="studentName"
        placeholder="Full Name"
        value={formData.studentName}
        onChange={handleChange}
        error={errors.studentName}
      />

      {/* Institution / College */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-gray-300 font-semibold">Institution / College</label>

        <select
          name="org"
          value={formData.org}
          onChange={handleChange}
          className={`w-full text-gray-100 px-3 py-2 rounded-md text-xs appearance-none
            border ${errors.org ? "border-red-500" : "border-gray-700"}
            bg-gradient-to-r from-[#07182a] via-[#0b2230] to-[#0f2b39]
            hover:from-[#0b2230] hover:to-[#113544]
            focus:ring-2 focus:ring-emerald-500 transition-all duration-150`}
        >
          <option className="bg-[#0d0d0e] text-gray-200" value="">
            -- Select College --
          </option>
          {organizations.map((o) => (
            <option key={o} value={o} className="bg-[#0d0d0e] text-gray-200">
              {o}
            </option>
          ))}
        </select>

        {errors.org && <span className="text-[10px] text-red-400">{errors.org}</span>}
      </div>

      {/* Subject: only shown after organization selected */}
      {formData.org && (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-gray-300 font-semibold">Subject</label>

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={loadingSubjects}
            className={`w-full text-gray-100 px-3 py-2 rounded-md text-xs appearance-none
              border ${errors.subject ? "border-red-500" : "border-gray-700"}
              bg-gradient-to-r from-[#07182a] via-[#0b2230] to-[#0f2b39]
              hover:from-[#0b2230] hover:to-[#113544]
              focus:ring-2 focus:ring-emerald-500 transition-all duration-150 ${loadingSubjects ? "opacity-70" : ""
            }`}
          >
            <option className="bg-[#0d0d0e] text-gray-200" value="">
              {loadingSubjects ? "Loading subjects..." : "-- Choose Subject --"}
            </option>

            {availableSubjects.map((s) => (
              <option key={s} value={s} className="bg-[#0d0d0e] text-gray-200">
                {s}
              </option>
            ))}
          </select>

          {errors.subject && <span className="text-[10px] text-red-400">{errors.subject}</span>}
        </div>
      )}

      {/* Email */}
      <InputField
        label="Email"
        type="email"
        name="email"
        placeholder="Your email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      {/* Password */}
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

      {/* Submit */}
      <button
        type="submit"
        className="w-full p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center justify-center gap-2 mt-2"
      >
        Submit
        <FiArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

export default StudentForm;
