// ui/ActionButton.jsx
import React from "react";

export default function ActionButton({ label, onClick, bg = "bg-indigo-600" }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-white font-medium shadow 
                ${bg} hover:scale-[1.02] transition`}
        >
            {label}
        </button>
    );
}
