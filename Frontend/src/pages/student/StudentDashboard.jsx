// import React, { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// import {
//     FiHeadphones,
//     FiBookOpen,
//     FiDownload,
//     FiGrid,
//     FiChevronsRight,
//     FiChevronsLeft,
//     FiMessageCircle,
//     FiAward,
//     FiBell,
//     FiTrendingUp,
//     FiX,
//     FiMenu,
//     FiLogOut,
//     FiVideo // Using FiVideo for Recorded Sessions
// } from "react-icons/fi";

// // IMPORT ALL COMPONENTS
// import Overview from "./components/Overview";
// import ViewCourses from "./components/ViewCourses";
// import LiveAudio from "./components/LiveAudio";
// import AttemptQuizzes from "./components/AttemptQuizzes";

// import Downloads from "./components/Downloads";
// import OfflineMode from "./components/OfflineMode";
// import Doubts from "./components/Doubts";
// import Gamification from "./components/Gamification";
// import StudentAnalytics from "./components/StudentAnalytics";

// // --- NEW COMPONENT PLACEHOLDER ---
// const RecordedSessions = () => (
//     <div className="p-4 text-center text-gray-600">
//         <h2 className="text-xl font-semibold mb-2">Recorded Sessions</h2>
//         <p>This is where your recorded session playback interface will be.</p>
//     </div>
// );
// // ------------------------------------


// const THEME = {
//     gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
// };

// const navItems = [
//     { id: "overview", icon: FiGrid, name: "Dashboard Overview" },
//     { id: "viewCourses", icon: FiBookOpen, name: "My Courses" },
//     { id: "liveAudio", icon: FiHeadphones, name: "Join Live Audio" },
//     { id: "quizzes", icon: FiBookOpen, name: "Attempt Quizzes" },
//     // --- ADDED NEW TAB HERE ---
//     { id: "recordedSessions", icon: FiVideo, name: "Recorded Sessions" },
//     // --------------------------
//     { id: "downloads", icon: FiDownload, name: "Lesson Bundles" },
//     { id: "offlineMode", icon: FiBookOpen, name: "Offline Mode" },
//     { id: "doubts", icon: FiMessageCircle, name: "Doubts & Discussion" },
//     { id: "gamification", icon: FiAward, name: "Achievements" },
//     { id: "analytics", icon: FiTrendingUp, name: "Student Analytics" },
// ];

// export default function StudentDashboard() {

//     const studentName = "Alex Lee";

//     const [activeTab, setActiveTab] = useState("overview");
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [mobileNavOpen, setMobileNavOpen] = useState(false);

//     const dummyQuizData = [
//         { id: 1, title: "Quiz 1: Basics", course: "CSE101", status: "Pending" },
//         { id: 2, title: "Quiz 2: Arrays", course: "CSE101", status: "Attempted", score: "88%" },
//         { id: 3, title: "Reading Test", course: "ENG201", status: "Pending" },
//     ];

//     const dummyDownloads = [
//         { id: 1, name: "Week 3 Slides", size: "12MB", downloaded: false, fileType: "pdf" },
//         { id: 2, name: "Audio Recap", size: "30MB", downloaded: true, fileType: "audio" },
//     ];

//     const dummyDoubts = [
//         { id: 1, text: "Sir explain recursion again", reply: "Sure tomorrow.", time: "1d ago", status: "answered" },
//         { id: 2, text: "What is time complexity?", time: "3h ago", status: "pending" },
//     ];

//     const dummyBadges = [
//         { id: 1, title: "7-Day Streak", icon: "🔥", unlocked: true },
//         { id: 2, title: "Quiz Master", icon: "🏆", unlocked: false },
//         { id: 3, title: "Top Performer", icon: "⭐", unlocked: true },
//     ];

//     const dummyAnalytics = {
//         attendance: 85,
//         assignments: 72,
//         overallProgress: 90,
//     };

//     const components = useMemo(() => ({
//         overview: <Overview studentName={studentName} quizItems={dummyQuizData} />,
//         viewCourses: <ViewCourses />,
//         liveAudio: <LiveAudio />,
//         quizzes: <AttemptQuizzes quizItems={dummyQuizData} />,
//         // --- ADDED NEW COMPONENT HERE ---
//         recordedSessions: <RecordedSessions />,
//         // ----------------------------------
//         downloads: <Downloads downloadItems={dummyDownloads} />,
//         offlineMode: <OfflineMode downloadItems={dummyDownloads} />,
//         doubts: <Doubts doubtItems={dummyDoubts} />,
//         gamification: <Gamification badges={dummyBadges} streak={11} />,
//         analytics: <StudentAnalytics analytics={dummyAnalytics} />,
//     }), []);

//     const renderContent = components[activeTab];


//     return (
//         <div className="h-screen flex flex-col lg:flex-row bg-gray-100 overflow-hidden">

//             {/* MOBILE HEADER */}
//             <div className={`lg:hidden fixed top-0 w-full px-4 py-3 flex items-center justify-between
//                 shadow-md z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 ${THEME.gradient}`}>

//                 <h1 className="text-xl font-bold text-white drop-shadow">
//                     Remote<span className="text-yellow-300">Edu</span>
//                 </h1>

//                 <button onClick={() => setMobileNavOpen(true)} className="p-3 bg-white/20 rounded-lg">
//                     <FiMenu size={24} className="text-white" />
//                 </button>
//             </div>


//             {/* MOBILE SIDEBAR */}
//             <AnimatePresence>
//                 {mobileNavOpen && (
//                     <>
//                         <motion.div
//                             initial={{ x: "100%" }}
//                             animate={{ x: 0 }}
//                             exit={{ x: "100%" }}
//                             transition={{ type: "spring", stiffness: 120, damping: 20 }}
//                             className={`${THEME.gradient} fixed right-0 top-0 h-full w-72 z-50 text-white shadow-2xl p-6 overflow-y-auto`}
//                         >
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-2xl font-bold">Menu</h2>

//                                 <button onClick={() => setMobileNavOpen(false)}><FiX size={26} /></button>
//                             </div>

//                             <nav className="space-y-2">
//                                 {navItems.map(item => (
//                                     <button
//                                         key={item.id}
//                                         onClick={() => {
//                                             setActiveTab(item.id);
//                                             setMobileNavOpen(false);
//                                         }}
//                                         className={`w-full flex items-center gap-4 p-3 rounded-xl font-medium
//                                         hover:bg-white/20 transition ${activeTab === item.id ? "bg-white/20" : ""}`}
//                                     >
//                                         <item.icon size={20} />
//                                         {item.name}
//                                     </button>
//                                 ))}
//                             </nav>

//                             {/* LOGOUT */}
//                             <button className="mt-10 flex items-center gap-3 w-full bg-white/20 hover:bg-white/30 p-3 rounded-xl transition">
//                                 <FiLogOut />
//                                 Logout
//                             </button>

//                         </motion.div>

//                         {/* backdrop click close */}
//                         <div
//                             className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//                             onClick={() => setMobileNavOpen(false)}
//                         />
//                     </>
//                 )}
//             </AnimatePresence>




//             {/* DESKTOP SIDEBAR */}
//             <aside
//                 className={`hidden lg:flex flex-col h-screen shadow-xl 
//                 bg-white/10 border-r border-white/20 text-white transition-all duration-300
//                 ${THEME.gradient} ${isSidebarOpen ? "w-72" : "w-20"} flex-shrink-0`}>
                
//                 <div className="h-20 flex items-center justify-between px-5 border-b border-white/20">

//                     {isSidebarOpen && (
//                         <h1 className="text-2xl font-bold">
//                             Remote<span className="text-yellow-300">Edu</span>
//                         </h1>
//                     )}

//                     <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/20 rounded-lg">
//                         {isSidebarOpen ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}
//                     </button>
//                 </div>

//                 <nav className="flex-1 overflow-y-auto p-4 space-y-2">
//                     {navItems.map(item => (
//                         <button
//                             key={item.id}
//                             onClick={() => setActiveTab(item.id)}
//                             className={`w-full flex items-center gap-4 p-3 rounded-xl 
//                             hover:bg-white/20 transition ${activeTab === item.id ? "bg-white/20" : ""}`}
//                         >
//                             <item.icon size={22} />

//                             {isSidebarOpen && item.name}
//                         </button>
//                     ))}
//                 </nav>

//                 {/* LOGOUT BUTTON */}
//                 <div className="p-4 border-t border-white/20">
//                     <button className="flex items-center gap-3 w-full bg-white/20 hover:bg-white/30 p-3 rounded-xl transition">
//                         <FiLogOut />
//                         {isSidebarOpen && "Logout"}
//                     </button>
//                 </div>

//             </aside>




//             {/* MAIN */}
//             <main className="flex-1 h-full overflow-y-auto p-6 pt-20 lg:pt-6">

//                 <div className="hidden lg:flex justify-between items-center mb-8">
//                     <h1 className="text-4xl font-bold text-gray-900 capitalize">
//                         {activeTab.replace(/([A-Z])/g, " $1")}
//                     </h1>

//                     <div className="flex items-center gap-4">
//                         <button className="p-3 bg-white rounded-full shadow hover:bg-gray-100">
//                             <FiBell size={20} />
//                         </button>

//                         <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow font-semibold">
//                             {studentName}
//                         </div>
//                     </div>
//                 </div>


//                 <motion.div
//                     key={activeTab}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.25 }}
//                     className="bg-white rounded-2xl shadow-xl p-8 min-h-[75vh]"
//                 >
//                     {renderContent}
//                 </motion.div>

//             </main>
//         </div>
//     );
// }






import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    FiHeadphones,
    FiBookOpen,
    FiDownload,
    FiGrid,
    FiChevronsRight,
    FiChevronsLeft,
    FiMessageCircle,
    FiAward,
    FiBell,
    FiTrendingUp,
    FiX,
    FiMenu,
    FiLogOut,
    FiVideo
} from "react-icons/fi";


// IMPORT ALL COMPONENTS
import Overview from "./components/Overview";
import ViewCourses from "./components/ViewCourses";
import LiveAudio from "./components/LiveAudio";
import AttemptQuizzes from "./components/AttemptQuizzes";

import Downloads from "./components/Downloads";
import OfflineMode from "./components/OfflineMode";
import Doubts from "./components/Doubts";
import Gamification from "./components/Gamification";
import StudentAnalytics from "./components/StudentAnalytics";

// ⭐ NEW – REAL COMPONENT
import RecordedSessions from "./components/RecordedSessions";
// ------------------------------------


const THEME = {
    gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
};

const navItems = [
    { id: "overview", icon: FiGrid, name: "Dashboard Overview" },
    { id: "viewCourses", icon: FiBookOpen, name: "My Courses" },
    { id: "liveAudio", icon: FiHeadphones, name: "Join Live Audio" },
    { id: "quizzes", icon: FiBookOpen, name: "Attempt Quizzes" },
    { id: "recordedSessions", icon: FiVideo, name: "Recorded Sessions" },
    { id: "downloads", icon: FiDownload, name: "Lesson Bundles" },
    { id: "offlineMode", icon: FiBookOpen, name: "Offline Mode" },
    { id: "doubts", icon: FiMessageCircle, name: "Doubts & Discussion" },
    { id: "gamification", icon: FiAward, name: "Achievements" },
    { id: "analytics", icon: FiTrendingUp, name: "Student Analytics" },
];


export default function StudentDashboard() {

    const studentName = "Alex Lee";

    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);


    const dummyQuizData = [
        { id: 1, title: "Quiz 1: Basics", course: "CSE101", status: "Pending" },
        { id: 2, title: "Quiz 2: Arrays", course: "CSE101", status: "Attempted", score: "88%" },
        { id: 3, title: "Reading Test", course: "ENG201", status: "Pending" },
    ];

    const dummyDownloads = [
        { id: 1, name: "Week 3 Slides", size: "12MB", downloaded: false, fileType: "pdf" },
        { id: 2, name: "Audio Recap", size: "30MB", downloaded: true, fileType: "audio" },
    ];

    const dummyDoubts = [
        { id: 1, text: "Sir explain recursion again", reply: "Sure tomorrow.", time: "1d ago", status: "answered" },
        { id: 2, text: "What is time complexity?", time: "3h ago", status: "pending" },
    ];

    const dummyBadges = [
        { id: 1, title: "7-Day Streak", icon: "🔥", unlocked: true },
        { id: 2, title: "Quiz Master", icon: "🏆", unlocked: false },
        { id: 3, title: "Top Performer", icon: "⭐", unlocked: true },
    ];

    const dummyAnalytics = {
        attendance: 85,
        assignments: 72,
        overallProgress: 90,
    };


    const components = useMemo(() => ({
        overview: <Overview studentName={studentName} quizItems={dummyQuizData} />,
        viewCourses: <ViewCourses />,
        liveAudio: <LiveAudio />,
        quizzes: <AttemptQuizzes quizItems={dummyQuizData} />,
        recordedSessions: <RecordedSessions />,    // ⭐ FIXED
        downloads: <Downloads downloadItems={dummyDownloads} />,
        offlineMode: <OfflineMode downloadItems={dummyDownloads} />,
        doubts: <Doubts doubtItems={dummyDoubts} />,
        gamification: <Gamification badges={dummyBadges} streak={11} />,
        analytics: <StudentAnalytics analytics={dummyAnalytics} />,
    }), []);


    const renderContent = components[activeTab];


    return (
        <div className="h-screen flex flex-col lg:flex-row bg-gray-100 overflow-hidden">


            {/* MOBILE HEADER */}
            <div className={`lg:hidden fixed top-0 w-full px-4 py-3 flex items-center justify-between
                shadow-md z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 ${THEME.gradient}`}>

                <h1 className="text-xl font-bold text-white drop-shadow">
                    Remote<span className="text-yellow-300">Edu</span>
                </h1>

                <button onClick={() => setMobileNavOpen(true)} className="p-3 bg-white/20 rounded-lg">
                    <FiMenu size={24} className="text-white" />
                </button>
            </div>



            {/* MOBILE SIDEBAR */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                            className={`${THEME.gradient} fixed right-0 top-0 h-full w-72 z-50 text-white shadow-2xl p-6 overflow-y-auto`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Menu</h2>

                                <button onClick={() => setMobileNavOpen(false)}><FiX size={26} /></button>
                            </div>

                            <nav className="space-y-2">
                                {navItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setMobileNavOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-4 p-3 rounded-xl font-medium
                                        hover:bg-white/20 transition ${activeTab === item.id ? "bg-white/20" : ""}`}
                                    >
                                        <item.icon size={20} />
                                        {item.name}
                                    </button>
                                ))}
                            </nav>

                            <button className="mt-10 flex items-center gap-3 w-full bg-white/20 hover:bg-white/30 p-3 rounded-xl transition">
                                <FiLogOut />
                                Logout
                            </button>

                        </motion.div>

                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                            onClick={() => setMobileNavOpen(false)}
                        />
                    </>
                )}
            </AnimatePresence>




            {/* DESKTOP SIDEBAR */}
            <aside
                className={`hidden lg:flex flex-col h-screen shadow-xl 
                bg-white/10 border-r border-white/20 text-white transition-all duration-300
                ${THEME.gradient} ${isSidebarOpen ? "w-72" : "w-20"} flex-shrink-0`}>
                

                <div className="h-20 flex items-center justify-between px-5 border-b border-white/20">

                    {isSidebarOpen && (
                        <h1 className="text-2xl font-bold">
                            Remote<span className="text-yellow-300">Edu</span>
                        </h1>
                    )}

                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/20 rounded-lg">
                        {isSidebarOpen ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl 
                            hover:bg-white/20 transition ${activeTab === item.id ? "bg-white/20" : ""}`}
                        >
                            <item.icon size={22} />

                            {isSidebarOpen && item.name}
                        </button>
                    ))}
                </nav>


                <div className="p-4 border-t border-white/20">
                    <button className="flex items-center gap-3 w-full bg-white/20 hover:bg-white/30 p-3 rounded-xl transition">
                        <FiLogOut />
                        {isSidebarOpen && "Logout"}
                    </button>
                </div>

            </aside>




            {/* MAIN */}
            <main className="flex-1 h-full overflow-y-auto p-6 pt-20 lg:pt-6">

                <div className="hidden lg:flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 capitalize">
                        {activeTab.replace(/([A-Z])/g, " $1")}
                    </h1>

                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-white rounded-full shadow hover:bg-gray-100">
                            <FiBell size={20} />
                        </button>

                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow font-semibold">
                            {studentName}
                        </div>
                    </div>
                </div>


                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl shadow-xl p-8 min-h-[75vh]"
                >
                    {renderContent}
                </motion.div>

            </main>
        </div>
    );
}
