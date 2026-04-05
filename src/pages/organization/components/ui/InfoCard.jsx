import React from "react";

export default function InfoCard({ title, children }) {
    return (
        <div className="p-4 bg-white border rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <div className="mt-2">{children}</div>
        </div>
    );
}
