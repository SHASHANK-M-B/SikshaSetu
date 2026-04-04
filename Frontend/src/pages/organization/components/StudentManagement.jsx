import {
  approveStudent,
  getAllStudent,
  getPendingStudents,
  rejectStudent,
} from "@/api/admin";
import { Trophy } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { FiUsers, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Function to transform backend student data into the required structure
const transformStudentData = (backendStudents) => {
  return backendStudents.map((student) => ({
    id: student.studentId, // Use studentId as the unique ID
    name: student.studentName,
    email: student.email,
    enrolled: student.subject, // Map 'subject' to 'enrolled'
    // --- Dummy Data for Stats (as backend only provides core info) ---
    // You must fetch or calculate these stats separately if needed later
    courses: [student.subject], // For display in modal
    attendance: "N/A",
    quizScores: { Subject: "N/A" },
    streak: "N/A",
    badges: ["New Member"],
  }));
};

export default function StudentManagement({ organisationData }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // States for backend data
  const [allStudents, setAllStudents] = useState([]); // Stores raw data from API
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------
  // Student Data Processing
  // -----------------------

  const validCourses = ["AI/ML", "VLSI", "Renewable Energy"];

  // 1. Transform and memoize the active student list
  const activeStudents = useMemo(() => {
    return transformStudentData(allStudents);
  }, [allStudents]);

  // 2. Group active students by course (uses the transformed data)
  const grouped = useMemo(() => {
    const initialGroup = {
      "AI/ML": [],
      VLSI: [],
      "Renewable Energy": [],
      Others: [],
    };

    activeStudents.forEach((student) => {
      const course =
        student.enrolled && validCourses.includes(student.enrolled)
          ? student.enrolled
          : "Others";
      initialGroup[course].push(student);
    });

    return initialGroup;
  }, [activeStudents]);

  const toggleCategory = (course) => {
    setOpenCategory(openCategory === course ? null : course);
  };

  // -----------------------
  // API Calls
  // -----------------------
  const fetchPendingRequests = async () => {
    try {
      // NOTE: Ensure organisationData is correctly loaded before calling API
      if (!organisationData?.orgId) return;
      const response = await getPendingStudents(organisationData.orgId);
      console.log(response, "student requests");
      setPendingRequests(response.data.students || []);
    } catch (error) {
      console.error("Error fetching pending student requests:", error);
    }
  };

  const getAllAstudentsList = async () => {
    try {
      const response = await getAllStudent();
      console.log(response.data.students, "All approved students");
      // Filter students by orgId if getAllStudent returns all students,
      // otherwise, assume the backend filters by the admin's organization.
      setAllStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching all students:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (organisationData?.orgId) {
        setLoading(true);
        try {
          await Promise.all([fetchPendingRequests(), getAllAstudentsList()]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [organisationData]); // Dependency on organisationData

  // Accept request: fetch updated lists
  const acceptRequest = async (req) => {
    try {
      await approveStudent(req.studentId);
      // Refresh both lists after acceptance
      await Promise.all([fetchPendingRequests(), getAllAstudentsList()]);
      console.log("Student approved successfully.");
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  // Decline request: fetch updated pending list
  const declineRequest = async (req) => {
    try {
      await rejectStudent(req.studentId, "Not eligible at this time");
      await fetchPendingRequests(); // Only refresh pending list
      console.log("Student rejected successfully.");
    } catch (error) {
      console.error("Error rejecting student:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {loading && <LoadingScreen message="Loading Student Management..." />}
      {/* ORG HEADER */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-xl shadow flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            {organisationData?.orgName}
          </h1>
          <p className="text-sm text-white/80">Student Management System</p>
        </div>
      </div>

      {/* Students Header */}
      <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
        <FiUsers /> Students ({activeStudents.length})
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
                      <tr
                        key={student.id}
                        className="border-b hover:bg-gray-50"
                      >
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
                {/* Courses list now uses the dynamic 'subject' from backend */}
                {selectedStudent.courses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Note: The following blocks will display "N/A" for missing data */}
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
          <div className="p-4 bg-gray-50 border rounded text-gray-600">
            No new join requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-2">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="min-w-[300px] p-4 bg-white border rounded-lg flex-shrink-0 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-semibold text-base">
                      {req.studentName}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {req.email}
                    </div>

                    <div className="mt-3 text-sm">
                      <div className="text-xs text-gray-400">Course</div>
                      <div className="px-2 py-1 mt-1 inline-block border rounded text-sm bg-white">
                        {req.subject}
                      </div>

                      {req.note && (
                        <div className="mt-2 text-xs text-gray-600">
                          {req.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => acceptRequest(req)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded cursor-pointer "
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineRequest(req)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded border cursor-pointer"
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
