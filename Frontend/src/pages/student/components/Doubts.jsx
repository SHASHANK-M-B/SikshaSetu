import React, { useState, useEffect } from "react";
import {
  getMyDiscussions,
  createDiscussion,
  getDiscussionThread,
  replyToDiscussion,
  markResolved,
} from "@/api/student";
import { FiPlus, FiMessageCircle, FiSend, FiX, FiCheck } from "react-icons/fi";

export default function Doubts() {
  const [view, setView] = useState("list"); // 'list', 'create', 'detail'
  const [doubts, setDoubts] = useState([]);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    description: "",
  });
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchMyDoubts();
  }, []);

  const fetchMyDoubts = async () => {
    try {
      setLoading(true);
      const { data } = await getMyDiscussions();
      setDoubts(data.discussions || []);
    } catch (error) {
      console.error("Failed to fetch doubts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.title || !formData.description) {
      alert("All fields are required");
      return;
    }
    try {
      setLoading(true);
      // Backend expects: subject, title, description
      await createDiscussion(formData);
      await fetchMyDoubts();
      setView("list");
      setFormData({ subject: "", title: "", description: "" });
    } catch (error) {
      console.error("Create failed", error);
      alert("Failed to create discussion");
    } finally {
      setLoading(false);
    }
  };

  const openDoubtDetail = async (id) => {
    try {
      setLoading(true);
      const { data } = await getDiscussionThread(id);
      setSelectedDoubt({
        ...data.discussion,
        replies: data.replies || [],
      });
      setView("detail");
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !selectedDoubt) return;
    try {
      const payload = { messageText: replyText };
      const { data } = await replyToDiscussion(
        selectedDoubt.discussionId,
        payload
      );

      const newReply = {
        ...data.reply,
        createdAt: data.reply.createdAt || new Date().toISOString(),
      };

      setSelectedDoubt((prev) => ({
        ...prev,
        replies: [...prev.replies, newReply],
      }));
      setReplyText("");
    } catch (error) {
      console.error("Reply failed", error);
    }
  };

  const handleResolve = async (id) => {
    try {
      await markResolved(id);
      // Update local state in list
      setDoubts((prev) =>
        prev.map((d) =>
          d.discussionId === id ? { ...d, status: "resolved" } : d
        )
      );
      // Update detail view if open
      if (selectedDoubt && selectedDoubt.discussionId === id) {
        setSelectedDoubt((prev) => ({ ...prev, status: "resolved" }));
      }
    } catch (error) {
      console.error("Resolve failed", error);
    }
  };

  // --- VIEW: CREATE DOUBT ---
  if (view === "create") {
    return (
      <div className="p-4 max-w-2xl mx-auto h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Ask a New Doubt</h2>
          <button
            onClick={() => setView("list")}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <form
          onSubmit={handleCreateSubmit}
          className="space-y-4 bg-white p-6 rounded-xl border shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Subject</option>
              <option value="AI">AI</option>
              <option value="VLSI">VLSI</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Short summary of your question"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Explain your doubt in detail..."
              rows={5}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? "Posting..." : "Post Doubt"}
          </button>
        </form>
      </div>
    );
  }

  // --- VIEW: DOUBT DETAIL ---
  if (view === "detail" && selectedDoubt) {
    return (
      <div className="h-[85vh] flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("list")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiX size={20} />
            </button>
            <div>
              <h2 className="font-bold text-lg leading-tight">
                {selectedDoubt.title}
              </h2>
              <p className="text-xs text-gray-500">{selectedDoubt.subject}</p>
            </div>
          </div>
          {selectedDoubt.status !== "resolved" && (
            <button
              onClick={() => handleResolve(selectedDoubt.discussionId)}
              className="text-xs flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold"
            >
              <FiCheck /> Mark Resolved
            </button>
          )}
          {selectedDoubt.status === "resolved" && (
            <span className="text-xs px-3 py-1 bg-gray-200 text-gray-600 rounded-full font-bold">
              Resolved
            </span>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Original Question */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap">
              {selectedDoubt.description}
            </p>
            <p className="text-xs text-gray-400 mt-2 text-right">
              {new Date(
                selectedDoubt.createdAt?._seconds
                  ? selectedDoubt.createdAt._seconds * 1000
                  : selectedDoubt.createdAt
              ).toLocaleString()}
            </p>
          </div>

          {/* Replies */}
          {selectedDoubt.replies.map((r, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                r.role === "student" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${
                  r.role === "student"
                    ? "bg-indigo-100 text-indigo-900 rounded-tr-none"
                    : "bg-white border text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="font-bold text-xs mb-1 opacity-70">
                  {r.userName || r.role}
                </p>
                <p>{r.messageText}</p>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {new Date(
                  r.createdAt?._seconds
                    ? r.createdAt._seconds * 1000
                    : r.createdAt
                ).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type a reply..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
            />
            <button
              onClick={handleReplySubmit}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: LIST ---
  return (
    <div className="p-4 h-[85vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">My Doubts</h1>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          <FiPlus /> New Doubt
        </button>
      </div>

      {loading && <div className="text-center py-10">Loading...</div>}

      <div className="flex-1 overflow-y-auto space-y-3">
        {!loading && doubts.length === 0 && (
          <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-xl">
            You haven't asked any doubts yet.
          </div>
        )}

        {doubts.map((d) => (
          <div
            key={d.discussionId}
            onClick={() => openDoubtDetail(d.discussionId)}
            className="bg-white p-4 rounded-xl border hover:border-indigo-300 shadow-sm cursor-pointer transition group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-800 group-hover:text-indigo-600">
                {d.title}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-bold ${
                  d.status === "resolved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {d.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {d.description || "No description preview"}
            </p>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
              <span>{d.subject}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <FiMessageCircle /> {d.replyCount || 0}
                </span>
                <span>
                  {new Date(
                    d.createdAt?._seconds
                      ? d.createdAt._seconds * 1000
                      : d.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
