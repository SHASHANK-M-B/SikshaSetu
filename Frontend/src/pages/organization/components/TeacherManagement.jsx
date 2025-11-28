

// import React, { useState } from "react";
// import { FiUsers, FiPlusCircle, FiTrash2 } from "react-icons/fi";

// export default function TeacherManagement({
//     teachers,
//     setTeachers,
//     removeTeacher,
//     viewTeacherDetails,
//     openInvite,
// }) {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");

//     const addTeacher = (e) => {
//         e.preventDefault();

//         const newId = Math.max(0, ...teachers.map((t) => t.id)) + 1;

//         const newTeacher = {
//             id: newId,
//             name,
//             email,
//             status: "Active",
//             sessions: 0,
//             reactions: 0,
//             doubts: 0,
//         };

//         setTeachers((prev) => [newTeacher, ...prev]);

//         setName("");
//         setEmail("");
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
//                     <FiUsers /> Manage Teachers ({teachers.length})
//                 </h2>

//                 <button
//                     onClick={() => openInvite("teacher")}
//                     className="px-3 py-2 bg-pink-600 text-white rounded"
//                 >
//                     Invite
//                 </button>
//             </div>

//             {/* Add New Teacher */}
//             <form
//                 onSubmit={addTeacher}
//                 className="flex gap-3 flex-wrap items-end bg-white p-4 rounded border"
//             >
//                 <input
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Teacher Name"
//                     required
//                     className="p-2 border rounded flex-1 min-w-[180px]"
//                 />

//                 <input
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Teacher Email"
//                     required
//                     className="p-2 border rounded flex-1 min-w-[220px]"
//                 />

//                 <button
//                     type="submit"
//                     className="px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-1"
//                 >
//                     <FiPlusCircle /> Add
//                 </button>
//             </form>

//             {/* Teachers List */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {teachers.map((teacher) => (
//                     <div
//                         key={teacher.id}
//                         className="p-4 bg-gray-50 border rounded-lg flex items-center justify-between"
//                     >
//                         <div>
//                             <div className="font-semibold">{teacher.name}</div>
//                             <div className="text-sm text-gray-500">
//                                 {teacher.email}
//                             </div>
//                             <div className="text-xs mt-1">
//                                 Sessions:{" "}
//                                 <span className="font-medium">
//                                     {teacher.sessions}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-2">
//                             <button
//                                 onClick={() => viewTeacherDetails(teacher)}
//                                 className="px-3 py-2 bg-white border rounded"
//                             >
//                                 View
//                             </button>

//                             <button
//                                 onClick={() => removeTeacher(teacher.id)}
//                                 className="p-2 bg-red-100 text-red-600 rounded-full"
//                             >
//                                 <FiTrash2 />
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


import React, { useState } from "react";
import { FiUsers, FiPlusCircle, FiTrash2 } from "react-icons/fi";

export default function TeacherManagement({
  teachers = [],
  setTeachers = () => {},
  removeTeacher = () => {},
  viewTeacherDetails = () => {}, // will show courses handled by expert
}) {
  // Local form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("AI");

  const SUBJECTS = ["AI", "VLSI", "Renewable Energy", "Others"];
  const CATEGORIES = ["All", ...SUBJECTS];
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add Expert Locally Only
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
      courses: ["Course 1", "Course 2"], // optional sample
    };

    setTeachers((prev) => [newExpert, ...(Array.isArray(prev) ? prev : teachers)]);

    setName("");
    setEmail("");
    setSubject("AI");

    alert("Expert added!");
  };

  // Filtering
  const filtered =
    selectedCategory === "All"
      ? teachers
      : teachers.filter((exp) => exp.subject === selectedCategory);

  // Dummy Stats
  const dummyStats = {
    totalExperts: teachers.length,
    activeExperts: 20,
    aiExperts: teachers.filter((t) => t.subject === "AI").length,
  };

  return (
    <div className="space-y-6 px-4 py-6">
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
        {/* Invite Button Removed */}
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

        <div className="ml-auto text-sm text-gray-500">{filtered.length} shown</div>
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
                <div className="text-sm text-gray-500 truncate">{expert.email}</div>

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
                  onClick={() => viewTeacherDetails(expert)} // SHOW COURSES HANDLED
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
    </div>
  );
}
