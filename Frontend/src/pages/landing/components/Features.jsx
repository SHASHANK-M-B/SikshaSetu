// // // src/pages/landing/components/Features.jsx
// // import React from "react";
// // import { motion } from "framer-motion";
// // import { FiUploadCloud, FiBarChart2, FiDownload } from "react-icons/fi";

// // const FeaturesComponent = ({ darkMode }) => {
// //     const featureCards = [
// //         {
// //             icon: <FiUploadCloud className="w-10 h-10 text-cyan-400" />,
// //             title: "Optimized Content Delivery",
// //             description:
// //                 "High compression for slides, audio and video ensures minimal data usage, ideal for low-bandwidth regions.",
// //             tag: "Content Engine",
// //         },
// //         {
// //             icon: <FiDownload className="w-10 h-10 text-emerald-400" />,
// //             title: "Offline Learning Packets",
// //             description:
// //                 "Students download encrypted learning packets once and consume content fully offline with automatic progress sync.",
// //             tag: "Offline First",
// //         },
// //         {
// //             icon: <FiBarChart2 className="w-10 h-10 text-indigo-400" />,
// //             title: "Progress & Engagement Analytics",
// //             description:
// //                 "Faculty get real-time analytics on completion rate, watch-time, dropout hotspots and topic-wise performance.",
// //             tag: "Actionable Insights",
// //         },
// //     ];

// //     return (
// //         <section
// //             id="features"
// //             className="py-24 px-8 bg-white/5 dark:bg-black/20 backdrop-blur-sm border-y border-gray-700/50"
// //         >
// //             <div className="max-w-7xl mx-auto">
// //                 <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-14">
// //                     <div>
// //                         <p className="text-xs tracking-[0.28em] uppercase text-cyan-300 mb-2">
// //                             Platform Capabilities
// //                         </p>
// //                         <h2 className="text-4xl md:text-5xl font-extrabold text-cyan-400">
// //                             Designed for Rural & Remote Campuses
// //                         </h2>
// //                     </div>
// //                     <p className="text-lg text-gray-300 max-w-xl">
// //                         RuralRemoteClass replaces generic video platforms with an
// //                         infrastructure layer tuned for low data usage, intermittent
// //                         connectivity and shared devices.
// //                     </p>
// //                 </div>

// //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
// //                     {featureCards.map((card, index) => (
// //                         <motion.div
// //                             key={index}
// //                             data-aos="fade-up"
// //                             data-aos-delay={index * 150}
// //                             className={`relative p-8 rounded-2xl border border-gray-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 ${darkMode
// //                                     ? "bg-[#151a36] hover:border-cyan-500/50"
// //                                     : "bg-white hover:bg-gray-50"
// //                                 }`}
// //                         >
// //                             <div className="absolute -top-3 right-5 text-[11px] px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 uppercase tracking-[0.18em]">
// //                                 {card.tag}
// //                             </div>
// //                             <div className="flex justify-center items-center mb-5">
// //                                 {card.icon}
// //                             </div>
// //                             <h3 className="text-2xl font-bold mt-4 mb-2 text-center text-white">
// //                                 {card.title}
// //                             </h3>
// //                             <p className="text-gray-400 text-center text-sm leading-relaxed">
// //                                 {card.description}
// //                             </p>
// //                         </motion.div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </section>
// //     );
// // };

// // export default FeaturesComponent;
// import React, { useState } from "react";
// import {
//     FiChevronLeft,
//     FiChevronRight,
//     FiMonitor,
//     FiBarChart2,
//     FiGlobe,
//     FiUser,
//     FiVideo,
// } from "react-icons/fi";

// const tabs = [
//     {
//         label: "Offline-First Learning",
//         subtitle: "Access lessons without continuous internet",
//         icon: FiMonitor,
//     },
//     {
//         label: "Rural School Management",
//         subtitle: "Simple tools for school admins",
//         icon: FiBarChart2,
//     },
//     {
//         label: "Community Learning Hub",
//         subtitle: "Shared devices & village learning",
//         icon: FiGlobe,
//     },
//     {
//         label: "Rural Assessments",
//         subtitle: "Exams that work offline too",
//         icon: FiUser,
//     },
//     {
//         label: "Low-Data Live Classroom",
//         subtitle: "Live classes on slow networks",
//         icon: FiVideo,
//     },
// ];

// const Features = () => {
//     const [activeTab, setActiveTab] = useState(0);

//     const tabContent = [
//         // 1) Offline-First Learning
//         {
//             tag: "For Low-Connectivity Schools",
//             title: "Offline-First Learning for Rural Classrooms",
//             highlight:
//                 "Teaching and learning continue even when the internet does not.",
//             description:
//                 "RemoteClass for Rural Areas lets teachers and students access lessons, notes, and activities without needing continuous network connectivity. Content can be downloaded once and used throughout the day in class.",
//             points: [
//                 {
//                     h: "Learn Without Internet",
//                     p: "Teachers can access lessons and activities offline after a one-time sync.",
//                 },
//                 {
//                     h: "Works on Low-End Devices",
//                     p: "Optimized for basic Android phones, shared computers, and classroom screens.",
//                 },
//                 {
//                     h: "Regional Language Support",
//                     p: "Supports local and regional languages to improve understanding for students.",
//                 },
//                 {
//                     h: "Printable Materials",
//                     p: "Generate printable notes and worksheets for students without personal devices.",
//                 },
//             ],
//             img: "/project/teacher_board.png",
//         },

//         // 2) Rural School Management
//         {
//             tag: "For Principals, NGOs & Admins",
//             title: "Rural School Management Made Simple",
//             highlight:
//                 "One simple dashboard to keep track of students, teachers, and classes in rural schools.",
//             description:
//                 "RemoteClass provides a light-weight management layer for government, NGO-run, and rural private schools to maintain attendance, timetables, and basic student records without heavy infrastructure.",
//             points: [
//                 {
//                     h: "Attendance Tracking",
//                     p: "Record teacher and student attendance using simple daily logs or basic IDs.",
//                 },
//                 {
//                     h: "Class & Timetable Management",
//                     p: "Manage classes, periods, and subject allocations from one place.",
//                 },
//                 {
//                     h: "Student Profiles",
//                     p: "Store basic information like class, section, guardian contact and address.",
//                 },
//                 {
//                     h: "Monthly Reports",
//                     p: "Download school-level summaries in PDF/Excel formats for govt or NGO review.",
//                 },
//             ],
//             img: "/project/teacher.png",
//         },

//         // 3) Community Learning Hub
//         {
//             tag: "For Shared Devices & Villages",
//             title: "Community Learning Hub for Villages",
//             highlight:
//                 "Enables multiple children to learn using a shared device at home or community centers.",
//             description:
//                 "In many rural areas, one phone or computer is shared by many students. RemoteClass supports this reality with shared-device login, group learning, and offline revision packs.",
//             points: [
//                 {
//                     h: "Shared Device Login",
//                     p: "Multiple students can sign in from the same device with separate profiles.",
//                 },
//                 {
//                     h: "Group-Based Learning",
//                     p: "Create learning groups for villages, tuition centers, or community spaces.",
//                 },
//                 {
//                     h: "Home Revision Packs",
//                     p: "Provide offline revision content and practice material for after-school learning.",
//                 },
//                 {
//                     h: "Audio & Simple Content",
//                     p: "Short notes and audio explanations help students with limited reading skills.",
//                 },
//             ],
//             img: "/project/student.png",
//         },

//         // 4) Rural Assessments
//         {
//             tag: "For Exams in Low-Resource Settings",
//             title: "Assessments That Work in Rural Conditions",
//             highlight:
//                 "Plan and track exams even when schools depend on paper and limited connectivity.",
//             description:
//                 "RemoteClass supports both digital and paper-based assessments so teachers in rural schools can conduct exams smoothly and still maintain digital records for long-term tracking.",
//             points: [
//                 {
//                     h: "Offline Quiz Creation",
//                     p: "Create tests and question sets that can be used in class without internet.",
//                 },
//                 {
//                     h: "Paper + Digital Friendly",
//                     p: "Use printed papers in class and later enter marks or upload results to the system.",
//                 },
//                 {
//                     h: "Progress Tracking",
//                     p: "View how classes and students are performing across subjects over time.",
//                 },
//                 {
//                     h: "Govt-Ready Reports",
//                     p: "Generate simple assessment summaries aligned with government reporting needs.",
//                 },
//             ],
//             img: "/project/analytics.png",
//         },

//         // 5) Low-Data Live Classroom
//         {
//             tag: "For Remote & Fragile Networks",
//             title: "Low-Data Live Classroom for Remote Areas",
//             highlight:
//                 "Live teaching experience that runs smoothly even on slow or unstable networks.",
//             description:
//                 "RemoteClass Live focuses on audio-first and low-resolution content so teachers can still connect with students in remote villages without needing high-speed internet.",
//             points: [
//                 {
//                     h: "Audio-First Live Sessions",
//                     p: "Conduct live classes using audio mode that works on slow and fluctuating connections.",
//                 },
//                 {
//                     h: "Optional Light Video",
//                     p: "Use low-resolution video only when the network condition allows.",
//                 },
//                 {
//                     h: "Interaction & Doubt Clearing",
//                     p: "Students can respond, ask doubts, and stay engaged during the live class.",
//                 },
//                 {
//                     h: "Session Recap",
//                     p: "Save important notes or key points so students who missed can catch up later.",
//                 },
//             ],
//             img: "/project/live_class.png",
//         },
//     ];

//     const content = tabContent[activeTab];
//     const total = tabContent.length;

//     const goPrev = () => setActiveTab((s) => (s - 1 + total) % total);
//     const goNext = () => setActiveTab((s) => (s + 1) % total);

//     const ActiveIcon = tabs[activeTab].icon;

//     return (
//         <section
//             id="features"
//             className="py-20 px-6 bg-gradient-to-b from-orange-50 via-white to-blue-50"
//         >
//             <div className="max-w-7xl mx-auto relative">

//                 {/* Small section heading */}
//                 <div className="text-center mb-10">
//                     <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold bg-white/80 shadow-sm border border-orange-100">
//                         <span className="h-2 w-2 rounded-full bg-orange-500"></span>
//                         RemoteClass for Rural Areas
//                     </span>
//                     <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
//                         Built for Low-Connectivity Schools,
//                         <span className="text-orange-600"> High-Quality Learning</span>
//                     </h2>
//                     <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
//                         Practical tools that bring structured learning, assessments, and
//                         school management to villages and remote communities — even with
//                         limited internet and devices.
//                     </p>
//                 </div>

//                 {/* ------------------ TABS ------------------ */}
//                 <div className="flex items-center gap-4 overflow-x-auto pb-3 border-b border-gray-200">
//                     {tabs.map((tab, idx) => {
//                         const Icon = tab.icon;
//                         const isActive = activeTab === idx;
//                         return (
//                             <button
//                                 key={idx}
//                                 onClick={() => setActiveTab(idx)}
//                                 className={`group relative px-4 py-2 rounded-2xl flex flex-col items-start justify-center min-w-[180px] transition
//                   ${isActive
//                                         ? "bg-white shadow-sm border border-orange-200"
//                                         : "bg-transparent hover:bg-white/70"
//                                     }
//                 `}
//                             >
//                                 <div className="flex items-center gap-2">
//                                     <div
//                                         className={`p-1.5 rounded-full border text-xs
//                       ${isActive
//                                                 ? "border-orange-500 text-orange-600"
//                                                 : "border-gray-300 text-gray-500"
//                                             }
//                     `}
//                                     >
//                                         <Icon className="w-4 h-4" />
//                                     </div>
//                                     <span
//                                         className={`text-xs font-semibold tracking-wide uppercase
//                       ${isActive
//                                                 ? "text-orange-600"
//                                                 : "text-gray-500 group-hover:text-gray-700"
//                                             }
//                     `}
//                                     >
//                                         {tab.label}
//                                     </span>
//                                 </div>
//                                 <span className="mt-1 text-[11px] text-gray-500">
//                                     {tab.subtitle}
//                                 </span>

//                                 {isActive && (
//                                     <div className="absolute -bottom-[2px] left-4 right-4 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-blue-500 rounded-full"></div>
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* ------------------ MAIN CARD ------------------ */}
//                 <div
//                     className="mt-10 rounded-3xl bg-white/90 backdrop-blur shadow-xl flex flex-col md:flex-row p-8 md:p-10 gap-10 relative overflow-hidden border border-orange-100"
//                 >
//                     {/* Soft gradient accent blob */}
//                     <div className="pointer-events-none absolute -right-10 -top-10 w-56 h-56 bg-orange-100 rounded-full opacity-60 blur-3xl" />
//                     <div className="pointer-events-none absolute -left-10 -bottom-10 w-56 h-56 bg-blue-100 rounded-full opacity-60 blur-3xl" />

//                     {/* LEFT Arrow Button (icon) */}
//                     <button
//                         onClick={goPrev}
//                         aria-label="Previous feature"
//                         className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 border border-gray-200 rounded-full p-2 shadow-md hover:scale-105 transition"
//                     >
//                         <FiChevronLeft className="w-5 h-5 text-orange-500" />
//                     </button>

//                     {/* ---------------- LEFT CONTENT ---------------- */}
//                     <div className="flex-1 space-y-6 relative z-10">
//                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-medium text-orange-700">
//                             <ActiveIcon className="w-3 h-3" />
//                             <span>{content.tag}</span>
//                         </div>

//                         <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
//                             {content.title}
//                         </h3>

//                         <p className="text-sm md:text-base text-orange-700 font-medium">
//                             {content.highlight}
//                         </p>

//                         <p className="text-gray-600 text-sm md:text-base leading-relaxed">
//                             {content.description}
//                         </p>

//                         <div className="grid md:grid-cols-2 gap-4 md:gap-6">
//                             {content.points.map((item, idx) => (
//                                 <div
//                                     key={idx}
//                                     className="group rounded-2xl border border-gray-100 bg-white/70 px-4 py-3 hover:border-orange-200 hover:shadow-sm transition"
//                                 >
//                                     <p className="font-semibold text-gray-900 text-sm md:text-base flex items-center gap-2">
//                                         <span className="h-1.5 w-1.5 rounded-full bg-orange-500 group-hover:scale-110 transition"></span>
//                                         {item.h}
//                                     </p>
//                                     <p className="text-gray-600 text-xs md:text-sm mt-1">
//                                         {item.p}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ---------------- RIGHT IMAGE ---------------- */}
//                     <div className="flex-1 flex justify-center items-center relative z-10">
//                         <div className="relative w-full max-w-md md:max-w-lg">
//                             <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-orange-100 via-amber-50 to-blue-100 opacity-70 blur-sm" />
//                             <img
//                                 src={content.img}
//                                 alt="Feature Preview"
//                                 className="relative w-full rounded-3xl shadow-2xl border border-white/70"
//                             />
//                         </div>
//                     </div>

//                     {/* RIGHT Arrow Button (icon) */}
//                     <button
//                         onClick={goNext}
//                         aria-label="Next feature"
//                         className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 border border-gray-200 rounded-full p-2 shadow-md hover:scale-105 transition"
//                     >
//                         <FiChevronRight className="w-5 h-5 text-blue-600" />
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Features;
import React, { useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiMonitor,
    FiBarChart2,
    FiGlobe,
    FiUser,
    FiVideo,
} from "react-icons/fi";

const tabs = [
    {
        label: "Offline-First Learning",
        subtitle: "Access lessons without continuous internet",
        icon: FiMonitor,
    },
    {
        label: "Rural School Management",
        subtitle: "Simple tools for school admins",
        icon: FiBarChart2,
    },
    {
        label: "Community Learning Hub",
        subtitle: "Shared devices & village learning",
        icon: FiGlobe,
    },
    {
        label: "Rural Assessments",
        subtitle: "Exams that work offline too",
        icon: FiUser,
    },
    {
        label: "Low-Data Live Classroom",
        subtitle: "Live classes on slow networks",
        icon: FiVideo,
    },
];

const Features = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabContent = [
        {
            tag: "For Low-Connectivity Schools",
            title: "Offline-First Learning for Rural Classrooms",
            highlight:
                "Teaching and learning continue even when the internet does not.",
            description:
                "RemoteClass for Rural Areas lets teachers and students access lessons, notes, and activities without needing continuous network connectivity. Content can be downloaded once and used throughout the day in class.",
            points: [
                {
                    h: "Learn Without Internet",
                    p: "Teachers can access lessons and activities offline after a one-time sync.",
                },
                {
                    h: "Works on Low-End Devices",
                    p: "Optimized for basic Android phones, shared computers, and classroom screens.",
                },
                {
                    h: "Regional Language Support",
                    p: "Supports local and regional languages to improve understanding for students.",
                },
                {
                    h: "Printable Materials",
                    p: "Generate printable notes and worksheets for students without personal devices.",
                },
            ],
        },
        {
            tag: "For Principals, NGOs & Admins",
            title: "Rural School Management Made Simple",
            highlight:
                "One simple dashboard to keep track of students, teachers, and classes in rural schools.",
            description:
                "RemoteClass provides a light-weight management layer for government, NGO-run, and rural private schools to maintain attendance, timetables, and basic student records without heavy infrastructure.",
            points: [
                {
                    h: "Attendance Tracking",
                    p: "Record teacher and student attendance using simple daily logs or basic IDs.",
                },
                {
                    h: "Class & Timetable Management",
                    p: "Manage classes, periods, and subject allocations from one place.",
                },
                {
                    h: "Student Profiles",
                    p: "Store basic information like class, section, guardian contact and address.",
                },
                {
                    h: "Monthly Reports",
                    p: "Download school-level summaries in PDF/Excel formats for govt or NGO review.",
                },
            ],
        },
        {
            tag: "For Shared Devices & Villages",
            title: "Community Learning Hub for Villages",
            highlight:
                "Enables multiple children to learn using a shared device at home or community centers.",
            description:
                "In many rural areas, one phone or computer is shared by many students. RemoteClass supports this reality with shared-device login, group learning, and offline revision packs.",
            points: [
                {
                    h: "Shared Device Login",
                    p: "Multiple students can sign in from the same device with separate profiles.",
                },
                {
                    h: "Group-Based Learning",
                    p: "Create learning groups for villages, tuition centers, or community spaces.",
                },
                {
                    h: "Home Revision Packs",
                    p: "Provide offline revision content and practice material for after-school learning.",
                },
                {
                    h: "Audio & Simple Content",
                    p: "Short notes and audio explanations help students with limited reading skills.",
                },
            ],
        },
        {
            tag: "For Exams in Low-Resource Settings",
            title: "Assessments That Work in Rural Conditions",
            highlight:
                "Plan and track exams even when schools depend on paper and limited connectivity.",
            description:
                "RemoteClass supports both digital and paper-based assessments so teachers in rural schools can conduct exams smoothly and still maintain digital records for long-term tracking.",
            points: [
                {
                    h: "Offline Quiz Creation",
                    p: "Create tests and question sets that can be used in class without internet.",
                },
                {
                    h: "Paper + Digital Friendly",
                    p: "Use printed papers in class and later enter marks or upload results to the system.",
                },
                {
                    h: "Progress Tracking",
                    p: "View how classes and students are performing across subjects over time.",
                },
                {
                    h: "Govt-Ready Reports",
                    p: "Generate simple assessment summaries aligned with government reporting needs.",
                },
            ],
        },
        {
            tag: "For Remote & Fragile Networks",
            title: "Low-Data Live Classroom for Remote Areas",
            highlight:
                "Live teaching experience that runs smoothly even on slow or unstable networks.",
            description:
                "RemoteClass Live focuses on audio-first and low-resolution content so teachers can still connect with students in remote villages without needing high-speed internet.",
            points: [
                {
                    h: "Audio-First Live Sessions",
                    p: "Conduct live classes using audio mode that works on slow and fluctuating connections.",
                },
                {
                    h: "Optional Light Video",
                    p: "Use low-resolution video only when the network condition allows.",
                },
                {
                    h: "Interaction & Doubt Clearing",
                    p: "Students can respond, ask doubts, and stay engaged during the live class.",
                },
                {
                    h: "Session Recap",
                    p: "Save important notes or key points so students who missed can catch up later.",
                },
            ],
        },
    ];

    const content = tabContent[activeTab];
    const total = tabContent.length;

    const goPrev = () => setActiveTab((s) => (s - 1 + total) % total);
    const goNext = () => setActiveTab((s) => (s + 1) % total);

    const ActiveIcon = tabs[activeTab].icon;
    const keyBenefits = content.points.map((p) => p.h).slice(0, 3);

    return (
        <section
            id="features"
            className="py-20 px-6 bg-gradient-to-b from-orange-50 via-white to-blue-50"
        >
            <div className="max-w-7xl mx-auto relative">
                {/* Small section heading */}
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold bg-white/80 shadow-sm border border-orange-100">
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                        SikhaSetu
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Built for Low-Connectivity Schools,
                        <span className="text-orange-600"> High-Quality Learning</span>
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
                        Practical tools that bring structured learning, assessments, and
                        school management to villages and remote communities — even with
                        limited internet and devices.
                    </p>
                </div>

                {/* ------------------ TABS ------------------ */}
                <div className="flex items-center gap-4 overflow-x-auto pb-3 border-b border-gray-200">
                    {tabs.map((tab, idx) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                className={`group relative px-4 py-2 rounded-2xl flex flex-col items-start justify-center min-w-[180px] transition
                  ${isActive
                                        ? "bg-white shadow-sm border border-orange-200"
                                        : "bg-transparent hover:bg-white/70"
                                    }
                `}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`p-1.5 rounded-full border text-xs
                      ${isActive
                                                ? "border-orange-500 text-orange-600"
                                                : "border-gray-300 text-gray-500"
                                            }
                    `}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span
                                        className={`text-xs font-semibold tracking-wide uppercase
                      ${isActive
                                                ? "text-orange-600"
                                                : "text-gray-500 group-hover:text-gray-700"
                                            }
                    `}
                                    >
                                        {tab.label}
                                    </span>
                                </div>
                                <span className="mt-1 text-[11px] text-gray-500">
                                    {tab.subtitle}
                                </span>

                                {isActive && (
                                    <div className="absolute -bottom-[2px] left-4 right-4 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-blue-500 rounded-full"></div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ------------------ MAIN CARD ------------------ */}
                <div className="mt-10 mx-auto w-[95%] md:w-[90%] rounded-3xl bg-white/90 backdrop-blur shadow-xl p-6 md:p-10 gap-8 relative overflow-hidden border border-orange-100">
                    {/* Soft gradient accent blob */}
                    <div className="pointer-events-none absolute -right-10 -top-10 w-56 h-56 bg-orange-100 rounded-full opacity-60 blur-3xl" />
                    <div className="pointer-events-none absolute -left-10 -bottom-10 w-56 h-56 bg-blue-100 rounded-full opacity-60 blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10 space-y-6">
                        {/* Tag + icon */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-medium text-orange-700">
                            <ActiveIcon className="w-3 h-3" />
                            <span>{content.tag}</span>
                        </div>

                        {/* Title + highlight */}
                        <div className="space-y-2">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                                {content.title}
                            </h3>

                            <p className="text-sm md:text-base text-orange-700 font-medium">
                                {content.highlight}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl">
                            {content.description}
                        </p>

                        {/* Key benefit chips */}
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {keyBenefits.map((b, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-100 bg-orange-50/60 text-[11px] md:text-xs font-medium text-orange-800"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                    {b}
                                </span>
                            ))}
                        </div>

                        {/* Points grid */}
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-2">
                            {content.points.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group rounded-2xl border border-gray-100 bg-white/70 px-4 py-3 hover:border-orange-200 hover:shadow-sm transition"
                                >
                                    <p className="font-semibold text-gray-900 text-sm md:text-base flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 group-hover:scale-110 transition" />
                                        {item.h}
                                    </p>
                                    <p className="text-gray-600 text-xs md:text-sm mt-1">
                                        {item.p}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Bottom meta strip */}
                        <div className="mt-6 pt-4 border-t border-orange-100 flex flex-wrap gap-6 text-xs md:text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Designed for rural & remote schools</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                <span>Works with limited devices & low bandwidth</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                <span>Scalable for NGOs & government programs</span>
                            </div>
                        </div>

                        {/* Mobile arrows (bottom) */}
                        <div className="mt-6 flex items-center justify-between md:hidden">
                            <button
                                onClick={goPrev}
                                aria-label="Previous feature"
                                className="bg-white/90 border border-gray-200 rounded-full px-4 py-2 shadow-md flex items-center gap-2 text-xs font-medium hover:scale-105 transition"
                            >
                                <FiChevronLeft className="w-4 h-4 text-orange-500" />
                                Previous
                            </button>
                            <button
                                onClick={goNext}
                                aria-label="Next feature"
                                className="bg-white/90 border border-gray-200 rounded-full px-4 py-2 shadow-md flex items-center gap-2 text-xs font-medium hover:scale-105 transition"
                            >
                                Next
                                <FiChevronRight className="w-4 h-4 text-blue-600" />
                            </button>
                        </div>
                    </div>

                    {/* Desktop LEFT Arrow Button */}
                    <button
                        onClick={goPrev}
                        aria-label="Previous feature"
                        className="hidden md:flex absolute -left-0.5 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2  hover:scale-105 transition"
                    >
                        <FiChevronLeft className="w-5 h-5 text-orange-500" />
                    </button>


                    {/* Desktop RIGHT Arrow Button */}
                    <button
                        onClick={goNext}
                        aria-label="Next feature"
                        className="hidden md:flex absolute -right-0.5 top-1/2 -translate-y-1/2 z-20 bg-white/90  p-2  hover:scale-105 transition"
                    >
                        <FiChevronRight className="w-5 h-5 text-blue-600" />
                    </button>

                </div>
            </div>
        </section>
    );
};

export default Features;
