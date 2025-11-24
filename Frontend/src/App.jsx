import { Routes, Route } from "react-router-dom";

// Landing
import LandingPage from "./pages/landing/LandingPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RoleSelectPage from "./pages/auth/RoleSelectPage";

// Dashboards
import OrganizationDashboard from "./pages/organization/OrganizationDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

// Developer Pages  ✅ Added
import DeveloperLogin from "./pages/Developer/DeveloperLogin";
import DeveloperPanel from "./pages/Developer/DeveloperPanel";


function App() {
  return (
    <>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/select" element={<RoleSelectPage />} />

        {/* Dashboards */}
        <Route
          path="/organization/dashboard"
          element={<OrganizationDashboard />}
        />
        <Route
          path="/teacher/dashboard"
          element={<TeacherDashboard />}
        />
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* Developer (Hidden Admin Access) */}
        <Route path="/developer/login" element={<DeveloperLogin />} />
        <Route path="/developer/panel" element={<DeveloperPanel />} />
      </Routes>
    </>
  );
}

export default App;
