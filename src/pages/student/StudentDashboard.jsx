import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeadphones, FiBookOpen, FiDownload, FiGrid, FiChevronsRight,
  FiChevronsLeft, FiMessageCircle, FiAward, FiBell, FiTrendingUp,
  FiX, FiMenu, FiLogOut, FiVideo, FiSearch, FiUser, FiSettings
} from "react-icons/fi";

// Import your sub-components here
import Overview from "./components/Overview";
import ViewCourses from "./components/ViewCourses";
import LiveAudio from "./components/LiveSession";
import AttemptQuizzes from "./components/AttemptQuizzes";
import Downloads from "./components/Downloads";
import OfflineMode from "./components/OfflineMode";
import Doubts from "./components/Doubts";
import Gamification from "./components/Gamification";
import StudentAnalytics from "./components/StudentAnalytics";
import RecordedSessions from "./components/RecordedSessions";

import { getStudentDashboard } from "@/api/student";
import { logoutUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";

const navItems = [
  { id: "overview", icon: FiGrid, name: "Dashboard" },
  { id: "viewCourses", icon: FiBookOpen, name: "My Courses" },
  { id: "liveAudio", icon: FiHeadphones, name: "Live Sessions" },
  { id: "quizzes", icon: FiBookOpen, name: "Quizzes" },
  { id: "recordedSessions", icon: FiVideo, name: "Recordings" },
  { id: "doubts", icon: FiMessageCircle, name: "Discussions" },
  { id: "analytics", icon: FiTrendingUp, name: "Analytics" },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);

  // Dynamic Logo based on Org Name to avoid 404s
  const orgLogoUrl = useMemo(() => {
    const name = studentDetails?.orgName || "Org";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true&rounded=true`;
  }, [studentDetails]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await getStudentDashboard();
        setStudentDetails(response.data);
      } catch (error) {
        // Fallback for development/preview
        setStudentDetails({
          orgName: "RVS Academy",
          studentName: "Student User",
          points: 1250
        });
      }
    };
    fetchStudentDetails();
  }, []);

  const components = useMemo(() => ({
    overview: <Overview studentDetails={studentDetails} />,
    viewCourses: <ViewCourses />,
    liveAudio: <LiveAudio />,
    quizzes: <AttemptQuizzes />,
    recordedSessions: <RecordedSessions />,
    doubts: <Doubts />,
    analytics: <StudentAnalytics />,
    downloads: <Downloads />,
    offlineMode: <OfflineMode />,
    gamification: <Gamification />,
  }), [studentDetails]);

  const renderContent = components[activeTab] || <Overview />;

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      navigate("/"); // Force redirect even on error
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-[#F8FAFC] overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden sticky top-0 w-full px-5 py-4 flex items-center justify-between z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 p-0.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl">
            <img src={orgLogoUrl} alt="Logo" className="w-full h-full rounded-lg object-cover" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 leading-none">Academy</p>
            <h1 className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
              {studentDetails?.orgName || "Loading..."}
            </h1>
          </div>
        </div>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="w-11 h-11 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 active:scale-95 transition-transform"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <img src={orgLogoUrl} className="w-10 h-10 rounded-xl" />
                  <span className="font-black text-slate-900 uppercase tracking-tighter">Menu</span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="p-3 bg-slate-100 rounded-2xl">
                  <FiX size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileNavOpen(false); }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] font-bold transition-all ${activeTab === item.id
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                      : "text-slate-500 hover:bg-slate-50"
                      }`}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-6 flex items-center justify-center gap-3 w-full bg-slate-900 text-white p-5 rounded-[24px] font-bold shadow-lg active:scale-95 transition-transform"
              >
                <FiLogOut /> Logout
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[65]"
            />
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col h-screen bg-white border-r border-slate-100 transition-all duration-500 relative ${isSidebarOpen ? "w-80" : "w-24"}`}>
        <div className="h-28 flex items-center px-7">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="min-w-[52px] h-[52px] bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
              <img src={orgLogoUrl} className="w-10 h-10 object-contain rounded-lg shadow-inner" />
            </div>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[2px] leading-none mb-1">Organization</p>
                <h1 className="text-xl font-black text-slate-800 truncate w-44">{studentDetails?.orgName}</h1>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar pt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                ? "bg-slate-900 text-white shadow-2xl shadow-slate-300"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-800"
                }`}
            >
              <item.icon size={22} className={activeTab === item.id ? "text-indigo-400" : "group-hover:text-indigo-500"} />
              {isSidebarOpen && <span className="font-bold tracking-tight">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-4">
          {isSidebarOpen && (
            <div className="p-4 bg-indigo-50 rounded-[20px] flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                <FiAward size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase">Points</p>
                <p className="text-sm font-black text-indigo-900">{studentDetails?.points || 0} XP</p>
              </div>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
            {isSidebarOpen ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 h-full overflow-y-auto px-4 md:px-12 py-8 md:py-10 scroll-smooth">

        {/* TOP BAR / BREADCRUMBS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-indigo-500 rounded-full"></span>
              <span className="text-indigo-500 text-[11px] font-black uppercase tracking-[3px]">
                Student Portal
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter capitalize">
              {activeTab.replace(/([A-Z])/g, " $1")}
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-[24px] shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 cursor-pointer transition-colors relative">
              <FiBell size={20} />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>

            <div className="h-10 w-[1px] bg-slate-100 mx-1"></div>

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                  {studentDetails?.studentName}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                <FiUser size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="bg-white rounded-[40px] p-6 md:p-12 shadow-2xl shadow-indigo-200/20 min-h-[75vh] border border-white/60 relative overflow-hidden"
        >
          {/* Subtle Background Accent */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {renderContent}
          </div>
        </motion.div>

        {/* FOOTER SPACE */}
        <footer className="mt-12 mb-8 text-center">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-[2px]">
            &copy; 2026 {studentDetails?.orgName}
          </p>
        </footer>
      </main>
    </div>
  );
}