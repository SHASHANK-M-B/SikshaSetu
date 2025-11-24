import React from "react";

export default function Downloads({ downloadItems, handleDownload }) {

    return (
        <div className="space-y-8">

            <p className="text-gray-600 text-lg">
                Download study materials to access them offline anytime.
            </p>

            {downloadItems.map(item => (
                <div
                    key={item.id}
                    className="p-6 bg-white rounded-2xl shadow border flex items-center justify-between
                    transform hover:-translate-y-1 hover:shadow-xl transition"
                >
                    <div>
                        <p className="text-lg font-bold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.size}</p>
                    </div>

                    <button
                        disabled={item.downloaded}
                        onClick={() => handleDownload(item.id)}
                        className={`px-5 py-2 rounded-xl flex items-center gap-2 font-semibold text-white
                            ${item.downloaded
                                ? "bg-green-500"
                                : "bg-blue-600 hover:bg-blue-700"} transition`}
                    >
                        {item.downloaded ? "Downloaded" : "Download"}
                    </button>
                </div>
            ))}
        </div>
    );
}
