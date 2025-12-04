import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/landing/LandingPage";
import OrganizationDashboard from "./pages/organization/OrganizationDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import DeveloperLogin from "./pages/Developer/DeveloperLogin";
import DeveloperPanel from "./pages/Developer/DeveloperPanel";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/developer/login" element={<DeveloperLogin />} />
        <Route path="/developer/panel" element={<DeveloperPanel />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;