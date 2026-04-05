import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./pages/landing/LandingPage";
import OrganizationDashboard from "./pages/organization/OrganizationDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import DeveloperLogin from "./pages/Developer/DeveloperLogin";
import DeveloperPanel from "./pages/Developer/DeveloperPanel";
import LoadingScreen from "./components/ui/LoadingScreen";

// Main Content Wrapper to handle loading state from AuthContext
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Initializing ShikshaSetu" />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/developer/login" element={<DeveloperLogin />} />
      <Route path="/developer/panel" element={<DeveloperPanel />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;