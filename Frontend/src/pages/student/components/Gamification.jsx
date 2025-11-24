import React from "react";

export default function Gamification({ badges, streak }) {

    return (
        <div className="space-y-10 bg-white p-6 rounded-2xl shadow border">

            <h3 className="text-3xl font-bold text-indigo-700">Achievements</h3>

            <div className="p-6 bg-indigo-50 border-l-4 border-indigo-600 rounded-2xl shadow">
                <p className="text-xl font-bold">🔥 Current Streak: {streak} days</p>
                <p className="text-gray-600">Keep learning daily to maintain your streak!</p>
            </div>

            <div>
                <h4 className="text-xl font-bold text-gray-800">Unlocked Badges</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                    {badges.map(b => (
                        <div
                            key={b.id}
                            className={`p-6 rounded-2xl text-center shadow
                                ${b.unlocked ? "bg-green-100" : "bg-gray-200 opacity-60"}`}
                        >
                            <div className="text-4xl">{b.icon}</div>
                            <p className="mt-2 text-lg font-bold text-gray-700">{b.title}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
