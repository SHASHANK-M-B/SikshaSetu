import React, { useState } from "react";
import InputField from "./InputField";

const OrganizationForm = ({ onRegisterSuccess, showToast }) => {
    const [formData, setFormData] = useState({
        orgName: "",
        address: "",
        city: "",
        state: "",
        country: "",
        email: "",
        phone: "",
        ownerName: "",
        adminEmail: "",
        adminPhone: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const validate = () => {
        const req = (v) => !v || v.trim() === "";
        const fields = [
            "orgName", "address", "city", "state", "country",
            "email", "phone", "ownerName", "adminEmail", "adminPhone"
        ];

        let err = {};
        fields.forEach((f) => req(formData[f]) && (err[f] = "Required"));
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await fetch("http://localhost:5000/api/org/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!data.success) return showToast("error", data.message);

            showToast("success", "Organization submitted for approval!");
            onRegisterSuccess("login");
        } catch {
            showToast("error", "Server error.");
        }
    };

    return (
        <form onSubmit={submit} className="text-[11px] space-y-3 py-1">
            <InputField name="orgName" label="Organization Name" value={formData.orgName} onChange={handleChange} error={errors.orgName} small />

            <InputField isTextArea name="address" label="Address" value={formData.address} onChange={handleChange} error={errors.address} small />

            <div className="grid grid-cols-2 gap-2">
                <InputField name="city" label="City" value={formData.city} onChange={handleChange} error={errors.city} small />
                <InputField name="state" label="State" value={formData.state} onChange={handleChange} error={errors.state} small />
            </div>

            <InputField name="country" label="Country" value={formData.country} onChange={handleChange} error={errors.country} small />
            <InputField name="email" label="Official Email" value={formData.email} onChange={handleChange} error={errors.email} small />
            <InputField name="phone" label="Official Phone" value={formData.phone} onChange={handleChange} error={errors.phone} small />

            <InputField name="ownerName" label="Admin / Owner Name" value={formData.ownerName} onChange={handleChange} error={errors.ownerName} small />
            <InputField name="adminEmail" label="Admin Email" value={formData.adminEmail} onChange={handleChange} error={errors.adminEmail} small />
            <InputField name="adminPhone" label="Admin Phone" value={formData.adminPhone} onChange={handleChange} error={errors.adminPhone} small />

            <button className="w-full p-2 bg-emerald-600 rounded text-white text-[10px]">
                Register Organization
            </button>
        </form>
    );
};

export default OrganizationForm;
