// ui/NavButton.jsx
import React from "react";

export default function NavButton({ label, icon: Icon, onClick, active, collapsed }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition 
                ${active ? "bg-white/8 ring-1 ring-white/20" : "hover:bg-white/6"}`}
        >
            <Icon className="text-white/90" />
            {!collapsed && (
                <span className="text-white text-sm font-medium">{label}</span>
            )}
        </button>
    );
}
