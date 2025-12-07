// import axios from 'axios';

// const client = axios.create({
//   baseURL: 'http://localhost:8928',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// export default client;
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8928",
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
