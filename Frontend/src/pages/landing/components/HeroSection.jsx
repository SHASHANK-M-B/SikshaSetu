// // src/pages/landing/components/HeroSection.jsx
// import React from "react";
// import { Typewriter } from "react-simple-typewriter";
// import { motion } from "framer-motion";
// import Tilt from "react-parallax-tilt";
// import { FiHelpCircle, FiChevronDown } from "react-icons/fi";
// import { PlayerSuspense, FiShieldCheckIcon } from "./utils.jsx";
// import animationData from "../../../assets/animations/OnlineLearning.json";

// const HeroSection = ({ setFormType }) => {
//     return (
//         <section className="pt-40 md:pt-44 lg:pt-48 px-8 pb-16 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-16">
//             {/* Left Content */}
//             <div
//                 data-aos="fade-right"
//                 className="flex-1 space-y-6 text-center md:text-left reveal"
//             >
//                 <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/40 border border-cyan-400/40 text-[10px] uppercase tracking-[0.24em] text-cyan-300 mb-2">
//                     <FiHelpCircle className="w-4 h-4" />
//                     Built for Low-Bandwidth Higher Education
//                 </span>

//                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-indigo-400 drop-shadow-lg">
//                     Remote Learning
//                     <br />
//                     <span className="text-white">that Respects Data Limits.</span>
//                 </h1>

//                 <p className="text-base md:text-lg font-light text-gray-300 max-w-xl mx-auto md:mx-0">
//                     <Typewriter
//                         words={[
//                             "Deliver full-semester content without overloading networks.",
//                             "Give rural students the same experience as metropolitan campuses.",
//                             "Use one platform for content delivery, analytics and support.",
//                         ]}
//                         loop
//                         cursor
//                         cursorStyle="|"
//                         typeSpeed={60}
//                         deleteSpeed={35}
//                         delaySpeed={1600}
//                     />
//                 </p>

//                 <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setFormType("register")}
//                         className="bg-cyan-500 text-gray-900 font-bold px-8 py-3 text-sm md:text-lg rounded-lg shadow-xl shadow-cyan-500/20 hover:bg-cyan-400 transition-all duration-300"
//                     >
//                         Request Campus Demo
//                     </motion.button>
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setFormType("login")}
//                         className="border-2 border-gray-600 px-8 py-3 text-sm md:text-lg rounded-lg hover:bg-gray-900/60 hover:border-cyan-400 transition-all duration-300 font-semibold text-gray-200"
//                     >
//                         Existing Client Login
//                     </motion.button>
//                 </div>

//                 <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start text-xs md:text-sm text-gray-400 pt-4">
//                     <div className="flex items-center gap-2">
//                         <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
//                         <span>99.9% Uptime Infrastructure</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <FiShieldCheckIcon />
//                         <span>End-to-End Encrypted Student Data</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <FiShieldCheckIcon />
//                         <span>Tailored for Rural & Remote Institutes</span>
//                     </div>
//                 </div>

//                 <button
//                     onClick={() => {
//                         const el = document.getElementById("how-it-works");
//                         if (el) el.scrollIntoView({ behavior: "smooth" });
//                     }}
//                     className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-300 hover:text-cyan-200"
//                 >
//                     <FiChevronDown className="w-4 h-4" />
//                     Scroll to see how it works
//                 </button>
//             </div>

//             {/* Right Animation */}
//             <div
//                 data-aos="fade-left"
//                 className="flex-1 flex justify-center items-center"
//             >
//                 <Tilt
//                     tiltMaxAngleX={4}
//                     tiltMaxAngleY={4}
//                     scale={1.03}
//                     transitionSpeed={1000}
//                     className="rounded-3xl overflow-hidden "
//                 >
//                     <PlayerSuspense
//                         autoplay
//                         loop
//                         src={animationData}
//                         className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[500px] lg:h-[500px]"
//                     />
//                 </Tilt>
//             </div>
//         </section>
//     );
// };

// export default HeroSection;
import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { FiGlobe, FiChevronDown, FiStar } from "react-icons/fi"; // Added FiStar
import { PlayerSuspense, FiShieldCheckIcon } from "./utils.jsx";
import animationData from "../../../assets/animations/OnlineLearning.json";

const HeroSection = ({ setFormType }) => {
    return (
        // Added bg-transparent to ensure the global gradient from Landing component shows through, 
        // overriding the bg-gray-50 if necessary for better visual continuity.
        <section className="pt-36 md:pt-40 lg:pt-44 px-6 pb-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 bg-transparent">

            {/* LEFT CONTENT */}
            <div data-aos="fade-right" className="flex-1 space-y-6 text-center md:text-left">

                {/* Badge: Primary Institutional Color (Indigo) */}
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full 
                                 bg-indigo-100 border border-indigo-300 text-[10px] font-medium 
                                 uppercase tracking-wide text-indigo-800 shadow-sm">
                    <FiGlobe className="w-4 h-4" />
                    Dedicated to Educational Equity
                </span>

                {/* Heading: Primary Institutional Color (Indigo) */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                    Next-Gen
                    <br />
                    <span className="text-indigo-800">Learning Infrastructure.</span>
                </h1>

                {/* Typewriter Text: Kept functional and relevant */}
                <p className="text-base md:text-lg text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
                    <Typewriter
                        words={[
                            "Provide high-quality course material regardless of location.",
                            "Seamlessly integrate practical labs and assessment tools.",
                            "Elevate student outcomes through powerful analytics and feedback.",
                        ]}
                        loop
                        cursor
                        cursorStyle="|"
                        typeSpeed={50}
                        deleteSpeed={30}
                        delaySpeed={1500}
                    />
                </p>

                {/* Buttons and CTA Trust Bar */}
                <div className="flex flex-col gap-4 justify-center md:justify-start pt-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Primary CTA: Vibrant Teal */}
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setFormType("register")}
                            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold 
                                     px-8 py-3 text-base md:text-lg rounded-lg shadow-lg 
                                     transition-all duration-300 transform hover:shadow-xl"
                        >
                            Schedule Institutional Demo
                        </motion.button>

                        {/* Secondary Button: Neutral */}
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setFormType("login")}
                            className="border border-gray-300 px-8 py-3 text-base md:text-lg rounded-lg 
                                     hover:bg-gray-200 transition-all font-semibold text-gray-700"
                        >
                            Student / Faculty Login
                        </motion.button>
                    </div>

                    {/* 💡 NEW ELEMENT: Post-CTA Trust/Rating Box (Teal Accent) */}
                    <div className="flex items-center gap-4 pt-2 justify-center md:justify-start">
                        <div className="flex items-center gap-1 text-sm font-semibold text-teal-700">
                            <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>4.9/5 Star Rating</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            (Based on 120+ Institute Reviews)
                        </div>
                    </div>
                </div>

                {/* Trust Indicators: Icons use primary Indigo color */}
                <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start text-xs md:text-sm text-gray-600 pt-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Optimized for Low-Bandwidth Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiShieldCheckIcon className="text-indigo-600" />
                        <span>Data Security & Compliance Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiGlobe className="text-indigo-600" />
                        <span>Deployed in 150+ Remote Institutes</span>
                    </div>
                </div>

                {/* Scroll CTA: Uses primary institutional color (Indigo) */}
                <button
                    onClick={() => {
                        const el = document.getElementById("timeline");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-3 inline-flex items-center gap-2 text-xs text-indigo-700 hover:text-indigo-600"
                >
                    <FiChevronDown className="w-4 h-4" />
                    Explore the Implementation Process
                </button>
            </div>

            {/* RIGHT ANIMATION */}
            <div data-aos="fade-left" className="flex-1 flex justify-center items-center">
                <Tilt
                    tiltMaxAngleX={4}
                    tiltMaxAngleY={4}
                    scale={1.02}
                    transitionSpeed={1000}
                    className="rounded-3xl overflow-hidden "
                >
                    <PlayerSuspense
                        autoplay
                        loop
                        src={animationData}
                        className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] lg:w-[480px] lg:h-[480px]"
                    />
                </Tilt>
            </div>

        </section>
    );
};

export default HeroSection;