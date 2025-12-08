// components/Downloads.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, Eye, CloudDownload } from "lucide-react";
import { downloadAllResourcess, lessionBundles } from "@/api/student";
import { all } from "axios";

// Load downloads from local storage
const loadDownloads = () => {
  try {
    return JSON.parse(localStorage.getItem("edu_downloads")) || [];
  } catch {
    return [];
  }
};

// Format map
const FORMAT_MAP = {
  Notes: "PDF",
  Assignments: "PDF",
  "Sample QP": "PDF",
  "External Links": "Link",
  "Images/Diagrams": "Image",
};

// Dummy resources
const DUMMY_RESOURCES = [
  {
    id: 1,
    title: "Unit 1 Notes",
    course: "CSE101",
    category: "Notes",
    downloadUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2024-01-05",
  },
  {
    id: 2,
    title: "Assignment 1",
    course: "CSE101",
    category: "Assignments",
    downloadUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2024-01-03",
  },
  {
    id: 3,
    title: "Sample QP 2023",
    course: "ENG201",
    category: "Sample QP",
    downloadUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2024-02-10",
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
    () => [...new Set(downloads.map((d) => d.course))],
    [downloads]
  );
  const [allResources, setAllResources] = useState([]);
  const dTime = (v) => (v ? new Date(v).getTime() : 0);

  const filtered = useMemo(() => {
    let list = [...downloads];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.course.toLowerCase().includes(q)
      );
    }

    if (courseFilter !== "all")
      list = list.filter((d) => d.course === courseFilter);

    if (categoryFilter !== "all")
      list = list.filter((d) => d.category === categoryFilter);

    list.sort((a, b) =>
      sortOrder === "newest"
        ? dTime(b.createdAt) - dTime(a.createdAt)
        : dTime(a.createdAt) - dTime(b.createdAt)
    );

    return list;
  }, [downloads, search, courseFilter, categoryFilter, sortOrder]);

  // -------------------------------------------------------
  // ✅ DOWNLOAD + SAVE LOCAL FILE URL (no redirects)
  // -------------------------------------------------------
  const handleDownload = async (item) => {
    try {
      const response = await fetch(item.downloadUrl);
      const blob = await response.blob();

      const localUrl = URL.createObjectURL(blob);

      const updatedDownloads = downloads.map((d) =>
        d.id === item.id ? { ...d, localUrl } : d
      );

      setDownloads(updatedDownloads);
      localStorage.setItem("edu_downloads", JSON.stringify(updatedDownloads));

      // Trigger actual download
      const link = document.createElement("a");
      link.href = localUrl;
      link.download = item.title;
      link.click();

      alert("File downloaded! Now you can click VIEW to open it.");
    } catch (e) {
      console.error(e);
      alert("Download failed");
    }
  };

  // -------------------------------------------------------
  // ✅ VIEW ONLY LOCAL DOWNLOADED FILE
  // -------------------------------------------------------
  const handleView = (item) => {
    if (item.localUrl) {
      window.open(item.localUrl, "_blank");
      return;
    }

    alert("Please download the file first to view it.");
  };

  const CATEGORY_LIST = [
    "Notes",
    "Assignments",
    "Sample QP",
    "External Links",
    "Images/Diagrams",
  ];

  const getAllResources = async () => {
    try {
      const response = await downloadAllResourcess();
      setAllResources(response.data.resources);
    } catch (error) {}
  };

  const getLessionBundels = async () => {
    try {
      const response = await lessionBundles();
      // setAllResources(response.data.resources);
    } catch (error) {}
  };

  useEffect(() => {
    getAllResources();
    getLessionBundels();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 md:px-10 py-6">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">Downloads</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-1/2">
            <Search size={18} className="text-gray-500" />
            <input
              className="bg-transparent w-full ml-2 outline-none text-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Course filter + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-1/2">
            <div className="relative w-full">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-3 py-2 pr-8"
              >
                <option value="all">All courses</option>
                {courseOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>

            <div className="relative w-full">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-3 py-2 pr-8"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>

        {/* Category buttons */}
        <div className="hidden md:flex gap-3 mt-5 flex-wrap">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg border text-sm ${
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
            {Array.isArray(allResources) &&
              allResources.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.course}</td>
                  <td className="p-3">{item.resourceType}</td>

                  {/* VIEW button */}
                  <td className="p-3">
                    <button
                      onClick={() => handleView(item)}
                      className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 flex items-center justify-center"
                    >
                      <Eye size={16} />
                    </button>
                  </td>

                  {/* DOWNLOAD button */}
                  <td className="p-3">
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center"
                    >
                      <CloudDownload size={18} />
                    </button>
                  </td>
                </tr>
              ))}

            {allResources.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No resources found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
