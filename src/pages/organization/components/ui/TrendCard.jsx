import React from "react";

export default function TrendCard({ title, data }) {
    const max = Math.max(...data, 1);

    const points = data
        .map(
            (v, i) =>
                `${(i / (data.length - 1 || 1)) * 100},${100 - (v / max) * 100
                }`
        )
        .join(" ");

    return (
        <div className="p-4 bg-white border rounded-lg">
            <p className="text-sm text-gray-500">{title}</p>

            <div className="mt-3">
                <svg viewBox="0 0 100 100" className="w-full h-28">
                    <polyline
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="2"
                        strokeLinecap="round"
                        points={points}
                    />

                    <polyline
                        fill="rgba(124,58,237,0.08)"
                        stroke="none"
                        points={`${points} 100,100 0,100`}
                    />
                </svg>
            </div>

            <div className="mt-2 text-sm text-gray-500">
                Showing last {data.length} points
            </div>
        </div>
    );
}
