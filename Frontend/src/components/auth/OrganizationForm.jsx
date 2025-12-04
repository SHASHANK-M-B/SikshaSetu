import React, { useState } from "react";
import InputField from "./InputField";
import { registerOrg } from "../../api/auth";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!formData.orgName.trim()) err.orgName = "Required";
    if (!formData.email.trim()) err.email = "Required";
    if (!formData.phone.trim()) err.phone = "Required";
    if (!formData.state.trim()) err.state = "Required";
    if (!formData.city.trim()) err.city = "Required";
    if (!formData.address.trim()) err.address = "Required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await registerOrg(formData);

      if (response.status === 201) {
        showToast(
          "success",
          "Registration submitted! Check email for approval status."
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
    <form onSubmit={submit} className="text-[11px] space-y-2 py-1">
      <div className="grid grid-cols-2 gap-2 px-0.5">
        <InputField
          name="orgName"
          label="Organization Name"
          value={formData.orgName}
          onChange={handleChange}
          error={errors.orgName}
        />
        <InputField
          name="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <InputField
          name="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <InputField
          name="state"
          label="State"
          value={formData.state}
          onChange={handleChange}
          error={errors.state}
        />
        <InputField
          name="city"
          label="City"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
        />
      </div>
      <div className="px-0.5">
        <InputField
          isTextArea
          name="address"
          label="Full Address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-[10px] transition"
      >
        {loading ? "Submitting..." : "Request For Approval"}
      </button>
    </form>
  );
};

export default OrganizationForm;
