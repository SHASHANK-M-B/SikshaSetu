// // src/pages/landing/components/MobileSidebar.jsx
// import React from "react";
// import { FiBarChart2, FiCode, FiStar, FiUser } from "react-icons/fi";

// const MobileSidebar = ({ setMobileMenuOpen, setFormType }) => {
//     return (
//         <div className="md:hidden fixed top-0 right-0 w-64 h-full bg-[#101828] bg-opacity-95 backdrop-blur-xl text-white shadow-2xl z-50 p-6 flex flex-col gap-6 animate-slideIn rounded-l-3xl border-l-4 border-cyan-500/50">
//             <button
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="text-4xl text-gray-400 hover:text-red-500 self-end transition"
//                 aria-label="Close menu"
//             >
//                 &times;
//             </button>
//             <a
//                 href="#features"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="flex items-center gap-3 text-lg hover:text-cyan-400 transition border-b border-white/10 pb-2"
//             >
//                 <FiBarChart2 /> Platform
//             </a>
//             <a
//                 href="#how-it-works"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="flex items-center gap-3 text-lg hover:text-cyan-400 transition border-b border-white/10 pb-2"
//             >
//                 <FiCode /> How it Works
//             </a>
//             <a
//                 href="#testimonials"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="flex items-center gap-3 text-lg hover:text-cyan-400 transition border-b border-white/10 pb-2"
//             >
//                 <FiStar /> Stories
//             </a>
//             <button
//                 onClick={() => {
//                     setFormType("login");
//                     setMobileMenuOpen(false);
//                 }}
//                 className="flex items-center gap-3 text-lg hover:text-cyan-400 transition border-b border-white/10 pb-2"
//             >
//                 <FiUser /> Log In
//             </button>
//             <button
//                 onClick={() => {
//                     setFormType("register");
//                     setMobileMenuOpen(false);
//                 }}
//                 className="flex items-center gap-3 text-lg bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition"
//             >
//                 <FiCode /> Register
//             </button>
//         </div>
//     );
// };

// export default MobileSidebar;
import React from "react";
import { FiBarChart2, FiCode, FiStar, FiUser } from "react-icons/fi";

const MobileSidebar = ({ setMobileMenuOpen, setFormType }) => {
    return (
        <div className="md:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-xl z-50 p-6 flex flex-col gap-6 animate-slideIn rounded-l-2xl border-l border-gray-200">

            {/* Close Button */}
            <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl text-gray-500 hover:text-red-500 self-end transition"
                aria-label="Close menu"
            >
                &times;
            </button>

            {/* Nav Links */}
            <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600 transition border-b border-gray-200 pb-2"
            >
                <FiBarChart2 /> Platform
            </a>

            <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600 transition border-b border-gray-200 pb-2"
            >
                <FiCode /> How it Works
            </a>

            <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600 transition border-b border-gray-200 pb-2"
            >
                <FiStar /> Stories
            </a>

            {/* Login */}
            <button
                onClick={() => {
                    setFormType("login");
                    setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600 transition border-b border-gray-200 pb-2 text-left"
            >
                <FiUser /> Log In
            </button>

            {/* Register */}
            <button
                onClick={() => {
                    setFormType("register");
                    setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-lg bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
                <FiCode /> Register
            </button>
        </div>
    );
};

export default MobileSidebar;
