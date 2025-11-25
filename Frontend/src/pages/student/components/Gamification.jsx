import React from "react";

export default function Gamification({ badges, streak }) {
    return (
        <div className="w-full min-h-[80vh] bg-gradient-to-br from-indigo-50 to-purple-50 p-3 sm:p-5 md:p-8">

            <div
                className="
                    w-full
                    max-w-full
                    mx-auto
                    space-y-8
                    bg-white/80
                    backdrop-blur-lg
                    p-4 sm:p-6 md:p-8
                    rounded-2xl
                    border
                    shadow-lg
                "
            >
                {/* Title */}
                <div className="text-center">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-700">
                        🏆 Achievements
                    </h3>
                    <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base">
                        Keep learning, keep leveling up!
                    </p>
                </div>

                {/* Streak Card */}
                <div
                    className="
                        w-full
                        p-4 sm:p-6
                        bg-gradient-to-r from-indigo-600 to-purple-600
                        text-white
                        rounded-2xl
                        shadow-lg
                    "
                >
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">
                        🔥 Current Streak: {streak} days
                    </p>
                    <p className="text-xs sm:text-sm md:text-base opacity-90 mt-1">
                        Stay consistent to boost your score and unlock more badges!
                    </p>
                </div>

                {/* Badges */}
                <div className="w-full">
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                        Unlocked Badges
                    </h4>

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            md:grid-cols-3
                            gap-4 sm:gap-5
                            mt-4
                            w-full
                        "
                    >
                        {badges.map(b => (
                            <div
                                key={b.id}
                                className={`
                                    p-4 sm:p-6
                                    rounded-2xl
                                    text-center
                                    w-full
                                    shadow-md
                                    transition
                                    duration-200
                                    hover:scale-[1.02]
                                    hover:shadow-lg
                                    ${
                                        b.unlocked
                                            ? "bg-green-100 border border-green-300"
                                            : "bg-gray-200 opacity-60 border border-gray-300"
                                    }
                                `}
                            >
                                <div className="text-3xl sm:text-4xl md:text-5xl">
                                    {b.icon}
                                </div>
                                <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl font-semibold text-gray-700">
                                    {b.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
