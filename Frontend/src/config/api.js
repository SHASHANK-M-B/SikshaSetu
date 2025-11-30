// API Configuration
// Change this to switch between local and production backend

// For local development - update the port if your backend runs on a different port
const LOCAL_API_URL = "http://localhost:8928";

// Production API URL
const PRODUCTION_API_URL = "https://sikshasetu-backend.onrender.com";

// Set to true to use local backend, false for production
const USE_LOCAL = false;

// Export the base URL
export const API_BASE_URL = USE_LOCAL ? LOCAL_API_URL : PRODUCTION_API_URL;

// API Endpoints
export const API_ENDPOINTS = {
  ORGANIZATION_REGISTER: `${API_BASE_URL}/api/organization/register`,
  STUDENT_REGISTER: `${API_BASE_URL}/api/student/register`,
};

