import React from "react";

export default function SyncEngine({ syncLog, syncData }) {

    return (
        <div className="p-6 bg-gray-100 rounded-2xl shadow-inner border space-y-4">

            <h3 className="text-xl font-bold">Offline Sync Engine (Preview)</h3>

            <button
                onClick={syncData}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
            >
                Sync Now
            </button>

            <ul className="text-gray-700 text-sm space-y-1 h-24 overflow-y-auto bg-white p-3 rounded-lg">
                {syncLog.map((log, i) => (
                    <li key={i}>{log}</li>
                ))}
            </ul>
        </div>
    );
}
