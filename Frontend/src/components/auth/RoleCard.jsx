import React from "react";

const RoleCard = ({ id, label, description, icon: Icon, active, onClick }) => {
    return (
        <button
            type="button"
            onClick={() => onClick(id)}
            className={`flex-1 min-w-[90px] px-3 py-3 rounded-xl border text-left text-xs md:text-sm transition-all flex flex-col gap-1 ${active
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-100 shadow-lg shadow-cyan-500/30"
                    : "border-gray-700 bg-gray-900/50 text-gray-300 hover:border-cyan-500/60 hover:bg-gray-900"
                }`}
        >
            <div className="flex items-center gap-2">
                <span
                    className={`p-1.5 rounded-md ${active
                            ? "bg-cyan-500 text-gray-900"
                            : "bg-gray-800 text-cyan-300"
                        }`}
                >
                    <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="font-semibold">{label}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">{description}</p>
        </button>
    );
};

export default RoleCard;
