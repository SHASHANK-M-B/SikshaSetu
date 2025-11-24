// src/pages/landing/components/RoleSelector.jsx
import React from "react";

const RoleSelector = ({ selectedRole, handleRoleClick }) => {
    return (
        <section className="pb-8 px-8">
            <div className="max-w-6xl mx-auto rounded-2xl border border-gray-700/50 bg-black/30 backdrop-blur-md p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-semibold text-cyan-300 mb-1">
                            Choose Your Track
                        </h3>
                        <p className="text-sm text-gray-400 max-w-xl">
                            We tailor the dashboard experience based on your role. Select who
                            you are and start with the most relevant workflow.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: "student", label: "Student" },
                            { id: "faculty", label: "Faculty" },
                            { id: "admin", label: "Institute Admin" },
                        ].map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleClick(role.id)}
                                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium border transition-all ${selectedRole === role.id
                                        ? "bg-cyan-500 text-gray-900 border-cyan-400 shadow-lg shadow-cyan-500/30"
                                        : "bg-transparent text-gray-200 border-gray-600 hover:border-cyan-400 hover:bg-gray-900/60"
                                    }`}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoleSelector;
