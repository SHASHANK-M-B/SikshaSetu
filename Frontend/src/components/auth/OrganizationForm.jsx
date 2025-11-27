import React, { useState } from "react";
import InputField from "./InputField";

const OrganizationForm = ({ onRegisterSuccess, showToast }) => {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        orgName: "",
        orgType: "",
        board: "",
        totalStudents: "",
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

    // -------------------- VALIDATION --------------------
    const validateStep = () => {
        const req = (v) => !v || v.trim() === "";

        const step1 = ["orgName", "orgType", "board", "totalStudents"];
        const step2 = ["address", "city", "state", "country", "email", "phone"];
        const step3 = ["ownerName", "adminEmail", "adminPhone"];

        let needed = [];

        if (step === 1) needed = step1;
        if (step === 2) needed = step2;
        if (step === 3) needed = step3;

        let newErrors = {};

        needed.forEach((f) => {
            if (req(formData[f])) newErrors[f] = "Required";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) setStep(step + 1);
    };

    const previousStep = () => setStep(step - 1);

    // -------------------- SUBMIT --------------------
    const submit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        try {
            const res = await fetch("http://localhost:5000/api/org/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!data.success) {
                showToast("error", data.message || "Registration failed");
                return;
            }

            showToast("success", "Organization submitted to admin for approval!");
            onRegisterSuccess("login");

        } catch (err) {
            showToast("error", "Server error.");
        }
    };

    return (
        <form onSubmit={submit} className="mt-3 text-[11px]">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-300 font-semibold">Step {step} of 3</span>
                <span className="text-gray-400">
                    {step === 1 ? "Organization Info" : step === 2 ? "Contact Info" : "Admin Info"}
                </span>
            </div>

            {/* CONTENT */}
            <div className="space-y-3 max-h-[52vh] overflow-y-auto pr-2 customScroll">

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <InputField label="Organization Name" name="orgName"
                            value={formData.orgName}
                            onChange={handleChange}
                            error={errors.orgName}
                            small
                        />

                        <div>
                            <label className="text-[10px] text-gray-300 font-medium">
                                Organization Type
                            </label>
                            <select
                                name="orgType"
                                value={formData.orgType}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                            >
                                <option value="">Select</option>
                                <option>School</option>
                                <option>College</option>
                                <option>University</option>
                                <option>Institute</option>
                                <option>Coaching Center</option>
                                <option>Training Center</option>
                            </select>
                            {errors.orgType && <p className="text-red-400">{errors.orgType}</p>}
                        </div>

                        <InputField label="Board / University" name="board"
                            value={formData.board}
                            onChange={handleChange}
                            error={errors.board}
                            small
                        />

                        <InputField label="Total Students" name="totalStudents"
                            value={formData.totalStudents}
                            onChange={handleChange}
                            error={errors.totalStudents}
                            small
                        />
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <InputField label="Address" name="address"
                            isTextArea
                            value={formData.address}
                            onChange={handleChange}
                            error={errors.address}
                            small
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <InputField label="City" name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                small
                            />
                            <InputField label="State" name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={errors.state}
                                small
                            />
                        </div>

                        <InputField label="Country" name="country"
                            value={formData.country}
                            onChange={handleChange}
                            error={errors.country}
                            small
                        />

                        <InputField label="Official Email" name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            small
                        />

                        <InputField label="Official Phone" name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            small
                        />
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <InputField label="Admin / Owner Name" name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            error={errors.ownerName}
                            small
                        />

                        <InputField label="Admin Email" name="adminEmail"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            error={errors.adminEmail}
                            small
                        />

                        <InputField label="Admin Phone" name="adminPhone"
                            value={formData.adminPhone}
                            onChange={handleChange}
                            error={errors.adminPhone}
                            small
                        />
                    </>
                )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-2 mt-3">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={previousStep}
                        className="flex-1 p-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800/60 text-[10px]"
                    >
                        Back
                    </button>
                )}

                {step < 3 && (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 p-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded text-[10px]"
                    >
                        Next
                    </button>
                )}

                {step === 3 && (
                    <button
                        type="submit"
                        className="flex-1 p-2 bg-emerald-600 text-white rounded text-[10px]"
                    >
                        Register
                    </button>
                )}
            </div>
        </form>
    );
};

export default OrganizationForm;