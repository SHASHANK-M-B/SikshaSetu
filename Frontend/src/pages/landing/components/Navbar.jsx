// // src/pages/landing/components/Navbar.jsx
// import React from "react";
// import { PlayerSuspense } from "./utils.jsx";
// import logoAnimation from "../../../assets/animations/logo.json";

// const Navbar = ({ setFormType, mobileMenuOpen, setMobileMenuOpen }) => {
//     return (
//         <nav className="w-full fixed top-0 left-0 flex justify-between items-center px-8 py-3 backdrop-blur-xl bg-white/10 dark:bg-black/25 shadow-lg z-50 transition-colors duration-500 border-b border-cyan-500/10">
//             <div className="flex items-center gap-2">
//                 <PlayerSuspense
//                     autoplay
//                     loop
//                     src={logoAnimation}
//                     style={{ height: "40px", width: "40px" }}
//                 />
//                 <span className="text-xl font-bold text-cyan-400 tracking-tight">
//                     RuralRemoteClass
//                 </span>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
//                 <a
//                     href="#features"
//                     className="hover:text-cyan-400 transition text-gray-200"
//                 >
//                     Platform
//                 </a>
//                 <a
//                     href="#how-it-works"
//                     className="hover:text-cyan-400 transition text-gray-200"
//                 >
//                     How it Works
//                 </a>
//                 <a
//                     href="#testimonials"
//                     className="hover:text-cyan-400 transition text-gray-200"
//                 >
//                     Stories
//                 </a>
//                 <a
//                     href="#pricing"
//                     className="hover:text-cyan-400 transition text-gray-200"
//                 >
//                     Pricing
//                 </a>
//                 <button
//                     onClick={() => setFormType("login")}
//                     className="hover:text-cyan-400 transition text-gray-200"
//                 >
//                     Log In
//                 </button>
//                 <button
//                     onClick={() => setFormType("register")}
//                     className="bg-cyan-500 text-gray-900 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-cyan-400 transition-colors duration-300"
//                 >
//                     Get Started
//                 </button>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden">
//                 <button
//                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                     className="text-white text-2xl p-2"
//                 >
//                     ☰
//                 </button>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
import React from "react";
const Navbar = ({ setFormType, mobileMenuOpen, setMobileMenuOpen }) => {
    return (
        // Navbar background remains light and slightly transparent to blend with the light gradient background
        <nav className="fixed top-0 left-0 w-full bg-gradient-to-br from-green-100 via-amber-50 to-white z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 select-none -ml-10">
                    <img
                        src="/SikhaSetuLogo.png"
                        alt="SikshaSetu Logo"
                        className="h-20 w-auto object-contain"
                    />
                </div>


                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium">

                    {[
                        { href: "#features", label: "Platform" },
                        { href: "#how-it-works", label: "How it Works" },
                        { href: "#testimonials", label: "Stories" },
                        { href: "#pricing", label: "Pricing" },
                    ].map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            // Text color is dark gray
                            className="relative text-gray-700 hover:text-gray-900 transition font-medium group"
                        >
                            {item.label}
                            {/* 🚨 ACCENT CHANGE: Underline color is now Vibrant Orange */}
                        </a>
                    ))}

                    {/* Login */}
                    <button
                        onClick={() => setFormType("login")}
                        // Text color is dark gray
                        className="relative text-gray-700 hover:text-gray-900 transition group"
                    >
                        Log In
                        {/* 🚨 ACCENT CHANGE: Underline color is now Vibrant Orange */}
                    </button>

                    {/* CTA */}
                    <button
                        onClick={() => setFormType("register")}
                        // 🚨 PRIMARY CTA COLOR CHANGE: Vibrant Orange
                        className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg shadow-lg transition font-semibold transform hover:scale-[1.02]"
                    >
                        Get Started
                    </button>
                </div>

                {/* MOBILE MENU BUTTON */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        // 🚨 MOBILE ICON CHANGE: Orange hover color
                        className="text-gray-700 text-3xl hover:text-cyan-300 transition"
                    >
                        ☰
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;