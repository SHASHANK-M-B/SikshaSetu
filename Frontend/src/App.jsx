import { Routes, Route } from "react-router-dom";

// Landing
import LandingPage from "./pages/landing/LandingPage";



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
