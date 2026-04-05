import { approveTeacher, getTeacherRequest, rejectTeacher } from "@/api/admin";
import React, { useState, useMemo, useEffect } from "react";
import { FiUsers, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function TeacherManagement({
  teachers = [],
  setTeachers = () => {},
  removeTeacher = () => {},
  viewTeacherDetails = null, // <-- parent may pass this

  onAcceptRequest = null,
  onDeclineRequest = null,
}) {
  // Local form states for adding experts manually
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("AI");

  const SUBJECTS = ["AI", "VLSI", "Renewable Energy", "Others"];
  const CATEGORIES = ["All", ...SUBJECTS];
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal / details state (for local View modal)
  const [detailExpert, setDetailExpert] = useState(null);

  // Add Expert Locally Only (from the form)
  const addTeacher = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newId = Math.max(0, ...teachers.map((t) => Number(t.id) || 0)) + 1;

    const newExpert = {
      id: newId,
      name,
      email,
      subject,
      sessions: 0,
      courses: ["Course 1", "Course 2"],
    };

    setTeachers((prev) => [
      newExpert,
      ...(Array.isArray(prev) ? prev : teachers),
    ]);

    setName("");
    setEmail("");
    setSubject("AI");

    alert("Expert added!");
  };

  // Filtering experts by category
  const filtered =
    selectedCategory === "All"
      ? teachers
      : teachers.filter((exp) => exp.subject === selectedCategory);

  // Dummy Stats
  const dummyStats = useMemo(
    () => ({
      totalExperts: teachers.length,
      activeExperts: 20,
      aiExperts: teachers.filter((t) => t.subject === "AI").length,
    }),
    [teachers]
  );

  // Accept a pending request
  const acceptRequest = async (request) => {
    try {
      const response = await approveTeacher(request.teacherId);

      await fetchRequests();
    } catch (e) {
      console.error("onAcceptRequest error:", e);
    }

    // Add expert to teachers locally
    const newId = Math.max(0, ...teachers.map((t) => Number(t.id) || 0)) + 1;
    const newExpert = {
      id: newId,
      name: request.name,
      email: request.email,
      subject: request.course || request.subject || "Unknown",
      sessions: 0,
      courses: request.courses ?? [],
    };
    setTeachers((prev) => [
      newExpert,
      ...(Array.isArray(prev) ? prev : teachers),
    ]);

    setLocalPending((prev) => prev.filter((r) => r.id !== request.id));
  };

  // Decline a pending request
  const declineRequest = async (request) => {
    try {
      const response = await rejectTeacher(
        request.teacherId,
        "Not a good fit at this time"
      );

      await fetchRequests();
    } catch (e) {
      console.error("onDeclineRequest error:", e);
    }

    setLocalPending((prev) => prev.filter((r) => r.id !== request.id));
  };

  // View handler: only open local modal if parent DOES NOT provide viewTeacherDetails
  const handleView = (expert) => {
    // If parent passed a handler, call it and DO NOT open local modal (prevents duplicate)
    if (typeof viewTeacherDetails === "function") {
      try {
        viewTeacherDetails(expert);
      } catch (e) {
        console.error("viewTeacherDetails error:", e);
      }
      return;
    }

    // Otherwise open local modal
    setDetailExpert(expert);
  };

  // Close detail modal
  const closeDetail = () => setDetailExpert(null);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await getTeacherRequest();

      setRequests(response.data.teachers || []);
    } catch (error) {
      console.error("Failed to fetch teacher requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6 px-4 py-6">
      {loading && <LoadingScreen message="Loading Teacher Requests..." />}
      {/* ===== Stats Row ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border p-4 rounded">
        <div className="flex-1">
          <div className="text-xs text-gray-500">Total Experts</div>
          <div className="text-2xl font-bold text-purple-800">
            {dummyStats.totalExperts}
          </div>
        </div>

        <div className="flex-1">
          <div className="text-xs text-gray-500">Active Experts</div>
          <div className="text-2xl font-bold text-green-700">
            {dummyStats.activeExperts}
          </div>
        </div>

        <div className="flex-1">
          <div className="text-xs text-gray-500">AI Experts</div>
          <div className="text-2xl font-bold text-blue-700">
            {dummyStats.aiExperts}
          </div>
        </div>
      </div>

      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
          <FiUsers /> Experts ({filtered.length})
        </h2>
      </div>

      {/* ===== Category Filter ===== */}
      <div className="flex flex-wrap gap-2 items-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            type="button"
            className={`px-3 py-1 rounded-full border text-sm ${
              selectedCategory === cat
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="ml-auto text-sm text-gray-500">
          {filtered.length} shown
        </div>
      </div>

      {/* ===== Add New Expert ===== */}
      <form
        onSubmit={addTeacher}
        className="flex flex-col sm:flex-row gap-3 items-stretch bg-white p-4 rounded border"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Expert Name"
          className="w-full sm:flex-1 p-2 border rounded"
          required
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Expert Email"
          type="email"
          className="w-full sm:flex-1 p-2 border rounded"
          required
        />

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full sm:w-40 p-2 border rounded"
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-2 justify-center"
        >
          <FiPlusCircle />
          Add
        </button>
      </form>

      {/* ===== Experts Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="p-4 bg-yellow-50 border rounded text-gray-700">
            No experts found.
          </div>
        ) : (
          filtered.map((expert) => (
            <div
              key={expert.id}
              className="p-4 bg-gray-50 border rounded-lg flex flex-col sm:flex-row justify-between gap-3"
            >
              <div className="flex-1">
                <div className="font-semibold text-base">
                  Expert Name: {expert.name}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {expert.email}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <div>
                    Sessions:{" "}
                    <span className="font-medium">{expert.sessions ?? 0}</span>
                  </div>

                  <div className="px-2 py-0.5 border rounded text-xs">
                    {expert.subject}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2">
                <button
                  onClick={() => handleView(expert)}
                  className="w-full sm:w-auto px-3 py-2 bg-white border rounded text-sm"
                >
                  View
                </button>

                <button
                  onClick={() => removeTeacher(expert.id)}
                  className="w-full sm:w-auto p-2 bg-red-100 text-red-600 rounded-full"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== Horizontal Pending Requests Menu ===== */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">New Teacher Requests</h3>

        {requests.length === 0 ? (
          <div className="p-4 bg-gray-50 border rounded text-gray-600">
            No new requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-2">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="min-w-[300px] p-4 bg-white border rounded-lg flex-shrink-0 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-semibold text-base">{req.name}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {req.email}
                    </div>

                    <div className="mt-3 text-sm">
                      <div className="text-xs text-gray-400">Course</div>
                      <div className="px-2 py-1 mt-1 inline-block border rounded text-sm bg-gray-50">
                        {req.course ?? req.subject ?? "—"}
                      </div>

                      {req.message && (
                        <div className="mt-2 text-xs text-gray-600">
                          {req.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => acceptRequest(req)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineRequest(req)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded border"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== Detail Modal (shows courses for selected expert) ===== */}
      {detailExpert && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-semibold">{detailExpert.name}</h4>
                <div className="text-sm text-gray-500">
                  {detailExpert.email}
                </div>
              </div>
              <button
                onClick={closeDetail}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Courses handled:</div>
              {Array.isArray(detailExpert.courses) &&
              detailExpert.courses.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {detailExpert.courses.map((c, i) => (
                    <li key={i} className="text-gray-700">
                      {c}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">No courses listed.</div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeDetail}
                className="px-3 py-2 bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
