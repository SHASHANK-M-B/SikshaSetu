import React, { useState } from "react";
import {
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiX
} from "react-icons/fi";

export default function StudentManagement() {
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Organization details
  const organizationName = "Presidency University";

  // Dummy student data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Priya Singh",
      email: "priya@mail.com",
      enrolled: "AI/ML",
      courses: ["AI/ML", "VLSI", "Renewable Energy"],
      attendance: "92%",
      quizScores: { Physics: "85%", Math: "72%" },
      streak: "15 days",
      badges: ["Top Learner", "Math Whiz"],
    },
    {
      id: 2,
      name: "Ravi Kumar",
      email: "ravi@mail.com",
      enrolled: "VLSI",
      courses: ["VLSI"],
      attendance: "88%",
      quizScores: { Physics: "78%", Math: "67%" },
      streak: "7 days",
      badges: ["Fast Learner"],
    },
    {
      id: 3,
      name: "Ananya Rao",
      email: "ananya@mail.com",
      enrolled: "Others",
      courses: ["Cyber Security", "Robotics"],
      attendance: "95%",
      quizScores: { Physics: "91%", Math: "88%" },
      streak: "22 days",
      badges: ["Top Learner", "Tech Explorer"],
    }
  ]);

  const validCourses = ["AI/ML", "VLSI", "Renewable Energy"];

  // group students by course (recomputed each render)
  const grouped = {
    "AI/ML": [],
    "VLSI": [],
    "Renewable Energy": [],
    "Others": [],
  };

  students.forEach((student) => {
    if (validCourses.includes(student.enrolled)) grouped[student.enrolled].push(student);
    else grouped["Others"].push(student);
  });

  const toggleCategory = (course) => {
    setOpenCategory(openCategory === course ? null : course);
  };

  // -----------------------
  // Pending join requests
  // -----------------------
  // Dummy pending requests so the menu is visible immediately
  const [pendingRequests, setPendingRequests] = useState([
    { id: "req-1", name: "Aman Verma", email: "aman@mail.com", course: "AI/ML", note: "Wants to join AI batch" },
    { id: "req-2", name: "Sana Kapoor", email: "sana@mail.com", course: "VLSI", note: "Has prior coursework" },
    { id: "req-3", name: "Rohit Patel", email: "rohit@mail.com", course: "Renewable Energy", note: "Looking for internship-linked course" },
  ]);

  // Accept request: add student to students list and remove from pending
  const acceptRequest = (req) => {
    // create a new student entry (id generated)
    const newId = Math.max(0, ...students.map(s => s.id)) + 1;
    const newStudent = {
      id: newId,
      name: req.name,
      email: req.email,
      enrolled: req.course,
      courses: [req.course],
      attendance: "0%",
      quizScores: {},
      streak: "0 days",
      badges: [],
    };

    setStudents(prev => [newStudent, ...prev]);
    setPendingRequests(prev => prev.filter(p => p.id !== req.id));
  };

  // Decline request: remove from pending only
  const declineRequest = (req) => {
    setPendingRequests(prev => prev.filter(p => p.id !== req.id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* ORG HEADER CLEAN (NO DP) */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-xl shadow flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            {organizationName}
          </h1>
          <p className="text-sm text-white/80">
            Student Management System
          </p>
        </div>
      </div>

      {/* Students Header */}
      <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
        <FiUsers /> Students ({students.length})
      </h2>

      {/* Category Wise Listing */}
      <div className="space-y-4">
        {Object.keys(grouped).map((course) => (
          <div key={course} className="border rounded-lg bg-white shadow">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-lg bg-gray-100"
              onClick={() => toggleCategory(course)}
            >
              <span>
                {course} ({grouped[course].length})
              </span>
              {openCategory === course ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {openCategory === course && (
              <div className="overflow-auto">
                <table className="min-w-full bg-white text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {grouped[course].map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{student.id}</td>
                        <td className="p-3">{student.name}</td>
                        <td className="p-3">{student.email}</td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Student Details Popup */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-purple-700">
                Student - {selectedStudent.name}
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-600 hover:text-black"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-lg font-semibold">{selectedStudent.name}</p>
              <p className="text-sm text-gray-600">{selectedStudent.email}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold text-purple-700">
                Courses: {selectedStudent.courses.length}
              </p>
              <ul className="mt-2 list-disc pl-6 text-sm text-purple-900">
                {selectedStudent.courses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold text-green-700">Attendance</p>
              <p className="text-lg font-bold">{selectedStudent.attendance}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-700">Recent Quiz Scores</p>
              <ul className="mt-2 text-sm text-blue-900 space-y-1">
                {Object.keys(selectedStudent.quizScores).map((sub) => (
                  <li key={sub}>
                    {sub}: <strong>{selectedStudent.quizScores[sub]}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="font-semibold text-yellow-700">Streak & Badges</p>
              <p className="text-sm mt-1">Streak: {selectedStudent.streak}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedStudent.badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs bg-yellow-200 rounded-full"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          Horizontal Pending Requests Menu
         ========================= */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">New Join Requests</h3>

        {pendingRequests.length === 0 ? (
          <div className="p-4 bg-gray-50 border rounded text-gray-600">No new join requests.</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-2">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="min-w-[300px] p-4 bg-white border rounded-lg flex-shrink-0 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-semibold text-base">{req.name}</div>
                    <div className="text-sm text-gray-500 truncate">{req.email}</div>

                    <div className="mt-3 text-sm">
                      <div className="text-xs text-gray-400">Course</div>
                      <div className="px-2 py-1 mt-1 inline-block border rounded text-sm bg-white">
                        {req.course ?? "—"}
                      </div>

                      {req.note && (
                        <div className="mt-2 text-xs text-gray-600">{req.note}</div>
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

    </div>
  );
}

