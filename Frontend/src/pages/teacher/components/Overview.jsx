import React from "react";
import {
    FiUpload,
    FiVideo,
    FiFileText,
    FiUsers,
    FiBookOpen,
    FiTrendingUp,
} from "react-icons/fi";

export default function Overview({ user, setActive }) {

    return (
        <div className="space-y-8">

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-white/70 rounded-xl p-4 border shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiUsers className="text-green-700" size={22}/>
                        </div>
                        <div>
                            <h3 className="font-semibold">Total Students</h3>
                            <p className="text-gray-600 text-sm">168</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 rounded-xl p-4 border shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiBookOpen className="text-blue-700" size={22}/>
                        </div>
                        <div>
                            <h3 className="font-semibold">Active Courses</h3>
                            <p className="text-gray-600 text-sm">3 Running</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 rounded-xl p-4 border shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FiTrendingUp className="text-purple-700" size={22}/>
                        </div>
                        <div>
                            <h3 className="font-semibold">Avg Quiz Score</h3>
                            <p className="text-gray-600 text-sm">82.5%</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="bg-white rounded-xl p-6 shadow border">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Upload */}
                    <button
                        onClick={() => setActive("uploads")}
                        className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex flex-col items-center gap-2 font-semibold"
                    >
                        <FiUpload size={24}/>
                        Upload Resource
                    </button>

                    {/* Recorded */}
                    <button
                        onClick={() => setActive("recorded")}
                        className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex flex-col items-center gap-2 font-semibold"
                    >
                        <FiFileText size={24}/>
                        Recorded Sessions
                    </button>

                    {/* Live */}
                    <button
                        onClick={() => setActive("liveClass")}
                        className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl flex flex-col items-center gap-2 font-semibold"
                    >
                        <FiVideo size={24}/>
                        Start Live Class
                    </button>

                </div>
            </div>

        </div>
    );
}
