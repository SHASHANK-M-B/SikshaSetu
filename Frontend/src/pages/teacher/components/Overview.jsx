import React, { useState } from "react";
import {
  FiUpload,
  FiVideo,
  FiFileText,
  FiUsers,
  FiBookOpen,
  FiTrendingUp,
  FiUser,
  FiX,
  FiEye,
  FiDownload,
} from "react-icons/fi";

/**
 * Overview (single expert)
 * - Modal heading "Certificate of Excellence in Teaching"
 * - Default expert includes a Certificate of Excellence in Teaching
 * - Single declaration of downloadFile (no duplication)
 */

export default function Overview({ user, setActive = () => {} }) {
  const [showProfile, setShowProfile] = useState(false);

  // Default expert (override by passing user prop)
  const expert = user || {
    name: "Aishwarya Rao",
    email: "aishwarya.rao@edu.in",
    subject: "AI",
    completedCourses: [
      {
        id: "ai-excellence-2024",
        title: "Certificate of Excellence in Teaching",
        date: "2024-11-28",
        certificateUrl: "/certificates/excellence-teaching-2024.pdf",
        award: "High Student Feedback & Outstanding Delivery",
        sessions: 50,
      },
    ],
  };

  // initials helper
  const initials = (name) => {
    if (!name || typeof name !== "string") return "??";
    return name
      .split(" ")
      .map((s) => (s && s[0] ? s[0] : ""))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Programmatically download a file (single declaration)
  const downloadFile = (url, filename) => {
    if (!url) return;
    try {
      const a = document.createElement("a");
      a.href = url;
      if (filename) a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Defensive handler to open profile modal
  const handleOpenProfile = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    setShowProfile(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-sm font-medium text-gray-700">{expert.name}</span>
            <span className="text-xs text-gray-500">{expert.subject}</span>
          </div>

          <button
            type="button"
            onClick={handleOpenProfile}
            className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow hover:bg-indigo-700"
            aria-label="Open profile"
          >
            <FiUser size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/70 rounded-xl p-4 border shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiUsers className="text-green-700" size={22} />
            </div>
            <div>
              <h3 className="font-semibold">Total Students</h3>
              <p className="text-gray-600 text-sm">168</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-xl p-4 border shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiBookOpen className="text-blue-700" size={22} />
            </div>
            <div>
              <h3 className="font-semibold">Active Courses</h3>
              <p className="text-gray-600 text-sm">3 Running</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-xl p-4 border shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiTrendingUp className="text-purple-700" size={22} />
            </div>
            <div>
              <h3 className="font-semibold">Avg Quiz Score</h3>
              <p className="text-gray-600 text-sm">82.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow border">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setActive("uploads")}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex flex-col items-center gap-2 font-semibold"
          >
            <FiUpload size={24} /> Upload Resource
          </button>

          <button
            type="button"
            onClick={() => setActive("recorded")}
            className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex flex-col items-center gap-2 font-semibold"
          >
            <FiFileText size={24} /> Recorded Sessions
          </button>

          <button
            type="button"
            onClick={() => setActive("liveClass")}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl flex flex-col items-center gap-2 font-semibold"
          >
            <FiVideo size={24} /> Start Live Class
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowProfile(false)} />

          <div className="relative z-50 max-w-lg w-full bg-white rounded-xl shadow-lg overflow-auto">
            {/* Profile Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
                  {initials(expert.name)}
                </div>
                <div>
                  <div className="font-semibold">{expert.name}</div>
                  <div className="text-sm text-gray-500">{expert.email}</div>
                  <div className="text-xs text-gray-400">Subject: {expert.subject}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* download latest certificate programmatically */}
                <button
                  type="button"
                  onClick={() => {
                    const url = expert.completedCourses && expert.completedCourses.length
                      ? expert.completedCourses[0].certificateUrl
                      : "/sample-certificate.pdf";
                    const filename = url.split("/").pop() || "certificate.pdf";
                    downloadFile(url, filename);
                  }}
                  title="Download latest certificate"
                  className="p-2 rounded hover:bg-gray-100 text-indigo-600"
                  aria-label="Download Latest Certificate"
                >
                  <FiDownload size={20} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowProfile(false)}
                  className="p-2 rounded hover:bg-gray-100 ml-2"
                  aria-label="Close profile"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* CERTIFICATE OF EXCELLENCE IN TEACHING */}
            <div className="p-4">
              <h4 className="font-semibold mb-3">Certificate of Excellence in Teaching</h4>

              {(!expert.completedCourses || expert.completedCourses.length === 0) ? (
                <div className="text-sm text-gray-600">No certificates available.</div>
              ) : (
                <div className="space-y-3">
                  {/* show excellence certificates first */}
                  {expert.completedCourses
                    .filter(c => c.title.toLowerCase().includes("excellence"))
                    .map((c) => (
                      <div key={c.id} className="flex items-center gap-3 p-3 border rounded bg-gradient-to-r from-yellow-50 to-white">
                        <div className="w-20 h-14 bg-yellow-100 rounded flex items-center justify-center text-xs font-semibold text-gray-700">
                          EX
                        </div>

                        <div className="flex-1">
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs text-gray-500">Awarded: {c.date}</div>
                          {c.award && <div className="text-xs text-indigo-600 mt-1">Reason: {c.award}</div>}
                          {c.sessions !== undefined && <div className="text-xs text-gray-500 mt-0.5">Teaching sessions: {c.sessions}</div>}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(c.certificateUrl || "#", "_blank", "noopener,noreferrer")}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1 text-sm"
                          >
                            <FiEye /> View
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const filename = (c.certificateUrl || "#").split("/").pop() || "certificate.pdf";
                              downloadFile(c.certificateUrl || "#", filename);
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1 text-sm"
                          >
                            <FiDownload /> Download
                          </button>
                        </div>
                      </div>
                    ))}

                  {/* remaining certificates */}
                  {expert.completedCourses
                    .filter(c => !c.title.toLowerCase().includes("excellence"))
                    .map((c) => (
                      <div key={c.id} className="flex items-center gap-3 p-3 border rounded bg-gray-50">
                        <div className="w-20 h-14 bg-gray-100 rounded flex items-center justify-center text-xs font-semibold text-gray-600">
                          {c.title.split(" ").slice(0, 2).map((s) => s[0]).join("")}
                        </div>

                        <div className="flex-1">
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs text-gray-500">Completed: {c.date}</div>
                          {c.award && <div className="text-xs text-indigo-600 mt-1">Award: {c.award}</div>}
                          {c.sessions !== undefined && <div className="text-xs text-gray-500 mt-0.5">Teaching sessions: {c.sessions}</div>}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(c.certificateUrl || "#", "_blank", "noopener,noreferrer")}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1 text-sm"
                          >
                            <FiEye /> View
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const filename = (c.certificateUrl || "#").split("/").pop() || "certificate.pdf";
                              downloadFile(c.certificateUrl || "#", filename);
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1 text-sm"
                          >
                            <FiDownload /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t text-right">
              <button type="button" onClick={() => setShowProfile(false)} className="px-4 py-2 bg-gray-100 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}