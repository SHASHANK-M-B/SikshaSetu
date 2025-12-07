// components/TeacherAnalytics.jsx
import { getAllAnalytics } from "@/api/teacher";
import React, { useEffect, useState, useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";

// Removed the 'load' function as it is now strictly forbidden to use local storage data.

export default function TeacherAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);

  // API Call: Fetch and set analytics data
  const getAllAalaytics = async () => {
    try {
      const response = await getAllAnalytics();
      setAnalyticsData(response.data.analytics);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    getAllAalaytics();
  }, []);

  // --- Chart Preparation using Fetched Data ---

  // 1. Bar Chart: Mapping to Recent Activity Counts (Concrete Data)
  const recentActivityData = useMemo(() => {
    const activity = analyticsData?.recentActivity;

    if (!activity) {
      return null;
    }

    const labels = ["Courses", "Quizzes", "Sessions"];
    const data = [
      activity.coursesLast30Days,
      activity.quizzesLast30Days,
      activity.sessionsLast30Days,
    ];

    return {
      labels: labels,
      datasets: [
        {
          label: "Activity Last 30 Days",
          data: data,
          backgroundColor: "rgba(59,130,246,0.9)",
        },
      ],
    };
  }, [analyticsData]);

  // Bar Chart Options (Updated Title)
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Recent Activity Overview (Last 30 Days)" },
    },
    scales: {
      y: {
        min: 0,
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  // 2. Pie Chart: Mapping to Resource Breakdown (Concrete Data)
  const resourceTypeData = useMemo(() => {
    const resourceStats = analyticsData?.resourceStats?.byType;

    if (!resourceStats || Object.keys(resourceStats).length === 0) {
      return null;
    }

    const labels = Object.keys(resourceStats);
    const data = Object.values(resourceStats);

    return {
      labels: labels,
      datasets: [
        {
          label: "Resources by Type",
          data: data,
          backgroundColor: [
            "#10B981",
            "#F59E0B",
            "#8B5CF6",
            "#EF4444",
            "#3B82F6",
          ],
        },
      ],
    };
  }, [analyticsData]);

  // --- Data for Engagement Snapshot ---
  const overview = analyticsData?.overview;
  const engagement = analyticsData?.engagement;
  const quizStats = analyticsData?.quizStats;

  const totalLiveSessions = overview?.totalLiveSessions ?? 0;
  const totalResources = overview?.totalResources ?? 0;
  const totalDiscussions = overview?.totalDiscussions ?? 0;
  const avgQuizScore = engagement?.averageQuizScore ?? "N/A";
  const totalStudents = overview?.totalStudents ?? 0;
  const totalQuizzes = quizStats?.totalQuizzes ?? 0;

  // Helper to render No Data message
  const NoData = ({ message }) => (
    <div className="flex items-center justify-center h-full text-slate-500 italic">
      {message}
    </div>
  );

  // --- Render Logic ---
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity Bar Chart */}
        <div className="p-4 bg-white/40 rounded-xl border border-white/20">
          {recentActivityData ? (
            <Bar data={recentActivityData} options={barOptions} />
          ) : (
            <NoData message="No recent activity data available." />
          )}
        </div>

        {/* Resource Breakdown Pie Chart */}
        <div className="p-4 bg-white/40 rounded-xl border border-white/20">
          <h4 className="text-center font-semibold mb-3">Resource Breakdown</h4>
          <div className="h-64">
            {resourceTypeData ? (
              <Pie data={resourceTypeData} />
            ) : (
              <NoData message="No resource type data available." />
            )}
          </div>
        </div>
      </div>

      {/* Engagement Snapshot */}
      <div className="p-4 bg-white/30 rounded-xl border-l-4 border-indigo-400">
        <div className="font-semibold">Engagement Snapshot</div>

        <div className="text-sm text-slate-600">
          Sessions: {totalLiveSessions} · Uploads: {totalResources} ·
          Discussions: {totalDiscussions}
        </div>

        <div className="mt-2 text-xs text-slate-500">
          Avg. Quiz Score: {avgQuizScore} · Total Students: {totalStudents} ·
          Total Quizzes: {totalQuizzes}
        </div>
      </div>
    </div>
  );
}
