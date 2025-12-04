import React, { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiBookOpen,
  FiFileText,
  FiClock,
} from "react-icons/fi";
import OverviewCard from "./ui/OverviewCard";
import AlertBox from "./ui/AlertBox";
import { getStudentDashboard } from "@/api/student";

export default function Overview({ studentDetails, quizItems }) {
  const pendingQuizzes = quizItems.filter((q) => q.status === "Pending").length;
  console.log("Student Details in Overview:", studentDetails);
  const [studentDetailss, setStudentDetails] = useState(null);
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await getStudentDashboard();
        setStudentDetails(response.data);
      } catch (error) {
        // alert("Error fetching student name", error);
      }
    };
    fetchStudentDetails();
  }, []);
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-extrabold text-indigo-600">
          Hello, {studentDetailss?.studentName}! 👋
        </h2>
        <p className="text-gray-600 text-lg mt-1">
          Welcome back! Keep learning and growing 🚀
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          icon={FiBookOpen}
          title="Enrolled Courses"
          value="4"
          color="from-indigo-500 to-purple-500"
        />
        <OverviewCard
          icon={FiFileText}
          title="Pending Quizzes"
          value={pendingQuizzes}
          color="from-red-500 to-orange-500"
        />
        <OverviewCard
          icon={FiClock}
          title="Study Hours (Week)"
          value="15.5"
          color="from-blue-500 to-cyan-500"
        />
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FiAlertTriangle className="text-yellow-500" /> Important Alerts
        </h3>

        <div className="space-y-4 mt-4">
          <AlertBox
            title="Programming Final Exam Schedule Updated"
            timestamp="2 hours ago"
            type="announcement"
          />

          {pendingQuizzes > 0 && (
            <AlertBox
              title={`You have ${pendingQuizzes} pending quizzes.`}
              timestamp="Due Soon"
              type="danger"
            />
          )}
        </div>
      </div>
    </div>
  );
}
