import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import InputField from "./InputField";

const StudentForm = ({ onRegisterSuccess, showToast }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        studentName: "",
        orgCode: "",
        course: "",
        yearSem: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const validateStep = () => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.studentName.trim())
                newErrors.studentName = "Student name is required.";
            if (!formData.orgCode.trim())
                newErrors.orgCode = "Organization code is required.";
            if (!formData.course.trim())
                newErrors.course = "Course is required.";
            if (!formData.yearSem.trim())
                newErrors.yearSem = "Year / Semester is required.";
        } else if (step === 2) {
            if (!formData.email.trim()) newErrors.email = "Email is required.";
            if (!formData.password.trim())
                newErrors.password = "Password is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!validateStep()) return;
        setStep(2);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        showToast("success", `Student "${formData.studentName}" registered.`);
        onRegisterSuccess("login");
    };

    return (
        <form onSubmit={submit} className="space-y-4 mt-4 text-xs md:text-sm">
            <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-medium text-cyan-300">Step {step} of 2</span>
                <span className="text-gray-500">
                    {step === 1 ? "Academic Details" : "Login Setup"}
                </span>
            </div>

            {step === 1 && (
                <>
                    <InputField
                        label="Student Name"
                        name="studentName"
                        placeholder="Full Name"
                        value={formData.studentName}
                        onChange={handleChange}
                        error={errors.studentName}
                    />
                    <InputField
                        label="Organization Code"
                        name="orgCode"
                        placeholder="Org code"
                        value={formData.orgCode}
                        onChange={handleChange}
                        error={errors.orgCode}
                    />
                    <InputField
                        label="Course"
                        name="course"
                        placeholder="Ex: BCA, CSE"
                        value={formData.course}
                        onChange={handleChange}
                        error={errors.course}
                    />
                    <InputField
                        label="Year / Semester"
                        name="yearSem"
                        placeholder="Ex: 2nd Year"
                        value={formData.yearSem}
                        onChange={handleChange}
                        error={errors.yearSem}
                    />

                    <button
                        type="button"
                        onClick={nextStep}
                        className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center justify-center gap-2 mt-2"
                    >
                        Next
                        <FiArrowRight className="w-4 h-4" />
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
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

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 p-3 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-800/60"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg text-xs font-semibold"
                        >
                            Register Student
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default StudentForm;
