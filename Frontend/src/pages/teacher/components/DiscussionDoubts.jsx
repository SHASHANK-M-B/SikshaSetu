import React, { useEffect, useState } from "react";
import {
  getAllDiscussions,
  getDiscussionThread,
  replyToDiscussion,
  updateDiscussionStatus,
} from "@/api/teacher";
import {
  FiThumbsUp,
  FiMessageCircle,
  FiCheckCircle,
  FiSend,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import LoadingScreen from "@/components/ui/LoadingScreen";

const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);

export default function DiscussionDoubts() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Broadcast State
  const [teacherMsg, setTeacherMsg] = useState("");

  // Reply State
  const [replyOpen, setReplyOpen] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingId, setReplyingId] = useState(null);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      // 1. Get List
      const { data } = await getAllDiscussions();
      const basicList = data.discussions || [];

      // 2. Hydrate with Details (Description & Replies)
      // We fetch thread details for each to get the full description and replies
      const detailedDoubts = await Promise.all(
        basicList.map(async (item) => {
          try {
            const threadRes = await getDiscussionThread(item.discussionId);
            return {
              ...item,
              // Backend 'description' maps to UI 'text'
              text: threadRes.data.discussion.description || item.title,
              replies: threadRes.data.replies || [],
              id: item.discussionId,
            };
          } catch (e) {
            console.warn(`Failed to load thread for ${item.discussionId}`, e);
            return {
              ...item,
              id: item.discussionId,
              text: item.title,
              replies: [],
            };
          }
        })
      );

      setDoubts(detailedDoubts);
    } catch (error) {
      console.error("Failed to load discussions", error);
    } finally {
      setLoading(false);
    }
  };

  // --- BROADCAST (Simulation) ---
  const postTeacherMessage = (e) => {
    e.preventDefault();
    if (!teacherMsg.trim()) return;
    setTeacherMsg("");
    alert("Broadcast feature coming soon (Backend integration pending)");
  };

  // --- ACTIONS ---

  const like = (id) => {
    // Local optimistic update only (No backend endpoint for likes yet)
    setDoubts((d) => d.map((x) => (x.id === id ? { ...x, liked: true } : x)));
  };

  const resolve = async (id) => {
    try {
      // Optimistic update
      setDoubts((d) =>
        d.map((x) => (x.id === id ? { ...x, status: "resolved" } : x))
      );
      // API call: Payload must be an object { status: "resolved" }
      await updateDiscussionStatus(id, { status: "resolved" });
    } catch (error) {
      console.error("Failed to resolve", error);
      alert("Failed to update status");
      fetchDoubts(); // Revert on error
    }
  };

  const submitReply = async (id) => {
    if (!replyText.trim()) return;

    try {
      setReplyingId(id);

      // Backend expects { messageText: string }
      const payload = { messageText: replyText };
      const { data } = await replyToDiscussion(id, payload);

      const newReply = {
        id: data.reply.replyId || uid("rep_"),
        messageText: data.reply.messageText,
        createdAt: data.reply.createdAt, // Backend returns firestore timestamp or ISO
        userName: data.reply.userName || "Teacher",
        role: "teacher",
      };

      setDoubts((prev) =>
        prev.map((doubt) =>
          doubt.id === id
            ? { ...doubt, replies: [...(doubt.replies || []), newReply] }
            : doubt
        )
      );

      setReplyText("");
      // Optional: keep reply open or close it
      // setReplyOpen(null);
    } catch (error) {
      console.error("Reply failed", error);
      alert("Failed to send reply");
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {loading && doubts.length === 0 && <LoadingScreen message="Loading Discussions..." />}
      {/* HEADER & REFRESH */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Doubts</h2>
        <button
          onClick={fetchDoubts}
          disabled={loading}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          title="Refresh List"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* TEACHER BROADCAST */}
      <form
        onSubmit={postTeacherMessage}
        className="bg-white border border-blue-100 shadow-sm rounded-xl p-5 bg-gradient-to-r from-blue-50/50 to-transparent"
      >
        <h3 className="font-bold text-lg mb-3 text-blue-900">
          📢 Class Broadcast
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            required
            value={teacherMsg}
            onChange={(e) => setTeacherMsg(e.target.value)}
            placeholder="Type an announcement for all students... *"
            className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-md"
          >
            <FiSend size={16} />
            Post
          </button>
        </div>
      </form>

      {/* DOUBTS LIST */}
      {loading && doubts.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Loading discussion threads...
        </div>
      )}

      {!loading && doubts.length === 0 && (
        <div className="p-8 text-slate-500 bg-white border border-dashed rounded-xl text-center">
          No doubts raised yet.
        </div>
      )}

      <div className="space-y-4">
        {doubts.map((d) => (
          <div
            key={d.id}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:border-gray-300 transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-900">
                    {d.studentName || "Unknown Student"}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {d.course?.courseCode || d.subject || "General"}
                  </span>
                </div>

                {/* Title and Description */}
                <div className="mt-2">
                  <h4 className="font-semibold text-gray-800">{d.title}</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {d.text}
                  </p>
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  Posted:{" "}
                  {d.createdAt
                    ? new Date(
                        d.createdAt._seconds
                          ? d.createdAt._seconds * 1000
                          : d.createdAt
                      ).toLocaleString()
                    : "Just now"}
                </div>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wide ${
                  d.status === "resolved"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {d.status || "unresolved"}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => like(d.id)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition ${
                  d.liked
                    ? "bg-pink-50 border-pink-200 text-pink-600"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiThumbsUp size={16} />
                {d.liked ? "Liked" : "Like"}
              </button>

              <button
                onClick={() => setReplyOpen(replyOpen === d.id ? null : d.id)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition ${
                  replyOpen === d.id
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiMessageCircle size={16} />
                Reply ({d.replies ? d.replies.length : 0})
              </button>

              {d.status !== "resolved" && (
                <button
                  onClick={() => resolve(d.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition"
                >
                  <FiCheckCircle size={16} />
                  Resolve
                </button>
              )}
            </div>

            {/* REPLY SECTION */}
            {replyOpen === d.id && (
              <div className="mt-4 animate-in slide-in-from-top-2 fade-in">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a clear explanation... *"
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => submitReply(d.id)}
                    disabled={replyingId === d.id}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {replyingId === d.id ? (
                      "Sending..."
                    ) : (
                      <>
                        <FiSend size={16} /> Send
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* REPLIES LIST */}
            {d.replies?.length > 0 && (
              <div className="mt-4 space-y-3 bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Discussion Thread
                </div>
                {d.replies.map((r, idx) => (
                  <div
                    key={r.replyId || idx}
                    className={`border rounded-lg p-3 shadow-sm ${
                      r.role === "teacher"
                        ? "bg-blue-50 border-blue-100"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-xs font-bold ${
                          r.role === "teacher"
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {r.userName || r.by || "User"}
                        {r.role === "teacher" && " (Teacher)"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {r.createdAt
                          ? new Date(
                              r.createdAt._seconds
                                ? r.createdAt._seconds * 1000
                                : r.createdAt
                            ).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <div className="text-sm text-gray-800 mt-1">
                      {r.messageText}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}