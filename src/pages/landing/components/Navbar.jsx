import React, { useState, useEffect } from "react";

const Navbar = ({ setFormType, mobileMenuOpen, setMobileMenuOpen }) => {
    const [scrolled, setScrolled] = useState(false);

    // Effect to handle scroll background change
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "#features", label: "Platform" },
        { href: "#how-it-works", label: "How it Works" },
        { href: "#testimonials", label: "Stories" },
        { href: "#pricing", label: "Pricing" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-md shadow-md py-2"
                : "bg-gradient-to-r from-green-50/50 via-amber-50/50 to-white/50 py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo with subtle hover lift */}
                <div className="flex items-center gap-2 select-none transition-transform hover:scale-105">
                    <img
                        src="/SikhaSetuLogo1.png"
                        alt="SikshaSetu Logo"
                        className="h-12 md:h-14 w-auto object-contain"
                    />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-10 text-sm font-semibold">
                    {navLinks.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            className="relative text-gray-600 hover:text-teal-600 transition-colors duration-300 group"
                        >
                            {item.label}
                            {/* Animated Underline */}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}

                    <div className="flex items-center gap-6 border-l pl-8 border-gray-200">
                        <button
                            onClick={() => setFormType("login")}
                            className="text-gray-700 hover:text-orange-500 transition-colors font-bold"
                        >
                            Log In
                        </button>

                        <button
                            onClick={() => setFormType("register")}
                            className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-bold text-white transition-all duration-300 bg-teal-600 rounded-full cursor-pointer group ease-out hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-500 shadow-teal-200/50 shadow-lg"
                        >
                            <span className="relative">Get Started</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 rounded-lg transition-colors ${mobileMenuOpen ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;