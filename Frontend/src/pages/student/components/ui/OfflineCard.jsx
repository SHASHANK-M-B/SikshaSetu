import React from "react";

export default function OfflineCard({ icon: Icon, label, count }) {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-md text-center border">
            <Icon size={36} className="text-indigo-500 mx-auto mb-2" />
            <p className="text-3xl font-extrabold">{count}</p>
            <p className="text-gray-600 font-medium">{label}</p>
        </div>
    );
}
