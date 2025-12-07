import React, { useState, useMemo } from "react";
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
  FiAlertCircle,
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

export default function TeacherDashboard() {
  // Load saved org/teacher name from localStorage
  const navigate = useNavigate();
  const organizationName =
    localStorage.getItem("organizationName") || "My Organization";

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

  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const content = useMemo(() => {
    switch (active) {
      case "overview":
        return <Overview user={user} setActive={setActive} />;
      case "courses":
        return <CourseManager user={user} />;
      case "uploads":
        return <ContentUpload user={user} />;
      case "recorded":
        return <RecordedLectures user={user} />;
      case "ai":
        return <AIStudioRedirect />;
      case "liveClass":
        return <LiveClassRoom user={user} />;
      case "quizzes":
        return <QuizManager user={user} />;
      case "responses":
        return <QuizResponses user={user} />;
      case "discussion":
        return <DiscussionDoubts user={user} />;
      case "analytics":
        return <TeacherAnalytics user={user} />;
      default:
        return <Overview user={user} setActive={setActive} />;
    }
  }, [active]);

  const logout = async () => {
    setLoading(true);
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        setLoading(false);
        navigate("/");
      }
    } catch (error) {}
  };

  const handleNavClick = (key) => {
    setActive(key);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 0; height: 0; }
        * { scrollbar-width: none; }
      `}</style>

      <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">
        {/* ---------------- MOBILE MENU BUTTON ---------------- */}
        {!mobileMenuOpen && (
          <button
            className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white shadow rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu className="text-xl text-slate-700" />
          </button>
        )}

        {/* ---------------- MOBILE OVERLAY ---------------- */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* ---------------- MOBILE SIDEBAR ---------------- */}
        <div
          className={`fixed top-0 right-0 z-50 h-full w-64 transition-transform duration-300 md:hidden
            ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <aside className="h-full bg-[rgba(40,43,252,0.94)] backdrop-blur-lg text-white flex flex-col">
            {/* ORG NAME (Mobile) */}
            <div className="p-4 flex items-center justify-between h-20">
              <div>
                <div className="text-lg font-extrabold">{organizationName}</div>
                <div className="text-xs text-white/80">Expert Console</div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-white/10"
              >
                <FiX className="text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-6">
              {/* NAV ITEMS */}
              <NavButton
                label="Overview"
                icon={FiGrid}
                active={active === "overview"}
                onClick={() => handleNavClick("overview")}
              />
              <NavButton
                label="Courses"
                icon={FiBook}
                active={active === "courses"}
                onClick={() => handleNavClick("courses")}
              />
              <NavButton
                label="Uploads"
                icon={FiUpload}
                active={active === "uploads"}
                onClick={() => handleNavClick("uploads")}
              />
              <NavButton
                label="Recorded"
                icon={FiVideo}
                active={active === "recorded"}
                onClick={() => handleNavClick("recorded")}
              />
              <NavButton
                label="AI Studio"
                icon={FiZap}
                active={active === "ai"}
                onClick={() => handleNavClick("ai")}
              />

              <div className="border-t border-white/20 mt-3 pt-3" />

              <NavButton
                label="Live Class"
                icon={FiVideo}
                active={active === "liveClass"}
                onClick={() => handleNavClick("liveClass")}
              />
              <NavButton
                label="Quizzes"
                icon={FiPlus}
                active={active === "quizzes"}
                onClick={() => handleNavClick("quizzes")}
              />
              <NavButton
                label="Responses"
                icon={FiFileText}
                active={active === "responses"}
                onClick={() => handleNavClick("responses")}
              />
              <NavButton
                label="Discussions"
                icon={FiMessageCircle}
                active={active === "discussion"}
                onClick={() => handleNavClick("discussion")}
              />
              <NavButton
                label="Analytics"
                icon={FiBarChart2}
                active={active === "analytics"}
                onClick={() => handleNavClick("analytics")}
              />
            </div>

            <div className="p-4 border-t border-white/10">
              <button
                className="w-full flex items-center gap-2 p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition"
                onClick={logout}
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </aside>
        </div>

        {/* ---------------- DESKTOP SIDEBAR ---------------- */}
        <aside
          className={`hidden md:flex flex-col bg-[rgba(40,43,252,0.64)] backdrop-blur-lg shadow-lg border-r border-white/10 h-screen transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-20"
          }`}
        >
          {/* ORGANIZATION NAME */}
          <div className="p-4 flex items-center justify-between h-20">
            {sidebarOpen && (
              <div>
                <div className="text-lg font-extrabold text-white">
                  {organizationName}
                </div>
                <div className="text-xs text-white/70">Experts Console</div>
              </div>
            )}

            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              {sidebarOpen ? (
                <FiChevronsLeft className="text-white" />
              ) : (
                <FiChevronsRight className="text-white" />
              )}
            </button>
          </div>

          {/* NAVIGATION LIST */}
          <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-4">
            <NavButton
              label="Overview"
              icon={FiGrid}
              active={active === "overview"}
              onClick={() => setActive("overview")}
              collapsed={!sidebarOpen}
            />
            <NavButton
              label="Courses"
              icon={FiBook}
              active={active === "courses"}
              onClick={() => setActive("courses")}
              collapsed={!sidebarOpen}
            />
            <NavButton
              label="Uploads"
              icon={FiUpload}
              active={active === "uploads"}
              onClick={() => setActive("uploads")}
              collapsed={!sidebarOpen}
            />
            <NavButton
              label="Recorded"
              icon={FiVideo}
              active={active === "recorded"}
              onClick={() => setActive("recorded")}
              collapsed={!sidebarOpen}
            />
            <NavButton
              label="AI Studio"
              icon={FiZap}
              active={active === "ai"}
              onClick={() => setActive("ai")}
              collapsed={!sidebarOpen}
            />

            <div className="border-t border-white/20 pt-3" />

            <NavButton
              label="Live Class"
              icon={FiVideo}
              active={active === "liveClass"}
              onClick={() => setActive("liveClass")}
              collapsed={!sidebarOpen}
            />
            <NavButton
              label="Quizzes"
              icon={FiPlus}
              active={active === "quizzes"}
              onClick={() => setActive("quizzes")}
              collapsed={!sidebarOpen}
            />
            <NavButton
              label="Responses"
              icon={FiFileText}
              active={active === "responses"}
              onClick={() => setActive("responses")}
              collapsed={!sidebarOpen}
            />
            <NavButton
              label="Discussions"
              icon={FiMessageCircle}
              active={active === "discussion"}
              onClick={() => setActive("discussion")}
              collapsed={!sidebarOpen}
            />
            <NavButton
              label="Analytics"
              icon={FiBarChart2}
              active={active === "analytics"}
              onClick={() => setActive("analytics")}
              collapsed={!sidebarOpen}
            />
          </div>

          {/* LOGOUT */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 p-2 text-sm bg-red-500/30 hover:bg-red-500/50 rounded-lg transition text-white"
            >
              <FiLogOut />
              {sidebarOpen && "Logout"}
            </button>
          </div>
        </aside>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 capitalize">
              {active.replace(/([A-Z])/g, " $1")}
            </h1>

            {/* TEACHER NAME TOP RIGHT */}
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow font-semibold">
                {teacherName}
              </div>
            </div>
          </header>

          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl min-h-[60vh]">
            {content}
          </section>
        </main>
      </div>
    </>
  );
}
