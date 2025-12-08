import React from "react";

const RoleCard = ({ id, label, description, icon: Icon, active, onClick }) => {
    return (
        <button
            type="button"
            onClick={() => onClick(id)}
            className={`flex-1 min-w-[90px] px-3 py-3 rounded-xl border text-left text-xs md:text-sm transition-all flex flex-col gap-1
        ${active
                    ? "border-emerald-500 bg-emerald-50 text-black shadow-md"
                    : "border-gray-300 bg-white text-black hover:border-emerald-400 hover:bg-gray-100"
                }`}
        >
            <div className="flex items-center gap-2">
                <span
                    className={`p-1.5 rounded-md ${active
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-200 text-emerald-600"
                        }`}
                >
                    <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="font-semibold">{label}</span>
            </div>

            <p className="text-[10px] text-gray-600 mt-1">{description}</p>
        </button>
    );
};

export default RoleCard;
