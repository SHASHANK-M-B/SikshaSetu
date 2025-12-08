// src/pages/landing/components/WhyChooseUs.jsx
import React from "react";

const WhyChooseUs = () => {
    return (
        <section className="py-20 px-8 bg-[#0b0f22]/90 border-y border-gray-800/70">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
                    <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300 mb-2">
                            Why Institutions Choose Us
                        </p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                            Made for Real Constraints, Not Ideal Conditions.
                        </h2>
                    </div>
                    <p className="text-sm md:text-base text-gray-300 max-w-xl">
                        Many platforms assume always-on high-speed internet and individual
                        devices. RuralRemoteClass is engineered around the reality of shared
                        phones, cyber cafés and irregular network coverage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="rounded-2xl border border-gray-700/70 bg-[#111528]/80 p-6 flex flex-col gap-3 shadow-lg">
                        <h3 className="text-lg font-semibold text-cyan-300">
                            Data-Light Infrastructure
                        </h3>
                        <p className="text-sm text-gray-300">
                            Up to 85% reduction in bandwidth compared to traditional video
                            platforms, without compromising clarity of concept delivery.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-700/70 bg-[#111528]/80 p-6 flex flex-col gap-3 shadow-lg">
                        <h3 className="text-lg font-semibold text-cyan-300">
                            Faculty-Friendly Workflows
                        </h3>
                        <p className="text-sm text-gray-300">
                            Simple upload flows, reusable content, and auto-organized modules
                            so faculty can focus on teaching, not tools.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-700/70 bg-[#111528]/80 p-6 flex flex-col gap-3 shadow-lg">
                        <h3 className="text-lg font-semibold text-cyan-300">
                            Admin-Ready Governance
                        </h3>
                        <p className="text-sm text-gray-300">
                            Role-based access, program-wise reports and exportable analytics
                            for accreditation and compliance reviews.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
