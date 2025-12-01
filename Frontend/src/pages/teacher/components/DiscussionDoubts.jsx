
import React, { useEffect, useState } from "react";
import {
    FiThumbsUp,
    FiMessageCircle,
    FiCheckCircle,
    FiSend,
    FiTrash2,
} from "react-icons/fi";

const load = (k, f) => {
    try {
        const raw = localStorage.getItem(k);
        return raw ? JSON.parse(raw) : f;
    } catch {
        return f;
    }
};
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);

export default function DiscussionDoubts() {
    const [doubts, setDoubts] = useState(() => load("edu_doubts", []));
    const [notifications, setNotifications] = useState(() =>
        load("edu_notifications", []),
    );

    const [teacherMsg, setTeacherMsg] = useState("");
    const [replyOpen, setReplyOpen] = useState(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => save("edu_doubts", doubts), [doubts]);
    useEffect(() => save("edu_notifications", notifications), [notifications]);

    const postTeacherMessage = (e) => {
        e.preventDefault();
        if (!teacherMsg.trim()) return;

        setNotifications((n) => [
            ...n,
            {
                id: uid("n_"),
                for: "student",
                message: teacherMsg,
                type: "broadcast",
                at: new Date().toISOString(),
            },
        ]);

        setTeacherMsg("");
        alert("Message sent to all students");
    };

    const like = (id) => {
        setDoubts((d) =>
            d.map((x) => (x.id === id ? { ...x, liked: true } : x)),
        );
    };

    const resolve = (id) => {
        setDoubts((d) =>
            d.map((x) => (x.id === id ? { ...x, status: "resolved" } : x)),
        );
    };

    const deleteDoubt = (id) => {
        if (!confirm("Delete this doubt?")) return;
        setDoubts((d) => d.filter((x) => x.id !== id));
    };

    const submitReply = (id) => {
        if (!replyText.trim()) return;

        setDoubts((d) =>
            d.map((x) =>
                x.id === id
                    ? {
                        ...x,
                        replies: [
                            ...x.replies,
                            {
                                id: uid("rep_"),
                                text: replyText,
                                at: new Date().toISOString(),
                                by: "Teacher",
                            },
                        ],
                    }
                    : x,
            ),
        );

        setReplyText("");
        setReplyOpen(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6">

            {/* TEACHER BROADCAST */}
            <form
                onSubmit={postTeacherMessage}
                className="bg-white border rounded-xl p-5"
            >
                <h3 className="font-bold text-lg mb-3">Message To All Students</h3>

                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        value={teacherMsg}
                        onChange={(e) => setTeacherMsg(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg p-2"
                    />

                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg border bg-blue-100 text-blue-800 hover:bg-blue-200 transition flex items-center gap-2"
                    >
                        <FiSend size={16} />
                        Send
                    </button>
                </div>
            </form>

            {/* DOUBTS LIST */}
            <h2 className="text-2xl font-bold">Student Doubts</h2>

            {doubts.length === 0 && (
                <div className="p-8 text-slate-500 bg-white border rounded-xl text-center">
                    No doubts yet.
                </div>
            )}

            <div className="space-y-4">
                {doubts.map((d) => (
                    <div
                        key={d.id}
                        className="bg-white border rounded-xl p-5"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-semibold text-lg">
                                    {d.student || "Student"}
                                </div>
                                <div className="text-slate-700 mt-1">
                                    {d.text}
                                </div>
                            </div>

                            <span
                                className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${d.status === "resolved"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                            >
                                {d.status || "open"}
                            </span>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex flex-wrap gap-2 mt-3">

                            {/* LIKE */}
                            <button
                                onClick={() => like(d.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-pink-100 text-pink-700"
                            >
                                <FiThumbsUp size={16} />
                                Like
                            </button>

                            {/* REPLY */}
                            <button
                                onClick={() => setReplyOpen(replyOpen === d.id ? null : d.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-blue-100 text-blue-800"
                            >
                                <FiMessageCircle size={16} />
                                Reply
                            </button>

                            {/* RESOLVE */}
                            <button
                                onClick={() => resolve(d.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-green-100 text-green-800"
                            >
                                <FiCheckCircle size={16} />
                                Resolve
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={() => deleteDoubt(d.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-red-100 text-red-800"
                            >
                                <FiTrash2 size={16} />
                                Delete
                            </button>
                        </div>

                        {/* REPLY SECTION */}
                        {replyOpen === d.id && (
                            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                                <input
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="flex-1 border rounded-lg p-2"
                                />
                                <button
                                    onClick={() => submitReply(d.id)}
                                    className="px-4 py-2 border bg-indigo-100 text-indigo-800 rounded-lg transition flex items-center gap-2"
                                >
                                    <FiSend size={16} />
                                    Send
                                </button>
                            </div>
                        )}

                        {/* REPLIES */}
                        {d.replies?.length > 0 && (
                            <div className="mt-4 border-t pt-3 space-y-2">
                                <div className="font-medium text-sm mb-1">
                                    Replies
                                </div>

                                {d.replies.map((r) => (
                                    <div
                                        key={r.id}
                                        className="bg-slate-50 border rounded-lg p-2"
                                    >
                                        <div className="text-sm">{r.text}</div>
                                        <div className="text-[10px] text-slate-500 mt-1">
                                            {new Date(r.at).toLocaleString()}
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
