// components/TeacherAnalytics.jsx
import { getAllAnalytics } from "@/api/teacher";
import React, { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";

const load = (k, f) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : f;
  } catch {
    return f;
  }
};

export default function TeacherAnalytics() {
  const quizzes = load("edu_quizzes", []);
  const uploads = load("edu_uploads", []);
  const sessions = load("edu_class_sessions", []);
  const reactions = load("edu_reactions", []);
  const responses = load("edu_quiz_responses", []);

  const quizLabels = quizzes.slice(0, 6).map((q) => q.title || q.id);

  const quizData = quizzes.slice(0, 6).map((q) => {
    const rs = responses.filter((r) => r.quiz === q.title);
    if (rs.length === 0) return Math.round(60 + Math.random() * 30);
    return Math.round(rs.reduce((s, r) => s + r.score, 0) / rs.length);
  });

  const attendanceLabels = load("edu_courses", []).map((c) => c.name);

  const attendanceData = attendanceLabels.map(() =>
    Math.round(60 + Math.random() * 40)
  );

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Quiz Performance Over Time (sample)" },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Score (%)",
        },
      },
    },
  };

  const quizScoreData = {
    labels: quizLabels.length ? quizLabels : ["Quiz 1", "Quiz 2"],
    datasets: [
      {
        label: "Avg. Class Score",
        data: quizData.length ? quizData : [78, 85],
        backgroundColor: "rgba(59,130,246,0.9)",
      },
    ],
  };

  const attendanceDataObj = {
    labels: attendanceLabels.length
      ? attendanceLabels
      : ["Physics 101", "Chem 302"],
    datasets: [
      {
        label: "Attendance",
        data: attendanceData.length ? attendanceData : [95, 88],
        backgroundColor: ["#10B981", "#F59E0B", "#8B5CF6"],
      },
    ],
  };

  const getAllAalaytics = async () => {
    try {
      const response = await getAllAnalytics();
    } catch (error) {}
  };

  useEffect(() => {
    getAllAalaytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 bg-white/40 rounded-xl border border-white/20">
          <Bar data={quizScoreData} options={barOptions} />
        </div>

        <div className="p-4 bg-white/40 rounded-xl border border-white/20">
          <h4 className="text-center font-semibold mb-3">
            Attendance Breakdown
          </h4>

          <div className="h-64">
            <Pie data={attendanceDataObj} />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/30 rounded-xl border-l-4 border-indigo-400">
        <div className="font-semibold">Engagement Snapshot</div>

        <div className="text-sm text-slate-600">
          Sessions: {sessions.length} · Uploads: {uploads.length} · Reactions:{" "}
          {reactions.length}
        </div>
      </div>
    </div>
  );
}
