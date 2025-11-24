// import React from "react";
// import { FiUsers, FiUserPlus, FiBookOpen, FiUpload, FiFileText } from "react-icons/fi";
// import MetricCard from "./ui/MetricCard";

// export default function Overview({
//     teachers,
//     students,
//     courses,
//     totalSessions,
//     orgCode,
//     approvalStatus,
//     openInvite,
//     handleUploadDocs,
//     generateCode,
//     totalTeachers,
//     totalStudents,
//     totalCourses
// }) {

//     const activeTeachers = teachers.filter(t => t.status === "Active").length;

//     return (
//         <div className="space-y-6">

//             {/* Top Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                 {/* Teachers */}
//                 <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl border shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm text-gray-500">Total Teachers</p>
//                             <p className="text-2xl font-bold text-purple-700">{totalTeachers}</p>
//                         </div>
//                         <FiUsers className="text-3xl text-purple-500" />
//                     </div>
//                     <p className="text-sm text-gray-500 mt-3">
//                         Active: <span className="font-semibold">{activeTeachers}</span>
//                     </p>

//                     <div className="mt-4 flex gap-2">
//                         <button
//                             onClick={() => openInvite("teacher")}
//                             className="px-3 py-2 bg-purple-600 text-white rounded"
//                         >
//                             Invite Teacher
//                         </button>
//                     </div>
//                 </div>

//                 {/* Students */}
//                 <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl border shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm text-gray-500">Total Students</p>
//                             <p className="text-2xl font-bold text-pink-600">{totalStudents}</p>
//                         </div>
//                         <FiUserPlus className="text-3xl text-pink-500" />
//                     </div>

//                     <p className="text-sm text-gray-500 mt-3">
//                         Courses enrolled:{" "}
//                         <span className="font-semibold">
//                             {students.reduce((a, s) => a + s.enrolled, 0)}
//                         </span>
//                     </p>

//                     <div className="mt-4">
//                         <button
//                             onClick={() => openInvite("student")}
//                             className="px-3 py-2 bg-pink-600 text-white rounded"
//                         >
//                             Invite Student
//                         </button>
//                     </div>
//                 </div>

//                 {/* Courses */}
//                 <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl border shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm text-gray-500">Active Courses</p>
//                             <p className="text-2xl font-bold text-indigo-700">{totalCourses}</p>
//                         </div>
//                         <FiBookOpen className="text-3xl text-indigo-500" />
//                     </div>

//                     <p className="text-sm text-gray-500 mt-3">
//                         Total Sessions:{" "}
//                         <span className="font-semibold">{totalSessions}</span>
//                     </p>

//                     <div className="mt-4">
//                         <button
//                             onClick={() => alert("Navigate to course list (dummy)")}
//                             className="px-3 py-2 bg-indigo-600 text-white rounded"
//                         >
//                             View Courses
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Docs + Invite Code Section */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                 {/* Verification */}
//                 <div className="md:col-span-2 p-6 bg-white border rounded-xl shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h3 className="font-semibold text-lg">
//                                 Organization Verification
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                                 Upload verification documents and request approval
//                                 from the Developer Panel.
//                             </p>
//                         </div>

//                         <div className="text-sm text-gray-600">
//                             Status:{" "}
//                             <span
//                                 className={`font-semibold ${approvalStatus === "Approved"
//                                         ? "text-green-600"
//                                         : approvalStatus === "Pending"
//                                             ? "text-yellow-500"
//                                             : "text-gray-600"
//                                     }`}
//                             >
//                                 {approvalStatus}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="mt-4 flex gap-3 items-center">
//                         <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
//                             <FiUpload />
//                             <input
//                                 type="file"
//                                 multiple
//                                 onChange={(e) =>
//                                     handleUploadDocs(e.target.files)
//                                 }
//                                 className="hidden"
//                             />
//                             <span className="text-sm">Upload Documents</span>
//                         </label>

//                         <button
//                             onClick={() =>
//                                 alert("Request sent to Developer Panel (dummy)")
//                             }
//                             className="px-4 py-2 bg-purple-600 text-white rounded-lg"
//                         >
//                             Request Approval
//                         </button>
//                     </div>

//                     {/* Uploaded Docs (dummy) */}
//                     <div className="mt-4">
//                         <h4 className="text-sm text-gray-600">Uploaded Documents</h4>
//                         <div className="mt-2 space-y-2">
//                             <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                                 <div className="flex items-center gap-3">
//                                     <FiFileText className="text-gray-500" />
//                                     <div>
//                                         <div className="font-medium">
//                                             license.pdf
//                                         </div>
//                                         <div className="text-xs text-gray-400">
//                                             Uploaded 2 days ago
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                     Verified
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Invite Code */}
//                 <div className="p-6 bg-white border rounded-xl shadow-sm">
//                     <h3 className="font-semibold text-lg">Invite Code</h3>
//                     <p className="text-sm text-gray-500">
//                         Share this code to onboard teachers & students.
//                     </p>

//                     <div className="mt-4 p-3 bg-purple-100 rounded flex items-center justify-between">
//                         <div className="font-bold tracking-widest">
//                             {orgCode}
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <button
//                                 onClick={generateCode}
//                                 className="px-3 py-1 bg-indigo-600 text-white rounded"
//                             >
//                                 Regenerate
//                             </button>
//                             <button
//                                 onClick={() =>
//                                     navigator.clipboard.writeText(orgCode)
//                                 }
//                                 className="px-3 py-1 bg-white border rounded"
//                             >
//                                 Copy
//                             </button>
//                         </div>
//                     </div>

//                     <div className="mt-4">
//                         <h4 className="text-sm text-gray-600">Quick actions</h4>
//                         <div className="mt-2 flex gap-2">
//                             <button
//                                 onClick={() => openInvite("teacher")}
//                                 className="px-3 py-2 bg-pink-600 text-white rounded"
//                             >
//                                 Invite Teacher
//                             </button>

//                             <button
//                                 onClick={() => openInvite("student")}
//                                 className="px-3 py-2 bg-indigo-600 text-white rounded"
//                             >
//                                 Invite Student
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
//                 <MetricCard title="Attendance (Avg)" value="86%" color="bg-green-50 text-green-700" icon={<span>📈</span>} />
//                 <MetricCard title="Avg Quiz Score" value="78%" color="bg-yellow-50 text-yellow-700" icon={<span>📊</span>} />
//                 <MetricCard title="Active Sessions (wk)" value="14" color="bg-indigo-50 text-indigo-700" icon={<span>📚</span>} />
//                 <MetricCard title="Badges Awarded" value="42" color="bg-pink-50 text-pink-700" icon={<span>🏅</span>} />
//             </div>
//         </div>
//     );
// }


import React from "react";
import { FiUsers, FiUserPlus, FiBookOpen, FiUpload, FiFileText } from "react-icons/fi";
import MetricCard from "./ui/MetricCard";

export default function Overview({
    teachers,
    students,
    courses,
    totalSessions,
    totalTeachers,
    totalStudents,
    totalCourses,
    // --- NEW PROP REQUIRED FOR NAVIGATION ---
    setTab, 
    // Props removed from use in UI: orgCode, approvalStatus, openInvite, handleUploadDocs, generateCode
}) {

    const activeTeachers = teachers.filter(t => t.status === "Active").length;
    
    // Total enrolled students across all courses (retained logic)
    const totalEnrolledCourses = students.reduce((a, s) => a + (s.enrolled || 0), 0);

    return (
        <div className="space-y-6">

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Teachers */}
                <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Teachers</p>
                            <p className="text-2xl font-bold text-purple-700">{totalTeachers}</p>
                        </div>
                        <FiUsers className="text-3xl text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        Active: <span className="font-semibold">{activeTeachers}</span>
                    </p>

                    <div className="mt-4 flex gap-2">
                        {/* ACTION: Navigates to TeacherManagement tab */}
                        <button
                            onClick={() => setTab("teachers")}
                            className="px-3 py-2 bg-purple-600 text-white rounded"
                        >
                            Invite Teacher
                        </button>
                    </div>
                </div>

                {/* Students */}
                <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Students</p>
                            <p className="text-2xl font-bold text-pink-600">{totalStudents}</p>
                        </div>
                        <FiUserPlus className="text-3xl text-pink-500" />
                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                        Courses enrolled:{" "}
                        <span className="font-semibold">
                            {totalEnrolledCourses}
                        </span>
                    </p>

                    <div className="mt-4">
                        {/* ACTION: Navigates to StudentManagement tab and button renamed */}
                        <button
                            onClick={() => setTab("students")}
                            className="px-3 py-2 bg-pink-600 text-white rounded"
                        >
                            View Students
                        </button>
                    </div>
                </div>

                {/* Courses */}
                <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Courses</p>
                            <p className="text-2xl font-bold text-indigo-700">{totalCourses}</p>
                        </div>
                        <FiBookOpen className="text-3xl text-indigo-500" />
                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                        Total Sessions:{" "}
                        <span className="font-semibold">{totalSessions}</span>
                    </p>

                    <div className="mt-4">
                        <button
                            onClick={() => alert("Navigate to course list (dummy)")}
                            className="px-3 py-2 bg-indigo-600 text-white rounded"
                        >
                            View Courses
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics (Kept) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <MetricCard title="Attendance (Avg)" value="86%" color="bg-green-50 text-green-700" icon={<span>📈</span>} />
                <MetricCard title="Avg Quiz Score" value="78%" color="bg-yellow-50 text-yellow-700" icon={<span>📊</span>} />
                <MetricCard title="Active Sessions (wk)" value="14" color="bg-indigo-50 text-indigo-700" icon={<span>📚</span>} />
                <MetricCard title="Badges Awarded" value="42" color="bg-pink-50 text-pink-700" icon={<span>🏅</span>} />
            </div>
        </div>
    );
}