import React from "react";
import { FiX } from "react-icons/fi";
import InfoCard from "./ui/InfoCard";

export default function TeacherModal({ teacher, onClose }) {
    if (!teacher) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">
                        Teacher - {teacher.name}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                        <FiX />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-lg font-semibold">{teacher.name}</div>
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                            <div className="text-sm mt-1">
                                Status:{" "}
                                <span
                                    className={`font-semibold ${teacher.status === "Active"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {teacher.status}
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-gray-500">Sessions</div>
                            <div className="text-2xl font-bold">{teacher.sessions}</div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InfoCard title="Reactions">
                            {teacher.reactions}
                        </InfoCard>

                        <InfoCard title="Doubts Handled">
                            {teacher.doubts}
                        </InfoCard>

                        <InfoCard title="Recent Activity">
                            <ul className="text-sm space-y-1">
                                <li>Session: "Sorting Algorithms" — 2 days ago</li>
                                <li>Answered 5 doubts — 3 days ago</li>
                                <li>Uploaded resource: notes.pdf — 5 days ago</li>
                            </ul>
                        </InfoCard>
                    </div>

                </div>
            </div>
        </div>
    );
}
