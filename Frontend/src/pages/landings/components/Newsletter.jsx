// src/pages/landing/components/Newsletter.jsx
import React from "react";
import { PlayerSuspense } from "./utils.jsx";
import newsletterAnimation from "../../../assets/animations/newsletter.json";

const Newsletter = () => {
    return (
        <section className="py-24 px-8">
            <div
                data-aos="fade-up"
                className="max-w-4xl mx-auto bg-[#1a2034] p-10 md:p-12 rounded-2xl shadow-2xl shadow-indigo-500/10 border-t-2 border-cyan-500/50 flex flex-col md:flex-row items-center gap-10"
            >
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold text-cyan-400 mb-3">
                        Schedule an Enterprise Briefing
                    </h3>
                    <p className="text-gray-300 mb-6 text-sm md:text-base">
                        Learn how we can customize a deployment for your institution’s
                        network, devices and compliance requirements. Share your
                        institutional email and we’ll coordinate a detailed walkthrough.
                    </p>
                    <form
                        className="flex flex-col sm:flex-row gap-3"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            placeholder="Your Institutional Email"
                            className="flex-1 px-5 py-3 rounded-lg border border-gray-600 bg-gray-900/70 text-white outline-none focus:ring-2 ring-cyan-500 text-sm"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-emerald-500 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-400 transition text-sm"
                        >
                            Contact Sales
                        </button>
                    </form>
                </div>
                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                    <PlayerSuspense autoplay loop src={newsletterAnimation} />
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
