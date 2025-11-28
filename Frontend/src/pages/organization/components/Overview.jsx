


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
                            <p className="text-sm text-gray-500">Total Experts</p>
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
                            Invite Experts
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