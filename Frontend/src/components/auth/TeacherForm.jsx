import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import InputField from "./InputField";

const TeacherForm = ({ onRegisterSuccess, showToast }) => {
    const [formData, setFormData] = useState({
        teacherName: "",
        org: "",
        customOrg: "",
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
        "Others",
    ];

    const subjects = [
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Cyber Security",
        "Web Development",
        "Cloud Computing",
        "Blockchain",
        "Others",
    ];

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.teacherName.trim())
            newErrors.teacherName = "Teacher name is required.";

        if (!formData.org.trim())
            newErrors.org = "Select institution.";

        if (formData.org === "Others" && !formData.customOrg.trim())
            newErrors.customOrg = "Enter your institution name.";

        if (!formData.subject.trim())
            newErrors.subject = "Select a subject.";

        if (formData.subject === "Others" && !formData.customSubject.trim())
            newErrors.customSubject = "Enter your subject.";

        if (!formData.email.trim())
            newErrors.email = "Email is required.";

        if (!formData.password.trim())
            newErrors.password = "Password is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const finalOrg =
            formData.org === "Others" ? formData.customOrg : formData.org;

        const finalSubject =
            formData.subject === "Others"
                ? formData.customSubject
                : formData.subject;

        showToast(
            "success",
            `Teacher "${formData.teacherName}" registered in ${finalOrg} (Subject: ${finalSubject})`
        );

        onRegisterSuccess("login");
    };

    return (
        <form onSubmit={submit} className="space-y-4 mt-3 text-xs md:text-sm">

            {/* Top Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <InputField
                    label="Teacher Name"
                    name="teacherName"
                    placeholder="Full Name"
                    value={formData.teacherName}
                    onChange={handleChange}
                    error={errors.teacherName}
                />

                {/* Organization Dropdown */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-gray-300 font-semibold">
                        Institution / College
                    </label>
                    <select
                        name="org"
                        value={formData.org}
                        onChange={handleChange}
                        className={`w-full bg-black/30 border ${errors.org ? "border-red-500" : "border-gray-700"
                            } text-gray-200 px-3 py-2 rounded-md text-xs`}
                    >
                        <option value="">-- Select College --</option>
                        {organizations.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                    {errors.org && (
                        <span className="text-[10px] text-red-400">{errors.org}</span>
                    )}
                </div>
            </div>

            {/* Custom Organization Input */}
            {formData.org === "Others" && (
                <InputField
                    label="Your Institution"
                    name="customOrg"
                    placeholder="Ex: Government Science College"
                    value={formData.customOrg}
                    onChange={handleChange}
                    error={errors.customOrg}
                />
            )}

            {/* Subject Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-gray-300 font-semibold">
                        Subject
                    </label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full bg-black/30 border ${errors.subject ? "border-red-500" : "border-gray-700"
                            } text-gray-200 px-3 py-2 rounded-md text-xs`}
                    >
                        <option value="">-- Select Subject --</option>
                        {subjects.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    {errors.subject && (
                        <span className="text-[10px] text-red-400">
                            {errors.subject}
                        </span>
                    )}
                </div>
            </div>

            {/* Custom Subject Input */}
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

            {/* Login Input Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Official email"
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
            </div>

            <button
                type="submit"
                className="w-full p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center justify-center gap-2 mt-2"
            >
                Register Teacher
                <FiArrowRight className="w-4 h-4" />
            </button>
        </form>
    );
};

export default TeacherForm;
