// // src/pages/landing/components/Timeline.jsx
// import React from "react";
// import { TimelineCard } from "./utils.jsx";
// import uploadAnimation from "../../../assets/animations/uploads.json";
// import chartsAnimation from "../../../assets/animations/charts.json";
// import exportAnimation from "../../../assets/animations/exports.json";

// const Timeline = () => {
//     return (
//         <section id="how-it-works" className="py-20 px-8">
//             <div className="max-w-6xl mx-auto">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-300 mb-3">
//                     How RuralRemoteClass Works
//                 </h2>
//                 <p className="text-sm md:text-base text-center text-gray-400 mb-10 max-w-2xl mx-auto">
//                     A simple three-step flow from faculty upload to offline student
//                     learning to analytics sync – built to run reliably even on uneven
//                     connectivity.
//                 </p>
//                 <div className="grid md:grid-cols-3 gap-8">
//                     <TimelineCard
//                         index={1}
//                         title="Upload Once, Optimize Everywhere"
//                         description="Faculty upload slides, audio or recorded lectures. Our engine compresses and packetizes the content for low-bandwidth delivery."
//                         lottie={uploadAnimation}
//                     />
//                     <TimelineCard
//                         index={2}
//                         title="Students Learn Offline"
//                         description="Students download learning packets once when connected, then consume content offline without any buffering or distractions."
//                         lottie={exportAnimation}
//                     />
//                     <TimelineCard
//                         index={3}
//                         title="Analytics Sync Back"
//                         description="Whenever students come back online, the app syncs completion data and engagement metrics for faculty dashboards."
//                         lottie={chartsAnimation}
//                     />
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Timeline;
import React from "react";
import { TimelineCard } from "./utils.jsx";

import uploadAnimation from "../../../assets/animations/uploads.json";
import exportAnimation from "../../../assets/animations/exports.json";
import chartsAnimation from "../../../assets/animations/charts.json";

const Timeline = () => {
    return (
        <section id="how-it-works" className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
                    How SikshaSetu Works
                </h2>

                <p className="text-sm md:text-base text-center text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    A simple three-step flow—from faculty upload to offline learning to
                    analytics sync. Built to run reliably even on uneven connectivity.
                </p>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8">
                    <TimelineCard
                        index={1}
                        title="Upload Once, Optimize Everywhere"
                        description="Faculty upload slides, audio, or recorded lectures. Our engine compresses and packetizes the content for low-data delivery."
                        lottie={uploadAnimation}
                    />

                    <TimelineCard
                        index={2}
                        title="Students Learn Offline"
                        description="Students download learning packets once when connected, then study offline without buffering or data worries."
                        lottie={exportAnimation}
                    />

                    <TimelineCard
                        index={3}
                        title="Analytics Sync Back"
                        description="When students reconnect, the app syncs completion reports and engagement insights back to faculty dashboards."
                        lottie={chartsAnimation}
                    />
                </div>
            </div>
        </section>
    );
};

export default Timeline;
