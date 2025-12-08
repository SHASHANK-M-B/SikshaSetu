// src/pages/landing/components/Navbar.jsx
import React from "react";
import { PlayerSuspense } from "./utils.jsx";
import logoAnimation from "../../../assets/animations/logo.json";

const Navbar = ({ setFormType, mobileMenuOpen, setMobileMenuOpen }) => {
    return (
        <nav className="w-full fixed top-0 left-0 flex justify-between items-center px-8 py-3 backdrop-blur-xl bg-white/10 dark:bg-black/25 shadow-lg z-50 transition-colors duration-500 border-b border-cyan-500/10">
            <div className="flex items-center gap-2">
                <PlayerSuspense
                    autoplay
                    loop
                    src={logoAnimation}
                    style={{ height: "40px", width: "40px" }}
                />
                <span className="text-xl font-bold text-cyan-400 tracking-tight">
                    RuralRemoteClass
                </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
                <a
                    href="#features"
                    className="hover:text-cyan-400 transition text-gray-200"
                >
                    Platform
                </a>
                <a
                    href="#how-it-works"
                    className="hover:text-cyan-400 transition text-gray-200"
                >
                    How it Works
                </a>
                <a
                    href="#testimonials"
                    className="hover:text-cyan-400 transition text-gray-200"
                >
                    Stories
                </a>
                <a
                    href="#pricing"
                    className="hover:text-cyan-400 transition text-gray-200"
                >
                    Pricing
                </a>
                <button
                    onClick={() => setFormType("login")}
                    className="hover:text-cyan-400 transition text-gray-200"
                >
                    Log In
                </button>
                <button
                    onClick={() => setFormType("register")}
                    className="bg-cyan-500 text-gray-900 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-cyan-400 transition-colors duration-300"
                >
                    Get Started
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white text-2xl p-2"
                >
                    ☰
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
