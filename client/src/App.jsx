import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import NewAdmission from './pages/NewAdmission';
import AdmissionPreview from './pages/AdmissionPreview';
import StudentProfilePage from './pages/StudentProfilePage';
import IDCards from './pages/IDCards';
import TransferCertificates from './pages/TransferCertificates';
import FeeManagement from './pages/FeeManagement';
import RemovedStudents from './pages/RemovedStudents';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global Notifications Alert Handler */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#1b3a6b',
              fontSize: '13px',
              fontWeight: '500',
              border: '1px solid #e7f0fa',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }
          }}
        />

        <Routes>
          {/* Public Credentials Portal */}
          <Route path="/login" element={<Login />} />

          {/* Secure Admin Operations Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/removed" element={<RemovedStudents />} />
            <Route path="admission/new" element={<NewAdmission />} />
            <Route path="admission/preview/:id" element={<AdmissionPreview />} />
            <Route path="students/profile/:id" element={<StudentProfilePage />} />
            <Route path="id-cards" element={<IDCards />} />
            <Route path="tc" element={<TransferCertificates />} />
            <Route path="fees" element={<FeeManagement />} />
          </Route>

          {/* Default Route redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
