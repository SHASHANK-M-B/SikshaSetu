// // TeacherDashboard.jsx
// // Full single-file Teacher Dashboard (Hybrid: localStorage now + backend placeholders)
// // Features included (local simulation + TODO backend hooks):
// // 1. Login/Signup (Org code or invite)
// // 2. Course & Class Management (create/edit/delete courses & class sessions)
// // 3. Content Upload + Auto Compression (PPT/PDF slides, audio -> ~16kbps simulation, video -> 360/480p simulation)
// // 4. Upload Recorded Lecture (attach slides, compressed & bundled)
// // 5. AI Video Generation Redirect (button with placeholder flow)
// // 6. Live Audio Class (low bandwidth simulated)
// // 7. Live Slide Push / Sync (broadcast slideIndex via window events)
// // 8. Quizzes & Polls (create MCQs, polls, push during live class, offline mode supported)
// // 9. View Quiz Responses & Engagement (class-level results)
// // 10. Discussion & Doubt Handling (post & reply; offline sync simulation)
// // 11. Live Reactions Dashboard (Understood / Doubt)
// // 12. Teacher Analytics + Charts (sessions, attendance, engagement)
// //
// // NOTE: No backend currently. Replace TODO comments with API calls to integrate with your backend.
// // The code uses localStorage for persistence and window CustomEvents to simulate real-time broadcasts.

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import {
//     FiUpload,
//     FiUsers,
//     FiPlus,
//     FiMic,
//     FiBarChart2,
//     FiFileText,
//     FiSend,
//     FiBook,
//     FiGrid,
//     FiChevronsRight,
//     FiChevronsLeft,
//     FiTrendingUp,
//     FiMail,
//     FiCopy,
//     FiMenu,
//     FiX,
//     FiClock,
//     FiChevronLeft,
//     FiChevronRight,
//     FiZap,
//     FiVideo,
//     FiPlay,
//     FiMessageCircle,
//     FiAlertCircle,
// } from "react-icons/fi";

// import { motion, AnimatePresence } from "framer-motion";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
// import { Bar, Pie } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// // ---------- simple storage helpers ----------
// const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
// const load = (k, fallback) => {
//     try {
//         const raw = localStorage.getItem(k);
//         return raw ? JSON.parse(raw) : fallback;
//     } catch {
//         return fallback;
//     }
// };

// // ---------- tiny utils ----------
// const uid = (prefix = "") => prefix + Math.random().toString(36).slice(2, 9);
// const prettySize = (bytes) => {
//     if (!bytes) return "0 B";
//     const units = ["B", "KB", "MB", "GB"];
//     let i = 0;
//     let b = bytes;
//     while (b >= 1024 && i < units.length - 1) {
//         b /= 1024;
//         i++;
//     }
//     return `${b.toFixed(2)} ${units[i]}`;
// };

// // ---------- top-level export ----------
// export default function TeacherDashboard() {
//     // UI / routing state
//     const [active, setActive] = useState("overview");
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//     const user = {
//         name: "Demo Teacher",
//         initials: "DT",
//         subject: "Science"
//     };

//     // main content
//     const content = useMemo(() => {
//         switch (active) {
//             case "overview":
//                 return <Overview user={user} />;
//             case "courses":
//                 return <CourseManager user={user} />;
//             case "classes":
//                 return <ClassManager user={user} />;
//             case "uploads":
//                 return <ContentUpload user={user} />;
//             case "recorded":
//                 return <RecordedLectures user={user} />;
//             case "ai":
//                 return <AIStudioRedirect />;
//             case "liveAudio":
//                 return <LiveAudio user={user} />;
//             case "liveSlides":
//                 return <LiveSlides user={user} />;
//             case "quizzes":
//                 return <QuizManager user={user} />;
//             case "responses":
//                 return <QuizResponses user={user} />;
//             case "discussion":
//                 return <DiscussionDoubts user={user} />;
//             case "reactions":
//                 return <LiveReactionsDashboard user={user} />;
//             case "analytics":
//                 return <TeacherAnalytics user={user} />;
//             default:
//                 return <Overview user={user} />;
//         }
//     }, [active, user]);

//     return (
//         <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-indigo-50">
//             {/* Sidebar - desktop */}
//             <aside
//                 className={`hidden md:flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "w-72" : "w-20"
//                     } bg-[rgba(40,43,252,0.64)] backdrop-blur-lg border-r border-white/6 shadow-lg`}
//             >
//                 <div className="p-4 flex items-center justify-between h-20">
//                     {sidebarOpen ? (
//                         <div className="flex items-center gap-3">
//                             <div>
//                                 <div className="text-lg font-extrabold text-white">EduDash</div>
//                                 <div className="text-xs text-white/70">Teacher Console</div>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="w-full flex items-center justify-center"></div>
//                     )}
//                     <button
//                         onClick={() => setSidebarOpen((s) => !s)}
//                         className="p-2 rounded-lg bg-white/8 hover:bg-white/12"
//                         aria-label="Toggle sidebar"
//                     >
//                         {sidebarOpen ? <FiChevronsLeft className="text-white" /> : <FiChevronsRight className="text-white" />}
//                     </button>
//                 </div>

//                 <nav className="flex-1 p-3 space-y-2 overflow-auto">
//                     <NavButton label="Overview" icon={FiGrid} onClick={() => setActive("overview")} active={active === "overview"} collapsed={!sidebarOpen} />
//                     <NavButton label="Courses" icon={FiBook} onClick={() => setActive("courses")} active={active === "courses"} collapsed={!sidebarOpen} />
//                     <NavButton label="Classes" icon={FiUsers} onClick={() => setActive("classes")} active={active === "classes"} collapsed={!sidebarOpen} />
//                     <NavButton label="Uploads" icon={FiUpload} onClick={() => setActive("uploads")} active={active === "uploads"} collapsed={!sidebarOpen} />
//                     <NavButton label="Recorded" icon={FiVideo} onClick={() => setActive("recorded")} active={active === "recorded"} collapsed={!sidebarOpen} />
//                     <NavButton label="AI Studio" icon={FiZap} onClick={() => setActive("ai")} active={active === "ai"} collapsed={!sidebarOpen} />
//                     <div className="border-t border-white/6 pt-3"></div>
//                     <NavButton label="Start Live Audio" icon={FiMic} onClick={() => setActive("liveAudio")} active={active === "liveAudio"} collapsed={!sidebarOpen} />
//                     <NavButton label="Live Slides" icon={FiSend} onClick={() => setActive("liveSlides")} active={active === "liveSlides"} collapsed={!sidebarOpen} />
//                     <NavButton label="Quizzes" icon={FiPlus} onClick={() => setActive("quizzes")} active={active === "quizzes"} collapsed={!sidebarOpen} />
//                     <NavButton label="Responses" icon={FiFileText} onClick={() => setActive("responses")} active={active === "responses"} collapsed={!sidebarOpen} />
//                     <NavButton label="Discussions" icon={FiMessageCircle} onClick={() => setActive("discussion")} active={active === "discussion"} collapsed={!sidebarOpen} />
//                     <NavButton label="Reactions" icon={FiAlertCircle} onClick={() => setActive("reactions")} active={active === "reactions"} collapsed={!sidebarOpen} />
//                     <NavButton label="Analytics" icon={FiBarChart2} onClick={() => setActive("analytics")} active={active === "analytics"} collapsed={!sidebarOpen} />
//                 </nav>

//                 <div className="p-4 border-t border-white/6">
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center text-white font-semibold">
//                             {user.initials}
//                         </div>
//                         {sidebarOpen && (
//                             <div className="flex-1">
//                                 <div className="text-sm font-medium text-white">{user.name}</div>
//                                 <div className="text-xs text-white/60">{user.subject || "—"}</div>
//                             </div>
//                         )}
//                         <button
//                             className="p-2 rounded-lg bg-white/6 hover:bg-white/10 text-white"
//                             onClick={() => {
//                                 if (confirm("Logout?")) {
//                                     localStorage.removeItem("edu_user");
//                                     window.location.reload();
//                                 }
//                             }}
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </aside>

//             {/* Mobile Header / Drawer */}
//             <div className="md:hidden fixed top-4 right-4 z-40">
//                 <button className="p-2 rounded-lg bg-black/10 text-black" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
//                     <FiMenu />
//                 </button>
//             </div>

//             <AnimatePresence>
//                 {mobileMenuOpen && (
//                     <motion.aside
//                         initial={{ x: 300 }}
//                         animate={{ x: 0 }}
//                         exit={{ x: 300 }}
//                         transition={{ type: "spring", bounce: 0.12 }}
//                         className="md:hidden fixed inset-y-0 right-0 w-72 bg-[rgba(48,34,243,0.79)] backdrop-blur-lg z-50 shadow-2xl p-4"
//                     >
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center gap-2">
//                                 <div className="text-white font-bold">EduDash</div>
//                             </div>

//                             <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-white/10 text-white">
//                                 <FiX />
//                             </button>
//                         </div>

//                         <nav className="space-y-2">
//                             <NavButtonMobile label="Overview" icon={FiGrid} onClick={() => { setActive("overview"); setMobileMenuOpen(false); }} />
//                             <NavButtonMobile label="Courses" icon={FiBook} onClick={() => { setActive("courses"); setMobileMenuOpen(false); }} />
//                             <NavButtonMobile label="Classes" icon={FiUsers} onClick={() => { setActive("classes"); setMobileMenuOpen(false); }} />
//                             <NavButtonMobile label="Uploads" icon={FiUpload} onClick={() => { setActive("uploads"); setMobileMenuOpen(false); }} />
//                             <NavButtonMobile label="Recorded" icon={FiVideo} onClick={() => { setActive("recorded"); setMobileMenuOpen(false); }} />
//                             <NavButtonMobile label="AI Studio" icon={FiZap} onClick={() => { setActive("ai"); setMobileMenuOpen(false); }} />
//                             <NavButtonMobile label="Live Audio" icon={FiMic} onClick={() => { setActive("liveAudio"); setMobileMenuOpen(false); }} />
//                             <NavButtonMobile label="Live Slides" icon={FiSend} onClick={() => { setActive("liveSlides"); setMobileMenuOpen(false); }} />
//                             <NavButtonMobile label="Quizzes" icon={FiPlus} onClick={() => { setActive("quizzes"); setMobileMenuOpen(false); }} />
//                         </nav>
//                     </motion.aside>
//                 )}
//             </AnimatePresence>

//             {/* Main Content */}
//             <main className="flex-1 p-4 md:p-8">
//                 <header className="flex items-center justify-between gap-4 mb-6">
//                     <div>
//                         <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 capitalize">{active.replace(/([A-Z])/g, " $1")}</h1>
//                         <p className="text-sm text-slate-600 hidden md:block">Your modern glass-powered teacher hub — responsive & fast.</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <div className="hidden sm:flex items-center gap-2 p-2 bg-white rounded-full shadow">
//                             <FiMail className="text-slate-500" />
//                         </div>
//                         <div className="hidden sm:flex items-center gap-3">
//                             <div className="text-sm font-medium text-slate-700">{user.name}</div>
//                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 grid place-items-center text-white font-semibold">{user.initials}</div>
//                         </div>
//                     </div>
//                 </header>

//                 <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl min-h-[60vh] border border-white/20">
//                     {content}
//                 </section>
//             </main>
//         </div>
//     );
// }

// // ===========================
// // ===== Subcomponents =======
// // ===========================


// // ---------- Nav Buttons ----------
// function NavButton({ label, icon: Icon, onClick, active, collapsed }) {
//     return (
//         <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${active ? "bg-white/8 ring-1 ring-white/20" : "hover:bg-white/6"}`}>
//             <Icon className="text-white/90" />
//             {!collapsed && <span className="text-white text-sm font-medium">{label}</span>}
//         </button>
//     );
// }
// function NavButtonMobile({ label, icon: Icon, onClick }) {
//     return (
//         <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/4 text-white hover:bg-white/8">
//             <Icon />
//             <span className="font-medium">{label}</span>
//         </button>
//     );
// }

// // ===========================
// // ===== Overview Tab ========
// // ===========================
// function Overview({ user }) {
//     const courses = load("edu_courses", [
//         { id: "c1", name: "Physics 101", students: 42 },
//         { id: "c2", name: "Chemistry 302", students: 54 },
//         { id: "c3", name: "CS 101", students: 30 },
//     ]);

//     const totalStudents = courses.reduce((s, c) => s + (c.students || 0), 0);
//     const avgScore = load("edu_avg_score", 82.5);
//     const sessions = load("edu_sessions", []);

//     return (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <GlassStat title="Total Students" value={totalStudents} icon={<FiUsers />} gradient="from-green-100 to-green-200" />
//                 <GlassStat title="Active Courses" value={courses.length} icon={<FiBook />} gradient="from-yellow-100 to-yellow-200" />
//                 <GlassStat title="Avg. Quiz Score" value={`${avgScore}%`} icon={<FiTrendingUp />} gradient="from-violet-100 to-violet-200" />
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                 <div className="lg:col-span-2 bg-white/60 p-4 rounded-xl shadow-sm border border-white/30">
//                     <h3 className="font-semibold mb-3">Recent Activity</h3>
//                     <ul className="space-y-3">
//                         <li className="p-3 rounded-lg bg-white/30 flex justify-between items-center">
//                             <div>
//                                 <div className="font-medium">Quiz: Thermodynamics Chapter 3</div>
//                                 <div className="text-sm text-slate-600">Responses incoming</div>
//                             </div>
//                             <div className="text-sm text-slate-500">2 hours left</div>
//                         </li>
//                         <li className="p-3 rounded-lg bg-white/30 flex justify-between items-center">
//                             <div>
//                                 <div className="font-medium">Live Audio: Quantum Physics</div>
//                                 <div className="text-sm text-slate-600">Prepare slides</div>
//                             </div>
//                             <div className="text-sm text-slate-500">Today, 3:00 PM</div>
//                         </li>
//                     </ul>
//                 </div>

//                 <div className="bg-white/60 p-4 rounded-xl shadow-sm border border-white/30">
//                     <h3 className="font-semibold mb-3">Quick Actions</h3>
//                     <div className="flex flex-col gap-2">
//                         <ActionButton label="Start Live Audio" onClick={() => window.dispatchEvent(new CustomEvent("edu_start_audio"))} bg="bg-green-600" />
//                         <ActionButton label="Push Slide" onClick={() => window.dispatchEvent(new CustomEvent("edu_push_slide"))} bg="bg-purple-600" />
//                         <ActionButton label="Create Quiz" onClick={() => window.dispatchEvent(new CustomEvent("edu_open_quiz"))} bg="bg-indigo-600" />
//                     </div>
//                 </div>
//             </div>

//             <div className="p-4 bg-white/30 rounded-xl border-l-4 border-indigo-400">
//                 <div className="font-semibold">Sessions Overview</div>
//                 <div className="text-sm text-slate-600">{sessions.length} sessions conducted (local demo)</div>
//             </div>
//         </div>
//     );
// }
// function GlassStat({ title, value, icon, gradient }) {
//     return (
//         <div className={`p-4 rounded-xl shadow-md bg-gradient-to-br ${gradient} border border-white/20`}>
//             <div className="flex items-center justify-between">
//                 <div className="text-sm text-slate-700">{title}</div>
//                 <div className="text-xl">{icon}</div>
//             </div>
//             <div className="mt-3 text-3xl font-bold text-slate-800">{value}</div>
//         </div>
//     );
// }
// function ActionButton({ label, onClick, bg = "bg-indigo-600" }) {
//     return (
//         <button onClick={onClick} className={`px-4 py-2 rounded-lg text-white font-medium shadow ${bg} hover:scale-[1.02] transition`}>
//             {label}
//         </button>
//     );
// }

// // ===========================
// // ===== Course Manager ======
// // ===========================
// function CourseManager({ user }) {
//     const [courses, setCourses] = useState(() => load("edu_courses", []));
//     const [form, setForm] = useState({ name: "", code: "", desc: "" });

//     useEffect(() => save("edu_courses", courses), [courses]);

//     const create = (e) => {
//         e.preventDefault();
//         if (!form.name || !form.code) return alert("Provide name & code");
//         const c = { id: uid("c_"), name: form.name, code: form.code, desc: form.desc, students: 0, mediaURL: "" };
//         setCourses((s) => [c, ...s]);
//         setForm({ name: "", code: "", desc: "" });
//         // TODO: POST /api/courses -> handle backend persistence
//     };

//     const remove = (id) => {
//         if (!confirm("Delete course?")) return;
//         setCourses((s) => s.filter((c) => c.id !== id));
//         // TODO: DELETE /api/courses/:id
//     };

//     const edit = (id) => {
//         const c = courses.find((x) => x.id === id);
//         if (!c) return;
//         const newName = prompt("Course name", c.name);
//         if (newName != null) {
//             setCourses((s) => s.map((x) => (x.id === id ? { ...x, name: newName } : x)));
//             // TODO: PUT /api/courses/:id
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto space-y-6">
//             <h3 className="font-bold text-2xl text-indigo-700 flex items-center gap-2"><FiBook /> Manage Courses</h3>

//             <form onSubmit={create} className="space-y-3 bg-white/50 p-4 rounded-xl border border-indigo-200/40">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//                     <input placeholder="Course name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="p-2 rounded border" />
//                     <input placeholder="Course code" value={form.code} onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))} className="p-2 rounded border" />
//                     <input placeholder="Short desc" value={form.desc} onChange={(e) => setForm((s) => ({ ...s, desc: e.target.value }))} className="p-2 rounded border" />
//                 </div>
//                 <div className="flex gap-2">
//                     <button className="px-4 py-2 bg-indigo-700 text-white rounded">Create</button>
//                     <button type="button" onClick={() => setForm({ name: "", code: "", desc: "" })} className="px-4 py-2 border rounded">Reset</button>
//                 </div>
//             </form>

//             <div>
//                 <h4 className="font-semibold mb-2">Your Courses</h4>
//                 <div className="grid gap-3">
//                     {courses.length === 0 && <div className="text-slate-500">No courses yet.</div>}
//                     {courses.map((c) => (
//                         <div key={c.id} className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10">
//                             <div>
//                                 <div className="font-medium">{c.name}</div>
//                                 <div className="text-xs text-slate-600">{c.code} · {c.students} students</div>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button onClick={() => edit(c.id)} className="px-3 py-1 bg-white/10 rounded">Edit</button>
//                                 <button onClick={() => remove(c.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ===========================
// // ===== Class Manager =======
// // ===========================
// function ClassManager({ user }) {
//     const [classes, setClasses] = useState(() => load("edu_class_sessions", []));
//     const [courses] = useState(() => load("edu_courses", []));
//     const [form, setForm] = useState({ courseId: courses?.[0]?.id || "", title: "", datetime: "", duration: 60 });

//     useEffect(() => save("edu_class_sessions", classes), [classes]);

//     const create = (e) => {
//         e.preventDefault();
//         if (!form.title || !form.courseId || !form.datetime) return alert("Provide title, course & datetime");
//         const s = { id: uid("s_"), ...form, teacher: user.name, createdAt: new Date().toISOString() };
//         setClasses((c) => [s, ...c]);
//         setForm({ courseId: courses?.[0]?.id || "", title: "", datetime: "", duration: 60 });
//         // TODO: POST /api/sessions
//     };

//     const remove = (id) => {
//         if (!confirm("Delete session?")) return;
//         setClasses((c) => c.filter((s) => s.id !== id));
//         // TODO: DELETE /api/sessions/:id
//     };

//     const edit = (id) => {
//         const sess = classes.find((s) => s.id === id);
//         if (!sess) return;
//         const newTitle = prompt("Session title", sess.title);
//         if (newTitle != null) setClasses((c) => c.map((x) => (x.id === id ? { ...x, title: newTitle } : x)));
//         // TODO: PUT /api/sessions/:id
//     };

//     return (
//         <div className="max-w-3xl mx-auto space-y-6">
//             <h3 className="font-bold text-2xl text-indigo-700 flex items-center gap-2"><FiUsers /> Class Sessions</h3>

//             <form onSubmit={create} className="bg-white/50 p-4 rounded-xl border border-indigo-200/40 grid grid-cols-1 md:grid-cols-2 gap-2">
//                 <select value={form.courseId} onChange={(e) => setForm((s) => ({ ...s, courseId: e.target.value }))} className="p-2 border rounded">
//                     {courses.length === 0 && <option value="">No courses</option>}
//                     {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                 </select>
//                 <input placeholder="Session title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="p-2 border rounded" />
//                 <input type="datetime-local" value={form.datetime} onChange={(e) => setForm((s) => ({ ...s, datetime: e.target.value }))} className="p-2 border rounded" />
//                 <input type="number" min={10} value={form.duration} onChange={(e) => setForm((s) => ({ ...s, duration: Number(e.target.value) }))} className="p-2 border rounded" />
//                 <div className="col-span-full flex gap-2">
//                     <button className="px-4 py-2 bg-indigo-700 text-white rounded">Create Session</button>
//                     <button type="button" onClick={() => setForm({ courseId: courses?.[0]?.id || "", title: "", datetime: "", duration: 60 })} className="px-4 py-2 border rounded">Reset</button>
//                 </div>
//             </form>

//             <div>
//                 <h4 className="font-semibold mb-2">Upcoming Sessions</h4>
//                 <div className="space-y-2">
//                     {classes.length === 0 && <div className="text-slate-500">No sessions scheduled.</div>}
//                     {classes.map((s) => (
//                         <div key={s.id} className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10">
//                             <div>
//                                 <div className="font-medium">{s.title}</div>
//                                 <div className="text-xs text-slate-600">{new Date(s.datetime).toLocaleString()} · {s.duration} mins</div>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button onClick={() => edit(s.id)} className="px-3 py-1 bg-white/10 rounded">Edit</button>
//                                 <button onClick={() => remove(s.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ===========================
// // ===== Content Upload ======
// // ===========================
// function ContentUpload() {
//     const [file, setFile] = useState(null);
//     const [progress, setProgress] = useState(0);
//     const [uploads, setUploads] = useState(() => load("edu_uploads", []));

//     useEffect(() => save("edu_uploads", uploads), [uploads]);

//     const simulateCompression = (file) => {
//         // naive compression simulation: certain rules by type
//         const original = file.size;
//         let compressed = Math.round(original * 0.45);
//         if (file.type.startsWith("audio/")) {
//             // compress heavily to simulate 16 kbps mono (this is only simulation)
//             compressed = Math.max(1024 * 32, Math.round(original * 0.18));
//         }
//         if (file.type === "application/pdf" || file.name.endsWith(".ppt") || file.name.endsWith(".pptx")) {
//             compressed = Math.max(1024 * 50, Math.round(original * 0.6));
//         }
//         // for video, simulate 360p/480p by limiting to 2-8MB
//         if (file.type.startsWith("video/")) compressed = Math.min(compressed, 8 * 1024 * 1024);

//         return { original, compressed };
//     };

//     const startUpload = (e) => {
//         e.preventDefault();
//         if (!file) return alert("Pick a file");
//         setProgress(2);
//         const { original, compressed } = simulateCompression(file);
//         let p = 2;
//         const id = setInterval(() => {
//             p += Math.random() * 18;
//             setProgress(Math.min(100, Math.floor(p)));
//             if (p >= 100) {
//                 clearInterval(id);
//                 const item = { id: uid("u_"), name: file.name, original, compressed, type: file.type, at: new Date().toISOString() };
//                 setUploads((u) => [item, ...u]);
//                 setFile(null);
//                 setProgress(0);
//                 alert(`Uploaded & compressed: ${item.name}`);
//                 // TODO: Upload file to backend storage and send metadata to DB
//             }
//         }, 300);
//     };

//     return (
//         <div className="max-w-3xl">
//             <h3 className="font-bold text-lg mb-3">Upload content (auto-compress)</h3>
//             <form onSubmit={startUpload} className="space-y-3 bg-white/50 p-4 rounded-xl border border-white/20">
//                 <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
//                 <div className="flex gap-2">
//                     <button className="px-4 py-2 bg-indigo-700 text-white rounded-lg" disabled={!file}>Start Upload & Compress</button>
//                     <button type="button" onClick={() => setFile(null)} className="px-4 py-2 border rounded-lg">Clear</button>
//                 </div>

//                 {progress > 0 && (
//                     <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
//                         <div style={{ width: `${progress}%` }} className="h-3 bg-indigo-600 transition-all" />
//                     </div>
//                 )}
//             </form>

//             <div className="mt-4">
//                 <h4 className="font-semibold mb-2">Recent uploads</h4>
//                 <ul className="space-y-2">
//                     {uploads.length === 0 && <div className="text-slate-500">No uploads yet.</div>}
//                     {uploads.map((u) => (
//                         <li key={u.id} className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10">
//                             <div>
//                                 <div className="font-medium">{u.name}</div>
//                                 <div className="text-xs text-slate-600">Original: {prettySize(u.original)} · Compressed: {prettySize(u.compressed)}</div>
//                             </div>
//                             <div className="text-xs text-slate-500">{new Date(u.at).toLocaleString()}</div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// // ===========================
// // === Recorded Lectures =====
// // ===========================
// function RecordedLectures() {
//     const [file, setFile] = useState(null);
//     const [slidesFile, setSlidesFile] = useState(null);
//     const [lectures, setLectures] = useState(() => load("edu_recorded_lectures", []));

//     useEffect(() => save("edu_recorded_lectures", lectures), [lectures]);

//     const uploadLecture = (e) => {
//         e.preventDefault();
//         if (!file) return alert("Pick audio/video file");
//         // simulate compression + bundle creation
//         const original = file.size;
//         const compressed = file.type.startsWith("audio/") ? Math.round(original * 0.18) : Math.min(Math.round(original * 0.5), 6 * 1024 * 1024);
//         const item = {
//             id: uid("lec_"),
//             name: file.name,
//             slidesName: slidesFile?.name || null,
//             original,
//             compressed,
//             at: new Date().toISOString(),
//         };
//         setLectures((l) => [item, ...l]);
//         setFile(null);
//         setSlidesFile(null);
//         alert(`Lecture uploaded & added to bundle: ${item.name}`);
//         // TODO: Upload lecture file + slides to cloud storage; persist metadata to DB
//     };

//     return (
//         <div className="max-w-3xl">
//             <h3 className="font-bold text-lg mb-3">Upload Recorded Lecture</h3>
//             <form onSubmit={uploadLecture} className="bg-white/50 p-4 rounded-xl border border-white/20 space-y-3">
//                 <div className="flex gap-2">
//                     <input type="file" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
//                     <input type="file" accept="application/pdf,.ppt,.pptx" onChange={(e) => setSlidesFile(e.target.files?.[0] ?? null)} />
//                 </div>
//                 <div className="flex gap-2">
//                     <button className="px-4 py-2 bg-indigo-700 text-white rounded" disabled={!file}>Upload Lecture</button>
//                     <button type="button" onClick={() => { setFile(null); setSlidesFile(null); }} className="px-4 py-2 border rounded">Clear</button>
//                 </div>
//             </form>

//             <div className="mt-4">
//                 <h4 className="font-semibold mb-2">Lecture Bundles</h4>
//                 <div className="space-y-2">
//                     {lectures.length === 0 && <div className="text-slate-500">No recorded lectures yet.</div>}
//                     {lectures.map((l) => (
//                         <div key={l.id} className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10">
//                             <div>
//                                 <div className="font-medium">{l.name}</div>
//                                 <div className="text-xs text-slate-600">Slides: {l.slidesName ?? "None"}</div>
//                             </div>
//                             <div className="text-xs text-slate-500">{new Date(l.at).toLocaleString()}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ===========================
// // ==== AI Studio Redirect ====
// // ===========================
// function AIStudioRedirect() {
//     const [prompt, setPrompt] = useState("");
//     const [externalURL, setExternalURL] = useState("");

//     const generate = (e) => {
//         e.preventDefault();
//         if (!prompt) return alert("Give a short prompt for AI video");
//         // In production: redirect to external AI video creator with prefilled prompt
//         // For demo: open new tab with placeholder
//         const url = `https://example-ai-video-studio.com/create?prompt=${encodeURIComponent(prompt)}`;
//         setExternalURL(url);
//         window.open(url, "_blank");
//         // TODO: Integrate with real AI video studio or your backend to create video programmatically
//     };

//     return (
//         <div className="max-w-2xl">
//             <h3 className="font-bold text-lg mb-3">AI Video Studio (redirect)</h3>
//             <p className="text-sm text-slate-600 mb-2">Click Generate to open external AI video creator. Teacher should download the produced video then upload to Recorded Lectures for compression.</p>
//             <form onSubmit={generate} className="space-y-3">
//                 <textarea placeholder="Short video prompt: e.g., 'Explain Newton's 2nd law with examples'." value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="w-full p-3 border rounded" />
//                 <div className="flex gap-2">
//                     <button className="px-4 py-2 bg-indigo-700 text-white rounded">Generate Video (Open Studio)</button>
//                     <button type="button" onClick={() => { setPrompt(""); }} className="px-4 py-2 border rounded">Reset</button>
//                 </div>
//             </form>
//             {externalURL && <div className="mt-3 text-xs text-slate-500">Opened: {externalURL}</div>}
//         </div>
//     );
// }

// // ===========================
// // ===== Live Audio =========
// // ===========================
// function LiveAudio({ user }) {
//     const [isLive, setIsLive] = useState(false);
//     const [seconds, setSeconds] = useState(0);
//     const [lowBandwidthMode, setLowBandwidthMode] = useState(true);

//     useEffect(() => {
//         let id;
//         if (isLive) id = setInterval(() => setSeconds((s) => s + 1), 1000);
//         return () => clearInterval(id);
//     }, [isLive]);

//     useEffect(() => {
//         const start = () => setIsLive(true);
//         window.addEventListener("edu_start_audio", start);
//         return () => window.removeEventListener("edu_start_audio", start);
//     }, []);

//     const toggle = () => {
//         setIsLive((s) => {
//             const next = !s;
//             alert(next ? "Live audio session started (demo)" : "Live audio session ended (demo)");
//             if (!next) setSeconds(0);
//             // TODO: Start/stop real audio broadcasting via WebRTC or low-bitrate streaming backend
//             return next;
//         });
//     };

//     const fmt = (s) => new Date(s * 1000).toISOString().substr(11, 8);

//     return (
//         <div className="max-w-md">
//             <h3 className="font-bold mb-2">Live Audio Session</h3>
//             <p className="text-sm text-slate-600 mb-3">Start an audio-only lecture optimized for low-bandwidth connections (demo simulation).</p>
//             <div className="flex gap-2 items-center mb-3">
//                 <button onClick={toggle} className={`px-4 py-2 rounded-lg font-semibold ${isLive ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>{isLive ? "End Session" : "Start Session"}</button>
//                 <div className="flex items-center gap-2">
//                     <label className="text-sm">Low bandwidth</label>
//                     <input type="checkbox" checked={lowBandwidthMode} onChange={(e) => setLowBandwidthMode(e.target.checked)} />
//                 </div>
//                 <button onClick={() => { setSeconds(0); setIsLive(false); }} className="px-3 py-1 border rounded">Reset</button>
//             </div>

//             {isLive && (
//                 <div className="mt-4 p-3 bg-white/30 rounded-lg flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-red-500 grid place-items-center text-white font-bold">●</div>
//                     <div>
//                         <div className="font-medium">LIVE</div>
//                         <div className="text-xs text-slate-600"><FiClock className="inline mr-1" /> {fmt(seconds)} · {lowBandwidthMode ? "Low-bandwidth codec (simulated)" : "Standard audio"}</div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ===========================
// // ===== Live Slides =========
// // ===========================
// function LiveSlides() {
//     // slides are stored as uploads; teacher selects a slide deck and pushes slide index to students
//     const [slidesDecks] = useState(() => load("edu_uploads", []).filter((u) => u.type === "application/pdf" || u.name.endsWith(".ppt") || u.name.endsWith(".pptx")));
//     const [selected, setSelected] = useState(slidesDecks?.[0]?.id ?? null);
//     const [slideIndex, setSlideIndex] = useState(0);
//     const [log, setLog] = useState(() => load("edu_slide_log", []));

//     useEffect(() => save("edu_slide_log", log), [log]);

//     useEffect(() => {
//         const handler = (e) => {
//             const entry = { type: "auto", at: new Date().toISOString(), reason: e?.detail?.reason ?? "external" };
//             setLog((l) => [entry, ...l]);
//             alert("Auto slide push initiated (demo)");
//         };
//         window.addEventListener("edu_push_slide", handler);
//         return () => window.removeEventListener("edu_push_slide", handler);
//     }, []);

//     const pushIndex = (idx, type = "manual") => {
//         setSlideIndex(idx);
//         const ev = new CustomEvent("edu_slide_index", { detail: { index: idx } });
//         window.dispatchEvent(ev);
//         setLog((l) => [{ type, index: idx, at: new Date().toISOString() }, ...l]);
//     };

//     const next = () => pushIndex(slideIndex + 1);
//     const prev = () => pushIndex(Math.max(0, slideIndex - 1));

//     return (
//         <div className="max-w-3xl">
//             <h3 className="font-bold mb-2">Live Slide Push</h3>
//             <p className="text-sm text-slate-600 mb-3">Synchronize slides to students by broadcasting only the slide index (very lightweight).</p>

//             <div className="flex gap-2 items-center mb-3">
//                 <select value={selected ?? ""} onChange={(e) => setSelected(e.target.value)} className="p-2 border rounded">
//                     <option value="">Choose slide deck (from uploads)</option>
//                     {slidesDecks.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//                 </select>
//                 <button onClick={() => { const ev = new CustomEvent("edu_push_slide"); window.dispatchEvent(ev); alert("Auto push triggered (demo)"); }} className="px-3 py-2 bg-purple-600 text-white rounded">Auto Push</button>
//                 <div className="ml-auto flex gap-2">
//                     <button onClick={prev} className="px-3 py-2 border rounded"><FiChevronLeft /></button>
//                     <div className="px-4 py-2 bg-white/20 rounded">Slide {slideIndex + 1}</div>
//                     <button onClick={next} className="px-3 py-2 border rounded"><FiChevronRight /></button>
//                 </div>
//             </div>

//             <div className="mt-4">
//                 <h4 className="font-semibold mb-2">Activity log</h4>
//                 <ul className="space-y-2">
//                     {log.length === 0 && <div className="text-slate-500">No pushes yet.</div>}
//                     {log.map((l, i) => (
//                         <li key={i} className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10">
//                             <div>
//                                 <div className="font-medium">{l.index != null ? `Slide ${l.index + 1}` : "Auto push"}</div>
//                                 <div className="text-xs text-slate-600">{l.type}</div>
//                             </div>
//                             <div className="text-xs text-slate-500">{new Date(l.at).toLocaleString()}</div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// // ===========================
// // ===== Quizzes & Polls =====
// // ===========================
// function QuizManager() {
//     const [title, setTitle] = useState("");
//     const [timeLimit, setTimeLimit] = useState("");
//     const [questions, setQuestions] = useState([]); // {q, options:[], correctIndex}
//     const [quizzes, setQuizzes] = useState(() => load("edu_quizzes", []));

//     useEffect(() => save("edu_quizzes", quizzes), [quizzes]);

//     const addQuestion = () => {
//         setQuestions((s) => [...s, { id: uid("qq_"), q: "", options: ["", ""], correctIndex: 0 }]);
//     };

//     const updateQuestion = (id, patch) => {
//         setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
//     };

//     const removeQuestion = (id) => setQuestions((s) => s.filter((q) => q.id !== id));

//     const publish = (e) => {
//         e.preventDefault();
//         if (!title || questions.length === 0) return alert("Title and at least 1 question required");
//         const newQuiz = { id: uid("quiz_"), title, timeLimit, questions, createdAt: new Date().toISOString() };
//         setQuizzes((s) => [newQuiz, ...s]);
//         setTitle(""); setTimeLimit(""); setQuestions([]);
//         alert("Quiz created (local)");
//         // TODO: POST /api/quizzes
//     };

//     const pushToLive = (quizId) => {
//         const ev = new CustomEvent("edu_push_quiz", { detail: { quizId } });
//         window.dispatchEvent(ev);
//         alert("Quiz pushed to live students (demo)");
//         // TODO: live push via websocket/RTC
//     };

//     return (
//         <div className="max-w-3xl">
//             <h3 className="font-bold mb-3">Create Quiz & Polls</h3>

//             <form onSubmit={publish} className="bg-white/50 p-4 rounded-xl border border-white/20 space-y-3">
//                 <input placeholder="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
//                 <input placeholder="Time limit (e.g., 30 mins)" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="w-full p-2 border rounded" />

//                 <div className="space-y-2">
//                     {questions.map((q, idx) => (
//                         <div key={q.id} className="p-3 bg-white/30 rounded grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
//                             <input value={q.q} onChange={(e) => updateQuestion(q.id, { q: e.target.value })} placeholder={`Q${idx + 1}`} className="col-span-3 p-2 border rounded" />
//                             <div className="col-span-2 flex flex-col gap-1">
//                                 {q.options.map((opt, i) => (
//                                     <input key={i} value={opt} onChange={(e) => updateQuestion(q.id, { options: q.options.map((o, j) => (j === i ? e.target.value : o)) })} placeholder={`Option ${i + 1}`} className="p-2 border rounded" />
//                                 ))}
//                                 <div className="flex gap-1 items-center">
//                                     <span className="text-xs">Correct:</span>
//                                     <select value={q.correctIndex} onChange={(e) => updateQuestion(q.id, { correctIndex: Number(e.target.value) })} className="p-1 border rounded">
//                                         {q.options.map((_, i) => <option key={i} value={i}>Opt {i + 1}</option>)}
//                                     </select>
//                                 </div>
//                             </div>
//                             <div className="col-span-full flex justify-end gap-2">
//                                 <button type="button" onClick={() => updateQuestion(q.id, { options: [...q.options, ""] })} className="px-2 py-1 border rounded">+Option</button>
//                                 <button type="button" onClick={() => removeQuestion(q.id)} className="px-2 py-1 bg-red-600 text-white rounded">Remove</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex gap-2">
//                     <button type="button" onClick={addQuestion} className="px-4 py-2 bg-white/20 rounded">Add Question</button>
//                     <button className="px-4 py-2 bg-indigo-700 text-white rounded">Publish Quiz</button>
//                 </div>
//             </form>

//             <div className="mt-4">
//                 <h4 className="font-semibold mb-2">Published Quizzes</h4>
//                 <ul className="space-y-2">
//                     {quizzes.length === 0 && <div className="text-slate-500">No quizzes yet.</div>}
//                     {quizzes.map((q) => (
//                         <li key={q.id} className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10">
//                             <div>
//                                 <div className="font-medium">{q.title}</div>
//                                 <div className="text-xs text-slate-600">{q.timeLimit} · {new Date(q.createdAt).toLocaleDateString()}</div>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button onClick={() => pushToLive(q.id)} className="px-3 py-1 bg-green-600 text-white rounded">Push Live</button>
//                                 <button onClick={() => { navigator.clipboard.writeText(q.id); alert("Copied quiz id"); }} className="px-3 py-1 border rounded">Copy ID</button>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// // ===========================
// // ==== Quiz Responses =======
// // ===========================
// function QuizResponses() {
//     // in demo, mock storage of attempts
//     const [responses, setResponses] = useState(() => load("edu_quiz_responses", [
//         { id: uid("r_"), student: "Alice", quiz: "Thermodynamics", score: 92, date: "2025-11-19" },
//         { id: uid("r_"), student: "Bob", quiz: "Thermodynamics", score: 78, date: "2025-11-19" },
//     ]));

//     useEffect(() => save("edu_quiz_responses", responses), [responses]);

//     return (
//         <div>
//             <h3 className="font-bold mb-3">Quiz Responses</h3>
//             <div className="overflow-auto">
//                 <table className="min-w-full bg-white/10 rounded-lg overflow-hidden">
//                     <thead className="bg-white/8 text-left text-sm font-semibold">
//                         <tr>
//                             <th className="p-3">Quiz</th>
//                             <th className="p-3">Student</th>
//                             <th className="p-3">Score</th>
//                             <th className="p-3">Date</th>
//                             <th className="p-3">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {responses.map((r) => (
//                             <tr key={r.id} className="border-b border-white/6 hover:bg-white/6 transition">
//                                 <td className="p-3 font-medium">{r.quiz}</td>
//                                 <td className="p-3">{r.student}</td>
//                                 <td className="p-3 font-bold text-indigo-700">{r.score}/100</td>
//                                 <td className="p-3 text-sm text-slate-600">{r.date}</td>
//                                 <td className="p-3"><button className="text-indigo-600">View</button></td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// // ===========================
// // ==== Discussion / Doubts ==
// // ===========================
// function DiscussionDoubts() {
//     const [doubts, setDoubts] = useState(() => load("edu_doubts", []));
//     const [message, setMessage] = useState("");

//     useEffect(() => save("edu_doubts", doubts), [doubts]);

//     const post = (e) => {
//         e.preventDefault();
//         if (!message) return;
//         const entry = { id: uid("d_"), student: "Student (offline)", text: message, replies: [], at: new Date().toISOString(), status: "open" };
//         setDoubts((d) => [entry, ...d]);
//         setMessage("");
//         alert("Doubt posted (demo). In production, student doubts sync to server.");
//         // TODO: POST /api/doubts
//     };

//     const reply = (id) => {
//         const text = prompt("Your reply");
//         if (!text) return;
//         setDoubts((d) => d.map((x) => x.id === id ? { ...x, replies: [...x.replies, { id: uid("dr_"), text, at: new Date().toISOString() }] } : x));
//         // TODO: POST reply to server
//     };

//     const close = (id) => {
//         setDoubts((d) => d.map((x) => x.id === id ? { ...x, status: "resolved" } : x));
//         // TODO: PATCH /api/doubts/:id
//     };

//     return (
//         <div className="max-w-3xl">
//             <h3 className="font-bold mb-3">Discussion & Doubts</h3>
//             <form onSubmit={post} className="flex gap-2 mb-3">
//                 <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a student doubt (simulate)" className="flex-1 p-2 border rounded" />
//                 <button className="px-4 py-2 bg-green-600 text-white rounded">Post</button>
//             </form>

//             <div className="space-y-2">
//                 {doubts.length === 0 && <div className="text-slate-500">No doubts yet.</div>}
//                 {doubts.map((d) => (
//                     <div key={d.id} className="p-3 bg-white/30 rounded-lg border border-white/10">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <div className="font-medium">{d.student}</div>
//                                 <div className="text-xs text-slate-600">{d.text}</div>
//                             </div>
//                             <div className="text-xs text-slate-500">{d.status}</div>
//                         </div>

//                         <div className="mt-2 flex gap-2">
//                             <button onClick={() => reply(d.id)} className="px-2 py-1 border rounded">Reply</button>
//                             <button onClick={() => close(d.id)} className="px-2 py-1 bg-indigo-600 text-white rounded">Resolve</button>
//                         </div>

//                         {d.replies?.length > 0 && (
//                             <div className="mt-2 text-xs">
//                                 <div className="font-semibold">Replies</div>
//                                 <ul className="mt-1 space-y-1">
//                                     {d.replies.map((r) => <li key={r.id} className="text-slate-700">{r.text} <span className="text-slate-400 text-[10px]">· {new Date(r.at).toLocaleString()}</span></li>)}
//                                 </ul>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // ===========================
// // ==== Live Reactions =======
// // ===========================
// function LiveReactionsDashboard() {
//     // store reactions locally; in production stream via websocket
//     const [reactions, setReactions] = useState(() => load("edu_reactions", []));
//     const [counts, setCounts] = useState({ understood: 0, doubt: 0 });

//     useEffect(() => save("edu_reactions", reactions), [reactions]);

//     // mimic external students sending reactions by clicking demo buttons
//     const pushReaction = (type) => {
//         const r = { id: uid("rx_"), type, at: new Date().toISOString() };
//         setReactions((s) => [r, ...s]);
//         setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
//     };

//     useEffect(() => {
//         // listen to external reaction events if integrated
//         const handler = (e) => {
//             const t = e?.detail?.type;
//             if (t) pushReaction(t);
//         };
//         window.addEventListener("edu_reaction", handler);
//         return () => window.removeEventListener("edu_reaction", handler);
//     }, []);

//     const reset = () => {
//         if (!confirm("Reset counts?")) return;
//         setReactions([]);
//         setCounts({ understood: 0, doubt: 0 });
//         // TODO: notify backend to reset real-time counters
//     };

//     return (
//         <div className="max-w-2xl">
//             <h3 className="font-bold mb-3">Live Reactions</h3>
//             <p className="text-sm text-slate-600 mb-3">Real-time reactions help you adapt pace during a live class.</p>

//             <div className="grid grid-cols-2 gap-3 mb-3">
//                 <div className="p-4 bg-white/30 rounded flex flex-col items-center">
//                     <div className="text-xs text-slate-600">Understood</div>
//                     <div className="text-3xl font-bold text-green-600">{counts.understood}</div>
//                 </div>
//                 <div className="p-4 bg-white/30 rounded flex flex-col items-center">
//                     <div className="text-xs text-slate-600">Doubt</div>
//                     <div className="text-3xl font-bold text-red-600">{counts.doubt}</div>
//                 </div>
//             </div>

//             <div className="flex gap-2">
//                 <button onClick={() => pushReaction("understood")} className="px-4 py-2 bg-green-600 text-white rounded">Demo: Understood</button>
//                 <button onClick={() => pushReaction("doubt")} className="px-4 py-2 bg-red-600 text-white rounded">Demo: Doubt</button>
//                 <button onClick={reset} className="px-4 py-2 border rounded">Reset</button>
//             </div>

//             <div className="mt-4">
//                 <h4 className="font-semibold mb-2">Recent Reactions</h4>
//                 <ul className="space-y-1">
//                     {reactions.length === 0 && <div className="text-slate-500">No reactions yet.</div>}
//                     {reactions.map((r) => (
//                         <li key={r.id} className="text-xs text-slate-700">{r.type} · {new Date(r.at).toLocaleString()}</li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// // ===========================
// // ===== Analytics Tab =======
// // ===========================
// function TeacherAnalytics() {
//     // derive data from local storage; replace with API for real analytics
//     const quizzes = load("edu_quizzes", []);
//     const uploads = load("edu_uploads", []);
//     const sessions = load("edu_class_sessions", []);
//     const reactions = load("edu_reactions", []);
//     const responses = load("edu_quiz_responses", []);

//     // simple aggregates
//     const quizLabels = quizzes.slice(0, 6).map((q) => q.title || q.id);
//     const quizData = quizzes.slice(0, 6).map((q, i) => {
//         // compute average from responses if any
//         const rs = responses.filter((r) => r.quiz === q.title);
//         if (rs.length === 0) return Math.round(60 + Math.random() * 30);
//         return Math.round(rs.reduce((s, r) => s + r.score, 0) / rs.length);
//     });

//     const attendanceLabels = load("edu_courses", []).map((c) => c.name);
//     const attendanceData = attendanceLabels.map(() => Math.round(60 + Math.random() * 40));

//     const barOptions = {
//         responsive: true,
//         plugins: {
//             legend: { position: "top" },
//             title: { display: true, text: "Quiz Performance Over Time (sample)" },
//         },
//         scales: {
//             y: { min: 0, max: 100, title: { display: true, text: "Score (%)" } },
//         },
//     };

//     const quizScoreData = {
//         labels: quizLabels.length ? quizLabels : ["Quiz 1", "Quiz 2"],
//         datasets: [{ label: "Avg. Class Score", data: quizData.length ? quizData : [78, 85], backgroundColor: "rgba(59,130,246,0.9)" }],
//     };

//     const attendanceDataObj = {
//         labels: attendanceLabels.length ? attendanceLabels : ["Physics 101", "Chem 302"],
//         datasets: [{ label: "Attendance", data: attendanceData.length ? attendanceData : [95, 88], backgroundColor: ["#10B981", "#F59E0B", "#8B5CF6"] }],
//     };

//     return (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <div className="p-4 bg-white/40 rounded-xl border border-white/20">
//                     <Bar data={quizScoreData} options={barOptions} />
//                 </div>
//                 <div className="p-4 bg-white/40 rounded-xl border border-white/20">
//                     <h4 className="text-center font-semibold mb-3">Attendance Breakdown</h4>
//                     <div className="h-64">
//                         <Pie data={attendanceDataObj} />
//                     </div>
//                 </div>
//             </div>

//             <div className="p-4 bg-white/30 rounded-xl border-l-4 border-indigo-400">
//                 <div className="font-semibold">Engagement Snapshot</div>
//                 <div className="text-sm text-slate-600">Sessions: {sessions.length} · Uploads: {uploads.length} · Reactions: {reactions.length}</div>
//             </div>
//         </div>
//     );
// }
// TeacherDashboard.jsx
// Split version – SAME UI, SAME LOGIC, NO TEXT CHANGED
// TeacherDashboard.jsx
// TeacherDashboard.jsx
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
//import LiveReactionsDashboard from "./components/LiveReactionsDashboard";
import TeacherAnalytics from "./components/TeacherAnalytics";
import LiveClassRoom from "./components/LiveClassRoom";

import NavButton from "./components/ui/NavButton";

export default function TeacherDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop collapse
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // mobile right-side menu

  const user = { name: "Demo Teacher", initials: "DT", subject: "Science" };

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
    //   case "reactions":
    //     return <LiveReactionsDashboard user={user} />;
      case "analytics":
        return <TeacherAnalytics user={user} />;
      default:
        return <Overview user={user} setActive={setActive} />;
    }
  }, [active]);

  const logout = () => {
    alert("Logged out (demo)");
  };

  // When user clicks a nav item on mobile, close the mobile menu
  const handleNavClick = (key) => {
    setActive(key);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 0; height: 0; }
        * { scrollbar-width: none; }
        body { -ms-overflow-style: none; }
      `}</style>

      <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">

        {/* ------------------ MOBILE: HAMBURGER BUTTON (top-right). Hides while menu open ------------------ */}
        {!mobileMenuOpen && (
          <button
            className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white shadow rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu className="text-xl text-slate-700" />
          </button>
        )}

        {/* ------------------ MOBILE OVERLAY (when menu open) ------------------ */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
        )}

        {/* ------------------ MOBILE SIDEBAR (slides in from right) ------------------ */}
        <div
          className={`fixed top-0 right-0 z-50 h-full w-64 transform transition-transform duration-300 md:hidden
            ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          aria-hidden={!mobileMenuOpen}
        >
          <aside className="h-full bg-[rgba(40,43,252,0.94)] backdrop-blur-lg text-white flex flex-col">
            <div className="p-4 flex items-center justify-between h-20">
              <div>
                <div className="text-lg font-extrabold">EduDash</div>
                <div className="text-xs text-white/80">Teacher Console</div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-white/10"
                aria-label="Close menu"
              >
                <FiX className="text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-6">
              <NavButton
                label="Overview"
                icon={FiGrid}
                active={active === "overview"}
                onClick={() => handleNavClick("overview")}
                collapsed={false}
              />
              <NavButton
                label="Courses"
                icon={FiBook}
                active={active === "courses"}
                onClick={() => handleNavClick("courses")}
                collapsed={false}
              />
              <NavButton
                label="Uploads"
                icon={FiUpload}
                active={active === "uploads"}
                onClick={() => handleNavClick("uploads")}
                collapsed={false}
              />
              <NavButton
                label="Recorded"
                icon={FiVideo}
                active={active === "recorded"}
                onClick={() => handleNavClick("recorded")}
                collapsed={false}
              />
              <NavButton
                label="AI Studio"
                icon={FiZap}
                active={active === "ai"}
                onClick={() => handleNavClick("ai")}
                collapsed={false}
              />

              <div className="border-t border-white/20 mt-3 pt-3" />

              <NavButton
                label="Live Class"
                icon={FiVideo}
                active={active === "liveClass"}
                onClick={() => handleNavClick("liveClass")}
                collapsed={false}
              />
              <NavButton
                label="Quizzes"
                icon={FiPlus}
                active={active === "quizzes"}
                onClick={() => handleNavClick("quizzes")}
                collapsed={false}
              />
              <NavButton
                label="Responses"
                icon={FiFileText}
                active={active === "responses"}
                onClick={() => handleNavClick("responses")}
                collapsed={false}
              />
              <NavButton
                label="Discussions"
                icon={FiMessageCircle}
                active={active === "discussion"}
                onClick={() => handleNavClick("discussion")}
                collapsed={false}
              />
              {/* <NavButton
                label="Reactions"
                icon={FiAlertCircle}
                active={active === "reactions"}
                onClick={() => handleNavClick("reactions")}
                collapsed={false}
              /> */}
              <NavButton
                label="Analytics"
                icon={FiBarChart2}
                active={active === "analytics"}
                onClick={() => handleNavClick("analytics")}
                collapsed={false}
              />
            </div>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 text-sm rounded-lg text-white bg-red-500/30 hover:bg-red-500/50 transition"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </aside>
        </div>

        {/* ------------------ DESKTOP SIDEBAR (unchanged behavior) ------------------ */}
        <aside
          className={`hidden md:flex flex-col transition-all duration-300 bg-[rgba(40,43,252,0.64)] backdrop-blur-lg border-r border-white/10 shadow-lg h-screen ${
            sidebarOpen ? "w-72" : "w-20"
          }`}
        >
          <div className="p-4 flex items-center justify-between h-20">
            {sidebarOpen && (
              <div>
                <div className="text-lg font-extrabold text-white">EduDash</div>
                <div className="text-xs text-white/70">Teacher Console</div>
              </div>
            )}

            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              {sidebarOpen ? (
                <FiChevronsLeft className="text-white" />
              ) : (
                <FiChevronsRight className="text-white" />
              )}
            </button>
          </div>

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
            {/* <NavButton
              label="Reactions"
              icon={FiAlertCircle}
              active={active === "reactions"}
              onClick={() => setActive("reactions")}
              collapsed={!sidebarOpen}
            /> */}
            <NavButton
              label="Analytics"
              icon={FiBarChart2}
              active={active === "analytics"}
              onClick={() => setActive("analytics")}
              collapsed={!sidebarOpen}
            />
          </div>

          <div className="p-4 border-t border-white/20">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 p-2 text-sm rounded-lg text-white bg-red-500/30 hover:bg-red-500/50 transition"
            >
              <FiLogOut />
              {sidebarOpen && "Logout"}
            </button>
          </div>
        </aside>

        {/* ------------------ MAIN PANEL ------------------ */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 capitalize">
              {active.replace(/([A-Z])/g, " $1")}
            </h1>
          </header>

          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl min-h-[60vh]">
            {content}
          </section>
        </main>
      </div>
    </>
  );
}
