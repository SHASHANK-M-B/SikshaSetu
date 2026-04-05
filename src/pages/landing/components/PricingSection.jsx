// // src/pages/landing/components/PricingSection.jsx
// import React from "react";
// import { PlanCard } from "./utils.jsx";

// const PricingSection = () => {
//     return (
//         <section
//             id="pricing"
//             className="py-24 px-8 bg-[#0b0f22]/95 border-y border-gray-800/70"
//         >
//             <div className="max-w-6xl mx-auto">
//                 <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
//                     <div>
//                         <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">
//                             Deployment Options
//                         </p>
//                         <h2 className="text-3xl md:text-4xl font-extrabold text-white">
//                             Simple, Institutional-Friendly Rollouts.
//                         </h2>
//                     </div>
//                     <p className="text-sm md:text-base text-gray-300 max-w-xl">
//                         Pricing is customized based on student strength, department count and
//                         support requirements. Here is a snapshot of typical roll-out tiers
//                         for institutes.
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     <PlanCard
//                         label="Starter Pilot"
//                         price="Campus Pilot"
//                         description="Ideal for a single department or small campus pilot with limited batches."
//                         features={[
//                             "Up to 500 active learners",
//                             "Core content engine & offline packets",
//                             "Basic analytics & faculty onboarding",
//                         ]}
//                         highlight={false}
//                     />
//                     <PlanCard
//                         label="Institution Rollout"
//                         price="Full Campus"
//                         description="Suitable for multi-department institutes looking for standardized delivery."
//                         features={[
//                             "Up to multi-thousand learners",
//                             "Custom branding & role-based dashboards",
//                             "Advanced analytics & accreditation-ready reports",
//                             "Faculty enablement workshops",
//                         ]}
//                         badge="Most Popular"
//                         highlight={true}
//                     />
//                     <PlanCard
//                         label="State / Group Program"
//                         price="Custom"
//                         description="For state-wide programs or group institutions needing deep integration."
//                         features={[
//                             "Multi-campus & multi-tenant support",
//                             "API integration with LMS/ERP",
//                             "Dedicated success & support team",
//                             "Custom compliance & reporting layers",
//                         ]}
//                         highlight={true}
//                     />
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default PricingSection;
import React from "react";
import { PlanCard } from "./utils.jsx";

const PricingSection = () => {
    return (
        <section id="pricing" className="py-20 px-6 bg-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">

                    <div>
                        <p className="text-xs uppercase tracking-wide text-blue-600 mb-1">
                            Deployment Options
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Simple, Institutional-Friendly Rollouts.
                        </h2>
                    </div>

                    <p className="text-sm md:text-base text-gray-600 max-w-xl leading-relaxed">
                        Pricing is customized based on student strength, department count
                        and support requirements. Here is a snapshot of typical roll-out
                        tiers for institutes.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PlanCard
                        label="Starter Pilot"
                        price="Campus Pilot"
                        description="Ideal for a single department or small campus pilot with limited batches."
                        features={[
                            "Up to 500 active learners",
                            "Core content engine & offline packets",
                            "Basic analytics & faculty onboarding",
                        ]}
                        highlight={false}
                    />

                    <PlanCard
                        label="Institution Rollout"
                        price="Full Campus"
                        description="Suitable for multi-department institutes looking for standardized delivery."
                        features={[
                            "Up to multi-thousand learners",
                            "Custom branding & role-based dashboards",
                            "Advanced analytics & accreditation-ready reports",
                            "Faculty enablement workshops",
                        ]}
                        badge="Most Popular"
                        highlight={true}
                    />

                    <PlanCard
                        label="State / Group Program"
                        price="Custom"
                        description="For state-wide programs or group institutions needing deep integration."
                        features={[
                            "Multi-campus & multi-tenant support",
                            "API integration with LMS/ERP",
                            "Dedicated success & support team",
                            "Custom compliance & reporting layers",
                        ]}
                        highlight={true}
                    />
                </div>

            </div>
        </section>
    );
};

export default PricingSection;
