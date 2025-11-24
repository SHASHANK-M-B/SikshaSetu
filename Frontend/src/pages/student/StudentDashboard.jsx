// // ================================================================
// // 🎨 STUDENT DASHBOARD — PREMIUM BLUE-PURPLE THEME (ONE FILE)
// // CLEAN • RESPONSIVE • FULLY WORKING • NO DUPLICATES
// // ================================================================

// import React, { useState, useMemo, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// import {
//     FiHeadphones,
//     FiBookOpen,
//     FiDownload,
//     FiPlayCircle,
//     FiFileText,
//     FiWifiOff,
//     FiImage,
//     FiGrid,
//     FiChevronsRight,
//     FiChevronsLeft,
//     FiCalendar,
//     FiClock,
//     FiAlertTriangle,
//     FiMessageCircle,
//     FiZap,
//     FiAward,
//     FiBell,
//     FiTrendingUp,
//     FiX,
//     FiMenu,
//     FiSend,
//     FiCheck,
//     FiCheckCircle,
// } from "react-icons/fi";


// // ================================================================
// // 🎨 PREMIUM BLUE-PURPLE THEME
// // ================================================================
// const THEME = {
//     gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
// };


// // ================================================================
// // 📌 NAV ITEMS
// // ================================================================
// const navItems = [
//     { id: "overview", icon: FiGrid, name: "Dashboard Overview" },
//     { id: "viewCourses", icon: FiBookOpen, name: "My Courses" },
//     { id: "liveAudio", icon: FiHeadphones, name: "Join Live Audio" },
//     { id: "viewSlides", icon: FiImage, name: "Live Slides" },
//     { id: "quizzes", icon: FiFileText, name: "Attempt Quizzes" },
//     { id: "downloads", icon: FiDownload, name: "Lesson Bundles" },
//     { id: "offlineMode", icon: FiWifiOff, name: "Offline Mode" },
//     { id: "doubts", icon: FiMessageCircle, name: "Doubts & Discussion" },
//     { id: "reactions", icon: FiZap, name: "Live Reactions" },
//     { id: "gamification", icon: FiAward, name: "Achievements" },
//     { id: "analytics", icon: FiTrendingUp, name: "Student Analytics" },
// ];


// // ================================================================
// // 🎯 MAIN COMPONENT START
// // ================================================================
// export default function StudentDashboard() {

//     const studentName = "Alex Lee";

//     const [activeTab, setActiveTab] = useState("overview");
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [mobileNavOpen, setMobileNavOpen] = useState(false);

//     // Dummy data used by tabs
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


//     // ============================================================
//     // TAB RENDERING SYSTEM (CONTENT COMES IN PART 2/3/4)
//     // ============================================================
//     const components = useMemo(
//         () => ({
//             overview: (
//                 <Overview studentName={studentName} quizItems={dummyQuizData} />
//             ),
//             viewCourses: <ViewCourses />,
//             liveAudio: <LiveAudio />,
//             viewSlides: <ViewSlides />,
//             quizzes: (
//                 <AttemptQuizzes
//                     quizItems={dummyQuizData}
//                     handleQuizAttempt={() => { }}
//                 />
//             ),
//             downloads: (
//                 <Downloads
//                     downloadItems={dummyDownloads}
//                     handleDownload={() => { }}
//                 />
//             ),
//             offlineMode: <OfflineMode downloadItems={dummyDownloads} />,
//             doubts: (
//                 <Doubts
//                     doubtItems={dummyDoubts}
//                     handleSubmitDoubt={() => { }}
//                 />
//             ),
//             reactions: <LiveReactions />,
//             gamification: (
//                 <Gamification badges={dummyBadges} streak={11} />
//             ),
//             analytics: (
//                 <StudentAnalytics analytics={dummyAnalytics} />
//             ),
//         }),
//         []
//     );

//     const renderContent = components[activeTab];


//     // ============================================================
//     // 🌟 MAIN LAYOUT (SIDEBAR + HEADER + CONTENT)
//     // ============================================================
//     return (
//         <div className="min-h-screen flex bg-gray-100 overflow-hidden">

//             {/* --------------------------------------------------
//             MOBILE HEADER
//             -------------------------------------------------- */}
//             <div className={`lg:hidden fixed top-0 w-full px-4 py-3 flex items-center justify-between
//                 shadow-md z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 ${THEME.gradient}`}>
//                 <h1 className="text-xl font-bold text-white drop-shadow">
//                     Remote<span className="text-yellow-300">Edu</span>
//                 </h1>

//                 <button
//                     onClick={() => setMobileNavOpen(!mobileNavOpen)}
//                     className="p-3 bg-white/20 rounded-lg"
//                 >
//                     {mobileNavOpen ? (
//                         <FiX size={26} className="text-white" />
//                     ) : (
//                         <FiMenu size={24} className="text-white" />
//                     )}
//                 </button>
//             </div>


//             {/* --------------------------------------------------
//             MOBILE SLIDING MENU
//             -------------------------------------------------- */}
//             <AnimatePresence>
//                 {mobileNavOpen && (
//                     <motion.aside
//                         initial={{ x: "100%" }}
//                         animate={{ x: 0 }}
//                         exit={{ x: "100%" }}
//                         transition={{ type: "spring", stiffness: 120, damping: 20 }}
//                         className={`${THEME.gradient} fixed right-0 top-0 h-full w-72 z-40 text-white 
//                             shadow-2xl p-6 overflow-y-auto`}
//                     >
//                         <div className="flex justify-between items-center mt-10 mb-6">
//                             <h2 className="text-2xl font-bold">Menu</h2>
//                             <button onClick={() => setMobileNavOpen(false)}>
//                                 <FiX size={26} />
//                             </button>
//                         </div>

//                         <nav className="space-y-2">
//                             {navItems.map(item => (
//                                 <button
//                                     key={item.id}
//                                     onClick={() => {
//                                         setActiveTab(item.id);
//                                         setMobileNavOpen(false);
//                                     }}
//                                     className={`w-full flex items-center gap-4 p-3 rounded-xl font-medium
//                                         hover:bg-white/20 transition ${activeTab === item.id ? "bg-white/20" : ""}`}
//                                 >
//                                     <item.icon size={20} />
//                                     {item.name}
//                                 </button>
//                             ))}
//                         </nav>
//                     </motion.aside>
//                 )}
//             </AnimatePresence>


//             {/* --------------------------------------------------
//             DESKTOP SIDEBAR
//             -------------------------------------------------- */}
//             <aside
//                 className={`hidden lg:flex flex-col h-screen shadow-xl backdrop-blur-xl 
//                     bg-white/10 border-r border-white/20 text-white transition-all duration-300
//                     ${THEME.gradient} ${isSidebarOpen ? "w-72" : "w-20"}`}
//             >
//                 <div className="h-20 flex items-center justify-between px-5 border-b border-white/20">
//                     {isSidebarOpen && (
//                         <h1 className="text-2xl font-bold">
//                             Remote<span className="text-yellow-300">Edu</span>
//                         </h1>
//                     )}

//                     <button
//                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                         className="p-2 bg-white/20 rounded-lg"
//                     >
//                         {isSidebarOpen ? (
//                             <FiChevronsLeft size={20} />
//                         ) : (
//                             <FiChevronsRight size={20} />
//                         )}
//                     </button>
//                 </div>

//                 <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/30">
//                     {navItems.map(item => (
//                         <button
//                             key={item.id}
//                             onClick={() => setActiveTab(item.id)}
//                             className={`w-full flex items-center gap-4 p-3 rounded-xl 
//                                 hover:bg-white/20 transition ${activeTab === item.id ? "bg-white/20" : ""}`}
//                         >
//                             <item.icon size={22} />
//                             {isSidebarOpen && item.name}
//                         </button>
//                     ))}
//                 </nav>
//             </aside>


//             {/* --------------------------------------------------
//             MAIN CONTENT AREA
//             -------------------------------------------------- */}
//             <main className="flex-1 p-6 mt-16 lg:mt-0">

//                 {/* HEADER (Desktop) */}
//                 <div className="hidden lg:flex justify-between items-center mb-8">
//                     <h1 className="text-4xl font-bold text-gray-900 capitalize">
//                         {activeTab.replace(/([A-Z])/g, ' $1')}
//                     </h1>

//                     <div className="flex items-center gap-4">
//                         <button className="p-3 bg-white rounded-full shadow hover:bg-gray-100">
//                             <FiBell size={20} />
//                         </button>

//                         <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white 
//                             px-4 py-2 rounded-xl shadow font-semibold">
//                             {studentName}
//                         </div>
//                     </div>
//                 </div>

//                 {/* CONTENT WRAPPER */}
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

// /* ============================================================
//    2️⃣ OVERVIEW (Dashboard Home)
// ============================================================ */

// function Overview({ studentName, quizItems }) {

//     const pendingQuizzes = quizItems.filter(q => q.status === "Pending").length;

//     return (
//         <div className="space-y-10">

//             {/* Greeting Section */}
//             <div>
//                 <h2 className="text-4xl font-extrabold text-indigo-600">
//                     Hello, {studentName}! 👋
//                 </h2>
//                 <p className="text-gray-600 text-lg mt-1">
//                     Welcome back! Keep learning and growing 🚀
//                 </p>
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                 <OverviewCard
//                     icon={FiBookOpen}
//                     title="Enrolled Courses"
//                     value="4"
//                     color="from-indigo-500 to-purple-500"
//                 />

//                 <OverviewCard
//                     icon={FiFileText}
//                     title="Pending Quizzes"
//                     value={pendingQuizzes}
//                     color="from-red-500 to-orange-500"
//                 />

//                 <OverviewCard
//                     icon={FiClock}
//                     title="Study Hours (Week)"
//                     value="15.5"
//                     color="from-blue-500 to-cyan-500"
//                 />
//             </div>

//             {/* Alerts Section */}
//             <div>
//                 <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
//                     <FiAlertTriangle className="text-yellow-500" /> Important Alerts
//                 </h3>

//                 <div className="space-y-4 mt-4">

//                     <AlertBox
//                         title="Programming Final Exam Schedule Updated"
//                         timestamp="2 hours ago"
//                         type="announcement"
//                     />

//                     {pendingQuizzes > 0 && (
//                         <AlertBox
//                             title={`You have ${pendingQuizzes} pending quizzes.`}
//                             timestamp="Due Soon"
//                             type="danger"
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


// /* ============ Overview Components ============ */

// const OverviewCard = ({ icon: Icon, title, value, color }) => (
//     <div className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white
//         transform hover:scale-[1.03] transition cursor-pointer`}>

//         <div className="p-3 bg-white/20 w-fit rounded-xl mb-3">
//             <Icon size={28} />
//         </div>

//         <p className="text-sm opacity-90">{title}</p>
//         <p className="text-4xl font-extrabold">{value}</p>
//     </div>
// );


// const AlertBox = ({ title, timestamp, type }) => {
//     const color =
//         type === "danger"
//             ? "border-red-500 bg-red-50"
//             : "border-yellow-500 bg-yellow-50";

//     const tagColor =
//         type === "danger" ? "bg-red-600" : "bg-yellow-600";

//     return (
//         <div className={`p-5 border-l-4 rounded-xl shadow-sm ${color}`}>
//             <div className="flex justify-between items-center">
//                 <div>
//                     <p className="font-bold text-gray-800">{title}</p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                         <FiCalendar size={14} /> {timestamp}
//                     </p>
//                 </div>

//                 <span className={`px-3 py-1 text-xs font-semibold text-white rounded-xl ${tagColor}`}>
//                     {type === "danger" ? "Urgent" : "Notice"}
//                 </span>
//             </div>
//         </div>
//     );
// };



// /* ============================================================
//    3️⃣ VIEW COURSES
// ============================================================ */

// function ViewCourses() {

//     const courses = [
//         { code: "CSE101", name: "Intro to Programming", progress: 70, instructor: "Dr. Sharma" },
//         { code: "ENG201", name: "Communication Skills", progress: 40, instructor: "Prof. Kim" },
//         { code: "MATH202", name: "Discrete Mathematics", progress: 90, instructor: "Dr. Anya" }
//     ];

//     return (
//         <div className="space-y-6">

//             <p className="text-gray-600 text-lg">
//                 Continue learning from your enrolled courses.
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//                 {courses.map((course) => (
//                     <div key={course.code}
//                         className="p-6 rounded-2xl bg-white shadow-lg border
//                         hover:shadow-2xl hover:-translate-y-1 transition">

//                         <h3 className="text-xl font-bold text-indigo-600">{course.code}</h3>
//                         <p className="text-lg font-semibold">{course.name}</p>
//                         <p className="text-sm text-gray-500 mt-1">
//                             Instructor: {course.instructor}
//                         </p>

//                         {/* Progress Bar */}
//                         <div className="mt-4">
//                             <div className="flex justify-between text-sm font-medium">
//                                 <span>Progress</span>
//                                 <span>{course.progress}%</span>
//                             </div>

//                             <div className="w-full bg-gray-200 h-2.5 rounded-full mt-1">
//                                 <div className="bg-indigo-600 h-2.5 rounded-full"
//                                     style={{ width: `${course.progress}%` }}></div>
//                             </div>
//                         </div>

//                         <button className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl
//                             font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">

//                             <FiPlayCircle /> Resume Learning
//                         </button>
//                     </div>
//                 ))}

//             </div>
//         </div>
//     );
// }



// /* ============================================================
//    4️⃣ LIVE AUDIO CLASS
// ============================================================ */

// function LiveAudio() {

//     const [joined, setJoined] = useState(false);

//     const session = {
//         title: "CSE101 — Data Structures",
//         instructor: "Dr. Sharma"
//     };

//     return (
//         <div className="max-w-xl space-y-6">

//             <h3 className="text-3xl font-bold text-indigo-600">Live Audio Class 🎧</h3>

//             <div className="p-6 rounded-2xl bg-indigo-50 border-l-4 border-indigo-500 shadow">

//                 <p className="text-xl font-bold">{session.title}</p>
//                 <p className="text-gray-600">Instructor: {session.instructor}</p>

//                 <button
//                     onClick={() => setJoined(!joined)}
//                     className={`mt-6 w-full py-3 rounded-xl text-white font-bold transition
//                         ${joined ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
//                 >
//                     <FiHeadphones className="inline-block mr-2" />
//                     {joined ? "Leave Class" : "Join Now"}
//                 </button>

//                 {joined && (
//                     <p className="mt-4 text-center text-indigo-600 font-semibold animate-pulse">
//                         🔴 LIVE: Connected to teacher audio…
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }



// /* ============================================================
//    5️⃣ LIVE SLIDES
// ============================================================ */

// function ViewSlides() {

//     const [showSlide] = useState(true);

//     const slide = {
//         title: "Slide 15 — Recursion Examples",
//         course: "CSE101"
//     };

//     return (
//         <div className="max-w-3xl space-y-8">

//             <h3 className="text-3xl font-bold text-indigo-600">Live Slides 🖼️</h3>

//             {showSlide ? (
//                 <div className="p-10 border-4 border-indigo-400 rounded-2xl
//                     bg-indigo-50 shadow-inner text-center">

//                     <FiImage size={60} className="mx-auto text-indigo-600 mb-4" />

//                     <h4 className="text-2xl font-black text-indigo-700 mb-2">
//                         {slide.title}
//                     </h4>

//                     <p className="text-indigo-600 font-medium">Course: {slide.course}</p>
//                 </div>
//             ) : (
//                 <div className="p-10 bg-gray-50 border-2 border-gray-300 rounded-2xl text-center">
//                     <FiImage size={40} className="mx-auto text-gray-400 mb-4" />
//                     <p className="text-gray-600">No live slides right now.</p>
//                 </div>
//             )}
//         </div>
//     );
// }
// /* ============================================================
//    6️⃣ ATTEMPT QUIZZES
// ============================================================ */

// function AttemptQuizzes({ quizItems, handleQuizAttempt }) {

//     return (
//         <div className="space-y-8">
//             <p className="text-gray-600 text-lg">
//                 Attempt pending quizzes. Offline attempts will sync automatically.
//             </p>

//             {quizItems.map((quiz) => (
//                 <div
//                     key={quiz.id}
//                     className="p-6 rounded-2xl bg-white border shadow hover:shadow-xl
//                     flex items-center justify-between transition transform hover:-translate-y-1"
//                 >
//                     <div>
//                         <h3 className="text-2xl font-bold text-indigo-600">{quiz.title}</h3>

//                         <p className="text-sm text-gray-600 mt-1">
//                             {quiz.course} |
//                             <span
//                                 className={`ml-1 font-bold ${quiz.status === "Pending"
//                                     ? "text-red-600"
//                                     : "text-green-600"
//                                     }`}
//                             >
//                                 {quiz.status}
//                             </span>
//                         </p>

//                         {/* Score */}
//                         {quiz.status === "Attempted" && (
//                             <p className="mt-2 text-green-600 font-bold text-lg">
//                                 ⭐ Score: {quiz.score}
//                             </p>
//                         )}
//                     </div>

//                     <button
//                         disabled={quiz.status === "Attempted"}
//                         onClick={() => handleQuizAttempt(quiz.id)}
//                         className={`px-6 py-3 rounded-xl text-white font-semibold transition
//                             ${quiz.status === "Attempted"
//                                 ? "bg-gray-400"
//                                 : "bg-indigo-600 hover:bg-indigo-700"}`}
//                     >
//                         {quiz.status === "Attempted" ? "Completed" : "Start Quiz"}
//                     </button>
//                 </div>
//             ))}
//         </div>
//     );
// }



// /* ============================================================
//    7️⃣ DOWNLOAD LESSON BUNDLES
// ============================================================ */

// function Downloads({ downloadItems, handleDownload }) {

//     return (
//         <div className="space-y-8">

//             <p className="text-gray-600 text-lg">
//                 Download study materials to access them offline anytime.
//             </p>

//             {downloadItems.map(item => (
//                 <div
//                     key={item.id}
//                     className="p-6 bg-white rounded-2xl shadow border flex items-center justify-between
//                     transform hover:-translate-y-1 hover:shadow-xl transition"
//                 >
//                     <div>
//                         <p className="text-lg font-bold text-gray-800">{item.name}</p>
//                         <p className="text-sm text-gray-500">{item.size}</p>
//                     </div>

//                     <button
//                         disabled={item.downloaded}
//                         onClick={() => handleDownload(item.id)}
//                         className={`px-5 py-2 rounded-xl flex items-center gap-2 font-semibold text-white
//                             ${item.downloaded
//                                 ? "bg-green-500"
//                                 : "bg-blue-600 hover:bg-blue-700"} transition`}
//                     >
//                         {item.downloaded ? "Downloaded" : "Download"}
//                     </button>
//                 </div>
//             ))}
//         </div>
//     );
// }



// /* ============================================================
//    8️⃣ OFFLINE MODE
// ============================================================ */

// const OfflineCard = ({ icon: Icon, label, count }) => (
//     <div className="p-6 bg-white rounded-2xl shadow-md text-center border">
//         <Icon size={36} className="text-indigo-500 mx-auto mb-2" />
//         <p className="text-3xl font-extrabold">{count}</p>
//         <p className="text-gray-600 font-medium">{label}</p>
//     </div>
// );



// function OfflineMode({ downloadItems }) {

//     const slides = downloadItems.filter(i => i.fileType === "pdf" || i.fileType === "doc").length;
//     const audio = downloadItems.filter(i => i.fileType === "audio").length;
//     const videos = downloadItems.filter(i => i.fileType === "video").length;

//     const savedQuizHistory = 5; // Dummy

//     const isReady = slides + audio + videos > 0;

//     return (
//         <div className="space-y-10">

//             {/* Status */}
//             <div
//                 className={`p-6 rounded-2xl border-l-4 shadow-md ${isReady ? "border-green-500 bg-green-50" : "border-yellow-500 bg-yellow-50"
//                     }`}
//             >
//                 <h3 className="text-2xl font-bold flex items-center gap-2">
//                     <FiWifiOff className="text-indigo-600" />
//                     Offline Learning Status
//                 </h3>

//                 <p className="text-gray-700 mt-1">
//                     {isReady
//                         ? `You have ${slides} slides, ${audio} audio files and ${videos} videos downloaded.`
//                         : "No offline materials found. Download study bundles to get started."}
//                 </p>
//             </div>

//             {/* Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                 <OfflineCard icon={FiImage} label="Slides & Docs" count={slides} />
//                 <OfflineCard icon={FiHeadphones} label="Audio/Video Files" count={audio + videos} />
//                 <OfflineCard icon={FiFileText} label="Quiz History" count={savedQuizHistory} />
//             </div>

//             <button className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">
//                 Open Offline Library
//             </button>
//         </div>
//     );
// }



// /* ============================================================
//    9️⃣ OFFLINE SYNC ENGINE
// ============================================================ */

// function SyncEngine({ syncLog, syncData }) {

//     return (
//         <div className="p-6 bg-gray-100 rounded-2xl shadow-inner border space-y-4">

//             <h3 className="text-xl font-bold">Offline Sync Engine (Preview)</h3>

//             <button
//                 onClick={syncData}
//                 className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold
//                 hover:bg-indigo-700"
//             >
//                 Sync Now
//             </button>

//             <ul className="text-gray-700 text-sm space-y-1 h-24 overflow-y-auto bg-white p-3 rounded-lg">
//                 {syncLog.map((log, i) => (
//                     <li key={i}>{log}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
// /* ============================================================
//    🔟 DOUBT / DISCUSSION SYSTEM
// ============================================================ */

// function Doubts({ doubtItems, handleSubmitDoubt }) {

//     const [text, setText] = useState("");

//     const sendDoubt = () => {
//         if (!text.trim()) return;
//         handleSubmitDoubt(text);
//         setText("");
//     };

//     return (
//         <div className="flex flex-col h-[70vh]">

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-xl border shadow-inner flex flex-col">

//                 {doubtItems.map(d => (
//                     <div
//                         key={d.id}
//                         className={`max-w-xs px-4 py-3 rounded-xl shadow text-sm 
//                             ${d.status === "answered"
//                                 ? "bg-blue-100 self-start"
//                                 : "bg-green-100 self-end"}`
//                         }
//                     >
//                         <p className="font-medium text-gray-800">{d.text}</p>

//                         <p className="text-xs text-gray-600 mt-1">{d.time}</p>

//                         {d.reply && (
//                             <p className="mt-2 p-2 bg-white rounded-lg text-gray-700 shadow">
//                                 <b>Teacher:</b> {d.reply}
//                             </p>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {/* Input box */}
//             <div className="mt-4 flex gap-3">
//                 <input
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     placeholder="Type your doubt…"
//                     className="flex-1 p-3 rounded-xl border shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
//                     onKeyDown={(e) => e.key === "Enter" && sendDoubt()}
//                 />

//                 <button
//                     onClick={sendDoubt}
//                     className="px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }



// /* ============================================================
//    1️⃣1️⃣ LIVE REACTIONS
// ============================================================ */

// function LiveReactions() {

//     const [reaction, setReaction] = useState("");

//     return (
//         <div className="space-y-8 bg-white p-6 rounded-2xl shadow border">

//             <h3 className="text-2xl font-bold text-indigo-700">Live Reactions</h3>
//             <p className="text-gray-600">Send quick reactions during the class.</p>

//             <div className="flex gap-6">

//                 <button
//                     onClick={() => setReaction("Understood")}
//                     className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 
//                     text-white font-bold shadow transition"
//                 >
//                     👍 Understood
//                 </button>

//                 <button
//                     onClick={() => setReaction("Doubt")}
//                     className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 
//                     text-white font-bold shadow transition"
//                 >
//                     ❓ Doubt
//                 </button>

//             </div>

//             {reaction && (
//                 <p className="text-xl font-semibold text-gray-700">
//                     Reaction Sent: <span className="text-indigo-600">{reaction}</span>
//                 </p>
//             )}
//         </div>
//     );
// }



// /* ============================================================
//    1️⃣2️⃣ GAMIFICATION (Badges + Streak)
// ============================================================ */

// function Gamification({ badges, streak }) {

//     return (
//         <div className="space-y-10 bg-white p-6 rounded-2xl shadow border">

//             <h3 className="text-3xl font-bold text-indigo-700">Achievements</h3>

//             {/* Streak */}
//             <div className="p-6 bg-indigo-50 border-l-4 border-indigo-600 rounded-2xl shadow">
//                 <p className="text-xl font-bold">🔥 Current Streak: {streak} days</p>
//                 <p className="text-gray-600">Keep learning daily to maintain your streak!</p>
//             </div>

//             {/* Badges */}
//             <div>
//                 <h4 className="text-xl font-bold text-gray-800">Unlocked Badges</h4>

//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
//                     {badges.map(b => (
//                         <div
//                             key={b.id}
//                             className={`p-6 rounded-2xl text-center shadow
//                                 ${b.unlocked ? "bg-green-100" : "bg-gray-200 opacity-60"}`}
//                         >
//                             <div className="text-4xl">{b.icon}</div>
//                             <p className="mt-2 text-lg font-bold text-gray-700">{b.title}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//         </div>
//     );
// }



// /* ============================================================
//    1️⃣3️⃣ ANALYTICS (Progress + Trend Graph)
// ============================================================ */

// const AnalyticsBar = ({ label, value }) => (
//     <div className="space-y-1 mb-4">
//         <div className="flex justify-between text-sm font-medium">
//             <span>{label}</span>
//             <span>{value}%</span>
//         </div>

//         <div className="w-full bg-gray-200 h-2.5 rounded-full">
//             <div
//                 className="h-2.5 bg-indigo-600 rounded-full"
//                 style={{ width: `${value}%` }}
//             ></div>
//         </div>
//     </div>
// );


// function StudentAnalytics({ analytics }) {

//     return (
//         <div className="space-y-10 bg-white p-6 rounded-2xl shadow border">

//             <h3 className="text-3xl font-bold text-indigo-700">
//                 Student Analytics
//             </h3>

//             {/* Progress Cards */}
//             <div>
//                 <h4 className="text-xl font-bold mb-4 text-gray-700">
//                     Progress Overview
//                 </h4>

//                 <AnalyticsBar label="Attendance" value={analytics.attendance} />
//                 <AnalyticsBar label="Assignments" value={analytics.assignments} />
//                 <AnalyticsBar label="Overall Progress" value={analytics.overallProgress} />
//             </div>

//             {/* Fake Graph */}
//             <div className="p-4 bg-gray-50 border rounded-xl">
//                 <h4 className="text-xl font-bold mb-3 text-gray-700">
//                     Performance Trend
//                 </h4>

//                 <div className="h-36 bg-gradient-to-r from-indigo-300 to-indigo-500 rounded-xl opacity-80"></div>
//             </div>

//         </div>
//     );
// }


//
// import React, { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     FiHeadphones,
//     FiBookOpen,
//     FiDownload,
//     FiImage,
//     FiGrid,
//     FiChevronsRight,
//     FiChevronsLeft,
//     FiMessageCircle,
//     FiZap,
//     FiAward,
//     FiBell,
//     FiTrendingUp,
//     FiX,
//     FiMenu,
// } from "react-icons/fi";

// // IMPORT ALL COMPONENTS
// import Overview from "./components/Overview";
// import ViewCourses from "./components/ViewCourses";
// import LiveAudio from "./components/LiveAudio";
// import ViewSlides from "./components/ViewSlides";
// import AttemptQuizzes from "./components/AttemptQuizzes";
// import Downloads from "./components/Downloads";
// import OfflineMode from "./components/OfflineMode";
// import Doubts from "./components/Doubts";
// import LiveReactions from "./components/LiveReactions";
// import Gamification from "./components/Gamification";
// import StudentAnalytics from "./components/StudentAnalytics";

// const THEME = {
//     gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
// };

// const navItems = [
//     { id: "overview", icon: FiGrid, name: "Dashboard Overview" },
//     { id: "viewCourses", icon: FiBookOpen, name: "My Courses" },
//     { id: "liveAudio", icon: FiHeadphones, name: "Join Live Audio" },
//     { id: "viewSlides", icon: FiImage, name: "Live Slides" },
//     { id: "quizzes", icon: FiBookOpen, name: "Attempt Quizzes" },
//     { id: "downloads", icon: FiDownload, name: "Lesson Bundles" },
//     { id: "offlineMode", icon: FiBookOpen, name: "Offline Mode" },
//     { id: "doubts", icon: FiMessageCircle, name: "Doubts & Discussion" },
//     { id: "reactions", icon: FiZap, name: "Live Reactions" },
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

//     const components = useMemo(
//         () => ({
//             overview: <Overview studentName={studentName} quizItems={dummyQuizData} />,
//             viewCourses: <ViewCourses />,
//             liveAudio: <LiveAudio />,
//             viewSlides: <ViewSlides />,
//             quizzes: <AttemptQuizzes quizItems={dummyQuizData} handleQuizAttempt={() => { }} />,
//             downloads: <Downloads downloadItems={dummyDownloads} handleDownload={() => { }} />,
//             offlineMode: <OfflineMode downloadItems={dummyDownloads} />,
//             doubts: <Doubts doubtItems={dummyDoubts} handleSubmitDoubt={() => { }} />,
//             reactions: <LiveReactions />,
//             gamification: <Gamification badges={dummyBadges} streak={11} />,
//             analytics: <StudentAnalytics analytics={dummyAnalytics} />,
//         }),
//         []
//     );

//     const renderContent = components[activeTab];

//     return (
//         <div className="min-h-screen flex bg-gray-100 overflow-hidden">
//             <div className={`lg:hidden fixed top-0 w-full px-4 py-3 flex items-center justify-between
//                 shadow-md z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 ${THEME.gradient}`}>
//                 <h1 className="text-xl font-bold text-white drop-shadow">
//                     Remote<span className="text-yellow-300">Edu</span>
//                 </h1>

//                 <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="p-3 bg-white/20 rounded-lg">
//                     {mobileNavOpen ? <FiX size={26} className="text-white" /> : <FiMenu size={24} className="text-white" />}
//                 </button>
//             </div>

//             <AnimatePresence>
//                 {mobileNavOpen && (
//                     <motion.aside
//                         initial={{ x: "100%" }}
//                         animate={{ x: 0 }}
//                         exit={{ x: "100%" }}
//                         transition={{ type: "spring", stiffness: 120, damping: 20 }}
//                         className={`${THEME.gradient} fixed right-0 top-0 h-full w-72 z-40 text-white shadow-2xl p-6 overflow-y-auto`}
//                     >
//                         <div className="flex justify-between items-center mt-10 mb-6">
//                             <h2 className="text-2xl font-bold">Menu</h2>
//                             <button onClick={() => setMobileNavOpen(false)}><FiX size={26} /></button>
//                         </div>

//                         <nav className="space-y-2">
//                             {navItems.map(item => (
//                                 <button
//                                     key={item.id}
//                                     onClick={() => {
//                                         setActiveTab(item.id);
//                                         setMobileNavOpen(false);
//                                     }}
//                                     className={`w-full flex items-center gap-4 p-3 rounded-xl font-medium
//                                         hover:bg-white/20 transition ${activeTab === item.id ? "bg-white/20" : ""}`}
//                                 >
//                                     <item.icon size={20} />
//                                     {item.name}
//                                 </button>
//                             ))}
//                         </nav>
//                     </motion.aside>
//                 )}
//             </AnimatePresence>

//             <aside
//                 className={`hidden lg:flex flex-col h-screen shadow-xl backdrop-blur-xl 
//                     bg-white/10 border-r border-white/20 text-white transition-all duration-300
//                     ${THEME.gradient} ${isSidebarOpen ? "w-72" : "w-20"}`}
//             >
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

//                 <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/30">
//                     {navItems.map(item => (
//                         <button
//                             key={item.id}
//                             onClick={() => setActiveTab(item.id)}
//                             className={`w-full flex items-center gap-4 p-3 rounded-xl 
//                                 hover:bg-white/20 transition ${activeTab === item.id ? "bg-white/20" : ""}`}
//                         >
//                             <item.icon size={22} />
//                             {isSidebarOpen && item.name}
//                         </button>
//                     ))}
//                 </nav>
//             </aside>

//             <main className="flex-1 p-6 mt-16 lg:mt-0">
//                 <div className="hidden lg:flex justify-between items-center mb-8">
//                     <h1 className="text-4xl font-bold text-gray-900 capitalize">
//                         {activeTab.replace(/([A-Z])/g, ' $1')}
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
    FiImage,
    FiGrid,
    FiChevronsRight,
    FiChevronsLeft,
    FiMessageCircle,
    FiZap,
    FiAward,
    FiBell,
    FiTrendingUp,
    FiX,
    FiMenu,
} from "react-icons/fi";

// IMPORT ALL COMPONENTS
import Overview from "./components/Overview";
import ViewCourses from "./components/ViewCourses";
import LiveAudio from "./components/LiveAudio";
import ViewSlides from "./components/ViewSlides";
import AttemptQuizzes from "./components/AttemptQuizzes";
import Downloads from "./components/Downloads";
import OfflineMode from "./components/OfflineMode";
import Doubts from "./components/Doubts";
import LiveReactions from "./components/LiveReactions";
import Gamification from "./components/Gamification";
import StudentAnalytics from "./components/StudentAnalytics";

const THEME = {
    gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
};

const navItems = [
    { id: "overview", icon: FiGrid, name: "Dashboard Overview" },
    { id: "viewCourses", icon: FiBookOpen, name: "My Courses" },
    { id: "liveAudio", icon: FiHeadphones, name: "Join Live Audio" },
    { id: "viewSlides", icon: FiImage, name: "Live Slides" },
    { id: "quizzes", icon: FiBookOpen, name: "Attempt Quizzes" },
    { id: "downloads", icon: FiDownload, name: "Lesson Bundles" },
    { id: "offlineMode", icon: FiBookOpen, name: "Offline Mode" },
    { id: "doubts", icon: FiMessageCircle, name: "Doubts & Discussion" },
    { id: "reactions", icon: FiZap, name: "Live Reactions" },
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

    const components = useMemo(
        () => ({
            overview: <Overview studentName={studentName} quizItems={dummyQuizData} />,
            viewCourses: <ViewCourses />,
            liveAudio: <LiveAudio />,
            viewSlides: <ViewSlides />,
            quizzes: <AttemptQuizzes quizItems={dummyQuizData} handleQuizAttempt={() => { }} />,
            downloads: <Downloads downloadItems={dummyDownloads} handleDownload={() => { }} />,
            offlineMode: <OfflineMode downloadItems={dummyDownloads} />,
            doubts: <Doubts doubtItems={dummyDoubts} handleSubmitDoubt={() => { }} />,
            reactions: <LiveReactions />,
            gamification: <Gamification badges={dummyBadges} streak={11} />,
            analytics: <StudentAnalytics analytics={dummyAnalytics} />,
        }),
        []
    );

    const renderContent = components[activeTab];

    return (
        // 1. ROOT CONTAINER: h-screen and overflow-hidden prevent the entire page from scrolling. 
        // flex and flex-col/row set up the layout.
        <div className="h-screen flex flex-col lg:flex-row bg-gray-100 overflow-hidden">
            
            {/* MOBILE HEADER (Fixed at top) */}
            <div className={`lg:hidden fixed top-0 w-full px-4 py-3 flex items-center justify-between
                shadow-md z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 ${THEME.gradient}`}>
                <h1 className="text-xl font-bold text-white drop-shadow">
                    Remote<span className="text-yellow-300">Edu</span>
                </h1>

                <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="p-3 bg-white/20 rounded-lg">
                    {mobileNavOpen ? <FiX size={26} className="text-white" /> : <FiMenu size={24} className="text-white" />}
                </button>
            </div>

            <AnimatePresence>
                {mobileNavOpen && (
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        // Added pt-16 to push content below the fixed mobile header
                        className={`${THEME.gradient} fixed right-0 top-0 h-full w-72 z-40 text-white shadow-2xl p-6 overflow-y-auto pt-16`}
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
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* DESKTOP SIDEBAR (Fixed height and independent scroll) */}
            <aside
                // h-screen makes the sidebar full height. flex-col and flex-1 on nav ensure nav scrolls.
                className={`hidden lg:flex flex-col h-screen shadow-xl backdrop-blur-xl 
                    bg-white/10 border-r border-white/20 text-white transition-all duration-300
                    ${THEME.gradient} ${isSidebarOpen ? "w-72" : "w-20"} flex-shrink-0`}
            >
                <div className="h-20 flex items-center justify-between px-5 border-b border-white/20 flex-shrink-0">
                    {isSidebarOpen && (
                        <h1 className="text-2xl font-bold">
                            Remote<span className="text-yellow-300">Edu</span>
                        </h1>
                    )}

                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/20 rounded-lg">
                        {isSidebarOpen ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/30">
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
            </aside>

            {/* MAIN CONTENT AREA */}
            {/* 2. <main>: flex-1 makes it take the remaining width. h-full takes the remaining height. 
               overflow-y-auto enables internal scrolling only for this element.
               pt-20 compensates for the mobile header (approx 80px), pt-6 is standard desktop padding.
            */}
            <main className="flex-1 h-full overflow-y-auto p-6 pt-20 lg:pt-6">
                <div className="hidden lg:flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 capitalize">
                        {activeTab.replace(/([A-Z])/g, ' $1')}
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