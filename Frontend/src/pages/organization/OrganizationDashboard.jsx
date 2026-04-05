import React, { useState, useEffect, useRef } from "react";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiBarChart2,
  FiLogOut,
  FiBriefcase,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi";

import Overview from "./components/Overview";
import Analytics from "./components/Analytics";
import TeacherManagement from "./components/TeacherManagement";
import StudentManagement from "./components/StudentManagement";
import StudentModal from "./components/StudentModal";
import TeacherModal from "./components/TeacherModal";
import { getOrgData, logoutUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getCache, setCache } from "@/utils/cache";

// localStorage helpers
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, f) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : f;
  } catch {
    return f;
  }
};

// Dummy initial data
const initialTeachers = [
  {
    id: 1,
    name: "Dr. Anya Sharma",
    email: "a.sharma@edu.in",
    status: "Active",
    sessions: 45,
    reactions: 200,
    doubts: 50,
  },
  {
    id: 2,
    name: "Mr. Rajeev Varma",
    email: "r.varma@edu.in",
    status: "Inactive",
    sessions: 12,
    reactions: 50,
    doubts: 10,
  },
  {
    id: 3,
    name: "Ms. Leela Krishnan",
    email: "l.krishnan@edu.in",
    status: "Active",
    sessions: 60,
    reactions: 320,
    doubts: 80,
  },
];

const initialStudents = [
  {
    id: 101,
    name: "Priya Singh",
    email: "priya@mail.com",
    enrolled: 3,
    attendance: 92,
    streak: 15,
    quizzes: [
      { title: "Physics", score: 85 },
      { title: "Math", score: 72 },
    ],
    badges: ["Top Learner", "Math Whiz"],
  },
  {
    id: 102,
    name: "Rohan Patel",
    email: "rohan@mail.com",
    enrolled: 2,
    attendance: 78,
    streak: 5,
    quizzes: [
      { title: "History", score: 65 },
      { title: "Geography", score: 88 },
    ],
    badges: ["Rising Star"],
  },
  {
    id: 103,
    name: "Amit Kumar",
    email: "amit@mail.com",
    enrolled: 4,
    attendance: 85,
    streak: 10,
    quizzes: [
      { title: "Chem", score: 95 },
      { title: "Bio", score: 78 },
    ],
    badges: ["Science Ace"],
  },
];

const initialCourses = [
  { id: 10, name: "Advanced Physics", students: 50, sessions: 20 },
  { id: 20, name: "Basic Mathematics", students: 75, sessions: 30 },
  { id: 30, name: "Indian History", students: 40, sessions: 15 },
];

const initialAnalyticsData = {
  avgScore: 78,
  avgAttendance: 86,
  topTeacher: "Dr. Anya Sharma",
  topCourse: "Basic Mathematics",
  attendanceTrend: [65, 70, 75, 80, 85, 86, 90],
  quizTrend: [120, 110, 150, 130, 140, 160, 170],
};

// Default logo (you can replace URL)
const DEFAULT_ORG_LOGO = "https://i.ibb.co/4Z1qZ4D/default-org.png";

export default function OrganizationDashboard({
  organizationName = "Presidency University",
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(() => load("org_dashboard_tab", "overview"));
  const [teachers, setTeachers] = useState(() => load("teachers_data", []));
  const [students, setStudents] = useState(() =>
    load("students_data", initialStudents)
  );
  const [courses] = useState(initialCourses);
  const [analyticsData] = useState(initialAnalyticsData);

  const [analyticsRange, setAnalyticsRange] = useState("7d");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // MOBILE SIDEBAR STATE
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organisationData, setOrganisationData] = useState(null);

  // ORGANIZATION LOGO (persisted in localStorage)
  const [orgLogo, setOrgLogo] = useState(() =>
    load("org_logo", DEFAULT_ORG_LOGO)
  );

  // DP Modal (Option B)
  const [showDpModal, setShowDpModal] = useState(false);
  // tempLogo: used for preview inside modal before saving
  const [tempLogo, setTempLogo] = useState(orgLogo);

  // file input ref for change photo action
  const fileRef = useRef(null);

  useEffect(() => save("org_dashboard_tab", tab), [tab]);
  useEffect(() => save("teachers_data", teachers), [teachers]);
  useEffect(() => save("students_data", students), [students]);
  useEffect(() => save("org_logo", orgLogo), [orgLogo]); // persist logo on change

  const removeTeacher = (id) => {
    if (window.confirm("Are you sure?"))
      setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const removeStudent = (id) => {
    if (window.confirm("Are you sure?"))
      setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const viewStudentDetails = (s) => setSelectedStudent(s);
  const closeStudentModal = () => setSelectedStudent(null);

  const viewTeacherDetails = (t) => setSelectedTeacher(t);
  const closeTeacherModal = () => setSelectedTeacher(null);

  const openInvite = (mode) => {
    if (mode === "teacher") setTab("teachers");
    else if (mode === "student") setTab("students");
  };

  const navItems = [
    { id: "overview", name: "Overview", icon: FiHome },
    { id: "analytics", name: "Analytics", icon: FiBarChart2 },
    { id: "teachers", name: "Teachers", icon: FiUsers },
    { id: "students", name: "Students", icon: FiUserCheck },
  ];

  const renderContent = () => {
    const commonProps = {
      teachers,
      students,
      courses,
      totalTeachers: teachers.length,
      totalStudents: students.length,
      totalCourses: courses.length,
      totalSessions: courses.reduce((a, c) => a + c.sessions, 0),
      setTab,
      openInvite,
    };

    switch (tab) {
      case "overview":
        return (
          <Overview {...commonProps} organisationData={organisationData} />
        );
      case "analytics":
        return (
          <Analytics
            {...commonProps}
            analyticsData={analyticsData}
            analyticsRange={analyticsRange}
            setAnalyticsRange={setAnalyticsRange}
          />
        );
      case "teachers":
        return (
          <TeacherManagement
            teachers={teachers}
            setTeachers={setTeachers}
            removeTeacher={removeTeacher}
            viewTeacherDetails={viewTeacherDetails}
            openInvite={openInvite}
          />
        );
      case "students":
        return (
          <StudentManagement
            students={students}
            removeStudent={removeStudent}
            viewStudentDetails={viewStudentDetails}
            openInvite={openInvite}
            organisationData={organisationData}
          />
        );
      default:
        return <Overview {...commonProps} />;
    }
  };

  // Open DP modal (prepare temp state)
  const openDpModal = () => {
    setTempLogo(orgLogo || DEFAULT_ORG_LOGO);
    setShowDpModal(true);
  };

  // Handle file chosen — convert to base64 for preview (tempLogo)
  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTempLogo(ev.target.result);
    };
    reader.readAsDataURL(f);
  };

  // Save tempLogo as orgLogo and persist (already persisted by useEffect)
  const saveDp = () => {
    setOrgLogo(tempLogo || DEFAULT_ORG_LOGO);
    setShowDpModal(false);
  };

  // Remove photo in modal (sets tempLogo to default)
  const removeDp = () => {
    setTempLogo(DEFAULT_ORG_LOGO);
  };

  // Cancel modal (discard temp)
  const cancelDp = () => {
    setTempLogo(orgLogo);
    setShowDpModal(false);
  };
  useEffect(() => {
    const fetchOrgData = async () => {
      const cachedData = getCache("org_dashboard");
      if (cachedData) {
        setOrganisationData(cachedData);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getOrgData();
        setOrganisationData(response.data);
        setCache("org_dashboard", response.data, 10); // Cache for 10 minutes
      } catch (error) {
        console.error("Failed to fetch organisation dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgData();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen message="Loading Organization Workspace" />}
      <div className="flex min-h-screen bg-gray-50">
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white shadow flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => openDpModal()}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-600 flex-shrink-0"
          >
            <img
              src={orgLogo || DEFAULT_ORG_LOGO}
              alt="Org"
              className="w-full h-full object-cover"
            />
          </button>

          <h1 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
            <FiBriefcase /> {organisationData?.orgName}
          </h1>
        </div>

        <button
          onClick={() => setMobileMenu(true)}
          className="text-purple-700 text-3xl"
        >
          <FiMenu />
        </button>
      </div>

      {/* RIGHT-SIDE MOBILE SLIDE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-purple-800 to-purple-700 text-white shadow-xl transform transition-transform duration-300 z-50 lg:hidden
                ${mobileMenu ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={openDpModal}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white"
            >
              <img
                src={orgLogo || DEFAULT_ORG_LOGO}
                alt="Org"
                className="w-full h-full object-cover"
              />
            </button>
            <h1 className="text-2xl font-bold">{organisationData?.orgName}</h1>
          </div>

          <button
            onClick={() => setMobileMenu(false)}
            className="text-white text-3xl"
          >
            <FiX />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                tab === item.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <item.icon size={20} /> {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          {/* <button
                        onClick={() => openInvite("teacher")}
                        className="w-full px-4 py-2 bg-pink-500 rounded-lg text-white font-semibold flex items-center gap-2 justify-center hover:brightness-105"
                    >
                        <FiMail /> Invite User
                    </button> */}

          <button
            className="w-full flex items-center gap-3 p-3 mt-2 text-red-300 hover:bg-white/5 rounded-lg font-medium transition-colors"
            onClick={logout}
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex w-64 bg-gradient-to-b from-purple-800 to-purple-700 text-white shadow-xl z-30 flex-col h-screen sticky top-0">
        <div className="p-6 h-20 flex items-center gap-3 border-b border-white/10">
          <button
            onClick={openDpModal}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0"
          >
            <img
              src={orgLogo || DEFAULT_ORG_LOGO}
              alt="Org"
              className="w-full h-full object-cover"
            />
          </button>

          <div>
            <h1 className="text-xl font-extrabold">
              {organisationData?.orgName}
            </h1>
            <p className="text-xs text-white/80">Organization</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                tab === item.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <item.icon size={20} /> {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          {/* <button
                        onClick={() => openInvite("teacher")}
                        className="w-full px-4 py-2 bg-pink-500 rounded-lg text-white font-semibold flex items-center gap-2 justify-center hover:brightness-105"
                    >
                        <FiMail /> Invite User
                    </button> */}

          <button
            className="w-full flex items-center gap-3 p-3 mt-2 text-red-300 hover:bg-white/5 rounded-lg font-medium transition-colors"
            onClick={logout}
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 mt-16 lg:mt-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 capitalize">
            {tab.replace(/([A-Z])/g, " $1")}
          </h1>

          <div className="hidden lg:flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {organisationData?.orgName}
            </div>
            <button
              onClick={openDpModal}
              className="w-10 h-10 rounded-full overflow-hidden border shadow"
            >
              <img
                src={orgLogo || DEFAULT_ORG_LOGO}
                alt="Org"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-h-[85vh]">
          {renderContent()}
        </div>
      </main>

      {selectedStudent && (
        <StudentModal student={selectedStudent} onClose={closeStudentModal} />
      )}

      {selectedTeacher && (
        <TeacherModal teacher={selectedTeacher} onClose={closeTeacherModal} />
      )}

      {/* DP Modal (Option B: popup with preview / change / remove / save / cancel) */}
      {showDpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold">Organization Photo</h3>
              <button
                onClick={cancelDp}
                className="text-gray-600 hover:text-black"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                <img
                  src={tempLogo || DEFAULT_ORG_LOGO}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-sm text-gray-600 text-center">
                This photo will be used across the dashboard (sidebar, top bar,
                mobile).
              </div>

              <div className="flex gap-2 w-full">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
                >
                  Change Photo
                </button>

                <button
                  onClick={removeDp}
                  className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg"
                >
                  Remove
                </button>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={saveDp}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={cancelDp}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
