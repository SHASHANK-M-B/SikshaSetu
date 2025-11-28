import React, { useState } from "react";
import InputField from "./InputField";

const OrganizationForm = ({ onRegisterSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    orgName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const req = (v) => !v || v.trim() === "";
    const fields = ["orgName", "email", "phone", "state", "city", "address"];
    const err = {};
    fields.forEach((f) => req(formData[f]) && (err[f] = "Required"));

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

    try {
      const res = await fetch("http://localhost:5000/api/org/register", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!data.success) {
        showToast?.("error", data.message || "Registration failed");
        return;
      }

      showToast?.("success", "Organization submitted for approval!");
      onRegisterSuccess?.("login");
    } catch {
      showToast?.("error", "Server error.");
    }
  };

  return (
    <form onSubmit={submit} className="text-[11px] space-y-3 py-1">
      <InputField name="orgName" label="Organization Name" value={formData.orgName} onChange={handleChange} error={errors.orgName} small />
      <InputField name="email" label="Email Address" value={formData.email} onChange={handleChange} error={errors.email} small />
      <InputField name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} small />

      <div className="grid grid-cols-2 gap-2">
        <InputField name="state" label="State" value={formData.state} onChange={handleChange} error={errors.state} small />
        <InputField name="city" label="City / Town / Village" value={formData.city} onChange={handleChange} error={errors.city} small />
      </div>

      <InputField isTextArea name="address" label="Full Address" value={formData.address} onChange={handleChange} error={errors.address} small />

      <button type="submit" className="w-full p-2 bg-emerald-600 rounded text-white text-[10px]">
        Request For Approval
      </button>
    </form>
  );
};

export default OrganizationForm;
