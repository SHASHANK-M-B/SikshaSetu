import client from "./client";

export const getPendingOrganizations = () =>
  client.get("/api/admin/organizations/pending");

export const approveOrganization = (orgId) =>
  client.put(`/api/admin/organizations/approve/${orgId}`);

export const rejectOrganization = (orgId, reason) =>
  client.put(`/api/admin/organizations/reject/${orgId}`, { reason });

export const getPendingTeachers = (orgId) =>
  client.get(`/api/admin/teachers/pending/${orgId}`);

export const approveTeacher = (teacherId) =>
  client.put(`/api/admin/teachers/approve/${teacherId}`);

export const rejectTeacher = (teacherId, reason) =>
  client.put(`/api/admin/teachers/reject/${teacherId}`, { reason });

export const getPendingStudents = (orgId) =>
  client.get(`/api/admin/students/pending/${orgId}`);

export const approveStudent = (studentId) =>
  client.put(`/api/admin/students/approve/${studentId}`);

export const rejectStudent = (studentId, reason) =>
  client.put(`/api/admin/students/reject/${studentId}`, { reason });

export const getAllOrganizations = () =>
  client.get("/api/admin/organizations/all");

export const getTeacherRequest = () =>
  client.get("/api/organization/teachers/requests");

export const getAllStudent = () => client.get("/api/organization/students");
