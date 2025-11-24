// DeveloperPanel.jsx
// FULL PREMIUM ADMIN PANEL WITH:
// - Document Viewer Modal
// - Email Simulation
// - Excel Export (SheetJS)
// - Pagination + Search
// - Dummy Data (Org Requests + Orgs + Users)
// - Charts
// - Fully Responsive

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

// ChartJS
import {
    Line, Bar, Pie, Doughnut, Radar
} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// HeroIcons
import {
    HomeModernIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
    UserGroupIcon,
    Cog6ToothIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    EnvelopeIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

// ------------------------------
// LOCAL STORAGE HOOK
// ------------------------------
const useLocalStorage = (k, init) => {
    const [v, setV] = useState(() => {
        try {
            const s = localStorage.getItem(k);
            return s ? JSON.parse(s) : init;
        } catch {
            return init;
        }
    });

    useEffect(() => localStorage.setItem(k, JSON.stringify(v)), [k, v]);
    return [v, setV];
};

// ------------------------------
// DUMMY DATA GENERATORS
// ------------------------------
const dummyOrgs = Array.from({ length: 50 }, (_, i) => ({
    id: "ORG" + (1000 + i),
    name: "Organization " + (i + 1),
    status: i % 2 === 0 ? "Approved" : "Pending",
    teachers: Math.floor(Math.random() * 50),
    students: Math.floor(Math.random() * 500),
    courses: Math.floor(Math.random() * 20),
    sessions: Math.floor(Math.random() * 200),
}));

const dummyRequests = Array.from({ length: 50 }, (_, i) => ({
    id: "REQ" + (2000 + i),
    name: "Requesting Institute " + (i + 1),
    documents: ["proof" + i + ".pdf"],
    status: "Pending",
}));

const dummyUsers = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: "User " + (i + 1),
    role: i % 2 === 0 ? "Teacher" : "Student",
    email: "user" + (i + 1) + "@example.com",
    status: i % 3 === 0 ? "Inactive" : "Active",
}));

// ------------------------------
// EXPORT TO EXCEL FUNCTION
// ------------------------------
const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename + ".xlsx");
};

// ------------------------------
// NAVBAR
// ------------------------------
const Navbar = ({ current, setCurrent }) => {
    const [open, setOpen] = useState(false);

    const menu = [
        { key: "dashboard", label: "Dashboard", icon: HomeModernIcon },
        { key: "orgRequests", label: "Org Requests", icon: BuildingOffice2Icon },
        { key: "orgRegistry", label: "Org Registry", icon: BuildingOffice2Icon },
        { key: "businessAnalytics", label: "Business Analytics", icon: ChartBarIcon },
        { key: "users", label: "Users", icon: UserGroupIcon },
        { key: "settings", label: "Settings", icon: Cog6ToothIcon },
    ];

    return (
        <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
            <div className="flex justify-between items-center px-4 h-16">
                <div className="text-white text-xl font-bold flex gap-2 items-center">
                    <span className="px-2 py-1 bg-indigo-600 rounded">PRO</span> Panel
                </div>

                <nav className="hidden md:flex gap-5 text-gray-300">
                    {menu.map(m => (
                        <button
                            key={m.key}
                            className={`flex items-center gap-2 px-3 py-2 rounded ${current === m.key ? "bg-gray-800 text-white" : "hover:text-white"}`}
                            onClick={() => setCurrent(m.key)}
                        >
                            <m.icon className="w-5 h-5" /> {m.label}
                        </button>
                    ))}
                </nav>

                <button onClick={() => setOpen(o => !o)} className="md:hidden text-white">
                    {open ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="md:hidden bg-gray-800 flex flex-col border-t border-gray-700"
                    >
                        {menu.map(m => (
                            <button
                                key={m.key}
                                className={`px-4 py-4 text-left flex items-center gap-2 ${current === m.key ? "text-white bg-gray-700" : "text-gray-300"}`}
                                onClick={() => {
                                    setCurrent(m.key);
                                    setOpen(false);
                                }}
                            >
                                <m.icon className="w-5 h-5" /> {m.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

// ------------------------------
// SHARED COMPONENTS
// ------------------------------
const SearchBar = ({ value, setValue }) => (
    <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded border border-gray-700">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        <input
            placeholder="Search..."
            value={value}
            onChange={e => setValue(e.target.value)}
            className="bg-transparent outline-none text-white w-full"
        />
    </div>
);

const Pagination = ({ page, setPage, totalPages }) => (
    <div className="flex justify-end gap-2 items-center mt-4">
        <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 bg-gray-800 text-gray-300 rounded disabled:opacity-40"
        >
            Prev
        </button>
        <span className="text-gray-400">Page {page} / {totalPages}</span>
        <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 bg-gray-800 text-gray-300 rounded disabled:opacity-40"
        >
            Next
        </button>
    </div>
);
// ------------------------------
// DOCUMENT VIEWER MODAL
// ------------------------------
const DocumentViewerModal = ({ open, onClose, file }) => {
    if (!open) return null;

    const isPDF = file?.endsWith(".pdf");
    const isImage = file?.match(/\.(png|jpg|jpeg)$/i);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]"
            >
                <motion.div
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.6 }}
                    className="bg-gray-900 rounded-lg p-4 max-w-4xl w-full border border-gray-700"
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-white text-xl font-semibold">Document Viewer</h3>
                        <button className="text-white" onClick={onClose}>
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-black rounded h-[70vh] flex items-center justify-center">
                        {isPDF && (
                            <iframe
                                src={"/docs/" + file}
                                title="PDF Viewer"
                                className="w-full h-full"
                            ></iframe>
                        )}

                        {isImage && (
                            <img
                                src={"/docs/" + file}
                                alt="document"
                                className="max-h-full max-w-full object-contain"
                            />
                        )}

                        {!isPDF && !isImage && (
                            <div className="text-gray-400">Unsupported file format</div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ------------------------------
// DASHBOARD
// ------------------------------
const DashboardPanel = ({ stats }) => {
    const genLineData = () => ({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
            label: "Signups",
            data: [100, 300, 250, 400, 350, 500],
            borderColor: "#6366f1",
            backgroundColor: "rgba(99,102,241,.3)",
            fill: true,
        }],
    });

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Orgs" value={stats.orgs} color="bg-blue-600" />
                <StatCard title="Teachers" value={stats.teachers} color="bg-indigo-600" />
                <StatCard title="Students" value={stats.students} color="bg-green-600" />
                <StatCard title="Retention" value={stats.retention + '%'} color="bg-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartBox title="Signups Trend">
                    <Line data={genLineData()} />
                </ChartBox>

                <ChartBox title="User Distribution">
                    <Pie
                        data={{
                            labels: ["Teachers", "Students"],
                            datasets: [{ data: [stats.teachers, stats.students] }],
                        }}
                    />
                </ChartBox>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className="p-5 bg-gray-800 border border-gray-700 rounded-xl flex justify-between">
        <div>
            <div className="text-gray-400 text-sm">{title}</div>
            <div className="text-white text-3xl font-bold">{value}</div>
        </div>
        <div className={`w-12 h-12 rounded-full ${color}`}></div>
    </div>
);

const ChartBox = ({ title, children }) => (
    <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 h-80">
        <h3 className="text-white font-semibold mb-3">{title}</h3>
        <div className="h-[85%]">{children}</div>
    </div>
);

// ------------------------------
// ORG REQUESTS
// ------------------------------
const OrgRequestsModule = ({
    data,
    setData,
    openModal,
    sendEmail,
}) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filtered = data.filter(req =>
        req.name.toLowerCase().includes(search.toLowerCase())
    );

    const perPage = 8;
    const totalPages = Math.ceil(filtered.length / perPage);
    const shown = filtered.slice((page - 1) * perPage, page * perPage);

    const updateStatus = (id, status) => {
        setData(prev =>
            prev.map(req => req.id === id ? { ...req, status } : req)
        );

        if (status === "Approved") sendEmail("Organization Approved Successfully");
        if (status === "Rejected") sendEmail("Organization Rejected");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Organization Requests</h2>

            <div className="flex justify-between items-center">
                <SearchBar value={search} setValue={setSearch} />

                <button
                    onClick={() => exportToExcel(filtered, "OrgRequests")}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 rounded"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" /> Export Excel
                </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-gray-300">
                    <thead className="bg-gray-700 text-gray-300 text-sm">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Documents</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {shown.map(req => (
                            <tr
                                key={req.id}
                                className="border-b border-gray-700 hover:bg-gray-750"
                            >
                                <td className="p-3">{req.name}</td>

                                <td className="p-3">
                                    {req.documents.map(doc => (
                                        <button
                                            key={doc}
                                            onClick={() => openModal(doc)}
                                            className="flex items-center gap-2 px-2 py-1 border border-gray-600 rounded text-xs text-blue-400 hover:bg-gray-700"
                                        >
                                            <EyeIcon className="w-4 h-4" /> {doc}
                                        </button>
                                    ))}
                                </td>

                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${req.status === "Pending" ? "bg-amber-500" :
                                        req.status === "Approved" ? "bg-green-600" :
                                            "bg-red-600"
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>

                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => updateStatus(req.id, "Approved")}
                                        className="px-3 py-1 bg-green-600 rounded text-sm"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => updateStatus(req.id, "Rejected")}
                                        className="px-3 py-1 bg-red-600 rounded text-sm"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
    );
};
// ------------------------------------------------------
// ORG REGISTRY MODULE
// ------------------------------------------------------
const OrgRegistryModule = ({ data }) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filtered = data.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase())
    );

    const perPage = 10;
    const totalPages = Math.ceil(filtered.length / perPage);
    const shown = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Organization Registry</h2>

            <div className="flex justify-between">
                <SearchBar value={search} setValue={setSearch} />

                <button
                    onClick={() => exportToExcel(filtered, "OrganizationRegistry")}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 rounded"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" /> Export Excel
                </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-gray-300">
                    <thead className="bg-gray-700 text-gray-300 text-sm">
                        <tr>
                            <th className="p-3">Org Name</th>
                            <th className="p-3">Code</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Teachers</th>
                            <th className="p-3">Students</th>
                            <th className="p-3">Courses</th>
                            <th className="p-3">Sessions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {shown.map(org => (
                            <tr key={org.id} className="border-b border-gray-700">
                                <td className="p-3">{org.name}</td>
                                <td className="p-3">{org.id}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${org.status === "Approved" ? "bg-green-600" :
                                            org.status === "Pending" ? "bg-amber-500" :
                                                "bg-red-600"
                                        }`}>
                                        {org.status}
                                    </span>
                                </td>
                                <td className="p-3">{org.teachers}</td>
                                <td className="p-3">{org.students}</td>
                                <td className="p-3">{org.courses}</td>
                                <td className="p-3">{org.sessions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
    );
};

// ------------------------------------------------------
// USERS MODULE (Search + Pagination + Excel)
// ------------------------------------------------------
const UsersModule = ({ users }) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const perPage = 10;
    const totalPages = Math.ceil(filtered.length / perPage);
    const shown = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Users</h2>

            <div className="flex justify-between">
                <SearchBar value={search} setValue={setSearch} />
                <button
                    onClick={() => exportToExcel(filtered, "UsersList")}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 rounded"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" /> Export Excel
                </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-gray-300">
                    <thead className="bg-gray-700 text-gray-300 text-sm">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {shown.map(user => (
                            <tr key={user.id} className="border-b border-gray-700">
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${user.status === "Active" ? "bg-green-600" : "bg-red-600"
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
    );
};

// ------------------------------------------------------
// BUSINESS ANALYTICS
// ------------------------------------------------------
const BusinessAnalytics = ({ stats }) => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Platform Analytics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Orgs" value={stats.orgs} color="bg-blue-600" />
            <StatCard title="Active Users" value={stats.activeUsers} color="bg-green-600" />
            <StatCard title="Sessions" value={stats.totalSessions} color="bg-indigo-600" />
            <StatCard title="Quizzes" value={stats.totalQuizzes} color="bg-amber-600" />
        </div>

        <ChartBox title="Monthly Usage">
            <Bar
                data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [{ label: "Activity", data: [100, 200, 250, 300, 350, 400] }],
                }}
            />
        </ChartBox>

        <ChartBox title="Region Adoption">
            <Doughnut
                data={{
                    labels: ["India", "USA", "UK", "Canada"],
                    datasets: [{
                        data: [45, 25, 20, 10],
                        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
                    }],
                }}
            />
        </ChartBox>
    </div>
);

// ------------------------------------------------------
// EMAIL TOAST (SIMULATION)
// ------------------------------------------------------
const EmailToast = ({ show, message }) => {
    if (!show) return null;

    return (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-[9999]">
            <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                {message}
            </div>
        </div>
    );
};

// ------------------------------------------------------
// MAIN EXPORT — DeveloperPanel
// ------------------------------------------------------
export default function DeveloperPanel() {
    const [current, setCurrent] = useLocalStorage("dev_current_page", "dashboard");

    const [requests, setRequests] = useLocalStorage("dev_requests", dummyRequests);
    const [orgs] = useLocalStorage("dev_orgs", dummyOrgs);
    const [users] = useLocalStorage("dev_users", dummyUsers);

    const [docModalOpen, setDocModalOpen] = useState(false);
    const [docFile, setDocFile] = useState("");

    const [toast, setToast] = useState({ show: false, message: "" });

    const openModal = file => {
        setDocFile(file);
        setDocModalOpen(true);
    };

    const sendEmail = message => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: "" }), 1800);
    };

    const stats = useMemo(() => ({
        orgs: orgs.length,
        teachers: users.filter(u => u.role === "Teacher").length,
        students: users.filter(u => u.role === "Student").length,
        retention: 88,
        activeUsers: users.length,
        totalSessions: 1400,
        totalQuizzes: 320,
    }), [orgs, users]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar current={current} setCurrent={setCurrent} />

            <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

                {current === "dashboard" && <DashboardPanel stats={stats} />}

                {current === "orgRequests" && (
                    <OrgRequestsModule
                        data={requests}
                        setData={setRequests}
                        openModal={openModal}
                        sendEmail={sendEmail}
                    />
                )}

                {current === "orgRegistry" && <OrgRegistryModule data={orgs} />}

                {current === "businessAnalytics" && <BusinessAnalytics stats={stats} />}

                {current === "users" && <UsersModule users={users} />}
            </main>

            {/* Document Viewer Modal */}
            <DocumentViewerModal
                open={docModalOpen}
                onClose={() => setDocModalOpen(false)}
                file={docFile}
            />

            {/* Email Toast */}
            <EmailToast show={toast.show} message={toast.message} />
        </div>
    );
}
