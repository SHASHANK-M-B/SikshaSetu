import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

import { Line, Bar, Pie, Doughnut, Radar } from "react-chartjs-2";

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

import {
  getPendingOrganizations,
  approveOrganization,
  rejectOrganization,
  getAllOrganizations,
} from "../../api/admin";

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

const dummyOrgs = Array.from({ length: 50 }, (_, i) => ({
  id: "ORG" + (1000 + i),
  name: "Organization " + (i + 1),
  status: i % 2 === 0 ? "Approved" : "Pending",
  teachers: Math.floor(Math.random() * 50),
  students: Math.floor(Math.random() * 500),
  courses: Math.floor(Math.random() * 20),
  sessions: Math.floor(Math.random() * 200),
}));

const dummyUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: "User " + (i + 1),
  role: i % 2 === 0 ? "Teacher" : "Student",
  email: "user" + (i + 1) + "@example.com",
  status: i % 3 === 0 ? "Inactive" : "Active",
}));

const exportToExcel = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename + ".xlsx");
};

const Navbar = ({ current, setCurrent }) => {
  const [open, setOpen] = useState(false);

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: HomeModernIcon },
    { key: "orgRequests", label: "Org Requests", icon: BuildingOffice2Icon },
    { key: "orgRegistry", label: "Org Registry", icon: BuildingOffice2Icon },
    {
      key: "businessAnalytics",
      label: "Business Analytics",
      icon: ChartBarIcon,
    },
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
          {menu.map((m) => (
            <button
              key={m.key}
              className={`flex items-center gap-2 px-3 py-2 rounded ${
                current === m.key
                  ? "bg-gray-800 text-white"
                  : "hover:text-white"
              }`}
              onClick={() => setCurrent(m.key)}
            >
              <m.icon className="w-5 h-5" /> {m.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden text-white"
        >
          {open ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <Bars3Icon className="w-7 h-7" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="md:hidden bg-gray-800 flex flex-col border-t border-gray-700">
            {menu.map((m) => (
              <button
                key={m.key}
                className={`px-4 py-4 text-left flex items-center gap-2 ${
                  current === m.key ? "text-white bg-gray-700" : "text-gray-300"
                }`}
                onClick={() => {
                  setCurrent(m.key);
                  setOpen(false);
                }}
              >
                <m.icon className="w-5 h-5" /> {m.label}
              </button>
            ))}
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

const SearchBar = ({ value, setValue }) => (
  <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded border border-gray-700">
    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
    <input
      placeholder="Search..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="bg-transparent outline-none text-white w-full"
    />
  </div>
);

const Pagination = ({ page, setPage, totalPages }) => (
  <div className="flex justify-end gap-2 items-center mt-4">
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="px-3 py-1 bg-gray-800 text-gray-300 rounded disabled:opacity-40"
    >
      Prev
    </button>
    <span className="text-gray-400">
      Page {page} / {totalPages}
    </span>
    <button
      disabled={page === totalPages}
      onClick={() => setPage((p) => p + 1)}
      className="px-3 py-1 bg-gray-800 text-gray-300 rounded disabled:opacity-40"
    >
      Next
    </button>
  </div>
);

const DocumentViewerModal = ({ open, onClose, file }) => {
  if (!open) return null;

  const isPDF = file?.endsWith(".pdf");
  const isImage = file?.match(/\.(png|jpg|jpeg)$/i);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl max-w-4xl w-full p-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded text-white"
          >
            Close
          </button>
          <h3 className="text-white text-lg mb-4">Document Viewer</h3>

          {isPDF && (
            <iframe
              src={file}
              className="w-full h-[70vh] rounded border border-gray-600"
              title="PDF Viewer"
            />
          )}

          {isImage && (
            <img
              src={file}
              alt="Document"
              className="max-w-full max-h-[70vh] mx-auto"
            />
          )}

          {!isPDF && !isImage && (
            <p className="text-gray-400">
              Preview not available for this file type.
            </p>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`${color} p-4 rounded-xl text-white`}>
    <h4 className="text-sm font-semibold opacity-80">{title}</h4>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const DashboardPanel = ({ stats }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Organizations" value={stats.orgs} color="bg-blue-600" />
      <StatCard title="Teachers" value={stats.teachers} color="bg-green-600" />
      <StatCard title="Students" value={stats.students} color="bg-indigo-600" />
      <StatCard
        title="Retention %"
        value={stats.retention}
        color="bg-amber-600"
      />
    </div>

    <ChartBox title="Weekly Active Users">
      <Line
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            { label: "Users", data: [120, 150, 180, 170, 200, 220, 240] },
          ],
        }}
      />
    </ChartBox>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartBox title="User Roles">
        <Pie
          data={{
            labels: ["Teachers", "Students"],
            datasets: [
              {
                data: [stats.teachers, stats.students],
                backgroundColor: ["#10b981", "#3b82f6"],
              },
            ],
          }}
        />
      </ChartBox>

      <ChartBox title="Course Difficulty">
        <Radar
          data={{
            labels: ["Beginner", "Intermediate", "Advanced"],
            datasets: [{ label: "Courses", data: [30, 50, 20] }],
          }}
        />
      </ChartBox>
    </div>
  </div>
);

const OrgRequestsModule = ({ sendEmail }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docFile, setDocFile] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await getPendingOrganizations();
      setRequests(response.data.organizations || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (orgId) => {
    if (!window.confirm("Approve this organization?")) return;
    try {
      await approveOrganization(orgId);
      // sendEmail("Approval email sent with credentials");
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (orgId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await rejectOrganization(orgId, reason);
      // sendEmail("Rejection email sent");
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Rejection failed");
    }
  };

  const openModal = (file) => {
    setDocFile(file);
    setDocModalOpen(true);
  };

  const filtered = requests.filter(
    (r) =>
      r.orgName?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase())
  );

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Organization Requests</h2>

      <div className="flex justify-between">
        <SearchBar value={search} setValue={setSearch} />
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 rounded"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : shown.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No pending organizations
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-gray-300">
            <thead className="bg-gray-700 text-gray-300 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Location</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {shown.map((req) => (
                <tr key={req.id} className="border-b border-gray-700">
                  <td className="p-3">{req.orgName}</td>
                  <td className="p-3">{req.email}</td>
                  <td className="p-3">{req.phone}</td>
                  <td className="p-3">
                    {req.city}, {req.state}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {req.documents && req.documents.length > 0 && (
                        <button
                          onClick={() => openModal(req.documents[0])}
                          className="px-2 py-1 bg-blue-600 rounded text-xs flex items-center gap-1"
                        >
                          <EyeIcon className="w-4 h-4" /> View
                        </button>
                      )}
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-2 py-1 bg-green-600 rounded text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-2 py-1 bg-red-600 rounded text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      <DocumentViewerModal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        file={docFile}
      />
    </div>
  );
};

const OrgRegistryModule = ({ data }) => {
  const [search, setSearch] = useState("");
  const [orgRegistryData, setOrgRegistryData] = useState(null);
  const [page, setPage] = useState(1);

  const filtered = data.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  const fetchRequests = async () => {
    // setLoading(true);
    try {
      const response = await getAllOrganizations();
      console.log(response, "all orgs response");
      setOrgRegistryData(response.data.organizations || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  console.log(orgRegistryData, "org registry data");
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Organization Registry</h2>

      <div className="flex justify-between">
        <SearchBar value={search} setValue={setSearch} />
        <button
          onClick={() => exportToExcel(filtered, "OrgRegistry")}
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
              <th className="p-3">ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Teachers</th>
              <th className="p-3">Students</th>
              <th className="p-3">Courses</th>
              <th className="p-3">Sessions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(orgRegistryData) &&
              orgRegistryData.map((org) => (
                <tr key={org.id} className="border-b border-gray-700">
                  <td className="p-3">{org.orgName}</td>
                  <td className="p-3">{org.orgCode}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        org.status === "approved"
                          ? "bg-green-600"
                          : org.status === "Pending"
                          ? "bg-amber-500"
                          : "bg-red-600"
                      }`}
                    >
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

const UsersModule = ({ users }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter(
    (u) =>
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
            {shown.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.status === "Active" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
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

const BusinessAnalytics = ({ stats }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">Platform Analytics</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Orgs" value={stats.orgs} color="bg-blue-600" />
      <StatCard
        title="Active Users"
        value={stats.activeUsers}
        color="bg-green-600"
      />
      <StatCard
        title="Sessions"
        value={stats.totalSessions}
        color="bg-indigo-600"
      />
      <StatCard
        title="Quizzes"
        value={stats.totalQuizzes}
        color="bg-amber-600"
      />
    </div>

    <ChartBox title="Monthly Usage">
      <Bar
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            { label: "Activity", data: [100, 200, 250, 300, 350, 400] },
          ],
        }}
      />
    </ChartBox>

    <ChartBox title="Region Adoption">
      <Doughnut
        data={{
          labels: ["India", "USA", "UK", "Canada"],
          datasets: [
            {
              data: [45, 25, 20, 10],
              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
            },
          ],
        }}
      />
    </ChartBox>
  </div>
);

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

export default function DeveloperPanel() {
  const [current, setCurrent] = useLocalStorage(
    "dev_current_page",
    "dashboard"
  );

  const [orgs] = useLocalStorage("dev_orgs", dummyOrgs);
  const [users] = useLocalStorage("dev_users", dummyUsers);

  const [toast, setToast] = useState({ show: false, message: "" });

  const sendEmail = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 1800);
  };

  const stats = useMemo(
    () => ({
      orgs: orgs.length,
      teachers: users.filter((u) => u.role === "Teacher").length,
      students: users.filter((u) => u.role === "Student").length,
      retention: 88,
      activeUsers: users.length,
      totalSessions: 1400,
      totalQuizzes: 320,
    }),
    [orgs, users]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar current={current} setCurrent={setCurrent} />

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {current === "dashboard" && <DashboardPanel stats={stats} />}

        {current === "orgRequests" && (
          <OrgRequestsModule sendEmail={sendEmail} />
        )}

        {current === "orgRegistry" && <OrgRegistryModule data={orgs} />}

        {current === "businessAnalytics" && <BusinessAnalytics stats={stats} />}

        {current === "users" && <UsersModule users={users} />}
      </main>

      <EmailToast show={toast.show} message={toast.message} />
    </div>
  );
}
