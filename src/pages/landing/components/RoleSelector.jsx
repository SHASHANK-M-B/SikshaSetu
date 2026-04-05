// // src/pages/landing/components/RoleSelector.jsx
// import React from "react";

// const RoleSelector = ({ selectedRole, handleRoleClick }) => {
//     return (
//         <section className="pb-8 px-8">
//             <div className="max-w-6xl mx-auto rounded-2xl border border-gray-700/50 bg-black/30 backdrop-blur-md p-6 md:p-8">
//                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//                     <div>
//                         <h3 className="text-xl font-semibold text-cyan-300 mb-1">
//                             Choose Your Track
//                         </h3>
//                         <p className="text-sm text-gray-400 max-w-xl">
//                             We tailor the dashboard experience based on your role. Select who
//                             you are and start with the most relevant workflow.
//                         </p>
//                     </div>
//                     <div className="flex flex-wrap gap-3">
//                         {[
//                             { id: "student", label: "Student" },
//                             { id: "faculty", label: "Faculty" },
//                             { id: "admin", label: "Institute Admin" },
//                         ].map((role) => (
//                             <button
//                                 key={role.id}
//                                 onClick={() => handleRoleClick(role.id)}
//                                 className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium border transition-all ${selectedRole === role.id
//                                         ? "bg-cyan-500 text-gray-900 border-cyan-400 shadow-lg shadow-cyan-500/30"
//                                         : "bg-transparent text-gray-200 border-gray-600 hover:border-cyan-400 hover:bg-gray-900/60"
//                                     }`}
//                             >
//                                 {role.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default RoleSelector;
import React from "react";

const RoleSelector = ({ selectedRole, handleRoleClick }) => {
    return (
        <section className="pb-8 px-6">
            <div className="w-[84%] mx-auto rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                    {/* Left Text */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            Choose Your Track
                        </h3>
                        <p className="text-sm text-gray-600 max-w-xl">
                            We tailor the dashboard experience based on your role. Select who
                            you are and start with the most relevant workflow.
                        </p>
                    </div>

                    {/* Role Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: "student", label: "Student" },
                            { id: "faculty", label: "Faculty" },
                            { id: "admin", label: "Institute Admin" },
                        ].map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleClick(role.id)}
                                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium 
                                    border transition-all 
                                    ${selectedRole === role.id
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }
                                `}
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