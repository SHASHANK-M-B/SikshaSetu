// import React, { useState, useMemo, useEffect } from "react";
// import {
//   FiUpload,
//   FiPlus,
//   FiBarChart2,
//   FiFileText,
//   FiBook,
//   FiGrid,
//   FiChevronsRight,
//   FiChevronsLeft,
//   FiMessageCircle,
//   FiAlertCircle,
//   FiZap,
//   FiVideo,
//   FiLogOut,
//   FiMenu,
//   FiX,
// } from "react-icons/fi";

// import Overview from "./components/Overview";
// import CourseManager from "./components/CourseManager";
// import ContentUpload from "./components/ContentUpload";
// import RecordedLectures from "./components/RecordedLectures";
// import AIStudioRedirect from "./components/AIStudioRedirect";
// import QuizManager from "./components/QuizManager";
// import QuizResponses from "./components/QuizResponses";
// import DiscussionDoubts from "./components/DiscussionDoubts";
// import TeacherAnalytics from "./components/TeacherAnalytics";
// import LiveClassRoom from "./components/LiveClassRoom";

// import NavButton from "./components/ui/NavButton";
// import { logoutUser } from "@/api/auth";
// import { useNavigate } from "react-router-dom";
// import { teacherDashbaord } from "@/api/teacher";

// export default function TeacherDashboard() {
//   // Load saved org/teacher name from localStorage
//   const navigate = useNavigate();
//   const organizationName =
//     localStorage.getItem("organizationName") || "My Organization";

//   const teacherName = localStorage.getItem("teacherName") || "Demo Teacher";
//   const [teacherData, setTeacherData] = useState([]);
//     useEffect(() => {
//       const teacherData = async () => {
//         try {
//           const response = await teacherDashbaord();
//           setTeacherData(response.data);
//         } catch (error) {}
//       };
//       teacherData();
//     }, []);

//   const user = {
//     name: teacherName,
//     subject: "Science",
//     initials: teacherName
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase(),
//   };

//   const [active, setActive] = useState("overview");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const content = useMemo(() => {
//     switch (active) {
//       case "overview":
//         return <Overview user={user} setActive={setActive} />;
//       case "courses":
//         return <CourseManager user={user} />;
//       case "uploads":
//         return <ContentUpload user={user} />;
//       case "recorded":
//         return <RecordedLectures user={user} />;
//       case "ai":
//         return <AIStudioRedirect />;
//       case "liveClass":
//         return <LiveClassRoom user={user} />;
//       case "quizzes":
//         return <QuizManager user={user} />;
//       case "responses":
//         return <QuizResponses user={user} />;
//       case "discussion":
//         return <DiscussionDoubts user={user} />;
//       case "analytics":
//         return <TeacherAnalytics user={user} />;
//       default:
//         return <Overview user={user} setActive={setActive} />;
//     }
//   }, [active]);

//   const logout = async () => {
//     setLoading(true);
//     try {
//       const response = await logoutUser();
//       if (response.status === 200) {
//         setLoading(false);
//         navigate("/");
//       }
//     } catch (error) {}
//   };

//   const handleNavClick = (key) => {
//     setActive(key);
//     setMobileMenuOpen(false);
//   };



//   return (
//     <>
//       <style>{`
//         ::-webkit-scrollbar { width: 0; height: 0; }
//         * { scrollbar-width: none; }
//       `}</style>

//       <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">
//         {/* ---------------- MOBILE MENU BUTTON ---------------- */}
//         {!mobileMenuOpen && (
//           <button
//             className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white shadow rounded-lg"
//             onClick={() => setMobileMenuOpen(true)}
//           >
//             <FiMenu className="text-xl text-slate-700" />
//           </button>
//         )}

//         {/* ---------------- MOBILE OVERLAY ---------------- */}
//         {mobileMenuOpen && (
//           <div
//             className="fixed inset-0 bg-black/50 z-40 md:hidden"
//             onClick={() => setMobileMenuOpen(false)}
//           />
//         )}

//         {/* ---------------- MOBILE SIDEBAR ---------------- */}
//         <div
//           className={`fixed top-0 right-0 z-50 h-full w-64 transition-transform duration-300 md:hidden
//             ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
//         >
//           <aside className="h-full bg-[rgba(40,43,252,0.94)] backdrop-blur-lg text-white flex flex-col">
//             {/* ORG NAME (Mobile) */}
//             <div className="p-4 flex items-center justify-between h-20">
//               <div>
//                 <div className="text-lg font-extrabold">{teacherData?.orgName}</div>
//                 <div className="text-xs text-white/80">Expert Console</div>
//               </div>

//               <button
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="p-2 rounded bg-white/10"
//               >
//                 <FiX className="text-white" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto px-3 pb-6">
//               {/* NAV ITEMS */}
//               <NavButton
//                 label="Overview"
//                 icon={FiGrid}
//                 active={active === "overview"}
//                 onClick={() => handleNavClick("overview")}
//               />
//               <NavButton
//                 label="Courses"
//                 icon={FiBook}
//                 active={active === "courses"}
//                 onClick={() => handleNavClick("courses")}
//               />
//               <NavButton
//                 label="Uploads"
//                 icon={FiUpload}
//                 active={active === "uploads"}
//                 onClick={() => handleNavClick("uploads")}
//               />
//               <NavButton
//                 label="Recorded"
//                 icon={FiVideo}
//                 active={active === "recorded"}
//                 onClick={() => handleNavClick("recorded")}
//               />
//               <NavButton
//                 label="AI Studio"
//                 icon={FiZap}
//                 active={active === "ai"}
//                 onClick={() => handleNavClick("ai")}
//               />

//               <div className="border-t border-white/20 mt-3 pt-3" />

//               <NavButton
//                 label="Live Class"
//                 icon={FiVideo}
//                 active={active === "liveClass"}
//                 onClick={() => handleNavClick("liveClass")}
//               />
//               <NavButton
//                 label="Quizzes"
//                 icon={FiPlus}
//                 active={active === "quizzes"}
//                 onClick={() => handleNavClick("quizzes")}
//               />
//               <NavButton
//                 label="Responses"
//                 icon={FiFileText}
//                 active={active === "responses"}
//                 onClick={() => handleNavClick("responses")}
//               />
//               <NavButton
//                 label="Discussions"
//                 icon={FiMessageCircle}
//                 active={active === "discussion"}
//                 onClick={() => handleNavClick("discussion")}
//               />
//               <NavButton
//                 label="Analytics"
//                 icon={FiBarChart2}
//                 active={active === "analytics"}
//                 onClick={() => handleNavClick("analytics")}
//               />
//             </div>

//             <div className="p-4 border-t border-white/10">
//               <button
//                 className="w-full flex items-center gap-2 p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition"
//                 onClick={logout}
//               >
//                 <FiLogOut />
//                 Logout
//               </button>
//             </div>
//           </aside>
//         </div>

//         {/* ---------------- DESKTOP SIDEBAR ---------------- */}
//         <aside
//           className={`hidden md:flex flex-col bg-[rgba(40,43,252,0.64)] backdrop-blur-lg shadow-lg border-r border-white/10 h-screen transition-all duration-300 ${
//             sidebarOpen ? "w-72" : "w-20"
//           }`}
//         >
//           {/* ORGANIZATION NAME */}
//           <div className="p-4 flex items-center justify-between h-20">
//             {sidebarOpen && (
//               <div>
//                 <div className="text-lg font-extrabold text-white">
//                   {teacherData?.orgName}
//                 </div>
//                 <div className="text-xs text-white/70">Experts Console</div>
//               </div>
//             )}

//             <button
//               onClick={() => setSidebarOpen((p) => !p)}
//               className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
//             >
//               {sidebarOpen ? (
//                 <FiChevronsLeft className="text-white" />
//               ) : (
//                 <FiChevronsRight className="text-white" />
//               )}
//             </button>
//           </div>

//           {/* NAVIGATION LIST */}
//           <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-4">
//             <NavButton
//               label="Overview"
//               icon={FiGrid}
//               active={active === "overview"}
//               onClick={() => setActive("overview")}
//               collapsed={!sidebarOpen}
//             />
//             <NavButton
//               label="Courses"
//               icon={FiBook}
//               active={active === "courses"}
//               onClick={() => setActive("courses")}
//               collapsed={!sidebarOpen}
//             />
//             <NavButton
//               label="Uploads"
//               icon={FiUpload}
//               active={active === "uploads"}
//               onClick={() => setActive("uploads")}
//               collapsed={!sidebarOpen}
//             />
//             <NavButton
//               label="Recorded"
//               icon={FiVideo}
//               active={active === "recorded"}
//               onClick={() => setActive("recorded")}
//               collapsed={!sidebarOpen}
//             />
//             <NavButton
//               label="AI Studio"
//               icon={FiZap}
//               active={active === "ai"}
//               onClick={() => setActive("ai")}
//               collapsed={!sidebarOpen}
//             />

//             <div className="border-t border-white/20 pt-3" />

//             <NavButton
//               label="Live Class"
//               icon={FiVideo}
//               active={active === "liveClass"}
//               onClick={() => setActive("liveClass")}
//               collapsed={!sidebarOpen}
//             />
//             <NavButton
//               label="Quizzes"
//               icon={FiPlus}
//               active={active === "quizzes"}
//               onClick={() => setActive("quizzes")}
//               collapsed={!sidebarOpen}
//             />
//             <NavButton
//               label="Responses"
//               icon={FiFileText}
//               active={active === "responses"}
//               onClick={() => setActive("responses")}
//               collapsed={!sidebarOpen}
//             />
//             <NavButton
//               label="Discussions"
//               icon={FiMessageCircle}
//               active={active === "discussion"}
//               onClick={() => setActive("discussion")}
//               collapsed={!sidebarOpen}
//             />
//             <NavButton
//               label="Analytics"
//               icon={FiBarChart2}
//               active={active === "analytics"}
//               onClick={() => setActive("analytics")}
//               collapsed={!sidebarOpen}
//             />
//           </div>

//           {/* LOGOUT */}
//           <div className="p-4 border-t border-white/20">
//             <button
//               onClick={logout}
//               className="w-full flex items-center gap-2 p-2 text-sm bg-red-500/30 hover:bg-red-500/50 rounded-lg transition text-white"
//             >
//               <FiLogOut />
//               {sidebarOpen && "Logout"}
//             </button>
//           </div>
//         </aside>

//         {/* ---------------- MAIN CONTENT ---------------- */}
//         <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
//           <header className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 capitalize">
//               {active.replace(/([A-Z])/g, " $1")}
//             </h1>

//             {/* TEACHER NAME TOP RIGHT */}
//             <div className="hidden md:flex items-center gap-4">
//               <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow font-semibold">
//             {teacherData?.teacherName}
//               </div>
//             </div>
//           </header>

//           <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl min-h-[60vh]">
//             {content}
//           </section>
//         </main>
//       </div>
//     </>
//   );
// }
import React, { useState, useMemo, useEffect } from "react";
import {
  FiUpload,
  FiPlus,
  FiBarChart2,
  FiFileText,
  FiBook,
  FiGrid,
  FiChevronsRight,
  FiChevronsLeft,
  FiMessageCircle,
  FiZap,
  FiVideo,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import Overview from "./components/Overview";
import CourseManager from "./components/CourseManager";
import ContentUpload from "./components/ContentUpload";
import RecordedLectures from "./components/RecordedLectures";
import AIStudioRedirect from "./components/AIStudioRedirect";
import QuizManager from "./components/QuizManager";
import QuizResponses from "./components/QuizResponses";
import DiscussionDoubts from "./components/DiscussionDoubts";
import TeacherAnalytics from "./components/TeacherAnalytics";
import LiveClassRoom from "./components/LiveClassRoom";

import NavButton from "./components/ui/NavButton";
import { logoutUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { teacherDashbaord } from "@/api/teacher";

// ─────────────────────────────────────────────
// Nav items config — single source of truth
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: FiGrid },
  { key: "courses", label: "Courses", icon: FiBook },
  { key: "uploads", label: "Uploads", icon: FiUpload },
  { key: "recorded", label: "Recorded", icon: FiVideo },
  { key: "ai", label: "AI Studio", icon: FiZap },
  { key: "divider" },                                          // ← visual divider
  { key: "liveClass", label: "Live Class", icon: FiVideo },
  { key: "quizzes", label: "Quizzes", icon: FiPlus },
  { key: "responses", label: "Responses", icon: FiFileText },
  { key: "discussion", label: "Discussions", icon: FiMessageCircle },
  { key: "analytics", label: "Analytics", icon: FiBarChart2 },
];

// Human-readable page title helper
const pageTitle = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const teacherName = localStorage.getItem("teacherName") || "Demo Teacher";

  const user = {
    name: teacherName,
    subject: "Science",
    initials: teacherName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
  };

  const [teacherData, setTeacherData] = useState({});
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);   // desktop collapse
  const [drawerOpen, setDrawerOpen] = useState(false);  // mobile drawer
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await teacherDashbaord();
        setTeacherData(res.data);
      } catch (_) { }
    })();
  }, []);

  const content = useMemo(() => {
    const props = { user, setActive };
    const map = {
      overview: <Overview {...props} />,
      courses: <CourseManager user={user} />,
      uploads: <ContentUpload user={user} />,
      recorded: <RecordedLectures user={user} />,
      ai: <AIStudioRedirect />,
      liveClass: <LiveClassRoom user={user} />,
      quizzes: <QuizManager user={user} />,
      responses: <QuizResponses user={user} />,
      discussion: <DiscussionDoubts user={user} />,
      analytics: <TeacherAnalytics user={user} />,
    };
    return map[active] ?? map.overview;
  }, [active]);

  const logout = async () => {
    setLoading(true);
    try {
      const res = await logoutUser();
      if (res.status === 200) navigate("/");
    } catch (_) { }
    setLoading(false);
  };

  const handleNavClick = (key) => {
    setActive(key);
    setDrawerOpen(false); // close mobile drawer on nav
  };

  // ─── Shared nav list renderer ──────────────────
  const renderNavItems = (collapsed = false) =>
    NAV_ITEMS.map((item, i) =>
      item.key === "divider" ? (
        <div key={`div-${i}`} className="border-t border-white/20 my-2" />
      ) : (
        <NavButton
          key={item.key}
          label={item.label}
          icon={item.icon}
          active={active === item.key}
          onClick={() => handleNavClick(item.key)}
          collapsed={collapsed}
        />
      )
    );

  // ─── Sidebar inner content ──────────────────────
  const SidebarContent = ({ collapsed = false, showClose = false }) => (
    <aside
      className={`
        h-full flex flex-col
        bg-[rgba(40,43,252,0.88)] backdrop-blur-lg
        text-white border-r border-white/10 shadow-xl
        transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 shrink-0">
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-base font-extrabold truncate leading-tight">
              {teacherData?.orgName || "My Organisation"}
            </p>
            <p className="text-xs text-white/70">Experts Console</p>
          </div>
        )}

        {/* Desktop: collapse toggle | Mobile: close button */}
        {showClose ? (
          <button
            onClick={() => setDrawerOpen(false)}
            className="ml-auto p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            aria-label="Close menu"
          >
            <FiX />
          </button>
        ) : (
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="ml-auto p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {renderNavItems(collapsed)}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 shrink-0">
        <button
          onClick={logout}
          disabled={loading}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm
                     bg-red-500/30 hover:bg-red-500/50 rounded-lg
                     transition disabled:opacity-60"
        >
          <FiLogOut className="shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 0; height: 0; }
        * { scrollbar-width: none; }
      `}</style>

      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">

        {/* ══════════════════════════════════════════
            MOBILE FIXED HEADER  (visible < md)
        ══════════════════════════════════════════ */}
        <header className="md:hidden flex items-center justify-between
                           px-4 h-14 shrink-0
                           bg-[rgba(40,43,252,0.92)] backdrop-blur-lg
                           text-white shadow-md z-30">
          {/* Org name */}
          <div className="min-w-0">
            <p className="text-sm font-extrabold truncate leading-tight">
              {teacherData?.orgName || "My Organisation"}
            </p>
            <p className="text-[10px] text-white/70 leading-none">
              Experts Console
            </p>
          </div>

          {/* Page title (center) */}
          <span className="absolute left-1/2 -translate-x-1/2
                           text-sm font-semibold capitalize tracking-wide">
            {pageTitle(active)}
          </span>

          {/* Hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition ml-auto"
            aria-label="Open menu"
          >
            <FiMenu className="text-lg" />
          </button>
        </header>

        {/* ══════════════════════════════════════════
            BODY ROW  (sidebar + main)
        ══════════════════════════════════════════ */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── DESKTOP SIDEBAR ── */}
          <div className="hidden md:block shrink-0 h-full">
            <SidebarContent collapsed={!sidebarOpen} />
          </div>

          {/* ── MOBILE DRAWER OVERLAY ── */}
          {drawerOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
          )}

          {/* ── MOBILE DRAWER PANEL ── */}
          <div
            className={`
              fixed top-0 left-0 h-full z-50 md:hidden
              transition-transform duration-300
              ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <SidebarContent showClose />
          </div>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">

              {/* Desktop page header */}
              <header className="hidden md:flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 capitalize">
                  {pageTitle(active)}
                </h1>
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow font-semibold text-sm">
                  {teacherData?.teacherName || user.name}
                </div>
              </header>

              {/* Content card */}
              <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl min-h-[75vh]">
                {content}
              </section>
            </div>
          </main>

        </div>
      </div>
    </>
  );
}