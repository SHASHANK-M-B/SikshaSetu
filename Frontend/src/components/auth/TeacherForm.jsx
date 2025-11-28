import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import InputField from "./InputField";

const TeacherForm = ({ onRegisterSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    subject: "",
    customSubject: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const organizations = [
    "Presidency University",
    "Jain University",
    "Rural Polytechnic College",
  ];

  const subjects = ["AI", "VLSI", "Renewable Energy", "Others"];

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.org.trim()) newErrors.org = "Select institution.";
    if (!formData.subject.trim()) newErrors.subject = "Select a subject.";
    if (formData.subject === "Others" && !formData.customSubject.trim())
      newErrors.customSubject = "Enter your subject.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalSubject =
      formData.subject === "Others" ? formData.customSubject : formData.subject;

    showToast(
      "success",
      `Experts/Trainers "${formData.name}" registered for subject: ${finalSubject}`
    );

    onRegisterSuccess && onRegisterSuccess("login");
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-3 text-xs md:text-sm">
      {/* NAME */}
      <InputField
        label="Name"
        name="name"
        placeholder="Full name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      {/* INSTITUTION / COLLEGE — gradient front + dark options */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-gray-300 font-semibold">
          Institution / College
        </label>

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

        {errors.org && (
          <span className="text-[10px] text-red-400">{errors.org}</span>
        )}
      </div>

      {/* SUBJECT — gradient front + dark options (keeps Others) */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-gray-300 font-semibold">Subject</label>

        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full text-gray-100 px-3 py-2 rounded-md text-xs appearance-none
            border ${errors.subject ? "border-red-500" : "border-gray-700"}
            bg-gradient-to-r from-[#07182a] via-[#0b2230] to-[#0f2b39]
            hover:from-[#0b2230] hover:to-[#113544]
            focus:ring-2 focus:ring-emerald-500 transition-all duration-150`}
        >
          <option className="bg-[#0d0d0e] text-gray-200" value="">
            -- Select Subject --
          </option>
          {subjects.map((s) => (
            <option key={s} value={s} className="bg-[#0d0d0e] text-gray-200">
              {s}
            </option>
          ))}
        </select>

        {errors.subject && (
          <span className="text-[10px] text-red-400">{errors.subject}</span>
        )}
      </div>

      {/* CUSTOM SUBJECT */}
      {formData.subject === "Others" && (
        <InputField
          label="Your Subject"
          name="customSubject"
          placeholder="Ex: Robotics, NLP"
          value={formData.customSubject}
          onChange={handleChange}
          error={errors.customSubject}
        />
      )}

      {/* EMAIL */}
      <InputField
        label="Email"
        type="email"
        name="email"
        placeholder="Official email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      {/* PASSWORD */}
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

      {/* SUBMIT BUTTON */}
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

export default TeacherForm;
