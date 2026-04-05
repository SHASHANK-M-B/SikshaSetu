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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-500">
      {/* HEADER & REFRESH */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Doubts</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and resolve class discussions in real-time.</p>
        </div>
        <button
          onClick={fetchDoubts}
          disabled={loading}
          className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all active:scale-95 disabled:opacity-50"
          title="Refresh List"
        >
          <FiRefreshCw className={`text-blue-600 ${loading ? "animate-spin" : ""}`} size={20} />
        </button>
      </div>

      {/* TEACHER BROADCAST */}
      <form
        onSubmit={postTeacherMessage}
        className="relative overflow-hidden bg-white border border-blue-100 shadow-xl shadow-blue-50/50 rounded-2xl p-6 ring-1 ring-blue-50"
      >
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-2xl" />

        <h3 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
          <span className="bg-blue-100 p-1.5 rounded-lg">📢</span>
          Class Broadcast
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <input
            value={teacherMsg}
            onChange={(e) => setTeacherMsg(e.target.value)}
            placeholder="Type an announcement for all students..."
            className="flex-1 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-700"
          />

          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 active:translate-y-0.5"
          >
            <FiSend size={18} />
            Post
          </button>
        </div>
      </form>

      {/* STATUS MESSAGES */}
      {loading && doubts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading discussion threads...</p>
        </div>
      )}

      {!loading && doubts.length === 0 && (
        <div className="p-12 text-slate-400 bg-white border-2 border-dashed border-gray-100 rounded-3xl text-center">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-lg font-medium">No doubts raised yet.</p>
          <p className="text-sm">New student queries will appear here.</p>
        </div>
      )}

      {/* DOUBTS LIST */}
      <div className="space-y-6">
        {doubts.map((d) => (
          <div
            key={d.id}
            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group"
          >
            {/* CARD HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-black text-xl text-gray-900 group-hover:text-blue-700 transition-colors">
                    {d.studentName || "Unknown Student"}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-bold border border-blue-100">
                    {d.course?.courseCode || d.subject || "General"}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-gray-800 text-lg leading-snug">{d.title}</h4>
                  <p className="text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                    {d.text}
                  </p>
                </div>

                <div className="text-[11px] font-medium text-gray-400 mt-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                  Posted: {d.createdAt
                    ? new Date(
                      d.createdAt._seconds
                        ? d.createdAt._seconds * 1000
                        : d.createdAt
                    ).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                    : "Just now"}
                </div>
              </div>

              <span
                className={`text-[10px] px-3 py-1.5 rounded-lg uppercase font-black tracking-tighter border ${d.status === "resolved"
                  ? "bg-green-50 text-green-600 border-green-100"
                  : "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
                  }`}
              >
                {d.status || "unresolved"}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-gray-50">
              <button
                onClick={() => like(d.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border transition-all active:scale-95 ${d.liked
                  ? "bg-pink-50 border-pink-100 text-pink-600 shadow-sm shadow-pink-100"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
              >
                <FiThumbsUp size={16} className={d.liked ? "fill-current" : ""} />
                {d.liked ? "Liked" : "Like"}
              </button>

              <button
                onClick={() => setReplyOpen(replyOpen === d.id ? null : d.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border transition-all active:scale-95 ${replyOpen === d.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
              >
                <FiMessageCircle size={16} />
                Reply ({d.replies ? d.replies.length : 0})
              </button>

              {d.status !== "resolved" && (
                <button
                  onClick={() => resolve(d.id)}
                  className="flex items-center gap-2 ml-auto px-4 py-2 text-sm font-bold rounded-xl border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  <FiCheckCircle size={16} />
                  Resolve
                </button>
              )}
            </div>

            {/* REPLY INPUT SECTION */}
            {replyOpen === d.id && (
              <div className="mt-5 p-4 bg-blue-50/30 border border-blue-50 rounded-2xl animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a clear explanation..."
                    className="flex-1 border border-blue-100 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                    autoFocus
                  />
                  <button
                    onClick={() => submitReply(d.id)}
                    disabled={replyingId === d.id}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {replyingId === d.id ? "Sending..." : <><FiSend size={16} /> Send</>}
                  </button>
                </div>
              </div>
            )}

            {/* REPLIES LIST */}
            {d.replies?.length > 0 && (
              <div className="mt-6 space-y-4 relative">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Discussion Thread
                  </span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                <div className="space-y-3">
                  {d.replies.map((r, idx) => (
                    <div
                      key={r.replyId || idx}
                      className={`relative border rounded-2xl p-4 transition-all ${r.role === "teacher"
                        ? "bg-blue-50/50 border-blue-100 ml-4 sm:ml-8"
                        : "bg-white border-gray-100 shadow-sm"
                        }`}
                    >
                      {/* Visual Connector for Teacher Replies */}
                      {r.role === "teacher" && (
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-blue-200 hidden sm:block" />
                      )}

                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={`text-xs font-black ${r.role === "teacher" ? "text-blue-700" : "text-gray-900"
                            }`}
                        >
                          {r.userName || r.by || "User"}
                          {r.role === "teacher" && (
                            <span className="ml-1 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded italic">Pro</span>
                          )}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400">
                          {r.createdAt ? new Date(r.createdAt._seconds ? r.createdAt._seconds * 1000 : r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed font-medium">
                        {r.messageText}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}