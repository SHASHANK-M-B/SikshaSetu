import React from "react";

export default function OverviewCard({ icon: Icon, title, value, color }) {
    return (
        <div className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white
        transform hover:scale-[1.03] transition cursor-pointer`}>

            <div className="p-3 bg-white/20 w-fit rounded-xl mb-3">
                <Icon size={28} />
            </div>

            <p className="text-sm opacity-90">{title}</p>
            <p className="text-4xl font-extrabold">{value}</p>
        </div>
    );
}
