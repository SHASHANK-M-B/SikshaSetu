// import React, { useEffect, useState } from "react";
// import {
//   FiAlertTriangle,
//   FiCalendar,
//   FiBookOpen,
//   FiFileText,
//   FiClock,
// } from "react-icons/fi";
// import OverviewCard from "./ui/OverviewCard";
// import AlertBox from "./ui/AlertBox";
// import { getStudentDashboard } from "@/api/student";

// export default function Overview({ studentDetails, quizItems }) {
//   const pendingQuizzes = quizItems.filter((q) => q.status === "Pending").length;

//   const [studentDetailss, setStudentDetails] = useState(null);
//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       try {
//         const response = await getStudentDashboard();
//         setStudentDetails(response.data);
//       } catch (error) {
//         // alert("Error fetching student name", error);
//       }
//     };
//     fetchStudentDetails();
//   }, []);
//   return (
//     <div className="space-y-10">
//       <div>
//         <h2 className="text-4xl font-extrabold text-indigo-600">
//           Hello, {studentDetailss?.studentName}! 👋
//         </h2>
//         <p className="text-gray-600 text-lg mt-1">
//           Welcome back! Keep learning and growing 🚀
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <OverviewCard
//           icon={FiBookOpen}
//           title="Enrolled Courses"
//           value={studentDetailss?.quickStats?.enrolledCourses}
//           color="from-indigo-500 to-purple-500"
//         />
//         <OverviewCard
//           icon={FiFileText}
//           title="Compelted Quizes"
//           value={studentDetailss?.quickStats?.completedQuizzes}
//           color="from-red-500 to-orange-500"
//         />
//         <OverviewCard
//           icon={FiClock}
//           title="Active Session"
//           value={studentDetailss?.quickStats?.activeSessions}
//           color="from-blue-500 to-cyan-500"
//         />
//       </div>

//       <div>
//         <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
//           <FiAlertTriangle className="text-yellow-500" /> Important Alerts
//         </h3>

//         <div className="space-y-4 mt-4">
//           <AlertBox
//             title="Programming Final Exam Schedule Updated"
//             timestamp="2 hours ago"
//             type="announcement"
//           />

//           {pendingQuizzes > 0 && (
//             <AlertBox
//               title={`You have ${pendingQuizzes} pending quizzes.`}
//               timestamp="Due Soon"
//               type="danger"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiFileText,
  FiClock,
} from "react-icons/fi";
import { motion } from "framer-motion";
import OverviewCard from "./ui/OverviewCard";
import AlertBox from "./ui/AlertBox";

export default function Overview({ studentDetails, quizItems = [] }) {
  // 1. SAFE DATA CHECK: Prevent .filter() crash if quizItems is undefined
  const safeQuizItems = quizItems || [];
  const pendingQuizzesCount = safeQuizItems.filter((q) => q.status === "Pending").length;

  // 2. LOADING STATE: If parent hasn't sent studentDetails yet
  if (!studentDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-slate-100 rounded-lg mb-4"></div>
          <div className="h-4 w-64 bg-slate-50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* WELCOME SECTION */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
          Hello, {studentDetails?.studentName || "Learner"}! 👋
        </h2>
        <p className="text-slate-500 text-lg mt-1 font-medium">
          Welcome back! You're making great progress. 🚀
        </p>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          icon={FiBookOpen}
          title="Enrolled Courses"
          value={studentDetails?.quickStats?.enrolledCourses || 0}
          color="from-indigo-600 to-violet-600"
        />
        <OverviewCard
          icon={FiFileText}
          title="Completed Quizzes"
          value={studentDetails?.quickStats?.completedQuizzes || 0}
          color="from-rose-500 to-orange-500"
        />
        <OverviewCard
          icon={FiClock}
          title="Active Sessions"
          value={studentDetails?.quickStats?.activeSessions || 0}
          color="from-blue-600 to-cyan-500"
        />
      </div>

      {/* ALERTS SECTION */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500" /> Important Updates
          </h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
            New Notifications
          </span>
        </div>

        <div className="space-y-4">
          <AlertBox
            title="Programming Final Exam Schedule Updated"
            timestamp="2 hours ago"
            type="announcement"
          />

          {/* DYNAMIC ALERT FOR PENDING QUIZZES */}
          {pendingQuizzesCount > 0 && (
            <AlertBox
              title={`Action Required: You have ${pendingQuizzesCount} pending quizzes.`}
              timestamp="Due Soon"
              type="danger"
            />
          )}

          {/* FALLBACK IF NO ALERTS */}
          {pendingQuizzesCount === 0 && (
            <div className="p-6 border-2 border-dashed border-slate-100 rounded-[24px] text-center">
              <p className="text-slate-400 font-bold text-sm uppercase">All caught up! No urgent alerts.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}