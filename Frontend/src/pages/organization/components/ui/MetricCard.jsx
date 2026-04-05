import React from "react";

export default function MetricCard({ title, value, icon, color }) {
    return (
        <div className="p-4 bg-white rounded-lg border shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>

            <div className={`p-3 rounded-full ${color ?? "bg-indigo-50 text-indigo-700"}`}>
                {icon}
            </div>
        </div>
    );
}
