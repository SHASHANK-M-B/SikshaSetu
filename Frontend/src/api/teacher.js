import client from "./client";

export const uploadResources = (data) => client.post("/api/teacher/resource",data);
