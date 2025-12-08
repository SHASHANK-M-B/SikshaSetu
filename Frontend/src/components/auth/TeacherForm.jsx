import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import { registerTeacher, getOrgList } from "../../api/auth";

const TeacherForm = ({ onRegisterSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    name: "",
    orgCode: "",
    subject: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  const subjects = [
    { subject: "AI" },
    { subject: "VLSI" },
    { subject: "Renewable Energy" },
    { subject: "Others" },
  ];

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getOrgList();
        if (response.status === 200) {
          setOrganizations(response.data.organizations || []);
        }
      } catch {
        showToast("error", "Failed to load organizations");
      } finally {
        setLoadingOrgs(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.orgCode.trim()) newErrors.orgCode = "Select organization";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await registerTeacher(formData);
      if (response.status === 201) {
        showToast(
          "success",
          "Registration submitted! Wait for organization approval."
        );
        onRegisterSuccess("login");
      } else {
        showToast("error", response.data.message || "Registration failed");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Server error. Please try again.";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-3 text-xs md:text-sm px-2">
      <InputField
        label="Name"
        name="name"
        placeholder="Full name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      {/* Organization Select */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-black font-semibold">
          Organization
        </label>

        <select
          name="orgCode"
          value={formData.orgCode}
          onChange={handleChange}
          disabled={loadingOrgs}
          className="w-full p-3 pr-10 border rounded-lg
          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
          bg-white border-gray-300 text-black transition text-sm"
        >
          <option value="">
            {loadingOrgs ? "Loading..." : "-- Select Organization --"}
          </option>

          {organizations.map((org) => (
            <option key={org.orgCode} value={org.orgCode}>
              {org.orgName}
            </option>
          ))}
        </select>

        {errors.orgCode && (
          <span className="text-[10px] text-red-600">{errors.orgCode}</span>
        )}
      </div>

      {/* Subject Select */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-black font-semibold">
          Subjects
        </label>

        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-3 pr-10 border rounded-lg
          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
          bg-white border-gray-300 text-black transition text-sm"
        >
          <option value="">-- Select Subject --</option>

          {subjects.map((sub) => (
            <option key={sub.subject} value={sub.subject}>
              {sub.subject}
            </option>
          ))}
        </select>

        {errors.subject && (
          <span className="text-[10px] text-red-600">{errors.subject}</span>
        )}
      </div>

      <InputField
        label="Email"
        type="email"
        name="email"
        placeholder="Official email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <button
        type="submit"
        disabled={loading || loadingOrgs}
        className="w-full p-3 bg-emerald-600 hover:bg-emerald-500
        disabled:bg-gray-400 disabled:cursor-not-allowed
        text-white rounded-lg shadow-lg text-xs font-semibold
        flex items-center justify-center gap-2 mt-2 transition"
      >
        {loading ? "Submitting..." : "Request For Approval"}
      </button>
    </form>
  );
};

export default TeacherForm;
