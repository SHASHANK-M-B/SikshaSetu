// import axios from 'axios';

// const client = axios.create({
//   baseURL: 'http://localhost:8928',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// export default client;
// import axios from "axios";

// const client = axios.create({
//   baseURL: "http://localhost:8928",
//   // baseURL: "https://sikshasetu-backend-1030932275340.asia-south1.run.app/",
//   withCredentials: true,
// });

// // Interceptor to adjust headers for FormData requests
// client.interceptors.request.use((config) => {
//   if (config.data instanceof FormData) {
//     config.headers["Content-Type"] = "multipart/form-data";
//   } else {
//     config.headers["Content-Type"] = "application/json";
//   }
//   return config;
// });

// export default client;

import axios from "axios";

// Automatically detect if running on Localhost or deployed
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const client = axios.create({
  // If local, use localhost:8928. If deployed, use your Cloud Run URL.
  // CRITICAL: Remove the trailing slash '/' at the end of the Cloud Run URL
  baseURL: isLocal 
    ? "http://localhost:8928" 
    : "https://sikshasetu-backend-856403064619.asia-south2.run.app", // <--- UPDATE THIS URL TO MATCH YOUR ACTUAL CLOUD RUN URL
  withCredentials: true,
});

// Interceptor to adjust headers for FormData requests
client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default client;
