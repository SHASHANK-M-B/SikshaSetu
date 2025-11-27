// components/Downloads.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, Eye, Download } from "lucide-react";

// Load downloads from local storage
const loadDownloads = () => {
  try {
    return JSON.parse(localStorage.getItem("edu_downloads")) || [];
  } catch {
    return [];
  }
};

// Category → format mapping
const FORMAT_MAP = {
  Notes: "PDF",
  Assignments: "PDF",
  "Sample QP": "PDF",
  "External Links": "Link",
  "Images/Diagrams": "Image",
};

// Dummy resources shown by default
const DUMMY_RESOURCES = [
  {
    id: 1,
    title: "Unit 1 Notes",
    course: "CSE101",
    category: "Notes",
    viewUrl: "#",
    downloadUrl: "#",
    createdAt: "2024-01-05",
  },
  {
    id: 2,
    title: "Assignment 1",
    course: "CSE101",
    category: "Assignments",
    viewUrl: "#",
    downloadUrl: "#",
    createdAt: "2024-01-03",
  },
  {
    id: 3,
    title: "Sample QP 2023",
    course: "ENG201",
    category: "Sample QP",
    viewUrl: "#",
    downloadUrl: "#",
    createdAt: "2024-02-10",
  },
  {
    id: 4,
    title: "Reference Material",
    course: "ENG201",
    category: "External Links",
    viewUrl: "https://example.com",
    createdAt: "2024-02-15",
  },
  {
    id: 5,
    title: "ER Diagram",
    course: "MATH202",
    category: "Images/Diagrams",
    viewUrl: "#",
    downloadUrl: "#",
    createdAt: "2024-02-20",
  },
];

export default function Downloads() {
  const [downloads, setDownloads] = useState(() => {
    const saved = loadDownloads();
    return saved.length === 0 ? DUMMY_RESOURCES : saved;
  });

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("edu_downloads", JSON.stringify(downloads));
  }, [downloads]);

  const courseOptions = useMemo(
    () => [...new Set(downloads.map((d) => d.course).filter(Boolean))],
    [downloads]
  );

  const dTime = (v) => (v ? new Date(v).getTime() : 0);

  const filtered = useMemo(() => {
    let list = [...downloads];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.course?.toLowerCase().includes(q)
      );
    }

    if (courseFilter !== "all") {
      list = list.filter((d) => d.course === courseFilter);
    }

    if (categoryFilter !== "all") {
      list = list.filter((d) => d.category === categoryFilter);
    }

    list.sort((a, b) => {
      const aT = dTime(a.createdAt);
      const bT = dTime(b.createdAt);
      return sortOrder === "newest" ? bT - aT : aT - bT;
    });

    return list;
  }, [downloads, search, courseFilter, categoryFilter, sortOrder]);

  const handleView = (item) => {
    const url = item.viewUrl || item.downloadUrl;
    if (!url) {
      alert("No view URL available.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const CATEGORY_LIST = [
    "Notes",
    "Assignments",
    "Sample QP",
    "External Links",
    "Images/Diagrams",
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 md:px-10 py-6">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">Downloads</h1>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-1/2">
            <Search size={18} className="text-gray-500" />
            <input
              className="bg-transparent w-full ml-2 outline-none text-sm"
              placeholder="Search downloads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Course + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-1/2">
            {/* Course filter */}
            <div className="relative w-full">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-3 py-2 pr-8 text-sm outline-none appearance-none"
              >
                <option value="all">All courses</option>
                {courseOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              />
            </div>

            {/* Newest */}
            <div className="relative w-full">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-3 py-2 pr-8 text-sm outline-none appearance-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Desktop Category clickable */}
        <div className="hidden md:flex flex-wrap gap-3 mt-5">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                categoryFilter === cat
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat} – {FORMAT_MAP[cat]}
            </button>
          ))}

          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-lg border text-sm ${
              categoryFilter === "all"
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            All
          </button>
        </div>

        {/* Mobile category dropdown */}
        <div className="md:hidden mt-4">
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className="w-full bg-gray-100 px-3 py-2 rounded-lg flex justify-between text-sm"
          >
            Categories
            <ChevronDown size={16} />
          </button>

          {notesOpen && (
            <div className="mt-2 bg-white border rounded-lg p-3 space-y-2 text-sm">
              {CATEGORY_LIST.map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setNotesOpen(false);
                  }}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  {cat} – {FORMAT_MAP[cat]}
                </div>
              ))}

              <div
                onClick={() => {
                  setCategoryFilter("all");
                  setNotesOpen(false);
                }}
                className="p-2 rounded hover:bg-gray-100"
              >
                All
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <h2 className="text-2xl font-semibold mb-4">Recent resources</h2>

      <div className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-700 font-semibold">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Format</th>
              <th className="p-3 text-left">View</th>
              <th className="p-3 text-left">Download</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No resources found.
                </td>
              </tr>
            )}

            {filtered.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.course}</td>
                <td className="p-3">{FORMAT_MAP[item.category]}</td>

                <td className="p-3">
                  <button
                    onClick={() => handleView(item)}
                    className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  >
                    <Eye size={16} />
                  </button>
                </td>

                <td className="p-3">
                  <a
                    href={item.downloadUrl || item.viewUrl}
                    download={item.title}
                    className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <Download size={16} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
