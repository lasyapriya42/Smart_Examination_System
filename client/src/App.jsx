import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BlockRooms from "./pages/BlockRooms.jsx";
import HodDashboard from "./pages/HodDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import SelectYear from "./pages/SelectYear.jsx";
import SelectDepartment from "./pages/SelectDepartment.jsx";
import SelectSection from "./pages/SelectSection.jsx";
import StudentsList from "./pages/StudentsList.jsx";
import StaffDepartment from "./pages/StaffDepartment.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/block-rooms" element={<BlockRooms />} />
        <Route path="/hod/dashboard" element={<HodDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/select-year" element={<SelectYear />} />
        <Route path="/select-department/:year" element={<SelectDepartment />} />
        <Route path="/select-section/:year/:dept" element={<SelectSection />} />
        <Route path="/students-list/:year/:dept/:section" element={<StudentsList />} />
        <Route path="/staff-department/:dept" element={<StaffDepartment />} />
      </Routes>
    </BrowserRouter>
  );
}
