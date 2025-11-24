// src/pages/landing/components/Testimonials.jsx
import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiHelpCircle } from "react-icons/fi";

const TestimonialsComponent = ({ darkMode }) => {
    const testimonials = [
        {
            quote:
                "The offline-first design radically changed how we support students in low-connectivity districts.",
            name: "Dr. Alok Verma",
            title: "Director, State-Powered Engineering Program",
            rating: 5,
        },
        {
            quote:
                "I no longer worry about buffering. The packets let me cover full lectures in a single data recharge.",
            name: "Karan S.",
            title: "Computer Science Student, Tier-3 City",
            rating: 5,
        },
        {
            quote:
                "Deployment was straightforward and the analytics dashboard finally gives visibility into real learning behaviour.",
            name: "Prof. Neha Kulkarni",
            title: "HoD, Electronics Department",
            rating: 5,
        },
    ];

    return (
        <section id="testimonials" className="py-24 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
                    <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-emerald-300 mb-2">
                            Community Voices
                        </p>
                        <h2 className="text-4xl font-extrabold text-emerald-400">
                            Trusted in Real Classrooms
                        </h2>
                        <p className="text-lg text-gray-400 mt-4 max-w-xl">
                            Early pilots across government and private institutes show improved
                            completion rates, better engagement and significantly reduced
                            student data costs.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                            <FiStar className="text-emerald-400 w-5 h-5 fill-current" />
                            <span>4.9 / 5 average satisfaction across pilot batches</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiHelpCircle className="text-emerald-400 w-4 h-4" />
                            <span>Dedicated onboarding support for faculty & admin</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            data-aos="zoom-in"
                            data-aos-delay={index * 150}
                            className={`p-7 rounded-2xl shadow-lg border border-emerald-400/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-emerald-500/30 ${darkMode
                                    ? "bg-[#1c2140] hover:bg-[#20254b]"
                                    : "bg-white hover:bg-emerald-50"
                                }`}
                        >
                            <div className="flex mb-3">
                                {[...Array(t.rating)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className="text-emerald-400 w-5 h-5 fill-current"
                                    />
                                ))}
                            </div>
                            <blockquote className="text-sm md:text-base italic text-gray-300 dark:text-gray-300 leading-relaxed">
                                "{t.quote}"
                            </blockquote>
                            <div className="mt-6 pt-4 border-t border-gray-700/50">
                                <p className="font-bold text-cyan-400 text-sm">{t.name}</p>
                                <p className="text-xs text-gray-400">{t.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsComponent;
