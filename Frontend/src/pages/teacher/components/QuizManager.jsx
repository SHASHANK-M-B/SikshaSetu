


// // components/QuizManager.jsx
// // components/QuizManager.jsx
// import React, { useState, useEffect } from "react";
// import { FiPlus, FiTrash2, FiEye, FiEdit } from "react-icons/fi";

// const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
// const load = (k, f) => {
//   try {
//     const raw = localStorage.getItem(k);
//     return raw ? JSON.parse(raw) : f;
//   } catch {
//     return f;
//   }
// };

// const uid = () => Math.random().toString(36).slice(2, 9);

// export default function QuizManager() {
//   const [activeTab, setActiveTab] = useState("create");

//   // Form state
//   const [editingId, setEditingId] = useState(null);
//   const [title, setTitle] = useState("");
//   const [timeLimit, setTimeLimit] = useState("");
//   const [questions, setQuestions] = useState([]);

//   // Stored quizzes
//   const [quizzes, setQuizzes] = useState(() => load("edu_quizzes", []));
//   useEffect(() => save("edu_quizzes", quizzes), [quizzes]);

//   // View modal
//   const [viewQuiz, setViewQuiz] = useState(null);

//   // Add new question
//   const addQuestion = () => {
//     setQuestions((s) => [
//       ...s,
//       {
//         id: uid(),
//         q: "",
//         options: ["", ""],
//         correctIndex: 0,
//       },
//     ]);
//   };

//   // Update question
//   const updateQuestion = (id, patch) => {
//     setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
//   };

//   // Remove question
//   const removeQuestion = (id) => {
//     setQuestions((s) => s.filter((q) => q.id !== id));
//   };

//   // Publish (Save)
//   const publish = (e) => {
//     e.preventDefault();

//     if (!title || !questions.length) {
//       alert("Title + at least 1 question required!");
//       return;
//     }

//     if (editingId) {
//       // Update existing
//       setQuizzes((s) =>
//         s.map((q) =>
//           q.id === editingId
//             ? { ...q, title, timeLimit, questions }
//             : q
//         )
//       );
//       alert("Quiz Updated!");
//     } else {
//       // Create new quiz
//       const quiz = {
//         id: uid(),
//         title,
//         timeLimit,
//         questions,
//         createdAt: new Date().toISOString(),
//       };
//       setQuizzes((s) => [quiz, ...s]);
//       alert("Quiz Created!");
//     }

//     // Reset form
//     setTitle("");
//     setTimeLimit("");
//     setQuestions([]);
//     setEditingId(null);
//     setActiveTab("published");
//   };

//   // Load quiz into form for editing
//   const startEdit = (quiz) => {
//     setTitle(quiz.title);
//     setTimeLimit(quiz.timeLimit);
//     setQuestions(quiz.questions);
//     setEditingId(quiz.id);
//     setActiveTab("create");
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4">

//       {/* Tabs */}
//       <div className="bg-slate-100 w-fit rounded-full mb-5 flex gap-1 text-xs p-1">
//         <button
//           onClick={() => setActiveTab("create")}
//           className={`px-3 py-2 rounded-full ${
//             activeTab === "create" ? "bg-indigo-600 text-white" : ""
//           }`}
//         >
//           {editingId ? "Edit Quiz" : "Create Quiz"}
//         </button>
//         <button
//           onClick={() => setActiveTab("published")}
//           className={`px-3 py-2 rounded-full ${
//             activeTab === "published" ? "bg-indigo-600 text-white" : ""
//           }`}
//         >
//           Published
//         </button>
//       </div>

//       {/* TAB: CREATE */}
//       {activeTab === "create" && (
//         <div className="bg-white border p-4 rounded-xl space-y-4 shadow">
//           <input
//             placeholder="Quiz Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border rounded p-2"
//           />

//           <input
//             placeholder="Time limit (e.g. 30 minutes)"
//             value={timeLimit}
//             onChange={(e) => setTimeLimit(e.target.value)}
//             className="w-full border rounded p-2"
//           />

//           {/* Questions */}
//           {questions.map((q, idx) => (
//             <div key={q.id} className="p-3 border rounded bg-slate-50 space-y-2">
//               <input
//                 value={q.q}
//                 onChange={(e) => updateQuestion(q.id, { q: e.target.value })}
//                 className="w-full border rounded p-2"
//                 placeholder={`Question ${idx + 1}`}
//               />

//               {q.options.map((op, i) => (
//                 <input
//                   key={i}
//                   value={op}
//                   placeholder={`Option ${i + 1}`}
//                   onChange={(e) =>
//                     updateQuestion(q.id, {
//                       options: q.options.map((o, j) =>
//                         j === i ? e.target.value : o
//                       ),
//                     })
//                   }
//                   className="w-full border rounded p-2"
//                 />
//               ))}

//               <div className="text-xs flex gap-2 items-center">
//                 Correct:
//                 <select
//                   value={q.correctIndex}
//                   onChange={(e) =>
//                     updateQuestion(q.id, { correctIndex: Number(e.target.value) })
//                   }
//                   className="border rounded px-2"
//                 >
//                   {q.options.map((_, i) => (
//                     <option key={i} value={i}>
//                       Option {i + 1}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() =>
//                     updateQuestion(q.id, { options: [...q.options, ""] })
//                   }
//                   type="button"
//                   className="px-3 py-1 border rounded"
//                 >
//                   + Add Option
//                 </button>

//                 <button
//                   onClick={() => removeQuestion(q.id)}
//                   type="button"
//                   className="px-3 py-1 bg-red-600 text-white rounded"
//                 >
//                   Remove Question
//                 </button>
//               </div>
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addQuestion}
//             className="px-4 py-2 bg-indigo-500 text-white rounded flex items-center gap-1"
//           >
//             <FiPlus /> Add Question
//           </button>

//           <button
//             className="w-full px-4 py-2 bg-green-600 text-white rounded font-bold"
//             onClick={publish}
//           >
//             {editingId ? "Update Quiz" : "Publish Quiz"}
//           </button>
//         </div>
//       )}

//       {/* TAB: PUBLISHED LIST */}
//       {activeTab === "published" && (
//         <div className="bg-white border rounded-xl shadow p-4 space-y-3">
//           {quizzes.length === 0 && (
//             <div className="text-slate-500 text-center py-4">
//               Nothing published yet
//             </div>
//           )}

//           {quizzes.map((q) => (
//             <div
//               key={q.id}
//               className="border rounded-lg p-4 bg-slate-50 flex items-center justify-between hover:shadow transition"
//             >
//               <div>
//                 <div className="font-semibold text-sm">{q.title}</div>
//                 <div className="text-xs text-slate-600">
//                   {q.timeLimit || "No time limit"} •{" "}
//                   {new Date(q.createdAt).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="flex gap-2">

//                 {/* VIEW */}
//                 <button
//                   className="flex items-center gap-1 px-3 py-1 border rounded text-xs hover:bg-blue-600 hover:text-white transition"
//                   onClick={() => setViewQuiz(q)}
//                 >
//                   <FiEye /> View
//                 </button>

//                 {/* EDIT */}
//                 <button
//                   className="flex items-center gap-1 px-3 py-1 border rounded text-xs hover:bg-yellow-500 hover:text-white transition"
//                   onClick={() => startEdit(q)}
//                 >
//                   <FiEdit /> Edit
//                 </button>

//                 {/* DELETE */}
//                 <button
//                   className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
//                   onClick={() =>
//                     setQuizzes((s) => s.filter((item) => item.id !== q.id))
//                   }
//                 >
//                   <FiTrash2 /> Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* VIEW MODAL */}
//       {viewQuiz && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
//           <div className="bg-white p-5 rounded-xl max-w-xl w-full space-y-3">

//             <div className="text-lg font-bold">{viewQuiz.title}</div>
//             <div className="text-xs text-slate-600">
//               Time: {viewQuiz.timeLimit || "No limit"}
//             </div>

//             {viewQuiz.questions.map((q, i) => (
//               <div key={q.id} className="border p-3 rounded bg-slate-50">
//                 <div className="font-semibold mb-2">
//                   {i + 1}. {q.q}
//                 </div>

//                 {q.options.map((op, idx) => (
//                   <div
//                     key={idx}
//                     className={`p-2 rounded mb-1 text-sm ${
//                       idx === q.correctIndex ? "bg-green-200" : "bg-white"
//                     }`}
//                   >
//                     {op}
//                   </div>
//                 ))}
//               </div>
//             ))}

//             <button
//               className="w-full bg-indigo-600 text-white rounded py-2"
//               onClick={() => setViewQuiz(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }









// // components/QuizManager.jsx
// import React, { useState, useEffect } from "react";
// import { FiPlus } from "react-icons/fi";
//
// const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
// const load = (k, f) => {
//     try {
//         const raw = localStorage.getItem(k);
//         return raw ? JSON.parse(raw) : f;
//     } catch {
//         return f;
//     }
// };
// const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);
//
// export default function QuizManager() {
//     const [title, setTitle] = useState("");
//     const [timeLimit, setTimeLimit] = useState("");
//     const [questions, setQuestions] = useState([]);
//     const [quizzes, setQuizzes] = useState(() => load("edu_quizzes", []));
//
//     useEffect(() => save("edu_quizzes", quizzes), [quizzes]);
//
//     const addQuestion = () => {
//         setQuestions((s) => [...s, { id: uid("qq_"), q: "", options: ["", ""], correctIndex: 0 }]);
//     };
//
//     const updateQuestion = (id, patch) => {
//         setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
//     };
//
//     const removeQuestion = (id) => {
//         setQuestions((s) => s.filter((q) => q.id !== id));
//     };
//
//     const publish = (e) => {
//         e.preventDefault();
//         if (!title || questions.length === 0)
//             return alert("Title and at least 1 question required");
//
//         const newQuiz = {
//             id: uid("quiz_"),
//             title,
//             timeLimit,
//             questions,
//             createdAt: new Date().toISOString()
//         };
//
//         setQuizzes((s) => [newQuiz, ...s]);
//
//         setTitle("");
//         setTimeLimit("");
//         setQuestions([]);
//
//         alert("Quiz created (local)");
//     };
//
//     const pushToLive = (quizId) => {
//         const ev = new CustomEvent("edu_push_quiz", { detail: { quizId } });
//         window.dispatchEvent(ev);
//         alert("Quiz pushed to live students (demo)");
//     };
//
//     return (
//         <div className="max-w-3xl">
//             <h3 className="font-bold mb-3">Create Quiz & Polls</h3>
//
//             <form
//                 onSubmit={publish}
//                 className="bg-white/50 p-4 rounded-xl border border-white/20 space-y-3"
//             >
//                 <input
//                     placeholder="Quiz title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="w-full p-2 border rounded"
//                 />
//
//                 <input
//                     placeholder="Time limit (e.g., 30 mins)"
//                     value={timeLimit}
//                     onChange={(e) => setTimeLimit(e.target.value)}
//                     className="w-full p-2 border rounded"
//                 />
//
//                 <div className="space-y-2">
//                     {questions.map((q, idx) => (
//                         <div
//                             key={q.id}
//                             className="p-3 bg-white/30 rounded grid grid-cols-1
//                             md:grid-cols-5 gap-2 items-center"
//                         >
//                             <input
//                                 value={q.q}
//                                 onChange={(e) => updateQuestion(q.id, { q: e.target.value })}
//                                 placeholder={`Q${idx + 1}`}
//                                 className="col-span-3 p-2 border rounded"
//                             />
//
//                             <div className="col-span-2 flex flex-col gap-1">
//                                 {q.options.map((opt, i) => (
//                                     <input
//                                         key={i}
//                                         value={opt}
//                                         onChange={(e) =>
//                                             updateQuestion(q.id, {
//                                                 options: q.options.map((o, j) =>
//                                                     j === i ? e.target.value : o
//                                                 )
//                                             })
//                                         }
//                                         placeholder={`Option ${i + 1}`}
//                                         className="p-2 border rounded"
//                                     />
//                                 ))}
//
//                                 <div className="flex gap-1 items-center">
//                                     <span className="text-xs">Correct:</span>
//
//                                     <select
//                                         value={q.correctIndex}
//                                         onChange={(e) =>
//                                             updateQuestion(q.id, {
//                                                 correctIndex: Number(e.target.value)
//                                             })
//                                         }
//                                         className="p-1 border rounded"
//                                     >
//                                         {q.options.map((_, i) => (
//                                             <option key={i} value={i}>
//                                                 Opt {i + 1}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>
//
//                             <div className="col-span-full flex justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         updateQuestion(q.id, { options: [...q.options, ""] })
//                                     }
//                                     className="px-2 py-1 border rounded"
//                                 >
//                                     +Option
//                                 </button>
//
//                                 <button
//                                     type="button"
//                                     onClick={() => removeQuestion(q.id)}
//                                     className="px-2 py-1 bg-red-600 text-white rounded"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//
//                 <div className="flex gap-2">
//                     <button
//                         type="button"
//                         onClick={addQuestion}
//                         className="px-4 py-2 bg-white/20 rounded"
//                     >
//                         Add Question
//                     </button>
//
//                     <button className="px-4 py-2 bg-indigo-700 text-white rounded">
//                         Publish Quiz
//                     </button>
//                 </div>
//             </form>
//
//             <div className="mt-4">
//                 <h4 className="font-semibold mb-2">Published Quizzes</h4>
//
//                 <ul className="space-y-2">
//                     {quizzes.length === 0 && (
//                         <div className="text-slate-500">No quizzes yet.</div>
//                     )}
//
//                     {quizzes.map((q) => (
//                         <li
//                             key={q.id}
//                             className="p-3 bg-white/30 rounded-lg flex justify-between
//                             items-center border border-white/10"
//                         >
//                             <div>
//                                 <div className="font-medium">{q.title}</div>
//                                 <div className="text-xs text-slate-600">
//                                     {q.timeLimit} ·{" "}
//                                     {new Date(q.createdAt).toLocaleDateString()}
//                                 </div>
//                             </div>
//
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => pushToLive(q.id)}
//                                     className="px-3 py-1 bg-green-600 text-white rounded"
//                                 >
//                                     Push Live
//                                 </button>
//
//                                 <button
//                                     onClick={() => {
//                                         navigator.clipboard.writeText(q.id);
//                                         alert("Copied quiz id");
//                                     }}
//                                     className="px-3 py-1 border rounded"
//                                 >
//                                     Copy ID
//                                 </button>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }


////
// components/QuizManager.jsx
// components/QuizManager.jsx
// import React, { useState, useEffect } from "react";
// import { FiPlus, FiTrash2, FiEye, FiEdit } from "react-icons/fi";

// const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
// const load = (k, f) => {
//   try {
//     const raw = localStorage.getItem(k);
//     return raw ? JSON.parse(raw) : f;
//   } catch {
//     return f;
//   }
// };

// const uid = () => Math.random().toString(36).slice(2, 9);

// export default function QuizManager() {
//   const [activeTab, setActiveTab] = useState("create");

//   const [editingId, setEditingId] = useState(null);
//   const [title, setTitle] = useState("");
//   const [timeLimit, setTimeLimit] = useState("");
//   const [questions, setQuestions] = useState([]);

//   const [quizzes, setQuizzes] = useState(() => load("edu_quizzes", []));
//   useEffect(() => save("edu_quizzes", quizzes), [quizzes]);

//   const [viewQuiz, setViewQuiz] = useState(null);

//   const addQuestion = () => {
//     setQuestions((s) => [
//       ...s,
//       { id: uid(), q: "", options: ["", ""], correctIndex: 0 },
//     ]);
//   };

//   const updateQuestion = (id, patch) => {
//     setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
//   };

//   const removeQuestion = (id) => {
//     setQuestions((s) => s.filter((q) => q.id !== id));
//   };

//   const publish = (e) => {
//     e.preventDefault();
//     if (!title || !questions.length) return alert("Enter all fields");

//     if (editingId) {
//       setQuizzes((s) =>
//         s.map((q) =>
//           q.id === editingId ? { ...q, title, timeLimit, questions } : q
//         )
//       );
//       alert("Quiz Updated");
//     } else {
//       setQuizzes((s) => [
//         {
//           id: uid(),
//           title,
//           timeLimit,
//           questions,
//           createdAt: new Date().toISOString(),
//         },
//         ...s,
//       ]);
//       alert("Quiz Created!");
//     }

//     setTitle("");
//     setTimeLimit("");
//     setQuestions([]);
//     setEditingId(null);
//     setActiveTab("published");
//   };

//   const startEdit = (quiz) => {
//     setTitle(quiz.title);
//     setTimeLimit(quiz.timeLimit);
//     setQuestions(quiz.questions);
//     setEditingId(quiz.id);
//     setActiveTab("create");
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto p-4">

//       {/* TABS */}
//       <div className="flex gap-2 bg-slate-100 p-1 rounded-full w-fit mb-3">
//         <button
//           onClick={() => setActiveTab("create")}
//           className={`px-4 py-2 rounded-full text-xs ${
//             activeTab === "create" ? "bg-indigo-600 text-white" : ""
//           }`}
//         >
//           {editingId ? "Edit Quiz" : "Create Quiz"}
//         </button>

//         <button
//           onClick={() => setActiveTab("published")}
//           className={`px-4 py-2 rounded-full text-xs ${
//             activeTab === "published" ? "bg-indigo-600 text-white" : ""
//           }`}
//         >
//           Published
//         </button>
//       </div>

//       {/* CREATE */}
//       {activeTab === "create" && (
//         <div className="bg-white border p-4 rounded-xl space-y-3 w-full">

//           <input
//             placeholder="Quiz Title"
//             className="w-full border rounded p-2"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <input
//             placeholder="Time limit (ex: 30 min)"
//             className="w-full border rounded p-2"
//             value={timeLimit}
//             onChange={(e) => setTimeLimit(e.target.value)}
//           />

//           {questions.map((q, idx) => (
//             <div key={q.id} className="border rounded p-3 bg-slate-50 space-y-2">

//               <input
//                 placeholder={`Question ${idx + 1}`}
//                 className="w-full border rounded p-2"
//                 value={q.q}
//                 onChange={(e) => updateQuestion(q.id, { q: e.target.value })}
//               />

//               {q.options.map((op, i) => (
//                 <input
//                   key={i}
//                   className="w-full border rounded p-2"
//                   placeholder={`Option ${i + 1}`}
//                   value={op}
//                   onChange={(e) =>
//                     updateQuestion(q.id, {
//                       options: q.options.map((o, j) =>
//                         j === i ? e.target.value : o
//                       ),
//                     })
//                   }
//                 />
//               ))}

//               <select
//                 className="border rounded p-1 text-xs"
//                 value={q.correctIndex}
//                 onChange={(e) =>
//                   updateQuestion(q.id, { correctIndex: Number(e.target.value) })
//                 }
//               >
//                 {q.options.map((_, i) => (
//                   <option key={i} value={i}>
//                     Option {i + 1}
//                   </option>
//                 ))}
//               </select>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() =>
//                     updateQuestion(q.id, { options: [...q.options, ""] })
//                   }
//                   className="px-3 py-1 bg-slate-200 rounded text-xs"
//                   type="button"
//                 >
//                   + Add Option
//                 </button>

//                 <button
//                   onClick={() => removeQuestion(q.id)}
//                   type="button"
//                   className="px-3 py-1 bg-red-600 text-white rounded text-xs"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}

//           <button
//             onClick={addQuestion}
//             type="button"
//             className="bg-indigo-500 text-white rounded p-2 w-full text-sm"
//           >
//             + Add Question
//           </button>

//           <button
//             onClick={publish}
//             className="bg-green-600 text-white rounded p-2 w-full font-semibold"
//           >
//             {editingId ? "Update Quiz" : "Publish Quiz"}
//           </button>
//         </div>
//       )}

//       {/* PUBLISHED */}
//       {activeTab === "published" && (
//         <div className="bg-white border rounded-xl p-4 w-full space-y-2">
//           {quizzes.length === 0 && (
//             <div className="text-center text-slate-500 py-6 text-sm">
//               No quizzes published
//             </div>
//           )}

//           {quizzes.map((q) => (
//             <div
//               key={q.id}
//               className="border rounded p-3 bg-slate-50 flex flex-col sm:flex-row justify-between gap-3 w-full"
//             >
//               <div className="text-sm font-medium">{q.title}</div>

//               <div className="flex gap-2">

//                 <button
//                   onClick={() => setViewQuiz(q)}
//                   className="px-3 py-1 border rounded text-xs"
//                 >
//                   <FiEye />
//                 </button>

//                 <button
//                   onClick={() => startEdit(q)}
//                   className="px-3 py-1 border rounded text-xs"
//                 >
//                   <FiEdit />
//                 </button>

//                 <button
//                   onClick={() =>
//                     setQuizzes((s) => s.filter((item) => item.id !== q.id))
//                   }
//                   className="px-3 py-1 bg-red-600 text-white rounded text-xs"
//                 >
//                   <FiTrash2 />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* VIEW MODAL */}
//       {viewQuiz && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-3">
//           <div className="bg-white rounded-xl p-4 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3">

//             <div className="text-lg font-semibold">
//               {viewQuiz.title}
//             </div>

//             {viewQuiz.questions.map((q, i) => (
//               <div key={q.id} className="border rounded p-3 bg-slate-50">
//                 <div>{i + 1}. {q.q}</div>

//                 {q.options.map((op, idx) => (
//                   <div key={idx} className="text-sm px-2 py-1 border-b">
//                     {op}
//                   </div>
//                 ))}
//               </div>
//             ))}

//             <button
//               className="bg-indigo-500 text-white w-full rounded p-2"
//               onClick={() => setViewQuiz(null)}
//             >
//               Close
//             </button>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// components/QuizManager.jsx
// components/QuizManager.jsx
import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEye, FiEdit } from "react-icons/fi";

// --- localStorage helpers ---
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, f) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : f;
  } catch {
    return f;
  }
};

const uid = () => Math.random().toString(36).slice(2, 9);

export default function QuizManager() {
  // which tab is open
  const [activeTab, setActiveTab] = useState("create");

  // form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);

  // saved quizzes
  const [quizzes, setQuizzes] = useState(() => load("edu_quizzes", []));
  useEffect(() => save("edu_quizzes", quizzes), [quizzes]);

  // for view modal
  const [viewQuiz, setViewQuiz] = useState(null);

  // add question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: uid(), q: "", options: ["", ""], correctIndex: 0 },
    ]);
  };

  // update a question
  const updateQuestion = (id, patch) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );
  };

  // remove question
  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // publish / update quiz
  const publish = (e) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) {
      alert("Please enter a title and at least one question.");
      return;
    }

    if (editingId) {
      // update existing quiz
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === editingId ? { ...q, title, timeLimit, questions } : q
        )
      );
      alert("Quiz updated.");
    } else {
      // new quiz
      const quiz = {
        id: uid(),
        title,
        timeLimit,
        questions,
        createdAt: new Date().toISOString(),
      };
      setQuizzes((prev) => [quiz, ...prev]);
      alert("Quiz created.");
    }

    // reset form
    setTitle("");
    setTimeLimit("");
    setQuestions([]);
    setEditingId(null);
    setActiveTab("published");
  };

  // load quiz into form for editing
  const startEdit = (quiz) => {
    setTitle(quiz.title);
    setTimeLimit(quiz.timeLimit);
    setQuestions(quiz.questions);
    setEditingId(quiz.id);
    setActiveTab("create");
  };
  return (
    <div className="w-full max-w-3xl mx-auto p-4">

      {/* TAB SWITCH */}
      <div className="flex gap-2 bg-slate-100 rounded-full p-1 w-fit mb-4">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 text-xs rounded-full ${
            activeTab === "create" ? "bg-black text-white" : "text-black"
          }`}
        >
          {editingId ? "Edit Quiz" : "Create Quiz"}
        </button>

        <button
          onClick={() => setActiveTab("published")}
          className={`px-4 py-2 text-xs rounded-full ${
            activeTab === "published" ? "bg-black text-white" : "text-black"
          }`}
        >
          Published
        </button>
      </div>

      {/* === CREATE TAB === */}
      {activeTab === "create" && (
        <div className="w-full bg-white border border-slate-300 p-4 rounded-lg space-y-3">

          <input
            placeholder="Quiz Title"
            className="w-full border border-slate-300 rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Time limit (ex: 30 mins)"
            className="w-full border border-slate-300 rounded p-2"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
          {/* Question blocks */}
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="border border-slate-300 p-3 rounded-md bg-white space-y-2"
            >
              <input
                placeholder={`Question ${idx + 1}`}
                className="w-full border border-slate-300 rounded p-2"
                value={q.q}
                onChange={(e) => updateQuestion(q.id, { q: e.target.value })}
              />

              {q.options.map((op, i) => (
                <input
                  key={i}
                  placeholder={`Option ${i + 1}`}
                  className="w-full border border-slate-300 rounded p-2"
                  value={op}
                  onChange={(e) =>
                    updateQuestion(q.id, {
                      options: q.options.map((o, j) =>
                        j === i ? e.target.value : o
                      ),
                    })
                  }
                />
              ))}

              <div className="flex items-center gap-2 text-xs">
                Correct:
                <select
                  value={q.correctIndex}
                  onChange={(e) =>
                    updateQuestion(q.id, {
                      correctIndex: Number(e.target.value),
                    })
                  }
                  className="border border-slate-300 rounded p-1"
                >
                  {q.options.map((_, i) => (
                    <option key={i} value={i}>
                      Option {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(q.id, { options: [...q.options, ""] })
                  }
                  className="px-3 py-1 bg-slate-200 rounded text-xs"
                >
                  + Add Option
                </button>

                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                >
                  Remove Question
                </button>

              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full bg-black text-white rounded p-2 text-sm"
          >
            + Add Question
          </button>

          <button
            onClick={publish}
            className="w-full bg-green-600 text-white rounded p-2 text-sm font-semibold"
          >
            {editingId ? "Update Quiz" : "Publish Quiz"}
          </button>

        </div>
      )}
      {/* === PUBLISHED TAB === */}
      {activeTab === "published" && (
        <div className="w-full bg-white border border-slate-300 p-4 rounded-lg space-y-2">

          {quizzes.length === 0 && (
            <div className="text-center text-slate-600 py-6 text-sm">
              No quizzes published yet
            </div>
          )}

          {quizzes.map((q) => (
            <div
              key={q.id}
              className="border border-slate-300 rounded p-3 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="text-sm font-medium">{q.title}</div>

              <div className="flex gap-2">

                {/* VIEW */}
                <button
                  onClick={() => setViewQuiz(q)}
                  className="w-9 h-9 rounded-full border border-blue-500 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                >
                  <FiEye size={19} />
                </button>

                {/* EDIT */}
                <button
                  onClick={() => startEdit(q)}
                  className="w-9 h-9 rounded-full border border-yellow-500 text-yellow-600 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition"
                >
                  <FiEdit size={19} />
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    setQuizzes((prev) => prev.filter((item) => item.id !== q.id))
                  }
                  className="w-9 h-9 rounded-full border border-red-600 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                >
                  <FiTrash2 size={19} />
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
      {/* VIEW MODAL */}
      {viewQuiz && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-3">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3">

            <div className="text-lg font-semibold">
              {viewQuiz.title}
            </div>

            <div className="text-xs text-slate-600">
              {viewQuiz.timeLimit || "No time limit"}
            </div>

            {viewQuiz.questions.map((q, i) => (
              <div
                key={q.id}
                className="border border-slate-300 rounded p-3 bg-white space-y-1"
              >
                <div className="font-medium">
                  {i + 1}. {q.q}
                </div>

                {q.options.map((op, idx) => (
                  <div
                    key={idx}
                    className={`text-sm px-2 py-1 border ${
                      idx === q.correctIndex
                        ? "bg-green-200 border-green-400"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {op}
                  </div>
                ))}
              </div>
            ))}

            <button
              className="w-full bg-black text-white rounded p-2"
              onClick={() => setViewQuiz(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
