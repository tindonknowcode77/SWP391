import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Import các trang
import HospitalHome from './pages/HospitalHome';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import HIVDepartment from './pages/HIVDepartment';
import Resources from './pages/Resources';
import TreatmentPlan from './pages/TreatmentPlan';
import MedicationManager from './pages/MedicationManager';
import AppointmentManager from './pages/AppointmentManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Trang chủ chính của ứng dụng */}
          <Route path="/" element={<Home />} />
          
          {/* Trang chủ bệnh viện */}
          <Route path="/hospital" element={<HospitalHome />} />
          
          {/* Các trang xác thực */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Các trang thuộc bệnh viện */}
          <Route path="/hospital/gioi-thieu" element={<div>Trang Giới thiệu</div>} />
          <Route path="/hospital/chuyen-khoa" element={<div>Trang Chuyên khoa</div>} />
          <Route path="/hospital/lich-kham" element={<div>Trang Lịch khám</div>} />
          <Route path="/hospital/tin-tuc" element={<div>Trang Tin tức</div>} />
          <Route path="/hospital/lien-he" element={<div>Trang Liên hệ</div>} />
          
          {/* Các trang chức năng của ứng dụng */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/hiv-department" element={<HIVDepartment />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/treatment-plan" element={<TreatmentPlan />} />
          <Route path="/medication" element={<MedicationManager />} />
          <Route path="/appointments" element={<AppointmentManager />} />
          
          {/* Chuyển hướng cho các URL không hợp lệ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;