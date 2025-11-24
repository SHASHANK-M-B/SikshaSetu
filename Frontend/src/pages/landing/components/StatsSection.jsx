// src/pages/landing/components/StatsSection.jsx
import React from "react";
import CountUp from "react-countup";

const StatsSection = () => {
    return (
        <section className="py-16 px-8 bg-[#151a36]/90 border-y border-gray-700/60">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center text-center gap-10">
                <div data-aos="zoom-in" data-aos-delay="100" className="m-4">
                    <CountUp
                        end={85}
                        duration={2.5}
                        suffix="%"
                        className="text-5xl md:text-6xl font-extrabold text-emerald-400"
                    />
                    <p className="text-lg mt-2 font-semibold text-gray-300 uppercase tracking-widest">
                        Data Efficiency
                    </p>
                </div>
                <div data-aos="zoom-in" data-aos-delay="200" className="m-4">
                    <CountUp
                        end={50}
                        duration={2.5}
                        suffix="K+"
                        className="text-5xl md:text-6xl font-extrabold text-cyan-400"
                    />
                    <p className="text-lg mt-2 font-semibold text-gray-300 uppercase tracking-widest">
                        Active Learners
                    </p>
                </div>
                <div data-aos="zoom-in" data-aos-delay="300" className="m-4">
                    <CountUp
                        end={99.9}
                        decimals={1}
                        duration={2.5}
                        suffix="%"
                        className="text-5xl md:text-6xl font-extrabold text-indigo-400"
                    />
                    <p className="text-lg mt-2 font-semibold text-gray-300 uppercase tracking-widest">
                        Uptime Guarantee
                    </p>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
