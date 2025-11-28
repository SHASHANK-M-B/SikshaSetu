// // OrganizationDashboard.jsx
// // Single-file PREMIUM Organization Module (responsive, full features, dummy data)
// // Requirements: React, Tailwind CSS, react-icons
// // Paste this file into src/components/OrganizationDashboard.jsx

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//     FiUserPlus,
//     FiUsers,
//     FiBarChart2,
//     FiClipboard,
//     FiHash,
//     FiBookOpen,
//     FiChevronsRight,
//     FiChevronsLeft,
//     FiTrash2,
//     FiCopy,
//     FiCheckCircle,
//     FiAlertCircle,
//     FiPlusCircle,
//     FiUpload,
//     FiMail,
//     FiSearch,
//     FiChevronDown,
//     FiX,
//     FiFileText,
//     FiTrendingUp,
//     FiActivity,
//     FiSmile,
//     FiMenu
// } from "react-icons/fi";

// /* =========================
//    NAV ITEMS (MUST BE TOP)
//    ========================= */
// const navItems = [
//     { id: "overview", icon: FiBarChart2, name: "Admin Overview" },
//     { id: "registerOrg", icon: FiClipboard, name: "Org Details & Setup" },
//     { id: "generateOrgCode", icon: FiHash, name: "Generate Invite Code" },
//     { id: "teachers", icon: FiUserPlus, name: "Teacher Management" },
//     { id: "students", icon: FiUsers, name: "Student Management" },
//     { id: "analytics", icon: FiBarChart2, name: "Performance Analytics" },
// ];

// /* =========================
//    DUMMY DATA (extendable)
//    // backend required: Replace with real API calls
//    ========================= */
// const dummyTeachers = [
//     { id: 1, name: "Dr. John Doe", email: "john@org.edu", status: "Active", sessions: 42, reactions: 320, doubts: 12 },
//     { id: 2, name: "Prof. Jane Smith", email: "jane@org.edu", status: "Active", sessions: 28, reactions: 210, doubts: 5 },
//     { id: 3, name: "Mr. Alex Chan", email: "alex@org.edu", status: "Inactive", sessions: 8, reactions: 40, doubts: 1 },
// ];

// const dummyStudents = [
//     { id: 101, name: "Alice Brown", email: "alice@student.com", enrolled: 3, attendance: 92, quizzes: [{ title: "Q1", score: 85 }, { title: "Q2", score: 78 }], streak: 12, badges: ["Fast Learner"] },
//     { id: 102, name: "Bob Green", email: "bob@student.com", enrolled: 2, attendance: 75, quizzes: [{ title: "Q1", score: 60 }], streak: 3, badges: [] },
//     { id: 103, name: "Charlie Davis", email: "charlie@student.com", enrolled: 4, attendance: 88, quizzes: [{ title: "Q1", score: 92 }, { title: "Q2", score: 95 }], streak: 25, badges: ["Top Scorer", "Consistency"] },
// ];

// const dummyCourses = [
//     { id: "C101", title: "Advanced Algorithms", students: 120, sessions: 24 },
//     { id: "C102", title: "Data Structures", students: 95, sessions: 30 },
//     { id: "C201", title: "Machine Learning", students: 80, sessions: 18 },
// ];

// const CONTACTS_KEY = "org_saved_contacts_v1";

// /* =========================
//    MAIN COMPONENT
//    ========================= */
// export default function OrganizationDashboard() {
//     // Navigation & responsiveness
//     const [activeTab, setActiveTab] = useState("overview");
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [mobileNavOpen, setMobileNavOpen] = useState(false);

//     // Core state (dummy / frontend)
//     const [teachers, setTeachers] = useState(dummyTeachers);
//     const [students, setStudents] = useState(dummyStudents);
//     const [courses, setCourses] = useState(dummyCourses);

//     // Org features
//     const [orgDocs, setOrgDocs] = useState([]); // uploaded docs (frontend placeholder)
//     const [approvalStatus, setApprovalStatus] = useState("Not Requested"); // Not Requested | Pending | Approved | Rejected
//     const [orgCode, setOrgCode] = useState("ORG-FA123");

//     // Contacts & invites
//     const [savedContacts, setSavedContacts] = useState(() => {
//         try {
//             const s = localStorage.getItem(CONTACTS_KEY);
//             return s ? JSON.parse(s) : ["john@org.edu", "alice@student.com", "devs@platform.com"];
//         } catch (e) {
//             return ["john@org.edu", "alice@student.com", "devs@platform.com"];
//         }
//     });

//     // Invite modal
//     const [inviteModalOpen, setInviteModalOpen] = useState(false);
//     const [inviteMode, setInviteMode] = useState("teacher"); // 'teacher' | 'student'
//     const [inviteEmail, setInviteEmail] = useState("");
//     const [autocomplete, setAutocomplete] = useState([]);

//     // Detail modals
//     const [selectedTeacher, setSelectedTeacher] = useState(null);
//     const [selectedStudent, setSelectedStudent] = useState(null);

//     // Analytics
//     const [analyticsRange, setAnalyticsRange] = useState("7d"); // 7d | 30d | 365d

//     // Derived numbers
//     const totalTeachers = teachers.length;
//     const totalStudents = students.length;
//     const totalCourses = courses.length;
//     const totalSessions = courses.reduce((s, c) => s + (c.sessions || 0), 0);

//     /* ---------------- Persist contacts ---------------- */
//     useEffect(() => {
//         try {
//             localStorage.setItem(CONTACTS_KEY, JSON.stringify(savedContacts));
//         } catch (e) { }
//     }, [savedContacts]);

//     /* ---------------- Invite helpers ---------------- */
//     const openInvite = (mode = "teacher") => {
//         setInviteMode(mode);
//         setInviteEmail("");
//         setAutocomplete([]);
//         setInviteModalOpen(true);
//     };

//     const handleInviteEmailChange = (val) => {
//         setInviteEmail(val);
//         if (!val) {
//             setAutocomplete([]);
//             return;
//         }
//         const q = val.toLowerCase();
//         setAutocomplete(savedContacts.filter(c => c.toLowerCase().includes(q) && c.toLowerCase() !== q).slice(0, 6));
//     };

//     const sendInvite = () => {
//         if (!inviteEmail) {
//             alert("Enter an email to invite");
//             return;
//         }
//         // backend required: POST /org/invite { email, role }
//         // Simulate success:
//         if (!savedContacts.includes(inviteEmail)) setSavedContacts(prev => [inviteEmail, ...prev].slice(0, 50));
//         alert(`${inviteMode === "teacher" ? "Teacher" : "Student"} invite sent to ${inviteEmail} (dummy)`);
//         setInviteModalOpen(false);
//     };

//     const removeContact = (email) => {
//         setSavedContacts(prev => prev.filter(e => e !== email));
//     };

//     /* ---------------- Upload docs ---------------- */
//     const handleUploadDocs = (files) => {
//         // backend required: POST /org/upload-docs (multipart)
//         const arr = Array.from(files).map((f, idx) => ({ id: Date.now() + idx, name: f.name, size: f.size }));
//         setOrgDocs(prev => [...arr, ...prev]);
//         setApprovalStatus("Pending");
//         alert("Files uploaded (dummy) — approval request simulated.");
//     };

//     /* ---------------- Generate Org Code ---------------- */
//     const generateCode = () => {
//         // backend required: POST /org/generate-code
//         const newCode = "ORG-" + Math.random().toString(36).substring(2, 7).toUpperCase();
//         setOrgCode(newCode);
//         try { navigator.clipboard.writeText(newCode); } catch (e) { }
//     };

//     /* ---------------- Detail modals ---------------- */
//     const viewTeacherDetails = (t) => setSelectedTeacher(t);
//     const closeTeacherModal = () => setSelectedTeacher(null);

//     const viewStudentDetails = (s) => setSelectedStudent(s);
//     const closeStudentModal = () => setSelectedStudent(null);

//     /* ---------------- Remove handlers ---------------- */
//     const handleRemoveTeacher = useCallback((id) => {
//         // backend required: DELETE /teachers/:id
//         if (window.confirm("Are you sure you want to remove this teacher?")) {
//             setTeachers(prev => prev.filter(t => t.id !== id));
//         }
//     }, []);

//     const handleRemoveStudent = useCallback((id) => {
//         // backend required: DELETE /students/:id
//         if (window.confirm("Are you sure you want to remove this student?")) {
//             setStudents(prev => prev.filter(s => s.id !== id));
//         }
//     }, []);

//     /* ---------------- Analytics dummy computation ---------------- */
//     const analyticsData = useMemo(() => {
//         const days = analyticsRange === "7d" ? 7 : analyticsRange === "30d" ? 30 : 12;
//         const attendanceTrend = Array.from({ length: days }, (_, i) => Math.floor(70 + Math.sin(i / 3) * 10 + Math.random() * 8));
//         const quizTrend = Array.from({ length: days }, (_, i) => Math.floor(40 + Math.cos(i / 4) * 15 + Math.random() * 12));
//         return { attendanceTrend, quizTrend };
//     }, [analyticsRange]);

//     /* ---------------- Render content by tab (keeps file tidy) ---------------- */
//     const renderContent = useMemo(() => {
//         switch (activeTab) {
//             case "overview":
//                 return (
//                     <OverviewV2
//                         teachers={teachers}
//                         students={students}
//                         courses={courses}
//                         totalSessions={totalSessions}
//                         orgCode={orgCode}
//                         approvalStatus={approvalStatus}
//                         openInvite={openInvite}
//                         handleUploadDocs={handleUploadDocs}
//                         generateCode={generateCode}
//                         totalTeachers={totalTeachers}
//                         totalStudents={totalStudents}
//                         totalCourses={totalCourses}
//                     />
//                 );
//             case "registerOrg":
//                 return <RegisterOrganization />;
//             case "generateOrgCode":
//                 return <GenerateOrgCode orgCode={orgCode} generateCode={generateCode} />;
//             case "teachers":
//                 return <TeacherManagementV2 teachers={teachers} setTeachers={setTeachers} removeTeacher={handleRemoveTeacher} viewTeacherDetails={viewTeacherDetails} openInvite={openInvite} />;
//             case "students":
//                 return <StudentManagementV2 students={students} removeStudent={handleRemoveStudent} viewStudentDetails={viewStudentDetails} openInvite={openInvite} />;
//             case "analytics":
//                 return <OrgAnalyticsV2 analyticsData={analyticsData} analyticsRange={analyticsRange} setAnalyticsRange={setAnalyticsRange} teachers={teachers} students={students} courses={courses} />;
//             default:
//                 return <OverviewV2 teachers={teachers} students={students} courses={courses} totalSessions={totalSessions} orgCode={orgCode} approvalStatus={approvalStatus} openInvite={openInvite} handleUploadDocs={handleUploadDocs} generateCode={generateCode} />;
//         }
//     }, [activeTab, teachers, students, courses, totalSessions, orgCode, approvalStatus, analyticsData]);

//     /* ---------------- UI Layout ---------------- */
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
//             <div className="flex">

//                 {/* MOBILE TOPBAR (visible on small screens) */}
//                 <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow">
//                     <div className="flex items-center gap-3">
//                         <div className="text-lg font-bold">
//                             <span className="text-pink-300">Org</span>Admin
//                         </div>
//                         <div className="text-xs text-white/80">College / School</div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="p-2 rounded-md bg-white/10 hover:bg-white/20">
//                             <FiMenu size={20} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* MOBILE SLIDE-IN NAV (right side) */}
//                 <aside className={`fixed top-0 right-0 z-40 h-full w-72 bg-purple-800 text-white transform transition-transform duration-300 lg:hidden ${mobileNavOpen ? "translate-x-0" : "translate-x-full"}`}>
//                     <div className="p-4 flex items-center justify-between border-b border-white/10">
//                         <div>
//                             <div className="font-semibold">Menu</div>
//                             <div className="text-xs text-white/80">Navigation</div>
//                         </div>
//                         <button onClick={() => setMobileNavOpen(false)} className="p-2 bg-white/10 rounded-md"><FiX /></button>
//                     </div>

//                     <nav className="p-3 space-y-2">
//                         {navItems.map(item => (
//                             <button
//                                 key={item.id}
//                                 onClick={() => { setActiveTab(item.id); setMobileNavOpen(false); }}
//                                 className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === item.id ? "bg-purple-600" : "hover:bg-white/5"}`}>
//                                 <item.icon size={18} />
//                                 <span className="font-medium">{item.name}</span>
//                             </button>
//                         ))}
//                     </nav>
//                 </aside>

//                 {/* DESKTOP SIDEBAR */}
//                 <aside className={`hidden lg:flex flex-col h-screen sticky top-0 z-20 bg-gradient-to-b from-purple-800 to-purple-700 text-white transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-20"}`}>
//                     <div className="p-4 h-20 flex items-center justify-between border-b border-white/10">
//                         {isSidebarOpen ? (
//                             <div>
//                                 <div className="text-2xl font-extrabold"><span className="text-pink-300">Org</span>Admin</div>
//                                 <div className="text-xs text-white/80">College / School Panel</div>
//                             </div>
//                         ) : null}
//                         <button onClick={() => setIsSidebarOpen(prev => !prev)} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
//                             {isSidebarOpen ? <FiChevronsLeft /> : <FiChevronsRight />}
//                         </button>
//                     </div>

//                     <nav className="p-4 space-y-2 flex-1 overflow-auto">
//                         {navItems.map(item => (
//                             <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === item.id ? "bg-white/10" : "hover:bg-white/5"}`}>
//                                 <item.icon size={18} />
//                                 {isSidebarOpen && <span className="font-medium">{item.name}</span>}
//                             </button>
//                         ))}
//                     </nav>

//                     <div className="p-4 border-t border-white/10">
//                         <button onClick={() => openInvite("teacher")} className="w-full px-4 py-2 bg-pink-500 rounded-lg text-white font-semibold flex items-center gap-2 justify-center hover:brightness-105">
//                             <FiMail /> Invite
//                         </button>
//                     </div>
//                 </aside>

//                 {/* MAIN AREA */}
//                 <main className="flex-1 min-h-screen lg:ml-0">
//                     <div className="pt-20 lg:pt-8 px-4 lg:px-10 pb-10">
//                         <div className="flex items-center justify-between mb-6">
//                             <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 capitalize">{activeTab.replace(/([A-Z])/g, " $1")}</h1>
//                             <div className="hidden lg:flex items-center gap-4">
//                                 <div className="text-sm text-gray-500">Signed in as</div>
//                                 <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow">OA</div>
//                             </div>
//                         </div>

//                         <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-h-[68vh]">
//                             {renderContent}
//                         </div>
//                     </div>
//                 </main>
//             </div>

//             {/* INVITE MODAL */}
//             {inviteModalOpen && (
//                 <Modal title={`Invite ${inviteMode === "teacher" ? "Teacher" : "Student"}`} onClose={() => setInviteModalOpen(false)}>
//                     <div className="space-y-4">
//                         <label className="block text-sm text-gray-600">Email</label>
//                         <div className="relative">
//                             <input value={inviteEmail} onChange={e => handleInviteEmailChange(e.target.value)} className="w-full p-3 border rounded-lg pr-32" placeholder={`invite@${inviteMode}.com`} />
//                             <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
//                                 <button onClick={() => { if (autocomplete[0]) setInviteEmail(autocomplete[0]); }} className="px-3 py-2 bg-gray-100 rounded">Use</button>
//                                 <button onClick={sendInvite} className="px-4 py-2 bg-purple-600 text-white rounded">Send</button>
//                             </div>
//                         </div>

//                         {autocomplete.length > 0 && (
//                             <div className="flex gap-2 flex-wrap">
//                                 {autocomplete.map(a => <button key={a} onClick={() => setInviteEmail(a)} className="px-3 py-1 bg-gray-100 rounded">{a}</button>)}
//                             </div>
//                         )}

//                         <div className="pt-2 border-t">
//                             <p className="text-sm text-gray-600">Saved Contacts</p>
//                             <div className="max-h-36 overflow-auto mt-2 space-y-2">
//                                 {savedContacts.map(c => (
//                                     <div key={c} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                                         <div className="text-sm">{c}</div>
//                                         <div className="flex items-center gap-2">
//                                             <button onClick={() => setInviteEmail(c)} className="px-2 py-1 bg-white border rounded">Use</button>
//                                             <button onClick={() => removeContact(c)} className="px-2 py-1 text-red-500">Remove</button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </Modal>
//             )}

//             {/* TEACHER DETAIL MODAL */}
//             {selectedTeacher && (
//                 <Modal title={`Teacher - ${selectedTeacher.name}`} onClose={closeTeacherModal}>
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <div className="text-lg font-semibold">{selectedTeacher.name}</div>
//                                 <div className="text-sm text-gray-500">{selectedTeacher.email}</div>
//                                 <div className="text-sm mt-1">Status: <span className={`font-semibold ${selectedTeacher.status === "Active" ? "text-green-600" : "text-red-600"}`}>{selectedTeacher.status}</span></div>
//                             </div>
//                             <div className="text-right">
//                                 <div className="text-sm text-gray-500">Sessions</div>
//                                 <div className="text-2xl font-bold">{selectedTeacher.sessions}</div>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                             <InfoCard title="Reactions">{selectedTeacher.reactions}</InfoCard>
//                             <InfoCard title="Doubts Handled">{selectedTeacher.doubts}</InfoCard>
//                             <InfoCard title="Recent Activity">
//                                 <ul className="text-sm space-y-1">
//                                     <li>Session: "Sorting Algorithms" — 2 days ago</li>
//                                     <li>Answered 5 doubts — 3 days ago</li>
//                                     <li>Uploaded resource: notes.pdf — 5 days ago</li>
//                                 </ul>
//                             </InfoCard>
//                         </div>
//                     </div>
//                 </Modal>
//             )}

//             {/* STUDENT DETAIL MODAL */}
//             {selectedStudent && (
//                 <Modal title={`Student - ${selectedStudent.name}`} onClose={closeStudentModal}>
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <div className="text-lg font-semibold">{selectedStudent.name}</div>
//                                 <div className="text-sm text-gray-500">{selectedStudent.email}</div>
//                                 <div className="text-sm mt-1">Courses: <span className="font-semibold">{selectedStudent.enrolled}</span></div>
//                             </div>
//                             <div className="text-right">
//                                 <div className="text-sm text-gray-500">Attendance</div>
//                                 <div className="text-2xl font-bold">{selectedStudent.attendance}%</div>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             <InfoCard title="Recent Quiz Scores">
//                                 <ul className="text-sm space-y-1">
//                                     {selectedStudent.quizzes.map((q, i) => <li key={i}>{q.title}: <span className="font-semibold">{q.score}%</span></li>)}
//                                 </ul>
//                             </InfoCard>
//                             <InfoCard title="Streaks & Badges">
//                                 <p>Streak: <span className="font-bold">{selectedStudent.streak} days</span></p>
//                                 <div className="mt-2 flex gap-2">
//                                     {selectedStudent.badges.map((b, i) => <span key={i} className="px-2 py-1 bg-yellow-100 rounded-full text-xs">{b}</span>)}
//                                 </div>
//                             </InfoCard>
//                         </div>
//                     </div>
//                 </Modal>
//             )}
//         </div>
//     );
// }

// /* =========================
//    REUSABLE SUB-COMPONENTS
//    ========================= */

// function Modal({ children, title, onClose }) {
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//             <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg overflow-hidden">
//                 <div className="flex items-center justify-between p-4 border-b">
//                     <h3 className="font-semibold text-lg">{title}</h3>
//                     <div>
//                         <button onClick={onClose} className="p-2 rounded-md text-gray-600 hover:bg-gray-100"><FiX /></button>
//                     </div>
//                 </div>
//                 <div className="p-6">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// }

// const InfoCard = ({ title, children }) => (
//     <div className="p-4 bg-white border rounded-lg shadow-sm">
//         <p className="text-sm text-gray-500">{title}</p>
//         <div className="mt-2">{children}</div>
//     </div>
// );

// /* =========================
//    CONTENT COMPONENTS
//    ========================= */

// function OverviewV2({ teachers, students, courses, totalSessions, orgCode, approvalStatus, openInvite, handleUploadDocs, generateCode, totalTeachers, totalStudents, totalCourses }) {
//     const activeTeachers = teachers.filter(t => t.status === "Active").length;

//     return (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl border shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm text-gray-500">Total Teachers</p>
//                             <p className="text-2xl font-bold text-purple-700">{totalTeachers}</p>
//                         </div>
//                         <FiUsers className="text-3xl text-purple-500" />
//                     </div>
//                     <p className="text-sm text-gray-500 mt-3">Active: <span className="font-semibold">{activeTeachers}</span></p>
//                     <div className="mt-4 flex gap-2">
//                         <button onClick={() => openInvite("teacher")} className="px-3 py-2 bg-purple-600 text-white rounded">Invite Teacher</button>
//                     </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl border shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm text-gray-500">Total Students</p>
//                             <p className="text-2xl font-bold text-pink-600">{totalStudents}</p>
//                         </div>
//                         <FiUserPlus className="text-3xl text-pink-500" />
//                     </div>
//                     <p className="text-sm text-gray-500 mt-3">Courses enrolled: <span className="font-semibold">{students.reduce((a, s) => a + s.enrolled, 0)}</span></p>
//                     <div className="mt-4">
//                         <button onClick={() => openInvite("student")} className="px-3 py-2 bg-pink-600 text-white rounded">Invite Student</button>
//                     </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl border shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm text-gray-500">Active Courses</p>
//                             <p className="text-2xl font-bold text-indigo-700">{totalCourses}</p>
//                         </div>
//                         <FiBookOpen className="text-3xl text-indigo-500" />
//                     </div>
//                     <p className="text-sm text-gray-500 mt-3">Total Sessions: <span className="font-semibold">{totalSessions}</span></p>
//                     <div className="mt-4">
//                         <button onClick={() => alert("Navigate to course list (dummy)")} className="px-3 py-2 bg-indigo-600 text-white rounded">View Courses</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Docs & Invite Code */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="md:col-span-2 p-6 bg-white border rounded-xl shadow-sm">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h3 className="font-semibold text-lg">Organization Verification</h3>
//                             <p className="text-sm text-gray-500">Upload verification documents and request approval from the Developer Panel.</p>
//                         </div>
//                         <div className="text-sm text-gray-600">Status: <span className={`font-semibold ${approvalStatus === "Approved" ? "text-green-600" : approvalStatus === "Pending" ? "text-yellow-500" : "text-gray-600"}`}>{approvalStatus}</span></div>
//                     </div>

//                     <div className="mt-4 flex gap-3 items-center">
//                         <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
//                             <FiUpload />
//                             <input type="file" multiple onChange={(e) => handleUploadDocs(e.target.files)} className="hidden" />
//                             <span className="text-sm">Upload Documents</span>
//                         </label>

//                         <button onClick={() => alert("Request sent to Developer Panel (dummy)")} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Request Approval</button>
//                     </div>

//                     <div className="mt-4">
//                         <h4 className="text-sm text-gray-600">Uploaded Documents</h4>
//                         <div className="mt-2 space-y-2">
//                             <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                                 <div className="flex items-center gap-3">
//                                     <FiFileText className="text-gray-500" />
//                                     <div>
//                                         <div className="font-medium">license.pdf</div>
//                                         <div className="text-xs text-gray-400">Uploaded 2 days ago</div>
//                                     </div>
//                                 </div>
//                                 <div className="text-sm text-gray-500">Verified</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="p-6 bg-white border rounded-xl shadow-sm">
//                     <h3 className="font-semibold text-lg">Invite Code</h3>
//                     <p className="text-sm text-gray-500">Share this code to onboard teachers & students into your org.</p>
//                     <div className="mt-4 p-3 bg-purple-100 rounded flex items-center justify-between">
//                         <div className="font-bold tracking-widest">{orgCode}</div>
//                         <div className="flex items-center gap-2">
//                             <button onClick={generateCode} className="px-3 py-1 bg-indigo-600 text-white rounded">Regenerate</button>
//                             <button onClick={() => { try { navigator.clipboard.writeText(orgCode); } catch (e) { } }} className="px-3 py-1 bg-white border rounded">Copy</button>
//                         </div>
//                     </div>

//                     <div className="mt-4">
//                         <h4 className="text-sm text-gray-600">Quick actions</h4>
//                         <div className="mt-2 flex gap-2">
//                             <button onClick={() => openInvite("teacher")} className="px-3 py-2 bg-pink-600 text-white rounded">Invite Teacher</button>
//                             <button onClick={() => openInvite("student")} className="px-3 py-2 bg-indigo-600 text-white rounded">Invite Student</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
//                 <MetricCard title="Attendance (Avg)" value="86%" icon={<FiTrendingUp />} color="bg-green-50 text-green-700" />
//                 <MetricCard title="Avg Quiz Score" value="78%" icon={<FiActivity />} color="bg-yellow-50 text-yellow-700" />
//                 <MetricCard title="Active Sessions (wk)" value="14" icon={<FiBarChart2 />} color="bg-indigo-50 text-indigo-700" />
//                 <MetricCard title="Badges Awarded" value="42" icon={<FiSmile />} color="bg-pink-50 text-pink-700" />
//             </div>
//         </div>
//     );
// }

// const MetricCard = ({ title, value, icon, color }) => (
//     <div className="p-4 bg-white rounded-lg border shadow-sm flex items-center justify-between">
//         <div>
//             <p className="text-sm text-gray-500">{title}</p>
//             <p className="text-2xl font-bold">{value}</p>
//         </div>
//         <div className={`p-3 rounded-full ${color ?? "bg-indigo-50 text-indigo-700"}`}>
//             {icon}
//         </div>
//     </div>
// );

// function RegisterOrganization() {
//     const [orgData, setOrgData] = useState({ name: "Future Academy", email: "admin@future.edu", address: "123 Learning Lane" });
//     const [isSaved, setIsSaved] = useState(false);

//     const handleChange = (e) => {
//         setOrgData({ ...orgData, [e.target.name]: e.target.value });
//         setIsSaved(false);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // backend required: PUT /org/details
//         setIsSaved(true);
//         setTimeout(() => setIsSaved(false), 3000);
//     };

//     return (
//         <div className="max-w-2xl">
//             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-700"><FiClipboard /> Organization Details Setup</h2>
//             <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white border rounded-lg">
//                 <label className="block">
//                     <span className="text-gray-700 font-medium">Organization Name</span>
//                     <input type="text" name="name" value={orgData.name} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-lg" />
//                 </label>
//                 <label className="block">
//                     <span className="text-gray-700 font-medium">Admin Email</span>
//                     <input type="email" name="email" value={orgData.email} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-lg" />
//                 </label>
//                 <label className="block">
//                     <span className="text-gray-700 font-medium">Physical Address</span>
//                     <input type="text" name="address" value={orgData.address} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" />
//                 </label>

//                 <button type="submit" className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg">Save Details</button>

//                 {isSaved && <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-2 mt-2"><FiCheckCircle /> Details successfully updated!</p>}
//             </form>
//         </div>
//     );
// }

// function GenerateOrgCode({ orgCode, generateCode }) {
//     return (
//         <div className="max-w-xl space-y-6">
//             <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-700"><FiHash /> Unique Organization Invitation Code</h2>
//             <p className="text-gray-600">Share this code with teachers or students so they can register under your organization.</p>

//             <div className="flex items-center space-x-4">
//                 <div className="p-4 flex-1 bg-purple-100 border-2 border-purple-300 rounded-lg font-extrabold text-2xl text-purple-700 tracking-widest text-center">
//                     {orgCode}
//                 </div>
//                 <div className="flex flex-col gap-2">
//                     <button onClick={generateCode} className="p-3 bg-purple-600 text-white rounded-lg">Generate New</button>
//                     <button onClick={() => { try { navigator.clipboard.writeText(orgCode); } catch (e) { } }} className="p-3 bg-white border rounded-lg">Copy</button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function TeacherManagementV2({ teachers, setTeachers, removeTeacher, viewTeacherDetails, openInvite }) {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");

//     const addTeacher = (e) => {
//         e.preventDefault();
//         // backend required: POST /teachers
//         const newId = Math.max(0, ...teachers.map(t => t.id)) + 1;
//         const newTeacher = { id: newId, name, email, status: "Active", sessions: 0, reactions: 0, doubts: 0 };
//         setTeachers(prev => [newTeacher, ...prev]);
//         setName(""); setEmail("");
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-purple-700"><FiUsers /> Manage Teachers ({teachers.length})</h2>
//                 <div className="flex gap-2">
//                     <button onClick={() => openInvite("teacher")} className="px-3 py-2 bg-pink-600 text-white rounded">Invite</button>
//                 </div>
//             </div>

//             <form onSubmit={addTeacher} className="flex gap-3 flex-wrap items-end bg-white p-4 rounded border">
//                 <input value={name} onChange={e => setName(e.target.value)} placeholder="Teacher Name" className="p-2 border rounded flex-1 min-w-[180px]" required />
//                 <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Teacher Email" className="p-2 border rounded flex-1 min-w-[220px]" required />
//                 <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-1"><FiPlusCircle /> Add</button>
//             </form>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {teachers.map(teacher => (
//                     <div key={teacher.id} className="p-4 bg-gray-50 border rounded-lg flex items-center justify-between">
//                         <div>
//                             <div className="font-semibold">{teacher.name}</div>
//                             <div className="text-sm text-gray-500">{teacher.email}</div>
//                             <div className="text-xs mt-1">Sessions: <span className="font-medium">{teacher.sessions}</span></div>
//                         </div>

//                         <div className="flex items-center gap-2">
//                             <button onClick={() => viewTeacherDetails(teacher)} className="px-3 py-2 bg-white border rounded">View</button>
//                             <button onClick={() => removeTeacher(teacher.id)} className="p-2 bg-red-100 text-red-600 rounded-full"><FiTrash2 /></button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// function StudentManagementV2({ students, removeStudent, viewStudentDetails, openInvite }) {
//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-purple-700"><FiUsers /> Manage Students ({students.length})</h2>
//                 <div className="flex gap-2">
//                     <button onClick={() => openInvite("student")} className="px-3 py-2 bg-indigo-600 text-white rounded">Invite</button>
//                 </div>
//             </div>

//             <div className="overflow-auto">
//                 <table className="min-w-full bg-white border rounded">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="p-3 text-left">ID</th>
//                             <th className="p-3 text-left">Name</th>
//                             <th className="p-3 text-left">Email</th>
//                             <th className="p-3 text-left">Courses</th>
//                             <th className="p-3 text-right">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {students.map(student => (
//                             <tr key={student.id} className="border-b hover:bg-gray-50">
//                                 <td className="p-3">{student.id}</td>
//                                 <td className="p-3">{student.name}</td>
//                                 <td className="p-3">{student.email}</td>
//                                 <td className="p-3">{student.enrolled}</td>
//                                 <td className="p-3 text-right">
//                                     <div className="flex items-center justify-end gap-2">
//                                         <button onClick={() => viewStudentDetails(student)} className="px-3 py-1 bg-white border rounded">View</button>
//                                         <button onClick={() => removeStudent(student.id)} className="p-2 bg-red-100 text-red-600 rounded-full"><FiTrash2 /></button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// function OrgAnalyticsV2({ analyticsData, analyticsRange, setAnalyticsRange, teachers, students, courses }) {
//     const topTeacher = teachers.reduce((a, b) => (b.sessions > (a.sessions || 0) ? b : a), {});
//     const topCourse = courses.reduce((a, b) => (b.students > (a.students || 0) ? b : a), {});
//     const avgAttendance = Math.round(students.reduce((s, st) => s + (st.attendance || 0), 0) / Math.max(1, students.length));

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-purple-700"><FiBarChart2 /> Organization Analytics</h2>
//                 <div className="flex items-center gap-2">
//                     <select value={analyticsRange} onChange={e => setAnalyticsRange(e.target.value)} className="p-2 border rounded">
//                         <option value="7d">Last 7 days</option>
//                         <option value="30d">Last 30 days</option>
//                         <option value="365d">Last 12 months</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="p-4 bg-white border rounded-lg">
//                     <p className="text-sm text-gray-500">Top Teacher (by sessions)</p>
//                     <p className="font-bold text-lg mt-2">{topTeacher.name ?? "—"}</p>
//                     <p className="text-sm text-gray-500 mt-1">{topTeacher.sessions ?? 0} sessions</p>
//                 </div>
//                 <div className="p-4 bg-white border rounded-lg">
//                     <p className="text-sm text-gray-500">Top Course</p>
//                     <p className="font-bold text-lg mt-2">{topCourse.title ?? "—"}</p>
//                     <p className="text-sm text-gray-500 mt-1">{topCourse.students ?? 0} students</p>
//                 </div>
//                 <div className="p-4 bg-white border rounded-lg">
//                     <p className="text-sm text-gray-500">Avg Attendance</p>
//                     <p className="font-bold text-lg mt-2">{avgAttendance}%</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <TrendCard title="Attendance Trend" data={analyticsData.attendanceTrend} />
//                 <TrendCard title="Quiz Attempts Trend" data={analyticsData.quizTrend} />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="p-4 bg-white border rounded-lg">
//                     <p className="text-sm text-gray-500">Total Teachers</p>
//                     <p className="font-bold text-2xl mt-2">{teachers.length}</p>
//                 </div>
//                 <div className="p-4 bg-white border rounded-lg">
//                     <p className="text-sm text-gray-500">Total Students</p>
//                     <p className="font-bold text-2xl mt-2">{students.length}</p>
//                 </div>
//                 <div className="p-4 bg-white border rounded-lg">
//                     <p className="text-sm text-gray-500">Total Courses</p>
//                     <p className="font-bold text-2xl mt-2">{courses.length}</p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// /* Tiny CSS-only sparkline for trends (SVG polyline) */
// function TrendCard({ title, data }) {
//     const max = Math.max(...data, 1);
//     const points = data.map((v, i) => `${(i / (data.length - 1 || 1)) * 100},${100 - (v / max * 100)}`).join(" ");
//     return (
//         <div className="p-4 bg-white border rounded-lg">
//             <p className="text-sm text-gray-500">{title}</p>
//             <div className="mt-3">
//                 <svg viewBox="0 0 100 100" className="w-full h-28">
//                     <polyline fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" points={points} />
//                     <polyline fill="rgba(124,58,237,0.08)" stroke="none" points={`${points} 100,100 0,100`} />
//                 </svg>
//             </div>
//             <div className="mt-2 text-sm text-gray-500">Showing last {data.length} points</div>
//         </div>
//     );
// }

// /* =========================
//    END OF FILE
//    ========================= */

// /*
// HOW TO USE:
// - Paste file as src/components/OrganizationDashboard.jsx
// - Ensure Tailwind CSS is configured in your project
// - Import and use <OrganizationDashboard /> in App.js or route

// NEXT STEPS I CAN DO (tell me which):
// - Split into separate component files (recommended)
// - Add axios + real API integration (I will scaffold api/organizationAPI.js)
// - Provide a sample Node/Express backend (endpoints + file upload)
// - Add authentication + JWT flow
// */
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
    FiX
} from "react-icons/fi";

import Overview from "./components/Overview";
import Analytics from "./components/Analytics";
import TeacherManagement from "./components/TeacherManagement";
import StudentManagement from "./components/StudentManagement";
import StudentModal from "./components/StudentModal";
import TeacherModal from "./components/TeacherModal";

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
    { id: 1, name: "Dr. Anya Sharma", email: "a.sharma@edu.in", status: "Active", sessions: 45, reactions: 200, doubts: 50 },
    { id: 2, name: "Mr. Rajeev Varma", email: "r.varma@edu.in", status: "Inactive", sessions: 12, reactions: 50, doubts: 10 },
    { id: 3, name: "Ms. Leela Krishnan", email: "l.krishnan@edu.in", status: "Active", sessions: 60, reactions: 320, doubts: 80 },
];

const initialStudents = [
    { id: 101, name: "Priya Singh", email: "priya@mail.com", enrolled: 3, attendance: 92, streak: 15, quizzes: [{ title: "Physics", score: 85 }, { title: "Math", score: 72 }], badges: ["Top Learner", "Math Whiz"] },
    { id: 102, name: "Rohan Patel", email: "rohan@mail.com", enrolled: 2, attendance: 78, streak: 5, quizzes: [{ title: "History", score: 65 }, { title: "Geography", score: 88 }], badges: ["Rising Star"] },
    { id: 103, name: "Amit Kumar", email: "amit@mail.com", enrolled: 4, attendance: 85, streak: 10, quizzes: [{ title: "Chem", score: 95 }, { title: "Bio", score: 78 }], badges: ["Science Ace"] },
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
    const [tab, setTab] = useState(() => load("org_dashboard_tab", "overview"));
    const [teachers, setTeachers] = useState(() => load("teachers_data", initialTeachers));
    const [students, setStudents] = useState(() => load("students_data", initialStudents));
    const [courses] = useState(initialCourses);
    const [analyticsData] = useState(initialAnalyticsData);

    const [analyticsRange, setAnalyticsRange] = useState("7d");

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // MOBILE SIDEBAR STATE
    const [mobileMenu, setMobileMenu] = useState(false);

    // ORGANIZATION LOGO (persisted in localStorage)
    const [orgLogo, setOrgLogo] = useState(() => load("org_logo", DEFAULT_ORG_LOGO));

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
                return <Overview {...commonProps} />;
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

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* MOBILE TOP BAR */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white shadow flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => openDpModal()} className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-600 flex-shrink-0">
                        <img src={orgLogo || DEFAULT_ORG_LOGO} alt="Org" className="w-full h-full object-cover" />
                    </button>

                    <h1 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                        <FiBriefcase /> {organizationName}
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
                        <button onClick={openDpModal} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                            <img src={orgLogo || DEFAULT_ORG_LOGO} alt="Org" className="w-full h-full object-cover" />
                        </button>
                        <h1 className="text-2xl font-bold">{organizationName}</h1>
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

                    <button className="w-full flex items-center gap-3 p-3 mt-2 text-red-300 hover:bg-white/5 rounded-lg font-medium transition-colors">
                        <FiLogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* DESKTOP SIDEBAR */}
            <div className="hidden lg:flex w-64 bg-gradient-to-b from-purple-800 to-purple-700 text-white shadow-xl z-30 flex-col h-screen sticky top-0">
                <div className="p-6 h-20 flex items-center gap-3 border-b border-white/10">

                    <button onClick={openDpModal} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                        <img src={orgLogo || DEFAULT_ORG_LOGO} alt="Org" className="w-full h-full object-cover" />
                    </button>

                    <div>
                        <h1 className="text-xl font-extrabold">
                            {organizationName}
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

                    <button className="w-full flex items-center gap-3 p-3 mt-2 text-red-300 hover:bg-white/5 rounded-lg font-medium transition-colors">
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
                        <div className="text-sm text-gray-500">{organizationName}</div>
                        <button onClick={openDpModal} className="w-10 h-10 rounded-full overflow-hidden border shadow">
                            <img src={orgLogo || DEFAULT_ORG_LOGO} alt="Org" className="w-full h-full object-cover" />
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
                            <button onClick={cancelDp} className="text-gray-600 hover:text-black">
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
                                This photo will be used across the dashboard (sidebar, top bar, mobile).
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
    );
}
