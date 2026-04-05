// ui/GlassStat.jsx
import React from "react";

export default function GlassStat({ title, value, icon, gradient }) {
    return (
        <div
            className={`p-4 rounded-xl shadow-md bg-gradient-to-br ${gradient} 
            border border-white/20`}
        >
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">{title}</div>
                <div className="text-xl">{icon}</div>
            </div>

            <div className="mt-3 text-3xl font-bold text-slate-800">
                {value}
            </div>
        </div>
    );
}
