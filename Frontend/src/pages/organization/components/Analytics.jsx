import React from "react";
import { FiBarChart2 } from "react-icons/fi";
import TrendCard from "./ui/TrendCard";

export default function Analytics({
    analyticsData,
    analyticsRange,
    setAnalyticsRange,
    teachers,
    students,
    courses,
}) {
    const topTeacher = teachers.reduce(
        (a, b) => (b.sessions > (a.sessions || 0) ? b : a),
        {}
    );

    const topCourse = courses.reduce(
        (a, b) => (b.students > (a.students || 0) ? b : a),
        {}
    );

    const avgAttendance = Math.round(
        students.reduce((s, st) => s + (st.attendance || 0), 0) /
            Math.max(1, students.length)
    );

    return (
        <div className="space-y-6">

            {/* ===========================
                HEADER — MOBILE FRIENDLY
            ============================ */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                    <FiBarChart2 /> Organization Analytics
                </h2>

                {/* On mobile → full width, below title */}
                <select
                    value={analyticsRange}
                    onChange={(e) => setAnalyticsRange(e.target.value)}
                    className="p-2 border rounded w-full md:w-auto"
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="365d">Last 12 months</option>
                </select>
            </div>

            {/* ===========================
                STAT CARDS
            ============================ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-gray-500">Top Teacher</p>
                    <p className="font-bold text-lg mt-2">{topTeacher.name ?? "—"}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {topTeacher.sessions ?? 0} sessions
                    </p>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-gray-500">Top Course</p>
                    <p className="font-bold text-lg mt-2">{topCourse.title ?? "—"}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {topCourse.students ?? 0} students
                    </p>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-gray-500">Avg Attendance</p>
                    <p className="font-bold text-lg mt-2">{avgAttendance}%</p>
                </div>
            </div>

            {/* ===========================
                TREND CHARTS (MOBILE STACK)
            ============================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TrendCard
                    title="Attendance Trend"
                    data={analyticsData.attendanceTrend}
                />
                <TrendCard
                    title="Quiz Attempts Trend"
                    data={analyticsData.quizTrend}
                />
            </div>

            {/* ===========================
                SUMMARY CARDS
            ============================ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-gray-500">Total Teachers</p>
                    <p className="font-bold text-2xl mt-2">{teachers.length}</p>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="font-bold text-2xl mt-2">{students.length}</p>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-gray-500">Total Courses</p>
                    <p className="font-bold text-2xl mt-2">{courses.length}</p>
                </div>
            </div>
        </div>
    );
}
