// // src/pages/landing/components/Footer.jsx
// import React from "react";
// import { PlayerSuspense } from "./utils.jsx";
// import logoAnimation from "../../../assets/animations/logo.json";

// const Footer = () => {
//     return (
//         <footer className="text-white py-14 px-8 border-t-2 border-gray-700/50 bg-[#151a36]/95">
//             <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 items-start">
//                 {/* Branding */}
//                 <div className="md:col-span-2">
//                     <div className="flex items-center mb-3">
//                         <PlayerSuspense
//                             autoplay
//                             loop
//                             src={logoAnimation}
//                             style={{ height: "40px", width: "40px" }}
//                         />
//                         <span className="text-cyan-400 text-2xl font-extrabold ml-2">
//                             RuralRemoteClass
//                         </span>
//                     </div>
//                     <p className="text-sm text-gray-400 max-w-xs">
//                         Dedicated to scalable, accessible remote learning infrastructure for
//                         colleges and universities with connectivity constraints.
//                     </p>
//                 </div>

//                 {/* Platform */}
//                 <div className="flex flex-col space-y-3 text-sm text-gray-300">
//                     <h4 className="text-indigo-400 font-semibold mb-1">Platform</h4>
//                     <a href="#features" className="hover:text-cyan-400 transition">
//                         Content Engine
//                     </a>
//                     <a href="#how-it-works" className="hover:text-cyan-400 transition">
//                         How It Works
//                     </a>
//                     <a href="#pricing" className="hover:text-cyan-400 transition">
//                         Pricing Overview
//                     </a>
//                 </div>

//                 {/* Resources */}
//                 <div className="flex flex-col space-y-3 text-sm text-gray-300">
//                     <h4 className="text-indigo-400 font-semibold mb-1">Resources</h4>
//                     <a href="#" className="hover:text-cyan-400 transition">
//                         Case Studies
//                     </a>
//                     <a href="#" className="hover:text-cyan-400 transition">
//                         Security Policy
//                     </a>
//                     <a href="#" className="hover:text-cyan-400 transition">
//                         Terms of Service
//                     </a>
//                 </div>

//                 {/* Support */}
//                 <div
//                     id="support"
//                     className="flex flex-col space-y-3 text-sm text-gray-300"
//                 >
//                     <h4 className="text-indigo-400 font-semibold mb-1">Support</h4>
//                     <a href="#" className="hover:text-cyan-400 transition">
//                         Contact Sales
//                     </a>
//                     <a href="#" className="hover:text-cyan-400 transition">
//                         Technical Help
//                     </a>
//                 </div>
//             </div>

//             {/* Bottom Line */}
//             <div className="text-center text-xs text-gray-500 border-t border-gray-700 mt-12 pt-4">
//                 &copy; {new Date().getFullYear()} RuralRemoteClass. All Rights Reserved.
//             </div>
//         </footer>
//     );
// };

// export default Footer;
import React from "react";
import { PlayerSuspense } from "./utils.jsx";
import logoAnimation from "../../../assets/animations/logo.json";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-14 px-8 text-gray-700">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 items-start">

                {/* Branding */}
                <div className="md:col-span-2">
                    <div className="flex items-center mb-3">
                        <PlayerSuspense
                            autoplay
                            loop
                            src={logoAnimation}
                            style={{ height: "38px", width: "38px" }}
                        />
                        <span className="text-blue-700 text-2xl font-bold ml-2">
                            SikshaSetu
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                        Dedicated to scalable, accessible remote learning infrastructure for
                        colleges and universities with connectivity constraints.
                    </p>
                </div>

                {/* Platform */}
                <div className="flex flex-col space-y-3 text-sm">
                    <h4 className="text-gray-800 font-semibold mb-1">Platform</h4>
                    <a href="#features" className="hover:text-blue-600 transition">
                        Content Engine
                    </a>
                    <a href="#how-it-works" className="hover:text-blue-600 transition">
                        How It Works
                    </a>
                    <a href="#pricing" className="hover:text-blue-600 transition">
                        Pricing Overview
                    </a>
                </div>

                {/* Resources */}
                <div className="flex flex-col space-y-3 text-sm">
                    <h4 className="text-gray-800 font-semibold mb-1">Resources</h4>
                    <a href="#" className="hover:text-blue-600 transition">
                        Case Studies
                    </a>
                    <a href="#" className="hover:text-blue-600 transition">
                        Security Policy
                    </a>
                    <a href="#" className="hover:text-blue-600 transition">
                        Terms of Service
                    </a>
                </div>

                {/* Support */}
                <div id="support" className="flex flex-col space-y-3 text-sm">
                    <h4 className="text-gray-800 font-semibold mb-1">Support</h4>
                    <a href="#" className="hover:text-blue-600 transition">
                        Contact Sales
                    </a>
                    <a href="#" className="hover:text-blue-600 transition">
                        Technical Help
                    </a>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="text-center text-xs text-gray-500 border-t border-gray-200 mt-12 pt-4">
                &copy; {new Date().getFullYear()} SikshaSetu. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
