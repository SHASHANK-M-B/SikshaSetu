import client from "./client";

// ================= ORGANIZATION =================
// Register
export const registerOrg = (data) =>
  client.post("/api/organization/register", data);

// Login (Password) - Payload: { orgCode, email, password }
export const loginOrg = (data) =>
  client.post("/api/auth/organization/login", data);

// Login (OTP Request) - Payload: { orgCode, email }
export const requestOrgOtp = (data) =>
  client.post("/api/auth/organization/login/request-otp", data);

// Login (OTP Verify) - Payload: { orgCode, email, otp }
export const verifyOrgOtp = (data) =>
  client.post("/api/auth/organization/login/verify-otp", data);

// Fetch List
export const getOrgList = () => client.get("/api/organization/list");

// Fetch organisation details
export const getOrgData = () => client.get("/api/organization/dashboard");

// ================= TEACHER =================
// Register
export const registerTeacher = (data) =>
  client.post("/api/teacher/register", data);

// Login (Password) - Payload: { email, password }
export const loginTeacher = (data) =>
  client.post("/api/auth/teacher/login", data);

// Login (OTP Request) - Payload: { email }
export const requestTeacherOtp = (data) =>
  client.post("/api/auth/teacher/login/request-otp", data);

// Login (OTP Verify) - Payload: { email, otp }
export const verifyTeacherOtp = (data) =>
  client.post("/api/auth/teacher/login/verify-otp", data);

// ================= STUDENT =================
// Register
export const registerStudent = (data) =>
  client.post("/api/student/register", data);

// Login (Password) - Payload: { email, password }
export const loginStudent = (data) =>
  client.post("/api/auth/student/login", data);

// Login (OTP Request) - Payload: { email }
export const requestStudentOtp = (data) =>
  client.post("/api/auth/student/login/request-otp", data);

// Login (OTP Verify) - Payload: { email, otp }
export const verifyStudentOtp = (data) =>
  client.post("/api/auth/student/login/verify-otp", data);

// ================= SHARED =================
export const logoutUser = () => client.post("/api/auth/logout");
