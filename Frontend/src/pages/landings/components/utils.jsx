import React, { Suspense, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

// --- LAZY LOADED PLAYER WRAPPER ---
export const PlayerSuspense = (props) => (
    <Suspense
        fallback={
            <div className="h-[300px] w-[300px] bg-gray-800/80 rounded-xl animate-pulse" />
        }
    >
        <Player {...props} />
    </Suspense>
);

// Small icon component since FiShield isn't imported from react-icons
export const FiShieldCheckIcon = () => (
    <span className="inline-flex items-center justify-center w-4 h-4 border border-emerald-400 rounded-full text-[9px] leading-none">
        ✓
    </span>
);

// Timeline Card
export const TimelineCard = ({ index, title, description, lottie }) => {
    return (
        <motion.div
            data-aos="fade-up"
            data-aos-delay={index * 120}
            className="relative bg-[#111528]/80 border border-gray-700/60 rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/30"
        >
            <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-cyan-500 text-gray-900 flex items-center justify-center text-sm font-bold shadow-lg">
                {index}
            </div>
            <div className="w-20 h-20 self-end opacity-90">
                <PlayerSuspense autoplay loop src={lottie} />
            </div>
            <h3 className="text-lg font-semibold text-cyan-200">{title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
        </motion.div>
    );
};

// FAQ Item
export const FAQItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            layout
            className="border border-gray-700/70 rounded-xl overflow-hidden bg-[#111528]/70"
        >
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left"
            >
                <span className="text-sm md:text-base font-semibold text-gray-100">
                    {question}
                </span>
                <FiChevronDown
                    className={`w-4 h-4 text-cyan-300 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>
            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                    className="px-4 md:px-6 pb-4 text-xs md:text-sm text-gray-300 border-t border-gray-700/60"
                >
                    {answer}
                </motion.div>
            )}
        </motion.div>
    );
};

// Pricing Card
export const PlanCard = ({
    label,
    highlight,
    price,
    description,
    features,
    badge,
}) => {
    return (
        <motion.div
            data-aos="fade-up"
            className={`relative flex flex-col gap-4 bg-[#111528]/90 border border-gray-700/70 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-cyan-500/25 transition-all`}
        >
            {badge && (
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-cyan-500 text-gray-900 text-[10px] font-bold tracking-[0.18em] uppercase shadow-lg">
                    {badge}
                </div>
            )}
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                {label}
            </p>
            <div className="flex items-end gap-1">
                <span className="text-3xl md:text-4xl font-extrabold text-white">
                    {price}
                </span>
                <span className="text-xs text-gray-400 mb-1">/campus</span>
            </div>
            <p className="text-xs md:text-sm text-gray-300">{description}</p>
            <ul className="space-y-2 text-xs md:text-sm text-gray-300 mt-2">
                {features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                        <FiShieldCheckIcon />
                        <span>{f}</span>
                    </li>
                ))}
            </ul>
            {highlight && (
                <button className="mt-4 w-full bg-cyan-500 text-gray-900 text-xs md:text-sm font-semibold px-4 py-2 rounded-lg hover:bg-cyan-400 transition">
                    Talk to Deployment Team
                </button>
            )}
        </motion.div>
    );
};
