import client from "./client";

// Dashboard & Courses
export const getStudentDashboard = () => client.get("/api/student/dashboard");
export const getAllCourses = () => client.get("/api/student/courses");

// Live Sessions (FIXED URL)
export const getStudentLiveSessions = () =>
  client.get("/api/student/live-session/available");

export const getLiveSessionDetails = (id) =>
  client.get(`/api/student/live-session/${id}`);
export const joinSessionAPI = (id) =>
  client.post(`/api/student/live-session/${id}/join`); // not new
export const getSessionChat = (id) =>
  client.get(`/api/student/live-session/${id}/chat`);
export const sendChatMessage = (id, data) =>
  client.post(`/api/student/live-session/${id}/chat`, data);
export const markUnderstood = (id) =>
  client.post(`/api/student/live-session/${id}/understood`);
export const getSessionMaterials = (id) =>
  client.get(`/api/student/live-session/${id}/materials`);

// Recorded & Resources
export const getRecordedSessionList = () =>
  client.get("/api/student/recorded-sessions");
export const downloadAllResourcess = () => client.get("/api/student/resources");
export const lessionBundles = () => client.get("/api/student/bundles");

// Analytics
export const getStudentAnalytics = (params) =>
  client.get("/api/student/analytics", { params });
