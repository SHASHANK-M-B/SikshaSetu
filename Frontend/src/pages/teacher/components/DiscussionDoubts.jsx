// // components/DiscussionDoubts.jsx
// import React, { useEffect, useState } from "react";

// const load = (k, f) => {
//     try {
//         const raw = localStorage.getItem(k);
//         return raw ? JSON.parse(raw) : f;
//     } catch {
//         return f;
//     }
// };
// const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
// const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);

// export default function DiscussionDoubts() {
//     const [doubts, setDoubts] = useState(() => load("edu_doubts", []));
//     const [message, setMessage] = useState("");

//     useEffect(() => save("edu_doubts", doubts), [doubts]);

//     const post = (e) => {
//         e.preventDefault();
//         if (!message) return;

//         const entry = {
//             id: uid("d_"),
//             student: "Student (offline)",
//             text: message,
//             replies: [],
//             at: new Date().toISOString(),
//             status: "open"
//         };

//         setDoubts((d) => [entry, ...d]);
//         setMessage("");

//         alert("Doubt posted (demo)");
//     };

//     const reply = (id) => {
//         const text = prompt("Your reply");
//         if (!text) return;

//         setDoubts((d) =>
//             d.map((x) =>
//                 x.id === id
//                     ? {
//                         ...x,
//                         replies: [
//                             ...x.replies,
//                             { id: uid("dr_"), text, at: new Date().toISOString() }
//                         ]
//                     }
//                     : x
//             )
//         );
//     };

//     const close = (id) => {
//         setDoubts((d) =>
//             d.map((x) => (x.id === id ? { ...x, status: "resolved" } : x))
//         );
//     };

//     return (
//         <div className="max-w-3xl">
//             <h3 className="font-bold mb-3">Discussion & Doubts</h3>

//             <form onSubmit={post} className="flex gap-2 mb-3">
//                 <input
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a student doubt (simulate)"
//                     className="flex-1 p-2 border rounded"
//                 />

//                 <button className="px-4 py-2 bg-green-600 text-white rounded">
//                     Post
//                 </button>
//             </form>

//             <div className="space-y-2">
//                 {doubts.length === 0 && (
//                     <div className="text-slate-500">No doubts yet.</div>
//                 )}

//                 {doubts.map((d) => (
//                     <div
//                         key={d.id}
//                         className="p-3 bg-white/30 rounded-lg border border-white/10"
//                     >
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <div className="font-medium">{d.student}</div>
//                                 <div className="text-xs text-slate-600">{d.text}</div>
//                             </div>

//                             <div className="text-xs text-slate-500">{d.status}</div>
//                         </div>

//                         <div className="mt-2 flex gap-2">
//                             <button
//                                 onClick={() => reply(d.id)}
//                                 className="px-2 py-1 border rounded"
//                             >
//                                 Reply
//                             </button>

//                             <button
//                                 onClick={() => close(d.id)}
//                                 className="px-2 py-1 bg-indigo-600 text-white rounded"
//                             >
//                                 Resolve
//                             </button>
//                         </div>

//                         {d.replies?.length > 0 && (
//                             <div className="mt-2 text-xs">
//                                 <div className="font-semibold">Replies</div>

//                                 <ul className="mt-1 space-y-1">
//                                     {d.replies.map((r) => (
//                                         <li key={r.id} className="text-slate-700">
//                                             {r.text}{" "}
//                                             <span className="text-slate-400 text-[10px]">
//                                                 · {new Date(r.at).toLocaleString()}
//                                             </span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }



// components/DiscussionDoubts.jsx
// components/DiscussionDoubts.jsx
// components/DiscussionDoubts.jsx
// components/DiscussionDoubts.jsx
// components/DiscussionDoubts.jsx





// import React, { useEffect, useState } from "react";
// import {
//     FiThumbsUp,
//     FiMessageCircle,
//     FiCheckCircle,
//     FiSend,
//     FiTrash2,
// } from "react-icons/fi";

// const load = (k, f) => {
//     try {
//         const raw = localStorage.getItem(k);
//         return raw ? JSON.parse(raw) : f;
//     } catch {
//         return f;
//     }
// };
// const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
// const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);

// export default function DiscussionDoubts() {
//     const [doubts, setDoubts] = useState(() => load("edu_doubts", []));
//     const [notifications, setNotifications] = useState(() =>
//         load("edu_notifications", [])
//     );

//     const [teacherMsg, setTeacherMsg] = useState("");
//     const [replyOpen, setReplyOpen] = useState(null);
//     const [replyText, setReplyText] = useState("");

//     useEffect(() => save("edu_doubts", doubts), [doubts]);
//     useEffect(() => save("edu_notifications", notifications), [notifications]);

//     const postTeacherMessage = (e) => {
//         e.preventDefault();
//         if (!teacherMsg.trim()) return;

//         setNotifications((n) => [
//             ...n,
//             {
//                 id: uid("n_"),
//                 for: "student",
//                 message: teacherMsg,
//                 type: "broadcast",
//                 at: new Date().toISOString(),
//             },
//         ]);

//         setTeacherMsg("");
//         alert("Message sent to all students");
//     };

//     const like = (id) => {
//         setDoubts((d) =>
//             d.map((x) => (x.id === id ? { ...x, liked: true } : x))
//         );
//         setNotifications((n) => [
//             ...n,
//             {
//                 id: uid("n_"),
//                 for: "student",
//                 message: `Teacher liked your doubt`,
//                 at: new Date().toISOString(),
//             },
//         ]);
//     };

//     const resolve = (id) => {
//         setDoubts((d) =>
//             d.map((x) => (x.id === id ? { ...x, status: "resolved" } : x))
//         );
//     };

//     const deleteDoubt = (id) => {
//         if (!confirm("Delete this doubt?")) return;
//         setDoubts((d) => d.filter((x) => x.id !== id));
//     };

//     const submitReply = (id) => {
//         if (!replyText.trim()) return;

//         setDoubts((d) =>
//             d.map((x) =>
//                 x.id === id
//                     ? {
//                         ...x,
//                         replies: [
//                             ...x.replies,
//                             {
//                                 id: uid("rep_"),
//                                 text: replyText,
//                                 at: new Date().toISOString(),
//                                 by: "Teacher",
//                             },
//                         ],
//                     }
//                     : x
//             )
//         );

//         setNotifications((n) => [
//             ...n,
//             {
//                 id: uid("n_"),
//                 for: "student",
//                 message: `Teacher replied to your doubt`,
//                 at: new Date().toISOString(),
//             },
//         ]);

//         setReplyText("");
//         setReplyOpen(null);
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6 space-y-6">

//             {/* TEACHER BROADCAST */}
//             <form
//                 onSubmit={postTeacherMessage}
//                 className="bg-white border rounded-xl p-5 shadow-sm"
//             >
//                 <h3 className="font-bold text-lg mb-3">Message To All Students</h3>

//                 <div className="flex gap-2">
//                     <input
//                         value={teacherMsg}
//                         onChange={(e) => setTeacherMsg(e.target.value)}
//                         placeholder="Type a message..."
//                         className="flex-1 border rounded-lg p-2"
//                     />

//                     <button
//                         type="submit"
//                         className="px-4 py-2 rounded-lg border bg-blue-100 text-blue-800 hover:bg-blue-200 transition flex items-center gap-2"
//                     >
//                         <FiSend size={16} />
//                         Send
//                     </button>
//                 </div>
//             </form>

//             {/* DOUBTS LIST */}
//             <h2 className="text-2xl font-bold">Student Doubts</h2>

//             {doubts.length === 0 && (
//                 <div className="p-8 text-slate-500 bg-white border rounded-xl text-center shadow">
//                     No doubts yet.
//                 </div>
//             )}

//             <div className="space-y-4">
//                 {doubts.map((d) => (
//                     <div
//                         key={d.id}
//                         className="bg-white border rounded-xl p-5 shadow-sm"
//                     >
//                         {/* HEADER */}
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <div className="font-semibold text-lg">
//                                     {d.student || "Student"}
//                                 </div>
//                                 <div className="text-slate-700 mt-1">
//                                     {d.text}
//                                 </div>
//                             </div>

//                             <span
//                                 className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${
//                                     d.status === "resolved"
//                                         ? "bg-green-100 text-green-700"
//                                         : "bg-amber-100 text-amber-700"
//                                 }`}
//                             >
//                                 {d.status || "open"}
//                             </span>
//                         </div>

//                         {/* ACTION BUTTONS */}
//                         <div className="flex gap-3 mt-3">

//                             {/* LIKE */}
//                             <button
//                                 onClick={() => like(d.id)}
//                                 className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition
//                                 ${
//                                     d.liked
//                                         ? "bg-pink-200 text-pink-800 border-pink-300"
//                                         : "bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200"
//                                 }`}
//                             >
//                                 <FiThumbsUp size={16} />
//                                 Like
//                             </button>

//                             {/* REPLY */}
//                             <button
//                                 onClick={() => setReplyOpen(replyOpen === d.id ? null : d.id)}
//                                 className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
//                             >
//                                 <FiMessageCircle size={16} />
//                                 Reply
//                             </button>

//                             {/* RESOLVE */}
//                             <button
//                                 onClick={() => resolve(d.id)}
//                                 className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-green-100 text-green-800 hover:bg-green-200 transition"
//                             >
//                                 <FiCheckCircle size={16} />
//                                 Resolve
//                             </button>

//                             {/* DELETE */}
//                             <button
//                                 onClick={() => deleteDoubt(d.id)}
//                                 className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-red-100 text-red-800 hover:bg-red-200 transition"
//                             >
//                                 <FiTrash2 size={16} />
//                                 Delete
//                             </button>
//                         </div>

//                         {/* REPLY SECTION */}
//                         {replyOpen === d.id && (
//                             <div className="mt-3 flex gap-2">
//                                 <input
//                                     value={replyText}
//                                     onChange={(e) => setReplyText(e.target.value)}
//                                     placeholder="Write a reply..."
//                                     className="flex-1 border rounded-lg p-2"
//                                 />
//                                 <button
//                                     onClick={() => submitReply(d.id)}
//                                     className="px-4 py-2 border bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition flex items-center gap-2"
//                                 >
//                                     <FiSend size={16} />
//                                     Send
//                                 </button>
//                             </div>
//                         )}

//                         {/* REPLIES */}
//                         {d.replies?.length > 0 && (
//                             <div className="mt-4 border-t pt-3 space-y-2">
//                                 <div className="font-medium text-sm mb-1">
//                                     Replies
//                                 </div>

//                                 {d.replies.map((r) => (
//                                     <div
//                                         key={r.id}
//                                         className="bg-slate-50 border rounded-lg p-2"
//                                     >
//                                         <div className="text-sm">{r.text}</div>
//                                         <div className="text-[10px] text-slate-500 mt-1">
//                                             {new Date(r.at).toLocaleString()}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

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
                                className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${
                                    d.status === "resolved"
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
