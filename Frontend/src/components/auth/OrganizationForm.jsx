import React, { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import InputField from "./InputField";
import AutoCompleteCollegeInput from "./AutoCompleteCollegeInput";

const OrganizationForm = ({ onRegisterSuccess, showToast }) => {
    const [step, setStep] = useState(1);
    const [logoPreview, setLogoPreview] = useState(null);

    const [formData, setFormData] = useState({
        orgName: "",
        orgCode: "",
        orgType: "",
        board: "",
        totalStudents: "",
        address: "",
        city: "",
        state: "",
        country: "",
        email: "",
        phone: "",
        website: "",
        ownerName: "",
        adminEmail: "",
        adminPhone: "",
        password: "",
        planType: "Free",
    });

    const [errors, setErrors] = useState({});

    /* ----------------------------------------------
        AUTO-GENERATE ORGANIZATION CODE
    ------------------------------------------------*/
    useEffect(() => {
        if (formData.orgName.trim().length > 2) {
            const short = formData.orgName.replace(/[^A-Za-z]/g, "").substring(0, 8).toUpperCase();
            const random = Math.floor(1000 + Math.random() * 9000);
            setFormData((prev) => ({
                ...prev,
                orgCode: `${short}-${random}`,
            }));
        }
    }, [formData.orgName]);

    /* ----------------------------------------------
        HANDLERS
    ------------------------------------------------*/
    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setLogoPreview(URL.createObjectURL(file));
    };

    /* ----------------------------------------------
        VALIDATION
    ------------------------------------------------*/
    const validateStep = () => {
        const required = (v) => (!v || !v.trim() ? "Required" : null);
        const newErrors = {};

        if (step === 1) {
            newErrors.orgName = required(formData.orgName);
            newErrors.orgType = required(formData.orgType);
            newErrors.board = required(formData.board);
            newErrors.totalStudents = required(formData.totalStudents);
        }

        if (step === 2) {
            newErrors.address = required(formData.address);
            newErrors.city = required(formData.city);
            newErrors.state = required(formData.state);
            newErrors.country = required(formData.country);
            newErrors.email = required(formData.email);
            newErrors.phone = required(formData.phone);
        }

        if (step === 3) {
            newErrors.ownerName = required(formData.ownerName);
            newErrors.adminEmail = required(formData.adminEmail);
            newErrors.adminPhone = required(formData.adminPhone);
            newErrors.password = required(formData.password);
        }

        Object.keys(newErrors).forEach((k) => newErrors[k] === null && delete newErrors[k]);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => validateStep() && setStep(step + 1);
    const previousStep = () => setStep(step - 1);

    const submit = (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        showToast("success", `Organization "${formData.orgName}" registered successfully!`);
        onRegisterSuccess("login");
    };

    /* ----------------------------------------------
        UI
    ------------------------------------------------*/
    return (
        <form onSubmit={submit} className="mt-3 text-[11px]">

            {/* Step Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-cyan-300">Step {step} of 3</span>
                <span className="text-gray-400">
                    {step === 1 ? "Organization Info" : step === 2 ? "Contact & Branding" : "Admin Setup"}
                </span>
            </div>

            {/* Main Scrollable Area */}
            <div className="relative max-h-[52vh] overflow-visible overflow-y-auto pr-2 space-y-3 customScroll">

                {/* -------------------------------------------------- STEP 1 -------------------------------------------------- */}
                {step === 1 && (
                    <div className="space-y-3">

                        {/* API college search */}
                        <AutoCompleteCollegeInput
                            label="Organization Name"
                            value={formData.orgName}
                            onChange={(v) => setFormData({ ...formData, orgName: v })}
                        />
                        {errors.orgName && <p className="text-red-400">{errors.orgName}</p>}

                        {/* Auto Org Code */}
                        <InputField
                            small
                            label="Organization Code"
                            name="orgCode"
                            value={formData.orgCode}
                            onChange={handleChange}
                            placeholder="Auto-generated (editable)"
                        />

                        {/* Organization Type */}
                        <div>
                            <label className="text-[10px] text-gray-300 font-medium">Organization Type</label>
                            <select
                                name="orgType"
                                value={formData.orgType}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200 text-[11px]"
                            >
                                <option value="">Select Type</option>
                                <option>School</option>
                                <option>College</option>
                                <option>University</option>
                                <option>Institute</option>
                                <option>Coaching Center</option>
                                <option>Training Center</option>
                            </select>
                            {errors.orgType && <p className="text-red-400">{errors.orgType}</p>}
                        </div>

                        <InputField
                            small
                            label="Board / University"
                            name="board"
                            value={formData.board}
                            onChange={handleChange}
                            error={errors.board}
                        />

                        <InputField
                            small
                            label="Total Students"
                            name="totalStudents"
                            value={formData.totalStudents}
                            onChange={handleChange}
                            error={errors.totalStudents}
                        />
                    </div>
                )}

                {/* -------------------------------------------------- STEP 2 -------------------------------------------------- */}
                {step === 2 && (
                    <div className="space-y-3">
                        <InputField small isTextArea label="Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} />

                        <div className="grid grid-cols-2 gap-2">
                            <InputField small label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} />
                            <InputField small label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} />
                        </div>

                        <InputField small label="Country" name="country" value={formData.country} onChange={handleChange} error={errors.country} />
                        <InputField small label="Official Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
                        <InputField small label="Official Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                        <InputField small label="Website (optional)" name="website" value={formData.website} onChange={handleChange} />

                        {/* Logo */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-medium text-gray-300">Logo (optional)</label>
                            <div className="flex items-center gap-2">
                                <input type="file" accept="image/*" onChange={handleLogoChange} className="text-[10px] text-gray-300" />
                                {logoPreview && (
                                    <img src={logoPreview} className="w-10 h-10 rounded-full border border-gray-600 object-cover" />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------- STEP 3 -------------------------------------------------- */}
                {step === 3 && (
                    <div className="space-y-3">
                        <InputField small label="Admin / Owner Name" name="ownerName" value={formData.ownerName} onChange={handleChange} error={errors.ownerName} />
                        <InputField small label="Admin Email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} error={errors.adminEmail} />
                        <InputField small label="Admin Phone" name="adminPhone" value={formData.adminPhone} onChange={handleChange} error={errors.adminPhone} />

                        <InputField small label="Password" type="password" name="password" value={formData.password} onChange={handleChange} showTogglePassword error={errors.password} />

                        {/* Plan */}
                        <div>
                            <label className="text-[10px] text-gray-300 font-medium">Plan Type</label>
                            <select
                                name="planType"
                                value={formData.planType}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200 text-[11px]"
                            >
                                <option>Free</option>
                                <option>Basic</option>
                                <option>Premium</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* -------------------------------------------------- BUTTONS -------------------------------------------------- */}
            <div className="flex gap-2 mt-3">
                {step > 1 && (
                    <button type="button" onClick={previousStep} className="flex-1 p-2 border border-gray-600 rounded text-[10px] text-gray-300 hover:bg-gray-800/60">
                        Back
                    </button>
                )}

                {step < 3 && (
                    <button type="button" onClick={nextStep} className="flex-1 p-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded text-[10px] font-semibold">
                        Next
                    </button>
                )}

                {step === 3 && (
                    <button type="submit" className="flex-1 p-2 bg-emerald-600 text-white rounded text-[10px] font-semibold">
                        Register
                    </button>
                )}
            </div>

            {/* Scrollbar Style */}
            <style>{`
                .customScroll::-webkit-scrollbar { width: 4px; }
                .customScroll::-webkit-scrollbar-thumb {
                    background: #22d3ee;
                    border-radius: 10px;
                }
            `}</style>
        </form>
    );
};

export default OrganizationForm;
