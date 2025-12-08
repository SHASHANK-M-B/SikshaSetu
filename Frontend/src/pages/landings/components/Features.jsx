// src/pages/landing/components/Features.jsx
import React from "react";
import { motion } from "framer-motion";
import { FiUploadCloud, FiBarChart2, FiDownload } from "react-icons/fi";

const FeaturesComponent = ({ darkMode }) => {
    const featureCards = [
        {
            icon: <FiUploadCloud className="w-10 h-10 text-cyan-400" />,
            title: "Optimized Content Delivery",
            description:
                "High compression for slides, audio and video ensures minimal data usage, ideal for low-bandwidth regions.",
            tag: "Content Engine",
        },
        {
            icon: <FiDownload className="w-10 h-10 text-emerald-400" />,
            title: "Offline Learning Packets",
            description:
                "Students download encrypted learning packets once and consume content fully offline with automatic progress sync.",
            tag: "Offline First",
        },
        {
            icon: <FiBarChart2 className="w-10 h-10 text-indigo-400" />,
            title: "Progress & Engagement Analytics",
            description:
                "Faculty get real-time analytics on completion rate, watch-time, dropout hotspots and topic-wise performance.",
            tag: "Actionable Insights",
        },
    ];

    return (
        <section
            id="features"
            className="py-24 px-8 bg-white/5 dark:bg-black/20 backdrop-blur-sm border-y border-gray-700/50"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-14">
                    <div>
                        <p className="text-xs tracking-[0.28em] uppercase text-cyan-300 mb-2">
                            Platform Capabilities
                        </p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-cyan-400">
                            Designed for Rural & Remote Campuses
                        </h2>
                    </div>
                    <p className="text-lg text-gray-300 max-w-xl">
                        RuralRemoteClass replaces generic video platforms with an
                        infrastructure layer tuned for low data usage, intermittent
                        connectivity and shared devices.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {featureCards.map((card, index) => (
                        <motion.div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 150}
                            className={`relative p-8 rounded-2xl border border-gray-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 ${darkMode
                                    ? "bg-[#151a36] hover:border-cyan-500/50"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                        >
                            <div className="absolute -top-3 right-5 text-[11px] px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 uppercase tracking-[0.18em]">
                                {card.tag}
                            </div>
                            <div className="flex justify-center items-center mb-5">
                                {card.icon}
                            </div>
                            <h3 className="text-2xl font-bold mt-4 mb-2 text-center text-white">
                                {card.title}
                            </h3>
                            <p className="text-gray-400 text-center text-sm leading-relaxed">
                                {card.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesComponent;
