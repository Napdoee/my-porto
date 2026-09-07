import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameLayout from "./layouts/GameLayout";
import QuestHome from "./pages/QuestHome";
import Profile from "./pages/Profile";
import ExperienceArchive from "./pages/ExperienceArchive";
import ProjectExplorer from "./pages/ProjectExplorer";
import ProjectCaseFile from "./pages/ProjectCaseFile";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminExperiences from "./pages/AdminExperiences";
import AdminProjects from "./pages/AdminProjects";
import AdminInquiries from "./pages/AdminInquiries";
import AdminSettings from "./pages/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<GameLayout />}>
          <Route path="/" element={<QuestHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/experience" element={<ExperienceArchive />} />
          <Route path="/projects" element={<ProjectExplorer />} />
          <Route path="/projects/:id" element={<ProjectCaseFile />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/experiences"
          element={
            <ProtectedRoute>
              <AdminExperiences />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inquiries"
          element={
            <ProtectedRoute>
              <AdminInquiries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
