// components/Downloads.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, Eye, CloudDownload } from "lucide-react";
import { downloadAllResourcess } from "@/api/student";

export default function Downloads() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch Resources from API
  const getAllResources = async () => {
    try {
      setLoading(true);
      const response = await downloadAllResourcess();
      // Backend returns { resources: [...] }
      if (response.data && response.data.resources) {
        setResources(response.data.resources);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllResources();
  }, []);

  // Helper to safely get unique course names
  const courseOptions = useMemo(() => {
    const courses = resources.map((r) => r.course?.courseName).filter((c) => c);
    return [...new Set(courses)];
  }, [resources]);

  // Helper to parse dates
  const dTime = (v) => {
    if (!v) return 0;
    if (v._seconds) return v._seconds * 1000;
    return new Date(v).getTime();
  };

  // Filter & Sort Logic
  const filtered = useMemo(() => {
    let list = [...resources];

    // 1. Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.course?.courseName?.toLowerCase().includes(q)
      );
    }

    // 2. Course Filter
    if (courseFilter !== "all") {
      list = list.filter((d) => d.course?.courseName === courseFilter);
    }

    // 3. Category Filter
    if (categoryFilter !== "all") {
      list = list.filter((d) => d.resourceType === categoryFilter);
    }

    // 4. Sorting
    list.sort((a, b) =>
      sortOrder === "newest"
        ? dTime(b.createdAt) - dTime(a.createdAt)
        : dTime(a.createdAt) - dTime(b.createdAt)
    );

    return list;
  }, [resources, search, courseFilter, categoryFilter, sortOrder]);

  // -------------------------------------------------------
  // ✅ VIEW / OPEN FILE
  // -------------------------------------------------------
  const handleView = (item) => {
    if (item.downloadUrl) {
      window.open(item.downloadUrl, "_blank");
    } else {
      alert("File URL not available.");
    }
  };

  // -------------------------------------------------------
  // ✅ DOWNLOAD FILE
  // -------------------------------------------------------
  const handleDownload = (item) => {
    // For cloud files, usually opening in a new tab triggers the browser's
    // native handling (view or download depending on file type).
    if (item.downloadUrl) {
      window.open(item.downloadUrl, "_blank");
    } else {
      alert("Download URL not available.");
    }
  };

  const CATEGORY_LIST = [
    "PDF Notes",
    "Assignment Sheets",
    "Sample Question Papers",
    "External Reference Links",
    "Images (Diagrams)",
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 md:px-10 py-6">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">
        Lesson Bundles
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-1/2">
            <Search size={18} className="text-gray-500" />
            <input
              className="bg-transparent w-full ml-2 outline-none text-sm"
              placeholder="Search by title or course..."
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
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                categoryFilter === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "hover:bg-gray-100 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              categoryFilter === "all"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "hover:bg-gray-100 border-gray-200"
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
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Loading resources...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((item) => (
                <tr
                  key={item.resourceId}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {item.title}
                  </td>
                  <td className="p-3 text-gray-600">
                    {item.course ? item.course.courseName : "General"}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {item.resourceType}
                    </span>
                  </td>

                  {/* VIEW button */}
                  <td className="p-3">
                    <button
                      onClick={() => handleView(item)}
                      className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 flex items-center justify-center transition"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  </td>

                  {/* DOWNLOAD button */}
                  <td className="p-3">
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center transition"
                      title="Download / Open"
                    >
                      <CloudDownload size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No resources found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}