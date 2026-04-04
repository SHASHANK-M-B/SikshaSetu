import axios from "axios";

// const BASE_URL = "https://sikshasetu-backend-1030932275340.asia-south1.run.app";
const BASE_URL = "http://localhost:8928";

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default client;
