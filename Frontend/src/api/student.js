import client from "./client";

export const getStudentDashboard = () => client.get("/api/student/dashboard");
export const getAllCourses = () => client.get("/api/student/courses");
export const joinLiveSession = () => client.get("/api/student/live-sessions");
export const getRecordedSessionList = () =>
  client.get("/api/student/recorded-sessions");
export const downloadAllResourcess = () => client.get("/api/student/resources");
export const lessionBundles = () => client.get("/api/student/bundles");
