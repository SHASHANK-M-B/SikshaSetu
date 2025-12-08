// import React, { useState, useEffect, Suspense } from "react";
// import { Player } from "@lottiefiles/react-lottie-player";
// import CountUp from "react-countup";
// import { motion } from "framer-motion";
// import Tilt from "react-parallax-tilt";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import {
//     FiHelpCircle,
//     FiChevronDown,
//     FiUploadCloud,
//     FiBarChart2,
//     FiDownload,
//     FiStar,
//     FiUser,
//     FiCode,
// } from "react-icons/fi";
// import Lenis from "@studio-freight/lenis";

// import AuthModal from "../../components/auth/AuthModal";

// // components
// import Navbar from "./components/Navbar";
// import MobileSidebar from "./components/MobileSidebar";
// import HeroSection from "./components/HeroSection";
// import RoleSelector from "./components/RoleSelector";
// import FeaturesComponent from "./components/Features";
// import Timeline from "./components/Timeline";
// import WhyChooseUs from "./components/WhyChooseUs";
// import StatsSection from "./components/StatsSection";
// import TestimonialsComponent from "./components/Testimonials";
// import FAQ from "./components/FAQ";
// import PricingSection from "./components/PricingSection";
// import Newsletter from "./components/Newsletter";
// import Footer from "./components/Footer";

// // utils
// import { PlayerSuspense } from "./components/utils";

// // --- LOTTIE ASSETS ---
// import animationData from "../../assets/animations/OnlineLearning.json";
// import logoAnimation from "../../assets/animations/logo.json";
// import uploadAnimation from "../../assets/animations/uploads.json";
// import chartsAnimation from "../../assets/animations/charts.json";
// import exportAnimation from "../../assets/animations/exports.json";
// import newsletterAnimation from "../../assets/animations/newsletter.json";

// const Landing = () => {
//     const [formType, setFormType] = useState(null);
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const [darkMode, setDarkMode] = useState(true);
//     const [selectedRole, setSelectedRole] = useState("student");

//     useEffect(() => {
//         // AOS
//         AOS.init({ duration: 800, once: true });

//         // Lenis smooth scroll
//         const lenis = new Lenis({
//             duration: 1.1,
//             smooth: true,
//             smoothTouch: true,
//             lerp: 0.08,
//             easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//         });

//         function raf(time) {
//             lenis.raf(time);
//             requestAnimationFrame(raf);
//         }
//         requestAnimationFrame(raf);

//         // Scroll progress bar
//         const handleScroll = () => {
//             const scrolled = window.scrollY;
//             const height = document.body.scrollHeight - window.innerHeight;
//             const progress = height > 0 ? (scrolled / height) * 100 : 0;
//             const bar = document.getElementById("scroll-progress");
//             if (bar) {
//                 bar.style.width = `${progress}%`;
//             }
//         };

//         window.addEventListener("scroll", handleScroll);

//         return () => {
//             lenis.destroy();
//             window.removeEventListener("scroll", handleScroll);
//         };
//     }, []);

//     const handleRoleClick = (role) => {
//         setSelectedRole(role);
//         setFormType("register");
//     };

//     return (
//         <div
//             className={`${darkMode
//                 ? "bg-gradient-to-br from-[#050713] via-[#141a2b] to-[#050713] text-white"
//                 : "bg-gradient-to-br from-[#ffffff] via-[#f7f9fd] to-[#eef3f9] text-gray-900"
//                 } transition-colors duration-500 min-h-screen font-sans relative`}
//         >
//             {/* Scroll Progress Bar */}
//             <div
//                 id="scroll-progress"
//                 className="fixed top-0 left-0 h-1 bg-cyan-400 z-[70] transition-all duration-150"
//             ></div>

//             {/* Subtle gradient at top */}
//             <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-[40]" />

//             {/* Background visuals */}
//             <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 dark:opacity-5">
//                 <div className="bubbles"></div>
//             </div>
//             <div className="pointer-events-none -z-10">
//                 <div className="absolute size-40 bg-cyan-500/10 blur-3xl top-32 left-10 rounded-full animate-[float_9s_ease-in-out_infinite]" />
//                 <div className="absolute size-52 bg-indigo-500/10 blur-3xl bottom-24 right-10 rounded-full animate-[float_11s_ease-in-out_infinite]" />
//                 <div className="absolute size-24 bg-emerald-500/10 blur-2xl top-1/2 left-1/2 -translate-x-1/2 rounded-full animate-[float_10s_ease-in-out_infinite]" />
//             </div>

//             {/* NAVBAR */}
//             <Navbar
//                 setFormType={setFormType}
//                 mobileMenuOpen={mobileMenuOpen}
//                 setMobileMenuOpen={setMobileMenuOpen}
//             />

//             {/* Mobile Sidebar */}
//             {mobileMenuOpen && (
//                 <MobileSidebar
//                     setMobileMenuOpen={setMobileMenuOpen}
//                     setFormType={setFormType}
//                 />
//             )}

//             {/* HERO */}
//             <HeroSection setFormType={setFormType} />

//             {/* QUICK ROLE CTA */}
//             <RoleSelector
//                 selectedRole={selectedRole}
//                 handleRoleClick={handleRoleClick}
//             />

//             {/* TRUST / PARTNERS STRIP */}
//             <section className="px-8 pb-10">
//                 <div className="max-w-6xl mx-auto rounded-xl bg-black/30 border border-gray-800/70 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
//                     <p className="text-xs md:text-sm text-gray-400">
//                         Trusted by early adopters across{" "}
//                         <span className="font-semibold text-cyan-300">
//                             engineering colleges, polytechnics & degree colleges
//                         </span>
//                         .
//                     </p>
//                     <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.22em] text-gray-500">
//                         <span className="px-3 py-1 rounded-full bg-white/5 border border-gray-700/60">
//                             Govt. Institutes
//                         </span>
//                         <span className="px-3 py-1 rounded-full bg-white/5 border border-gray-700/60">
//                             Autonomous
//                         </span>
//                         <span className="px-3 py-1 rounded-full bg-white/5 border border-gray-700/60">
//                             Rural Campuses
//                         </span>
//                     </div>
//                 </div>
//             </section>

//             {/* FEATURES */}
//             <Suspense
//                 fallback={
//                     <div className="text-center py-20 text-xl text-gray-400">
//                         Loading Capabilities...
//                     </div>
//                 }
//             >
//                 <FeaturesComponent darkMode={darkMode} />
//             </Suspense>

//             {/* HOW IT WORKS TIMELINE */}
//             <Timeline />

//             {/* WHY RURALREMOTECLASS SECTION */}
//             <WhyChooseUs />

//             {/* STATS */}
//             <StatsSection />

//             {/* TESTIMONIALS */}
//             <Suspense
//                 fallback={
//                     <div className="text-center py-20 text-xl text-gray-400">
//                         Loading Testimonials...
//                     </div>
//                 }
//             >
//                 <TestimonialsComponent darkMode={darkMode} />
//             </Suspense>

//             {/* FAQ SECTION */}
//             <FAQ />

//             {/* PRICING / DEPLOYMENT PLANS */}
//             <PricingSection />

//             {/* NEWSLETTER / CTA */}
//             <Newsletter />

//             {/* FOOTER */}
//             <Footer />

//             {/* Floating Help / Chat Bubble */}
//             <button
//                 onClick={() => {
//                     const supportEl = document.getElementById("support");
//                     if (supportEl) {
//                         supportEl.scrollIntoView({ behavior: "smooth" });
//                     }
//                 }}
//                 className="fixed bottom-5 right-5 bg-cyan-500 hover:bg-cyan-400 text-gray-900 shadow-xl shadow-cyan-500/40 px-4 py-3 rounded-full flex items-center gap-2 text-sm font-semibold z-50"
//             >
//                 <FiHelpCircle className="w-4 h-4" />
//                 Need help?
//             </button>

//             {/* AUTH MODAL */}
//             {formType && (
//                 <AuthModal
//                     initialFormType={formType}
//                     onClose={() => setFormType(null)}
//                 />
//             )}
//         </div>
//     );
// };

// export default Landing;
import React, { useState, useEffect, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import AuthModal from "../../components/auth/AuthModal";

// components
import Navbar from "./components/Navbar";
import MobileSidebar from "./components/MobileSidebar";
import HeroSection from "./components/HeroSection";
import RoleSelector from "./components/RoleSelector";
import FeaturesComponent from "./components/Features";
import Timeline from "./components/Timeline";
import WhyChooseUs from "./components/WhyChooseUs";
import StatsSection from "./components/StatsSection";
import TestimonialsComponent from "./components/Testimonials";
import FAQ from "./components/FAQ";
import PricingSection from "./components/PricingSection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

const Landing = () => {
    const [formType, setFormType] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("student");

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
    }, []);

    const handleRoleClick = (role) => {
        setSelectedRole(role);
        setFormType("register");
    };

    return (
        // 🎨 NEW COLOR COMBO: Soft background (gray-50) with deep primary text (indigo-900).
        <div className="text-gray-900 min-h-screen font-sans 
    /* 🎨 ENHANCED GRADIENT: More vibrant start, incorporates the Amber accent color. */
    bg-gradient-to-br from-green-100 via-amber-50 to-white">
            {/* NAVBAR */}
            <Navbar
                setFormType={setFormType}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <MobileSidebar
                    setMobileMenuOpen={setMobileMenuOpen}
                    setFormType={setFormType}
                />
            )}

            {/* HERO SECTION - (Content remains the same, styling is handled in HeroSection component) */}
            <HeroSection setFormType={setFormType} />

            {/* QUICK ROLE CTA */}
            <RoleSelector
                selectedRole={selectedRole}
                handleRoleClick={handleRoleClick}
            />

            {/* TRUST STRIP - Updated border and shadow for modern look */}
            <section className="px-6 pb-10" data-aos="fade-up">
                <div className="max-w-[77.5rem] mx-auto rounded-xl bg-white border border-gray-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                    <p className="text-sm md:text-lg text-indigo-700 font-semibold">
                        Trusted by <span className="text-teal-600">300+ Educational Institutions</span> globally.
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider text-indigo-600">
                        <span className="px-4 py-1 rounded-full bg-indigo-50 border border-indigo-200 shadow-sm font-medium">
                            Accredited Programs
                        </span>
                        <span className="px-4 py-1 rounded-full bg-indigo-50 border border-indigo-200 shadow-sm font-medium">
                            Industry Certified
                        </span>
                        <span className="px-4 py-1 rounded-full bg-indigo-50 border border-indigo-200 shadow-sm font-medium">
                            Research Partnerships
                        </span>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <Suspense
                fallback={
                    <div className="text-center py-16 text-lg text-gray-500">
                        Loading Curricula...
                    </div>
                }
            >
                <FeaturesComponent />
            </Suspense>

            {/* TIMELINE */}
            <Timeline />

            {/* WHY CHOOSE US */}
            <WhyChooseUs />

            {/* STATS */}
            <StatsSection />

            {/* TESTIMONIALS */}
            <Suspense
                fallback={
                    <div className="text-center py-20 text-lg text-gray-500">
                        Loading Student Stories...
                    </div>
                }
            >
                <TestimonialsComponent />
            </Suspense>

            {/* FAQ */}
            <FAQ />

            {/* PRICING */}
            <PricingSection />

            {/* NEWSLETTER */}
            <Newsletter />

            {/* FOOTER */}
            <Footer />

            {/* Floating Help Button - Changed color to Teal for accent */}
            {/* <button
                onClick={() => {
                    const el = document.getElementById("support");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="fixed bottom-5 right-5 bg-teal-600 hover:bg-teal-500 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium z-50"
            >
                Admissions Support
            </button> */}

            {/* AUTH MODAL */}
            {formType && (
                <AuthModal
                    initialFormType={formType}
                    onClose={() => setFormType(null)}
                />
            )}
        </div>
    );
};

export default Landing;