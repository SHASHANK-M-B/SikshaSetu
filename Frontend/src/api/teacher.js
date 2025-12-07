import client from "./client";

export const uploadResources = (data) =>
  client.post("/api/teacher/resource", data);

export const teacherDashbaord = () => client.get("/api/teacher/dashboard");
// courses
export const createCourse = (data) => client.post("/api/teacher/course", data);
export const getCourses = () => client.get("/api/teacher/courses");
export const deleteCourse = (id) => client.delete(`/api/teacher/course/${id}`);
export const updateCourse = (id, data) =>
  client.put(`/api/teacher/course/${id}`, data);
// Quizes
export const createQuiz = (data) => client.post("/api/teacher/quiz", data);
export const getAllQuizzes = () => client.get("/api/teacher/quizzes");
export const updateQuiz = (id, data) =>
  client.put(`/api/teacher/quiz/${id}`, data);
export const getQuizResponses = (id) =>
  client.get(`/api/teacher/quiz/${id}/responses`);
export const deleteQuiz = (id) => client.delete(`/api/teacher/quiz/${id}`);
// Doubt and discussion
export const getAllDiscussions = () => client.get("/api/teacher/discussions");
export const getDiscussionThread = (id) =>
  client.get(`/api/teacher/discussions/${id}`);
export const replyToDiscussion = (id, data) =>
  client.get(`/api/teacher/discussions/${id}/reply`, data);
export const updateDiscussionStatus = (id, data) =>
  client.get(`/api/teacher/discussions/${id}/reply`, data);
// analytics
export const getAllAnalytics = () => client.get("/api/teacher/analytics");
// recorded lecture
export const uploadRecordedLecture = (data) =>
  client.post("/api/teacher/content/upload", data);
export const getListOfRecordedLecture = () =>
  client.get("/api/teacher/content");
export const updateRecordedLecture = (id, data) =>
  client.put(`/api/teacher/content/${id}`, data);
export const deleteRecordedLecture = (id) =>
  client.delete(`/api/teacher/content/${id}`);

// Ask AI
export const askAI = (query) => client.post(`/api/teacher/ai/ask`, { query });

// ----------------- LIVE SESSION MANAGEMENT--------------

export const scheduleLiveClass = (data) =>
  client.post("/api/teacher/live-session/schedule", data);
