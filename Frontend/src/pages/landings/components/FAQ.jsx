// src/pages/landing/components/FAQ.jsx
import React from "react";
import { FAQItem } from "./utils.jsx";

const FAQ = () => {
    const faqList = [
        {
            q: "Does RuralRemoteClass work with patchy or low-speed internet?",
            a: "Yes. Content is compressed into small learning packets which can be downloaded even on basic 3G connections or shared Wi-Fi. Students can then learn completely offline.",
        },
        {
            q: "What type of content can faculty upload?",
            a: "Faculty can upload PDFs, slide decks, recorded lectures, short concept videos and audio explainers. The platform automatically optimizes formats for low-data delivery.",
        },
        {
            q: "Can we integrate this with our LMS or ERP?",
            a: "Our API layer allows integration with popular LMS/ERP systems, or we can provide a simple SSO-based access layer for your existing systems.",
        },
        {
            q: "How is student data secured?",
            a: "All data in transit is encrypted, with role-based access controls for faculty and admins. We follow institution-friendly data residency and retention policies.",
        },
    ];

    return (
        <section className="py-20 px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">
                        Have Questions?
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                        Everything you need to understand how RuralRemoteClass fits into
                        your academic and IT ecosystem.
                    </p>
                </div>
                <div className="space-y-4">
                    {faqList.map((item, idx) => (
                        <FAQItem key={idx} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
