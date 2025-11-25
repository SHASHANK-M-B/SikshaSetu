import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Filler,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Filler,
    Legend
);

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
            />
        </div>
    </div>
);

export default function StudentAnalytics({ analytics }) {

    const chartData = {
        labels: ["Attendance", "Assignments", "Overall"],
        datasets: [
            {
                label: "Performance %",
                data: [
                    analytics.attendance,
                    analytics.assignments,
                    analytics.overallProgress
                ],
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.25)",
                fill: true,
                tension: 0.35,
                borderWidth: 4,
                pointBackgroundColor: "#4f46e5",
                pointRadius: 6,
                pointBorderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            legend:{display:false}
        },
        scales:{
            y:{min:0,max:100}
        }
    };

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


            {/* RESPONSIVE BEAUTIFUL GRAPH */}
            <div className="p-4 bg-gray-50 border rounded-xl">
                <h4 className="text-xl font-bold mb-3 text-gray-700">
                    Performance Trend
                </h4>

                <div className="h-64 w-full">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

        </div>
    );
}
