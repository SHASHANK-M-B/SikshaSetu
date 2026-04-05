import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiEye, FiAward, FiStar, FiGift, FiCheckCircle } from "react-icons/fi";

export default function Gamification({
    badges,
    streak,
    quizPoints = 120,
    prizePoints = 30
}) {
    const [openModal, setOpenModal] = useState(false);

    // ⭐ Extra 4 Badges
    const extraBadges = [
        {
            id: 101,
            title: "7-Day Streak Master",
            icon: "🔥",
            unlocked: streak >= 7
        },
        {
            id: 102,
            title: "Quiz Champion",
            icon: "🏅",
            unlocked: quizPoints >= 100
        },
        {
            id: 104,
            title: "Perfect Score Badge",
            icon: "🌟",
            unlocked: quizPoints >= 50
        }
    ];

    const allBadges = [...badges, ...extraBadges];

    // ⭐ MOBILE CHECK
    const isMobile = window.innerWidth < 768;

    // Certifications
    const certifications = [
        {
            id: 1,
            title: "Artificial Intelligence Certification",
            provider: "IIT / Online Platform",
            viewUrl: "/certs/ai.pdf",
            downloadUrl: "/certs/ai.pdf"
        },
        {
            id: 2,
            title: "VLSI Design Certification",
            provider: "NPTEL / Electronics Dept.",
            viewUrl: "/certs/vlsi.pdf",
            downloadUrl: "/certs/vlsi.pdf"
        },
        {
            id: 3,
            title: "Renewable Energy Certification",
            provider: "Government Renewable Energy Program",
            viewUrl: "/certs/renewable.pdf",
            downloadUrl: "/certs/renewable.pdf"
        },
        {
            id: 4,
            title: "Other Certification",
            provider: "Any Other Course",
            viewUrl: "/certs/other.pdf",
            downloadUrl: "/certs/other.pdf"
        }
    ];

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-200 to-purple-200 p-4 sm:p-6 lg:p-10">

            <div className="w-full max-w-6xl mx-auto space-y-8 bg-white/40 backdrop-blur-xl p-5 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20">

                {/* Title */}
                <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-800 drop-shadow">
                        🏆 Achievements Center
                    </h3>
                    <p className="text-gray-700 mt-1 text-sm sm:text-base md:text-lg">
                        Your learning journey at a glance
                    </p>
                </div>

                {/* Streak */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl"
                >
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">
                        🔥 Current Learning Streak: {streak} days
                    </p>
                    <p className="opacity-90 text-xs sm:text-sm mt-1">
                        Great consistency! Keep going.
                    </p>

                    {streak >= 7 && (
                        <div className="mt-3 flex items-center gap-2 bg-green-600/30 p-2 rounded-lg">
                            <FiCheckCircle className="text-green-200 text-xl" />
                            <p className="text-sm font-semibold">You unlocked: 7-Day Streak Master!</p>
                        </div>
                    )}
                </motion.div>

                {/* Quiz Points */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-2xl"
                >
                    <h4 className="text-base sm:text-lg font-bold flex items-center gap-2 text-yellow-700">
                        <FiStar className="text-yellow-600" /> Quiz Performance
                    </h4>
                    <p className="text-gray-700 text-sm sm:text-base mt-1">
                        Total Quiz Points Earned: <b>{quizPoints}</b>
                    </p>
                </motion.div>

                {/* Prize Points */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-6 bg-green-100 border-l-4 border-green-500 rounded-2xl"
                >
                    <h4 className="text-base sm:text-lg font-bold flex items-center gap-2 text-green-700">
                        <FiGift className="text-green-600" /> Prize / Reward Points
                    </h4>
                    <p className="text-gray-700 text-sm sm:text-base mt-1">
                        You have earned <b>{prizePoints}</b> reward points.
                    </p>
                </motion.div>

                {/* ⭐ MOBILE VIEW — Rectangle List */}
                {isMobile && (
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FiAward className="text-indigo-600" /> Unlocked Badges
                        </h4>

                        {allBadges.map((b) => (
                            <motion.div
                                key={b.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`
                                    w-full p-4 flex items-center gap-4 rounded-xl shadow-md
                                    ${b.unlocked ? "bg-white border border-green-300" : "bg-gray-100 opacity-60"}
                                `}
                            >
                                <div className="text-4xl">{b.icon}</div>
                                <div>
                                    <p className="text-base font-semibold text-gray-800">{b.title}</p>
                                    <p className="text-xs text-gray-500">Unlocked Achievement</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ⭐ DESKTOP VIEW — Grid */}
                {!isMobile && (
                    <div className="w-full">
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FiAward className="text-indigo-600" /> Unlocked Badges
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mt-5">
                            {allBadges.map((b) => (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`
                                        p-4 sm:p-5 flex flex-col items-center 
                                        rounded-xl text-center shadow-lg
                                        ${b.unlocked ? "bg-white border border-green-300" : "bg-gray-100 opacity-60"}
                                    `}
                                >
                                    <div className="text-3xl sm:text-4xl">{b.icon}</div>
                                    <p className="mt-3 text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                                        {b.title}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                <div className="mt-8 text-center">
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-900">
                        🎓 Certifications
                    </h4>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="mt-4 px-5 py-3 bg-indigo-700 text-white text-sm sm:text-base rounded-xl shadow-md hover:bg-indigo-800 transition"
                    >
                        View Your Certificates
                    </button>
                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {openModal && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        <motion.div
                            className="fixed inset-0 flex justify-center items-center p-4 z-50"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-200">

                                <h3 className="text-xl sm:text-2xl font-bold text-indigo-700 text-center mb-5">
                                    Your Certifications (4)
                                </h3>

                                <div className="space-y-4 max-h-72 sm:max-h-80 overflow-y-auto pr-2">
                                    {certifications.map((cert) => (
                                        <motion.div
                                            key={cert.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="p-4 bg-gray-50 rounded-xl border shadow-sm"
                                        >
                                            <p className="text-base sm:text-lg font-semibold text-gray-900">
                                                {cert.title}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                Provider: {cert.provider}
                                            </p>

                                            <div className="flex gap-3 mt-3">
                                                <a
                                                    href={cert.viewUrl}
                                                    target="_blank"
                                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                                                >
                                                    <FiEye /> View
                                                </a>

                                                <a
                                                    href={cert.downloadUrl}
                                                    download
                                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition"
                                                >
                                                    <FiDownload /> Download
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="w-full mt-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
