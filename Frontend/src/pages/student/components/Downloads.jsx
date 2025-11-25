// components/Downloads.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, Eye, Download } from "lucide-react";

const loadDownloads = () => {
  try {
    return JSON.parse(localStorage.getItem("edu_downloads")) || [];
  } catch {
    return [];
  }
};

// Category → format mapping (used in table)
const FORMAT_MAP = {
  "Notes": "PDF",
  "Assignments": "PDF",
  "Sample QP": "PDF",
  "External Links": "Link",
  "Images/Diagrams": "Image",
};

export default function Downloads() {
  const [downloads, setDownloads] = useState(loadDownloads);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // mobile “Notes” dropdown open/close
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("edu_downloads", JSON.stringify(downloads));
  }, [downloads]);

  const courseOptions = useMemo(
    () => [...new Set(downloads.map((d) => d.course).filter(Boolean))],
    [downloads]
  );

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

    list.sort((a, b) => {
      const aT = dTime(a.createdAt);
      const bT = dTime(b.createdAt);
      return sortOrder === "newest" ? bT - aT : aT - bT;
    });

    return list;
  }, [downloads, search, courseFilter, sortOrder]);

  const dTime = (v) => (v ? new Date(v).getTime() : 0);

  const handleView = (item) => {
    const url = item.viewUrl || item.downloadUrl;
    if (!url) {
      alert("No view URL for this file.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 md:px-10 py-6">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">Downloads</h1>

      {/* Top card: search + filters + category info */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
        {/* Search + Course + Newest */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search (mobile + desktop) */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-1/2">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full ml-2 text-sm"
              placeholder="Search downloads..."
            />
          </div>

          {/* Course + Newest */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-1/2">
            {/* Course dropdown */}
            <div className="relative w-full">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-3 py-2 pr-8 text-sm outline-none appearance-none"
              >
                <option value="all">All courses</option>
                {courseOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            {/* Newest dropdown */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Desktop: inline category row under filters */}
        <div className="hidden md:flex flex-wrap gap-3 mt-5">
          <div className="px-4 py-2 rounded-lg border text-sm">
            Notes – PDF
          </div>
          <div className="px-4 py-2 rounded-lg border text-sm">
            Assignments – PDF
          </div>
          <div className="px-4 py-2 rounded-lg border text-sm">
            Sample QP – PDF
          </div>
          <div className="px-4 py-2 rounded-lg border text-sm">
            External Links – Link
          </div>
          <div className="px-4 py-2 rounded-lg border text-sm">
            Images/Diagrams – Image
          </div>
        </div>

        {/* Mobile: Notes dropdown under search / filters */}
        <div className="mt-4 md:hidden">
          <button
            onClick={() => setNotesOpen((o) => !o)}
            className="w-full bg-gray-100 px-3 py-2 rounded-lg flex items-center justify-between text-sm"
          >
            Notes
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          {notesOpen && (
            <div className="mt-2 bg-white border rounded-lg p-3 space-y-2 text-sm">
              <div>Notes – PDF</div>
              <div>Assignments – PDF</div>
              <div>Sample QP – PDF</div>
              <div>External Links – Link</div>
              <div>Images/Diagrams – Image</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent downloads table */}
      <h2 className="text-2xl font-semibold mb-3">Recent resources</h2>

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
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-400 text-sm"
                >
                  No resources uploaded yet.
                </td>
              </tr>
            )}

            {filtered.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-3 align-middle">{item.title || "-"}</td>
                <td className="p-3 align-middle">{item.course || "-"}</td>
                <td className="p-3 align-middle">
                  {FORMAT_MAP[item.category] || item.format || "File"}
                </td>
                <td className="p-3 align-middle">
                  <button
                    onClick={() => handleView(item)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  >
                    <Eye size={16} />
                  </button>
                </td>
                <td className="p-3 align-middle">
                  {item.downloadUrl || item.viewUrl ? (
                    <a
                      href={item.downloadUrl || item.viewUrl}
                      download={item.fileName || item.title}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">No file</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
