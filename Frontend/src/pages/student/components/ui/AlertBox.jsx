import React from "react";
import { FiCalendar } from "react-icons/fi";

export default function AlertBox({ title, timestamp, type }) {

    const color =
        type === "danger"
            ? "border-red-500 bg-red-50"
            : "border-yellow-500 bg-yellow-50";

    const tagColor =
        type === "danger" ? "bg-red-600" : "bg-yellow-600";

    return (
        <div className={`p-5 border-l-4 rounded-xl shadow-sm ${color}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold text-gray-800">{title}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FiCalendar size={14} /> {timestamp}
                    </p>
                </div>

                <span className={`px-3 py-1 text-xs font-semibold text-white rounded-xl ${tagColor}`}>
                    {type === "danger" ? "Urgent" : "Notice"}
                </span>
            </div>
        </div>
    );
}
