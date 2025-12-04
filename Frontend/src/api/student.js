import client from "./client";

export const getStudentDashboard = () => client.get("/api/student/dashboard");
