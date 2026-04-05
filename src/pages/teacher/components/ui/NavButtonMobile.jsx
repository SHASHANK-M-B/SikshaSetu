// ui/NavButtonMobile.jsx
import React from "react";

export default function NavButtonMobile({ label, icon: Icon, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 rounded-lg 
            bg-white/4 text-white hover:bg-white/8"
        >
            <Icon />
            <span className="font-medium">{label}</span>
        </button>
    );
}
