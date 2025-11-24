import React, { useState } from "react";
import { FiHeadphones } from "react-icons/fi";

export default function LiveAudio() {
    const [joined, setJoined] = useState(false);

    const session = {
        title: "CSE101 — Data Structures",
        instructor: "Dr. Sharma"
    };

    return (
        <div className="max-w-xl space-y-6">
            <h3 className="text-3xl font-bold text-indigo-600">Live Audio Class 🎧</h3>

            <div className="p-6 rounded-2xl bg-indigo-50 border-l-4 border-indigo-500 shadow">
                <p className="text-xl font-bold">{session.title}</p>
                <p className="text-gray-600">Instructor: {session.instructor}</p>

                <button
                    onClick={() => setJoined(!joined)}
                    className={`mt-6 w-full py-3 rounded-xl text-white font-bold transition
                        ${joined ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                    <FiHeadphones className="inline-block mr-2" />
                    {joined ? "Leave Class" : "Join Now"}
                </button>

                {joined && (
                    <p className="mt-4 text-center text-indigo-600 font-semibold animate-pulse">
                        🔴 LIVE: Connected to teacher audio…
                    </p>
                )}
            </div>
        </div>
    );
}
