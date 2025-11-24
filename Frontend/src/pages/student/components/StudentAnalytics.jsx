import React from "react";

const AnalyticsBar = ({ label, value }) => (
    <div className="space-y-1 mb-4">
        <div className="flex justify-between text-sm font-medium">
            <span>{label}</span>
            <span>{value}%</span>
        </div>

        <div className="w-full bg-gray-200 h-2.5 rounded-full">
            <div
                className="h-2.5 bg-indigo-600 rounded-full"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

export default function StudentAnalytics({ analytics }) {

    return (
        <div className="space-y-10 bg-white p-6 rounded-2xl shadow border">

            <h3 className="text-3xl font-bold text-indigo-700">
                Student Analytics
            </h3>

            <div>
                <h4 className="text-xl font-bold mb-4 text-gray-700">
                    Progress Overview
                </h4>

                <AnalyticsBar label="Attendance" value={analytics.attendance} />
                <AnalyticsBar label="Assignments" value={analytics.assignments} />
                <AnalyticsBar label="Overall Progress" value={analytics.overallProgress} />
            </div>

            <div className="p-4 bg-gray-50 border rounded-xl">
                <h4 className="text-xl font-bold mb-3 text-gray-700">
                    Performance Trend
                </h4>

                <div className="h-36 bg-gradient-to-r from-indigo-300 to-indigo-500 rounded-xl opacity-80"></div>
            </div>

        </div>
    );
}
